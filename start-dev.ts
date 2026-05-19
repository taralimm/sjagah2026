import { app } from "./server";
import path from "path";
import express from "express";

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const { createServer } = await import("vite");
    const vite = await createServer({
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
    console.log(`Standalone server running on http://localhost:${PORT} [${isProd ? 'PROD' : 'DEV'}]`);
  });
}

start();
