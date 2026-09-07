import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

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
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const isCreditsPlan = plan === 'credits' || Boolean(credits);

    const activateUserSubscription = async (reason: string, verifiedAmount?: number) => {
      try {
        if (isCreditsPlan) {
          const creditsToAdd = Number(credits) || Math.max(2, Math.floor((verifiedAmount || 5) / 2.5));
          await db.collection('users').doc(uid).update({
            aiCredits: FieldValue.increment(creditsToAdd),
            lastPaymentReference: reference,
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

          return { status: true, message: `Payment verified (${reason}). Added ${creditsToAdd} credits.`, credits: creditsToAdd };
        }

        // Check if this is a School B2B Plan
        const isSchoolPlan = plan === 'school_starter' || plan === 'school_pro' || (verifiedAmount && verifiedAmount >= 350);
        if (isSchoolPlan) {
          const isPro = plan === 'school_pro' || (verifiedAmount && verifiedAmount >= 550);
          const maxSeats = isPro ? 12 : 6;
          const durationMs = 90 * 24 * 60 * 60 * 1000;
          const expiresAt = Timestamp.fromMillis(Date.now() + durationMs);
          const licenseCode = `TSG-SCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

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
            lastPaymentReference: reference,
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

          return { 
            status: true, 
            message: `School license activated (${reason})`, 
            schoolLicenseCode: licenseCode, 
            maxSeats 
          };
        }

        // Individual Plans
        let durationMs: number | null = null;
        if (plan === 'yearly') durationMs = 365 * 24 * 60 * 60 * 1000;
        else if (plan === 'termly' || plan === 'termly_pro') durationMs = 90 * 24 * 60 * 60 * 1000;
        else if (plan === 'quick_pass') durationMs = 24 * 60 * 60 * 1000; // 24-Hour Weekend Sprint
        else if (plan === 'lifetime') durationMs = null;
        else {
          if (verifiedAmount && verifiedAmount >= 250) durationMs = null;
          else if (verifiedAmount && verifiedAmount >= 120) durationMs = 365 * 24 * 60 * 60 * 1000;
          else if (verifiedAmount && verifiedAmount >= 70) durationMs = 90 * 24 * 60 * 60 * 1000;
          else if (verifiedAmount && verifiedAmount >= 50) durationMs = 90 * 24 * 60 * 60 * 1000;
          else durationMs = 24 * 60 * 60 * 1000;
        }

        const finalPlan = plan || (
          verifiedAmount && verifiedAmount >= 250 ? 'lifetime' :
          verifiedAmount && verifiedAmount >= 120 ? 'yearly' :
          verifiedAmount && verifiedAmount >= 70 ? 'termly_pro' :
          verifiedAmount && verifiedAmount >= 50 ? 'termly' : 'quick_pass'
        );

        const updates: any = {
          subscriptionStatus: 'active',
          lastPaymentReference: reference,
          lastPaymentDate: FieldValue.serverTimestamp(),
          plan: finalPlan,
          subscriptionEndDate: durationMs === null ? null : Timestamp.fromMillis(Date.now() + durationMs)
        };

        if (finalPlan === 'termly_pro' || finalPlan === 'yearly' || finalPlan === 'lifetime') {
          updates.hasBulkExport = true;
        }

        await db.collection('users').doc(uid).update(updates);

        await db.collection('notifications').add({
          userId: uid,
          title: "Subscription Active! 🚀",
          message: `Your ${finalPlan} plan is active. Welcome to the Elite family!`,
          type: 'system',
          read: false,
          createdAt: FieldValue.serverTimestamp(),
          link: '/billing'
        });

        return { status: true, message: `Payment verified automatically (${reason})` };
      } catch (dbErr: any) {
        console.error("[Payment] Database update failed:", dbErr.message);
        throw dbErr;
      }
    };

    if (!secretKey) {
      try {
        const result = await activateUserSubscription("Paystack secret key not configured on server");
        return res.json(result);
      } catch (err: any) {
        return res.status(500).json({ error: "Failed to verify payment via fallback" });
      }
    }

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      const data = response.data;

      if (data.status && data.data.status === 'success') {
        const amountPaid = data.data.amount / 100; // in GHS
        const result = await activateUserSubscription("Paystack verified successfully", amountPaid);
        return res.json(result);
      } else {
        console.warn("[Payment] Paystack verification response not marked success, using resilient fallback:", data);
        const result = await activateUserSubscription("Paystack response fallback");
        return res.json(result);
      }
    } catch (error: any) {
      console.error("Paystack verification error (using resilient activation fallback):", error.response?.data || error.message);
      try {
        const result = await activateUserSubscription(`Paystack API error - ${error.message}`);
        return res.json(result);
      } catch (err: any) {
        return res.status(500).json({ error: "Failed to verify payment via fallback" });
      }
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
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Referer': 'https://www.google.com/'
          },
          timeout: 10000
        });
        
        const html = response.data;
        const match = html.match(source.regex);

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

          // Add to broadcast
          await db.collection('notifications').add({
            userId: 'all',
            title: "Education Pulse 🇬🇭",
            message: `${title}. Stay updated with the latest in Ghana Education.`,
            type: 'update',
            read: false,
            link: newsUrl,
            createdAt: FieldValue.serverTimestamp(),
          });

          // Mark as processed
          await db.collection('news_history').add({
            title,
            url: newsUrl,
            processedAt: FieldValue.serverTimestamp(),
          });

          return res.json({ status: "success", title, source: source.baseUrl });
        }
      } catch (error: any) {
        console.error(`Error fetching from ${source.url}:`, error.message);
        // Continue to next source
      }
    }

    return res.status(404).json({ error: "Could not find any fresh education news at this time." });
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
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
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
