import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import cors from "cors";

const app = express();

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
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ 
    status: "ok-v6-serverless", 
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

app.post("/api/orders", async (req: Request, res: Response) => {
  try {
    const s = getSupabase();
    const orderData = req.body;
    
    // 1. Generate Order ID
    const { count, error: countError } = await s
      .from("orders")
      .select("*", { count: "exact", head: true });
    
    if (countError) throw countError;
    
    const nextCount = (count !== null && count !== undefined ? count : 0) + 1001;
    const orderId = `DD-${nextCount}`;

    // Map frontend order fields to exact database columns
    const capItem = orderData.items?.find((item: any) => 
      item.name?.toLowerCase().includes("cap") || item.id === "cap"
    );
    const umbrellaItem = orderData.items?.find((item: any) => 
      item.name?.toLowerCase().includes("umbrella") || item.id === "umbrella"
    );

    const supabasePayload = {
      order_id: orderId,
      full_name: orderData.customer_name || orderData.fullName || "",
      mobile_number: orderData.mobile || orderData.mobileNumber || "",
      facebook_profile: orderData.facebook || orderData.facebookName || "",
      delivery_option: orderData.delivery_option || orderData.deliveryOption || "claim",
      delivery_address: orderData.address || "N/A (Claim on Event)",
      notes: orderData.notes || "",
      cap_qty: capItem ? capItem.quantity : 0,
      umbrella_qty: umbrellaItem ? umbrellaItem.quantity : 0,
      total_amount: orderData.total_amount || 0,
      payment_method: orderData.payment_method || "",
      payment_proof_url: orderData.proof_url || "",
      order_status: "Pending Verification",
      created_at: new Date().toISOString()
    };

    // 2. Save to Supabase
    const { data, error } = await s
      .from("orders")
      .insert([supabasePayload])
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

// Helper for upload route to avoid type overload issues
const handleUpload = async (req: Request, res: Response) => {
  try {
    const s = getSupabase();
    const multerReq = req as MulterRequest;
    if (!multerReq.file) throw new Error("No file uploaded");
    
    const file = multerReq.file;
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
};

app.post("/api/upload-proof", (req, res, next) => {
  getUpload().single("proof")(req, res, next);
}, handleUpload);

// Admin routes
app.get("/api/admin/orders", async (req: Request, res: Response) => {
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

    // Map the database rows to the names expected by the frontend Admin component
    const mappedOrders = (data || []).map((o: any) => {
      const items = [];
      if (o.cap_qty > 0) {
        items.push({ name: "SJA Baseball Cap", quantity: o.cap_qty, price: 500 });
      }
      if (o.umbrella_qty > 0) {
        items.push({ name: "SJA J-Type Umbrella", quantity: o.umbrella_qty, price: 500 });
      }

      return {
        id: o.id,
        order_id: o.order_id,
        customer_name: o.full_name,
        mobile: o.mobile_number,
        facebook: o.facebook_profile,
        delivery_option: o.delivery_option,
        total_amount: o.total_amount,
        status: o.order_status,
        created_at: o.created_at,
        proof_url: o.payment_proof_url,
        items,
        address: o.delivery_address,
        notes: o.notes
      };
    });

    res.json(mappedOrders);
  } catch (error: any) {
    console.error("Orders Fetch Error:", error);
    res.status(500).json({ 
      error: error.message || "Unknown error",
      details: error
    });
  }
});

app.patch("/api/admin/orders/:id", async (req: Request, res: Response) => {
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
      .update({ order_status: status })
      .eq("id", req.params.id)
      .select();

    if (error) throw error;
    
    const o = data[0];
    const items = [];
    if (o.cap_qty > 0) {
      items.push({ name: "SJA Baseball Cap", quantity: o.cap_qty, price: 500 });
    }
    if (o.umbrella_qty > 0) {
      items.push({ name: "SJA J-Type Umbrella", quantity: o.umbrella_qty, price: 500 });
    }

    const mapped = {
      id: o.id,
      order_id: o.order_id,
      customer_name: o.full_name,
      mobile: o.mobile_number,
      facebook: o.facebook_profile,
      delivery_option: o.delivery_option,
      total_amount: o.total_amount,
      status: o.order_status,
      created_at: o.created_at,
      proof_url: o.payment_proof_url,
      items,
      address: o.delivery_address,
      notes: o.notes
    };

    res.json(mapped);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ 
    error: "Internal Server Error", 
    message: err.message
  });
});

export { app };
export default app;
