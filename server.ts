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
        
        // 2. Update Firestore securely
        const durationDays = plan === 'yearly' ? 365 : (plan === 'lifetime' ? null : 90);
        
        await db.collection('users').doc(uid).update({
          subscriptionStatus: 'active',
          lastPaymentReference: reference,
          lastPaymentDate: FieldValue.serverTimestamp(),
          plan: plan || (amountPaid >= 150 ? 'lifetime' : (amountPaid >= 100 ? 'yearly' : 'termly')),
          subscriptionEndDate: plan === 'lifetime' ? null : Timestamp.fromDate(new Date(Date.now() + (durationDays || 90) * 24 * 60 * 60 * 1000))
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
  });
}

startServer();
