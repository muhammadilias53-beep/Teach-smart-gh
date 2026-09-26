import express from "express";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import path from "path";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Global process-level safety to ensure server resilience
process.on('unhandledRejection', (reason: any) => {
  console.warn('[Server Safety] Unhandled Rejection intercepted:', reason?.message || reason);
});

process.on('uncaughtException', (err: any) => {
  console.error('[Server Safety] Uncaught Exception intercepted:', err?.message || err);
});

// Load Firebase Config safely in both ESM and bundled CJS
let firebaseConfig: any = {};
try {
  firebaseConfig = JSON.parse(
    readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf-8")
  );
} catch (e: any) {
  console.warn("Could not read firebase-applet-config.json:", e.message);
}

// Check for explicit Firebase Admin service account environment variables (e.g., Production Hostinger)
const adminProjectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const adminClientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const adminPrivateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

const hasEnvCredentials = Boolean(adminProjectId && adminClientEmail && adminPrivateKeyRaw);

// Initialize Firebase Admin: use cert if environment variables exist, otherwise fallback safely to ADC
let app: any = null;
let db: any = null;

try {
  app = getApps().length === 0 
    ? (hasEnvCredentials
        ? initializeApp({
            credential: cert({
              projectId: adminProjectId!,
              clientEmail: adminClientEmail!,
              privateKey: adminPrivateKeyRaw!.replace(/\\n/g, '\n'),
            }),
            projectId: adminProjectId || firebaseConfig.projectId,
          })
        : initializeApp({ projectId: firebaseConfig.projectId || "teachsmart-ghana" }))
    : getApps()[0];

  // Specify the database ID if provided
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
    ? firebaseConfig.firestoreDatabaseId 
    : undefined);
} catch (err: any) {
  console.warn("Firebase Admin initialization note:", err.message);
}

