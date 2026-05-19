import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

interface MulterRequest extends Request {
  file?: any;
}

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL || "https://hobofihsbzhqbaclkdkc.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceRole || supabaseAnonKey);

// Multer for payment proof
const upload = multer({ dest: "/tmp/uploads/" });

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

app.post("/api/orders", async (req, res) => {
  try {
    const orderData = req.body;
    
    // 1. Generate Order ID
    const { data: countData, error: countError } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true });
    
    const count = (countData?.length || 0) + 1001;
    const orderId = `DD-${count}`;

    // 2. Save to Supabase
    const { data, error } = await supabase
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

app.post("/api/upload-proof", upload.single("proof"), async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) throw new Error("No file uploaded");
    
    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    const filePath = `proofs/${fileName}`;

    const fileContent = fs.readFileSync(file.path);
    
    const { data, error } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, fileContent, {
        contentType: file.mimetype
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(filePath);

    res.json({ url: publicUrl });
    
    // Cleanup temporary file
    fs.unlinkSync(file.path);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin routes
app.get("/api/admin/orders", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/admin/orders/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { status } = req.body;
    const { data, error } = await supabase
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

async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  // Vite middleware for development
  if (!isProd) {
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
    console.log(`Server running on http://localhost:${PORT} [${isProd ? 'PROD' : 'DEV'}]`);
  });
}

startServer();
