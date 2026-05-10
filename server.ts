import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { readFileSync } from "fs";

dotenv.config();

// Load Firebase Config safely in ESM
const firebaseConfig = JSON.parse(
  readFileSync(new URL("./firebase-applet-config.json", import.meta.url), "utf-8")
);

// Initialize Firebase Admin
const app = getApps().length === 0 
  ? initializeApp({ projectId: firebaseConfig.projectId })
  : getApps()[0];

// Specify the database ID if provided
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
  ? firebaseConfig.firestoreDatabaseId 
  : undefined);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Verify Paystack Payment
  app.post("/api/verify-payment", async (req, res) => {
    const { reference, uid, plan } = req.body;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({ error: "Paystack secret key not configured" });
    }

    if (!uid || !reference) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
      // 1. Verify with Paystack
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
        
        let durationMs: number | null = null;
        if (plan === 'yearly') durationMs = 365 * 24 * 60 * 60 * 1000;
        else if (plan === 'termly') durationMs = 90 * 24 * 60 * 60 * 1000;
        else if (plan === 'quick_pass') durationMs = 5 * 60 * 60 * 1000;
        else if (plan === 'lifetime') durationMs = null;
        else {
          // Fallback based on amount if plan is weirdly missing
          if (amountPaid >= 150) durationMs = null;
          else if (amountPaid >= 100) durationMs = 365 * 24 * 60 * 60 * 1000;
          else if (amountPaid >= 50) durationMs = 90 * 24 * 60 * 60 * 1000;
          else durationMs = 5 * 60 * 60 * 1000; // Smallest pass
        }

        const finalPlan = plan || (amountPaid >= 150 ? 'lifetime' : (amountPaid >= 100 ? 'yearly' : (amountPaid >= 50 ? 'termly' : 'quick_pass')));

        await db.collection('users').doc(uid).update({
          subscriptionStatus: 'active',
          lastPaymentReference: reference,
          lastPaymentDate: FieldValue.serverTimestamp(),
          plan: finalPlan,
          subscriptionEndDate: durationMs === null ? null : Timestamp.fromMillis(Date.now() + durationMs)
        });

        // Send notification
        await db.collection('notifications').add({
          userId: uid,
          title: "Subscription Active! 🚀",
          message: `Your ${finalPlan} plan is now active. Welcome to the Elite family!`,
          type: 'system',
          read: false,
          createdAt: FieldValue.serverTimestamp(),
          link: '/billing'
        });

        return res.json({ status: true, message: "Payment verified and subscription activated" });
      } else {
        return res.status(400).json({ status: false, message: "Payment verification failed" });
      }
    } catch (error: any) {
      console.error("Paystack verification error:", error.response?.data || error.message);
      return res.status(500).json({ error: "Failed to verify payment" });
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