// Optional startup Firebase Admin connectivity self-test (isolated to system_checks/firebase_admin_verify)
async function runFirebaseAdminSelfTest() {
  if (process.env.FIREBASE_ADMIN_SELF_TEST !== "true" || !db) {
    return;
  }
  try {
    const testDocRef = db.collection("system_checks").doc("firebase_admin_verify");
    
    // 1. Write harmless test data
    await testDocRef.set({
      status: "ok",
      timestamp: new Date().toISOString()
    });
    console.log("[FIREBASE ADMIN SELF-TEST] WRITE PASS");

    // 2. Read back
    const docSnap = await testDocRef.get();
    if (!docSnap.exists || docSnap.data()?.status !== "ok") {
      throw new Error("Verification failed: written document could not be verified");
    }
    console.log("[FIREBASE ADMIN SELF-TEST] READ PASS");

    // 3. Delete
    await testDocRef.delete();

    // 4. Confirm deletion
    const verifyDeleted = await testDocRef.get();
    if (verifyDeleted.exists) {
      throw new Error("Deletion confirmation failed: document still exists");
    }
    console.log("[FIREBASE ADMIN SELF-TEST] DELETE PASS");
    console.log("[FIREBASE ADMIN SELF-TEST] COMPLETE");
  } catch (error: any) {
    console.error("[FIREBASE ADMIN SELF-TEST] FAIL:", error?.code || error?.message || "Unknown error");
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // High-performance gzip/deflate response compression
  app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  }));

  app.use(express.json());

  // API Route: Secure AI Proxy with multi-model fallback & backoff retries
  app.post("/api/generate", async (req, res) => {
    const { prompt, contents, systemInstruction, responseMimeType, preferredModel } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    // Models in priority order with resilient multi-tier fallback (placing high-throughput lite models first to eliminate 503 high-demand spikes)
    const candidateModels = preferredModel 
      ? [preferredModel, 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.1-pro-preview', 'gemini-2.5-flash']
      : ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.1-pro-preview', 'gemini-2.5-flash'];

    // Deduplicate models preserving order
    const modelsToTry = Array.from(new Set(candidateModels));

    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents || prompt,
          config: {
            systemInstruction: systemInstruction || undefined,
            responseMimeType: responseMimeType || undefined,
            maxOutputTokens: 8192,
          }
        });

        if (response && response.text) {
          return res.json({ text: response.text, modelUsed: modelName });
        }
      } catch (error: any) {
        lastError = error;
        const errMsg = error?.message || String(error);
        console.info(`[Gemini Proxy] Fallback: Model ${modelName} returned error (${errMsg}), transitioning to next candidate...`);
        // If high demand (503) or rate limit (429), pause briefly before trying next candidate model
        if (errMsg.includes('503') || errMsg.includes('429') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE')) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        continue;
      }
    }

    console.error("[Gemini Proxy Final Error]:", lastError?.message || lastError);
    const friendlyMessage = lastError?.message?.includes("503") || lastError?.message?.includes("high demand")
      ? "AI services are currently experiencing high demand. Please try generating again in a few moments."
      : (lastError?.message || "Failed to generate AI response. Please try again.");

    return res.status(503).json({ error: friendlyMessage, details: lastError?.message });
  });

  // API Route: Verify Paystack Payment
  app.post("/api/verify-payment", async (req, res) => {
    const { reference, uid, plan, credits } = req.body;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!uid || !reference) {
      return res.status(400).json({ error: "Missing required parameters (uid or reference)" });
    }

    const cleanReference = String(reference).trim();
    if (!cleanReference) {
      return res.status(400).json({ error: "Invalid transaction reference" });
    }

    // 1. Check for Replay Attacks: Has this reference already been processed?
    let paymentDocRef: any = null;
    try {
      if (db) {
        paymentDocRef = db.collection('processed_payments').doc(cleanReference);
        const existingSnap = await paymentDocRef.get();
        if (existingSnap && existingSnap.exists) {
          return res.status(400).json({ 
            error: "This transaction reference has already been processed and credited. Replay attempts are rejected." 
          });
        }
      }
    } catch (checkErr: any) {
      console.warn('[Payment] Replay check note:', checkErr.message);
    }

    // Pricing tables for strict amount validation
    const PLAN_PRICES: Record<string, number> = {
      quick_pass: 20,
      termly: 50,
      termly_pro: 70,
      yearly: 130,
      lifetime: 300,
      school_starter: 350,
      school_pro: 600
    };

    const CREDIT_PACK_PRICES: Record<number, number> = {
      2: 5,
      4: 10,
      12: 25,
      25: 50,
      60: 100
    };

    const isCreditsPlan = plan === 'credits' || Boolean(credits);
    let amountPaid = 0;
    let paymentChannel = 'paystack';

    // Allow simulation references for test/sandbox mode or developer evaluation
    const isSimulationRef = 
      cleanReference.startsWith('TEST-') || 
      cleanReference.startsWith('DEMO-') || 
      cleanReference.startsWith('mock_') ||
      cleanReference.startsWith('TS-SIM-') ||
      cleanReference.startsWith('SANDBOX-');

    if (isSimulationRef) {
      amountPaid = Number(req.body.amount) || 50;
      paymentChannel = 'dev_sandbox';
    } else if (secretKey) {
      // 2. Cryptographic / Gateway Verification with Paystack
      try {
        const response = await axios.get(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(cleanReference)}`,
          {
            headers: {
              Authorization: `Bearer ${secretKey}`,
            },
            timeout: 15000
          }
        );

        const data = response.data;
        if (!data || !data.status || !data.data || data.data.status !== 'success') {
          return res.status(400).json({ 
            error: `Paystack reported transaction status: ${data?.data?.status || 'failed'}. Payment was not completed.` 
          });
        }

        amountPaid = data.data.amount / 100; // convert pesewas to GHS
        paymentChannel = data.data.channel || 'paystack';
      } catch (paystackError: any) {
        const msg = paystackError.response?.data?.message || paystackError.message || "Failed to communicate with Paystack";
        return res.status(400).json({ 
          error: `Payment verification failed: ${msg}. If your account was debited, please contact support with reference: ${cleanReference}` 
        });
      }
    } else {
      return res.status(500).json({ 
        error: "Live Paystack key is not configured on the server. To test subscriptions in preview mode, please use the Sandbox / Test Mode button or contact administrator." 
      });
    }

    // 3. Strict Amount Validation to Prevent Tampering
    if (isCreditsPlan) {
      const creditsToAdd = Number(credits) || 2;
      const expectedMinPrice = CREDIT_PACK_PRICES[creditsToAdd] || Math.ceil(creditsToAdd * 1.6);
      if (amountPaid < expectedMinPrice) {
        return res.status(400).json({ 
          error: `Verified amount of GHS ${amountPaid} is insufficient for ${creditsToAdd} AI credits (requires GHS ${expectedMinPrice}).` 
        });
      }
    } else {
      const expectedPrice = PLAN_PRICES[plan];
      if (expectedPrice && amountPaid < expectedPrice) {
        return res.status(400).json({ 
          error: `Verified amount of GHS ${amountPaid} is insufficient for plan '${plan}' (requires GHS ${expectedPrice}).` 
        });
      }
    }

    // 4. Record the processed payment immediately to prevent concurrent replay attacks
    try {
      if (paymentDocRef) {
        await paymentDocRef.set({
          reference: cleanReference,
          uid,
          plan: isCreditsPlan ? 'credits' : plan,
          credits: isCreditsPlan ? (Number(credits) || 2) : null,
          amount: amountPaid,
          currency: 'GHS',
          channel: paymentChannel,
          status: 'verified',
          processedAt: FieldValue.serverTimestamp()
        });
      }
    } catch (saveErr: any) {
      console.warn("[Payment] Note on recording in processed_payments:", saveErr.message);
    }

    // 5. Activate Subscription or Credits in Firestore with Admin SDK
    try {
      if (isCreditsPlan) {
        const creditsToAdd = Number(credits) || Math.max(2, Math.floor(amountPaid / 2.5));
        
        try {
          if (db) {
            await db.collection('users').doc(uid).update({
              aiCredits: FieldValue.increment(creditsToAdd),
              lastPaymentReference: cleanReference,
              lastPaymentDate: FieldValue.serverTimestamp()
            });

            await db.collection('notifications').add({
              userId: uid,
              title: "AI Credits Added! 💫",
              message: `${creditsToAdd} AI Generation Credits have been added to your balance. Happy teaching!`,
              type: 'system',
              read: false,
              createdAt: FieldValue.serverTimestamp(),
              link: '/billing'
            });
          }
        } catch (dbCreditsErr: any) {
          console.warn("[Payment] Server db credits update note:", dbCreditsErr.message);
        }

        return res.json({ 
          status: true, 
          message: `Payment verified. Added ${creditsToAdd} credits.`, 
          credits: creditsToAdd 
        });
      }

      // Check if this is a School B2B Plan
      const isSchoolPlan = plan === 'school_starter' || plan === 'school_pro' || amountPaid >= 350;
      if (isSchoolPlan) {
        const isPro = plan === 'school_pro' || amountPaid >= 550;
        const maxSeats = isPro ? 12 : 6;
        const durationMs = 90 * 24 * 60 * 60 * 1000;
        const expiresAt = Timestamp.fromMillis(Date.now() + durationMs);
        const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
        const licenseCode = `TSG-SCH-${randomHex}`;

        try {
          if (db) {
            const userSnap = await db.collection('users').doc(uid).get();
            const userData = userSnap.data() || {};
            const schoolName = userData.school || userData.schoolName || `${userData.displayName || 'Teacher'}'s School`;

            await db.collection('school_licenses').doc(licenseCode).set({
              code: licenseCode,
              ownerUid: uid,
              ownerName: userData.displayName || 'School Administrator',
              ownerEmail: userData.email || '',
              schoolName,
              plan: isPro ? 'school_pro' : 'school_starter',
              maxSeats,
              usedSeats: 1,
              members: [uid],
              createdAt: FieldValue.serverTimestamp(),
              expiresAt,
              active: true
            });

            await db.collection('users').doc(uid).update({
              subscriptionStatus: 'active',
              plan: 'school_license',
              isSchoolAdmin: true,
              hasBulkExport: true,
              schoolLicenseCode: licenseCode,
              schoolName,
              subscriptionEndDate: expiresAt,
              lastPaymentReference: cleanReference,
              lastPaymentDate: FieldValue.serverTimestamp()
            });

            await db.collection('notifications').add({
              userId: uid,
              title: "🏫 School License Active!",
              message: `Your ${isPro ? 'School Pro (12 seats)' : 'School Starter (6 seats)'} plan is active! Your school teacher invite code is: ${licenseCode}`,
              type: 'system',
              read: false,
              createdAt: FieldValue.serverTimestamp(),
              link: '/billing'
            });
          }
        } catch (dbSchoolErr: any) {
          console.warn("[Payment] Server db school update note:", dbSchoolErr.message);
        }

        return res.json({ 
          status: true, 
          message: "School license activated", 
          schoolLicenseCode: licenseCode, 
          maxSeats 
        });
      }

      // Individual Plans
      let durationMs: number | null = null;
      if (plan === 'yearly') durationMs = 365 * 24 * 60 * 60 * 1000;
      else if (plan === 'termly' || plan === 'termly_pro') durationMs = 90 * 24 * 60 * 60 * 1000;
      else if (plan === 'quick_pass') durationMs = 24 * 60 * 60 * 1000; // 24-Hour Weekend Sprint
      else if (plan === 'lifetime') durationMs = null;
      else {
        if (amountPaid >= 300) durationMs = null;
        else if (amountPaid >= 130) durationMs = 365 * 24 * 60 * 60 * 1000;
        else if (amountPaid >= 70) durationMs = 90 * 24 * 60 * 60 * 1000;
        else if (amountPaid >= 50) durationMs = 90 * 24 * 60 * 60 * 1000;
        else durationMs = 24 * 60 * 60 * 1000;
      }

      const finalPlan = plan || (
        amountPaid >= 300 ? 'lifetime' :
        amountPaid >= 130 ? 'yearly' :
        amountPaid >= 70 ? 'termly_pro' :
        amountPaid >= 50 ? 'termly' : 'quick_pass'
      );

      const updates: any = {
        subscriptionStatus: 'active',
        lastPaymentReference: cleanReference,
        lastPaymentDate: FieldValue.serverTimestamp(),
        plan: finalPlan,
        subscriptionEndDate: durationMs === null ? null : Timestamp.fromMillis(Date.now() + durationMs)
      };

      if (finalPlan === 'termly_pro' || finalPlan === 'yearly' || finalPlan === 'lifetime') {
        updates.hasBulkExport = true;
      }

      // If user activated quick_pass, reset quickPassGenerationsUsed
      if (finalPlan === 'quick_pass') {
        updates.quickPassGenerationsUsed = 0;
      }

      try {
        if (db) {
          await db.collection('users').doc(uid).update(updates);

          await db.collection('notifications').add({
            userId: uid,
            title: "Subscription Active! 🚀",
            message: `Your ${finalPlan} plan is active. Welcome to the TeachSmartGH Elite family!`,
            type: 'system',
            read: false,
            createdAt: FieldValue.serverTimestamp(),
            link: '/billing'
          });
        }
      } catch (dbUpdateErr: any) {
        console.warn("[Payment] Server db update note:", dbUpdateErr.message);
      }

      return res.json({ 
        status: true, 
        message: `Payment verified. Activated plan: ${finalPlan}`, 
        plan: finalPlan,
        subscriptionStatus: 'active',
        hasBulkExport: updates.hasBulkExport || false,
        subscriptionEndDate: durationMs ? new Date(Date.now() + durationMs).toISOString() : null
      });
    } catch (err: any) {
      console.error("[Payment] Verification process error:", err.message);
      return res.status(500).json({ error: "Payment verification error: " + err.message });
    }
  });

  // API Route: Redeem School License Passcode
  app.post("/api/redeem-school-code", async (req, res) => {
    const { code, uid } = req.body;
    if (!uid || !code) {
      return res.status(400).json({ error: "Missing user ID or school code" });
    }

    const cleanCode = String(code).trim().toUpperCase();

    try {
      const licenseRef = db.collection('school_licenses').doc(cleanCode);
      const licenseSnap = await licenseRef.get();

      if (!licenseSnap.exists) {
        return res.status(404).json({ error: "Invalid school code. Please verify the code with your school administrator or proprietor." });
      }

      const license = licenseSnap.data() as any;

      if (license.active === false) {
        return res.status(400).json({ error: "This school license is currently deactivated." });
      }

      // Check expiration
      if (license.expiresAt) {
        const expiresTime = license.expiresAt.toDate ? license.expiresAt.toDate().getTime() : new Date(license.expiresAt).getTime();
        if (Date.now() > expiresTime) {
          return res.status(400).json({ error: "This school license has expired for the current academic term. Please ask your administrator to renew." });
        }
      }

      const members: string[] = license.members || [];
      if (members.includes(uid)) {
        return res.json({ 
          status: true, 
          message: "You are already an active member of this school team!", 
          schoolName: license.schoolName 
        });
      }

      const maxSeats = Number(license.maxSeats) || 6;
      if (members.length >= maxSeats) {
        return res.status(400).json({ 
          error: `This school license has reached its seat limit (${members.length}/${maxSeats} teachers). Please contact your administrator.` 
        });
      }

      // Add teacher to school license
      await licenseRef.update({
        members: FieldValue.arrayUnion(uid),
        usedSeats: FieldValue.increment(1)
      });

      // Update teacher's profile
      await db.collection('users').doc(uid).update({
        subscriptionStatus: 'active',
        plan: 'school_license',
        schoolLicenseCode: cleanCode,
        schoolName: license.schoolName || '',
        hasBulkExport: true,
        subscriptionEndDate: license.expiresAt || Timestamp.fromMillis(Date.now() + 90 * 24 * 60 * 60 * 1000)
      });

      // Notification
      await db.collection('notifications').add({
        userId: uid,
        title: "🏫 Welcome to Your School Team!",
        message: `You have successfully joined ${license.schoolName || 'your school'}'s TeachSmart team! You now have full Termly Master access.`,
        type: 'system',
        read: false,
        createdAt: FieldValue.serverTimestamp(),
        link: '/billing'
      });

      return res.json({ 
        status: true, 
        message: `Successfully joined ${license.schoolName || 'your school'}! Termly access activated.`,
        schoolName: license.schoolName
      });
    } catch (err: any) {
      console.error("Redeem school code error:", err);
      return res.status(500).json({ error: `Failed to redeem school code: ${err.message}` });
    }
  });

  // API Route: Auto-sync Education News
  app.get("/api/admin/broadcast/auto-sync", async (req, res) => {
    const newsSources = [
      {
        url: "https://www.graphic.com.gh/news/education.html",
        regex: /<h3[^>]*class="article-title"[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i,
        baseUrl: "https://www.graphic.com.gh"
      },
      {
        url: "https://citinewsroom.com/category/education/",
        regex: /<h3[^>]*class="entry-title"[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i,
        baseUrl: ""
      }
    ];

    for (const source of newsSources) {
      try {
        const response = await axios.get(source.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/'
          },
          timeout: 6000
        });
        
        const html = response.data;
        const match = typeof html === 'string' ? html.match(source.regex) : null;

        if (match) {
          const relativeUrl = match[1];
          const title = match[2].trim();
          const newsUrl = relativeUrl.startsWith('http') ? relativeUrl : `${source.baseUrl}${relativeUrl}`;

          // Check if we already sent this
          const newsHistory = await db.collection('news_history')
            .where('title', '==', title)
            .limit(1)
            .get();

          if (!newsHistory.empty) {
            continue; // Try next source or finish
          }

          // Add to broadcast if db is available
          try {
            if (db) {
              await db.collection('notifications').add({
                userId: 'all',
                title: "Education Pulse 🇬🇭",
                message: `${title}. Stay updated with the latest in Ghana Education.`,
                type: 'update',
                read: false,
                link: newsUrl,
                createdAt: FieldValue.serverTimestamp(),
              });

              await db.collection('news_history').add({
                title,
                url: newsUrl,
                processedAt: FieldValue.serverTimestamp(),
              });
            }
          } catch (dbErr: any) {
            console.warn('[Auto-Sync] Firestore write note:', dbErr.message);
          }

          return res.json({ status: "success", title, source: source.baseUrl });
        }
      } catch (error: any) {
        console.warn(`[Auto-Sync] Scraper note for ${source.url}:`, error.message);
      }
    }

    // Intelligent Fallback: When external portals are blocked by Cloudflare or captchas,
    // use server-side Gemini to generate a timely, authoritative Ghanaian Teacher Educational Pulse bulletin!
    let generatedTitle = "GES Curriculum Bulletin 🇬🇭";
    let generatedMessage = "Ensure all weekly learner tasks reflect core competencies and NaCCA indicators.";

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ 
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',
          contents: "Generate ONE timely, realistic, and inspiring Ghanaian educational pulse announcement for GES Basic school, Primary, and JHS teachers. Focus on NaCCA curriculum alignment, school-based assessment (SBA), core competencies, or learner-centered pedagogy. Return valid JSON only with {\"title\": \"Short Title (max 10 words, e.g. 'GES Assessment Alert: Aligning SBA with Indicators')\", \"message\": \"2-3 practical, encouraging sentences for Ghanaian teachers.\", \"topic\": \"Curriculum & SBA\"}",
          config: {
            responseMimeType: 'application/json',
            maxOutputTokens: 500,
          }
        });

        if (aiResponse && aiResponse.text) {
          const data = JSON.parse(aiResponse.text);
          generatedTitle = data.title || generatedTitle;
          generatedMessage = data.message || generatedMessage;
        }
      }
    } catch (aiErr: any) {
      console.warn("[Auto-Sync] AI fallback note:", aiErr.message);
    }

    // Safely record in notifications if db has write credentials
    try {
      if (db) {
        await db.collection('notifications').add({
          userId: 'all',
          title: `🇬🇭 ${generatedTitle}`,
          message: generatedMessage,
          type: 'update',
          read: false,
          link: '/standards',
          createdAt: FieldValue.serverTimestamp(),
        });

        await db.collection('news_history').add({
          title: generatedTitle,
          url: '/standards',
          processedAt: FieldValue.serverTimestamp(),
        });
      }
    } catch (dbErr: any) {
      console.warn("[Auto-Sync] Firestore bulletin write note:", dbErr.message);
    }

    return res.json({ 
      status: "success", 
      title: generatedTitle, 
      message: generatedMessage,
      source: "TeachSmart GES Education Pulse" 
    });
  });

  // API Route: Log PWA Launch Analytics
  app.post("/api/analytics/pwa-launch", async (req, res) => {
    try {
      const { displayMode, referral, uid, email, language } = req.body;
      const userAgent = req.headers["user-agent"] || "unknown";
      
      console.log(`[Analytics] PWA Launch Event logged: mode=${displayMode}, uid=${uid}, email=${email}, referral=${referral}, lang=${language || 'en'}, UA=${userAgent}`);
      
      return res.json({ 
        status: "success", 
        message: "Launch analytics tracked securely on console", 
        id: "log_" + Date.now().toString(36),
        mode: displayMode 
      });
    } catch (error: any) {
      console.error("[Analytics] Error logging PWA launch:", error.message);
      return res.json({ status: "skipped", reason: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // 1-year immutable caching for fingerprinted assets (/assets/*)
    app.use('/assets', express.static(path.join(distPath, "assets"), {
      maxAge: '1y',
      immutable: true,
      index: false
    }));

    // Standard caching for root assets (favicons, manifests, etc.)
    app.use(express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      }
    }));

    app.get("*", (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Optional startup Firebase Admin connectivity self-test (only runs when FIREBASE_ADMIN_SELF_TEST=true)
    runFirebaseAdminSelfTest().catch(() => {});

    // Auto-sync news every 12 hours (43,200,000 ms)
    setInterval(async () => {
      console.log("Running automatic news pulse check...");
      try {
        await axios.get(`http://localhost:${PORT}/api/admin/broadcast/auto-sync`);
      } catch (err: any) {
        console.error("Interval news pulse error:", err.message);
      }
    }, 12 * 60 * 60 * 1000);
  });
}

startServer();
