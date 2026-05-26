import express from "express";
import path from "path";
import nodemailer from "nodemailer";
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

      // Read and validate SMTP environment variables safely
      const missingVars: string[] = [];
      if (!process.env.SMTP_HOST) missingVars.push("SMTP_HOST");
      if (!process.env.SMTP_PORT) missingVars.push("SMTP_PORT");
      if (!process.env.SMTP_USER) missingVars.push("SMTP_USER");
      if (!process.env.SMTP_PASS) missingVars.push("SMTP_PASS");
      if (!process.env.CONTACT_TO_EMAIL) missingVars.push("CONTACT_TO_EMAIL");

      if (missingVars.length > 0) {
        console.error(`[DEBUG] Missing env variables names: ${missingVars.join(", ")}`);
        return res.status(500).json({
          success: false,
          message: "Email service is not configured yet. Please email us directly at ahsanzulfiqar655@gmail.com.",
          error: "Email service is not configured yet. Please email us directly at ahsanzulfiqar655@gmail.com."
        });
      }

      const smtpHost = process.env.SMTP_HOST!;
      const smtpPort = Number(process.env.SMTP_PORT || 587);
      const smtpUser = process.env.SMTP_USER!;
      const smtpPass = process.env.SMTP_PASS!;
      const toEmail = process.env.CONTACT_TO_EMAIL!;
      const fromEmail = process.env.CONTACT_FROM_EMAIL || smtpUser;

      // Create transport client with strict timeouts
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // True for 465, false for 587 / other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });

      // Prepare date/time
      const formattedDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " (UTC)";

      // Construct a clean, modern plain-text and HTML email body
      const emailSubject = `New Cymise Lead — ${name.trim()} (${company ? countryOrOrg(company) : "Individual"})`;
      
      const emailText = `
=== NEW CYMISE LEAD DETAILS ===

Date/Time Submitted: ${formattedDate}

Core Contact Details:
------------------------------------------
Name: ${name.trim()}
Email: ${email.trim()}
Phone: ${phone ? phone.trim() : "Not Provided"}

Business Context:
------------------------------------------
Company/Organization: ${company ? company.trim() : "Not Provided"}
Website: ${website ? website.trim() : "Not Provided"}

Project Requirements:
------------------------------------------
Selected Service: ${service ? service.trim() : "Not Provided"}
Estimated Budget: ${budget ? budget.trim() : "Not Provided"}

Problem / Inquiry Message:
------------------------------------------
${message.trim()}

==========================================
Cymise Digital Lead Pipeline
`;

      const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #000; padding: 24px; text-align: center; border-bottom: 2px solid #7B61FF;">
          <h2 style="color: #fff; margin: 0; font-size: 24px; tracking-wider: 0.1em; text-transform: uppercase;">Cymise Lead Capture</h2>
        </div>
        <div style="padding: 30px; background-color: #fafdff;">
          <p style="font-size: 14px; color: #666; margin-top: 0;">A new leadership inquiry has been captured. Details are listed below:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; width: 140px; font-size: 13px;">Date Submitted</td>
              <td style="padding: 10px; font-size: 13px;">${escapeHtml(formattedDate)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; font-size: 13px;">Full Name</td>
              <td style="padding: 10px; font-size: 13px;">${escapeHtml(name.trim())}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; font-size: 13px;">Email Address</td>
              <td style="padding: 10px; font-size: 13px;"><a href="mailto:${escapeHtml(email.trim())}">${escapeHtml(email.trim())}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; font-size: 13px;">Phone</td>
              <td style="padding: 10px; font-size: 13px;">${phone ? escapeHtml(phone.trim()) : "<em>Not Provided</em>"}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; font-size: 13px;">Company</td>
              <td style="padding: 10px; font-size: 13px;">${company ? escapeHtml(company.trim()) : "<em>Not Provided</em>"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; font-size: 13px;">Website</td>
              <td style="padding: 10px; font-size: 13px;">${website ? escapeHtml(website.trim()) : "<em>Not Provided</em>"}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold; font-size: 13px;">Selected Service</td>
              <td style="padding: 10px; font-size: 13px;">${service ? escapeHtml(service.trim()) : "<em>Not Provided</em>"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; font-size: 13px;">Budget</td>
              <td style="padding: 10px; font-size: 13px;">${budget ? escapeHtml(budget.trim()) : "<em>Not Provided</em>"}</td>
            </tr>
          </table>

          <div style="background-color: #fff; border-left: 4px solid #7B61FF; padding: 15px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 24px;">
            <h4 style="margin: 0 0 10px 0; color: #111; font-size: 14px;">Problem Message Details:</h4>
            <p style="margin: 0; font-size: 13px; font-style: italic; white-space: pre-line; color: #444;">${escapeHtml(message.trim())}</p>
          </div>
        </div>
        <div style="background-color: #f3f4f6; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 11px; color: #888;">
          Cymise Digital Acquisition Ecosystem &bull; Secure Encrypted Submission
        </div>
      </div>
      `;

      // Helper function for formatting
      function countryOrOrg(val: string) {
        return val.trim();
      }

      console.log("[DEBUG] SMTP send started...");

      // Hard fail-safe promise timeout wrapper around Nodemailer send to guarantee response within 15s
      const mailPromise = transporter.sendMail({
        from: `Cymise System Lead <${fromEmail}>`,
        to: toEmail,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("SMTP message transmission timed out")), 15000);
      });

      await Promise.race([mailPromise, timeoutPromise]);

      console.log(`[DEBUG] SMTP send success: Email forwarded cleanly.`);
      return res.status(200).json({ success: true, message: "Lead registered and email sent successfully." });

    } catch (err: any) {
      console.error("[DEBUG] SMTP send failed:", err.message || err);
      return res.status(500).json({ 
        success: false, 
        message: "Email transmission failed. Please email us directly at ahsanzulfiqar655@gmail.com.",
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
