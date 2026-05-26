import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { isDisposableEmail } from "./server/disposableEmail";

// Load environment variables
dotenv.config();

// Secure HTML escaping helper to prevent script and content injection in notification emails
function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.post("/api/contact", async (req, res) => {
    console.log("[DEBUG] Contact route hit.");
    try {
      const { name, email, phone, message, company, website, service, budget, honeypot } = req.body;

      // Anti-spam honeypot protection: if the hidden honeypot field is filled, silently discard or reject
      if (honeypot && honeypot.trim() !== "") {
        console.warn("[DEBUG] Anti-spam triggered: Honeypot field was filled.");
        return res.status(200).json({ 
          success: true, 
          message: "Form submitted successfully." // Simulate success to spam bots
        });
      }

      // Backend field validation
      if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
        console.log("[DEBUG] Validation failed: required fields missing.");
        return res.status(400).json({ 
          success: false, 
          error: "Required fields (Name, Email, Message) are missing." 
        });
      }

      // 1. Strict regex-based email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        console.log(`[DEBUG] Validation failed: invalid email format (${email})`);
        return res.status(400).json({
          success: false,
          message: "Please enter a valid business or personal email address.",
          error: "Please enter a valid business or personal email address."
        });
      }

      // 2. Input length safety barriers to prevent memory/buffer overflow attack strings
      if (
        name.length > 100 || 
        email.length > 150 || 
        message.length > 5000 || 
        (phone && phone.length > 100) || 
        (company && company.length > 150) || 
        (website && website.length > 250) ||
        (service && service.length > 150) ||
        (budget && budget.length > 100)
      ) {
        console.log("[DEBUG] Validation failed: input string too long.");
        return res.status(400).json({
          success: false,
          error: "Input fields exceed safety length parameters."
        });
      }

      if (isDisposableEmail(email)) {
        console.warn(`[DEBUG] Disposable email status: rejected (${email})`);
        return res.status(400).json({
          success: false,
          message: "Please use a real business or personal email address. Temporary email addresses are not accepted.",
          error: "Please use a real business or personal email address. Temporary email addresses are not accepted."
        });
      }

      console.log(`[DEBUG] Disposable email status: accepted (${email})`);
      console.log("[DEBUG] Validation passed.");

      // Read and validate Web3Forms environment variables safely
      const missingVars: string[] = [];
      if (!process.env.WEB3FORMS_ACCESS_KEY) missingVars.push("WEB3FORMS_ACCESS_KEY");

      if (missingVars.length > 0) {
        console.error(`[DEBUG] Missing env variables names: ${missingVars.join(", ")}`);
        return res.status(500).json({
          success: false,
          message: "Email service is not configured yet. Please email us directly at ahsanzulfiqar655@gmail.com.",
          error: "Email service is not configured yet. Please email us directly at ahsanzulfiqar655@gmail.com."
        });
      }

      const web3FormsAccessKey = process.env.WEB3FORMS_ACCESS_KEY!;

      // Prepare date/time
      const formattedDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " (UTC)";

      // Core formatting helper function
      function countryOrOrg(val: string) {
        return val.trim();
      }

      // Construct subject for notification email
      const emailSubject = `New Cymise Lead — ${name.trim()} (${company ? countryOrOrg(company) : "Individual"})`;

      console.log("[DEBUG] Web3Forms submission started...");

      const controller = new AbortController();
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          controller.abort();
          reject(new Error("Web3Forms message transmission timed out"));
        }, 15000);
      });

      const fetchPromise = fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
          subject: emailSubject,
          from_name: "Cymise Lead Capture",
          reply_to: email.trim(),
          name: name.trim(),
          email: email.trim(),
          phone: phone ? phone.trim() : "Not Provided",
          company: company ? company.trim() : "Not Provided",
          website: website ? website.trim() : "Not Provided",
          selected_service: service ? service.trim() : "Not Provided",
          estimated_budget: budget ? budget.trim() : "Not Provided",
          message: message.trim(),
          submitted_time: formattedDate
        }),
        signal: controller.signal
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[DEBUG] Web3Forms API non-OK status: ${response.status}`, errorText);
        throw new Error(`Web3Forms API status code: ${response.status}`);
      }

      const responseData = await response.json() as { success: boolean; message?: string };
      console.log("[DEBUG] Web3Forms API response received.");

      if (!responseData || responseData.success !== true) {
        console.error("[DEBUG] Web3Forms API reports failure:", responseData);
        throw new Error(responseData?.message || "Web3Forms API reports failure");
      }

      console.log(`[DEBUG] Web3Forms submission success.`);
      return res.status(200).json({ success: true, message: "Lead received successfully." });

    } catch (err: any) {
      console.error("[DEBUG] Web3Forms submission failed:", err.message || err);
      return res.status(500).json({ 
        success: false, 
        message: "Something went wrong. Please email us directly at ahsanzulfiqar655@gmail.com.",
        error: err.message || "Internal Mail transmission service error."
      });
    }
  });

  // Serve static assets in production, use Vite in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Static assets served from ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fullstack Server running on port ${PORT}`);
  });
}

startServer();
