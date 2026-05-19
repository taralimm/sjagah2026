import express, { Request, Response } from "express";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

interface MulterRequest extends Request {
  file?: any;
}

// Lazy Supabase client
let supabase: any;
const getSupabase = () => {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL || "https://hobofihsbzhqbaclkdkc.supabase.co";
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const key = (supabaseServiceRole || supabaseAnonKey || "").trim();

    if (!key) {
      throw new Error("Supabase keys are missing. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are set in your environment variables.");
    }

    try {
      supabase = createClient(supabaseUrl, key);
    } catch (e: any) {
      throw new Error(`Failed to initialize Supabase client: ${e.message}`);
    }
  }
  return supabase;
};

// Lazy Multer
let upload: any;
const getUpload = () => {
  if (!upload) {
    const storage = multer.memoryStorage();
    upload = multer({ storage: storage });
  }
  return upload;
};

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok-v4-debug", 
    env: process.env.NODE_ENV,
    adminPasswordSet: !!process.env.ADMIN_PASSWORD,
    supabaseUrlSet: !!process.env.SUPABASE_URL,
    supabaseAnonKeySet: !!process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleSet: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    currentTime: new Date().toISOString(),
    isVercel: !!process.env.VERCEL,
    vercelEnv: process.env.VERCEL_ENV
  });
});

app.post("/api/orders", async (req, res) => {
  try {
    const s = getSupabase();
    const orderData = req.body;
    
    // 1. Generate Order ID
    const { data: countData, error: countError } = await s
      .from("orders")
      .select("id", { count: "exact", head: true });
    
    const count = (countData?.length || 0) + 1001;
    const orderId = `DD-${count}`;

    // 2. Save to Supabase
    const { data, error } = await s
      .from("orders")
      .insert([{
        ...orderData,
        order_id: orderId,
        status: "Pending Verification",
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    // 3. Append to Google Sheets via Webhook if configured
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      try {
        await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...orderData,
            order_id: orderId,
            status: "Pending Verification",
            timestamp: new Date().toLocaleString()
          })
        });
      } catch (sheetError) {
        console.error("Failed to append to Google Sheets:", sheetError);
      }
    }

    res.json({ success: true, orderId, data: data[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/upload-proof", (req: Request, res: Response, next: any) => {
  getUpload().single("proof")(req, res, next);
}, async (req: MulterRequest, res: Response) => {
  try {
    const s = getSupabase();
    if (!req.file) throw new Error("No file uploaded");
    
    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    const filePath = `proofs/${fileName}`;

    const { data, error } = await s.storage
      .from("payment-proofs")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype
      });

    if (error) throw error;

    const { data: { publicUrl } } = s.storage
      .from("payment-proofs")
      .getPublicUrl(filePath);

    res.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Admin routes
app.get("/api/admin/orders", async (req, res) => {
  const authHeader = req.headers.authorization;
  const providedPwd = authHeader?.replace("Bearer ", "").trim();
  const serverPwd = (process.env.ADMIN_PASSWORD || "").trim();

  if (!serverPwd || providedPwd !== serverPwd) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      details: !serverPwd ? "Server: ADMIN_PASSWORD is not set in environment variables." : "Password mismatch."
    });
  }

  try {
    const s = getSupabase();
    const { data, error } = await s
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    console.error("Orders Fetch Error:", error);
    res.status(500).json({ 
      error: error.message || "Unknown error",
      details: error
    });
  }
});

app.patch("/api/admin/orders/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  const providedPwd = authHeader?.replace("Bearer ", "").trim();
  const serverPwd = (process.env.ADMIN_PASSWORD || "").trim();

  if (!serverPwd || providedPwd !== serverPwd) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const s = getSupabase();
    const { status } = req.body;
    const { data, error } = await s
      .from("orders")
      .update({ status })
      .eq("id", req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ 
    error: "Internal Server Error", 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export { app };

export default app;
