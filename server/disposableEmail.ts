import fs from "fs";
import path from "path";

const BLOCKLIST_URL = "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf";
const LOCAL_CONF_PATH = path.join(process.cwd(), "server", "disposable_email_blocklist.conf");

// Fallback domains if file is not yet populated or offline
const CORE_FALLBACKS = [
  "mailinator.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "throwawaymail.com",
  "getnada.com",
  "emailondeck.com",
  "fakemail.net",
  "trashmail.com",
  "dispostable.com",
  "maildrop.cc",
  "sharklasers.com",
  "grr.la",
  "guerrillamailblock.com",
  "mintemail.com",
  "moakt.com",
  "mytemp.email",
  "tempail.com",
  "tempmail.com",
  "temporary-mail.net",
  "burner.kiwi",
  "inboxkitten.com",
  "spamgourmet.com",
  "mailnesia.com",
  "anonaddy.com",
  "simplelogin.com",
  "noyavip.com",
  "mail.tm",
  "generator.email",
  "inboxes.com",
  "temp-mail.ai",
  "tempinbox.xyz"
];

let disposableDomainsSet = new Set<string>(CORE_FALLBACKS);

/**
 * Clean and parse the blocklist file content
 */
function parseBlocklistContent(content: string): string[] {
  return content
    .split("\n")
    .map(line => line.trim())
    .filter(line => {
      // Ignore empty lines, comments
      return line.length > 0 && !line.startsWith("#") && !line.startsWith("//");
    })
    .map(line => {
      let domain = line.toLowerCase();
      // Remove trailing dots just in case
      if (domain.endsWith(".")) {
        domain = domain.slice(0, -1);
      }
      return domain;
    });
}

/**
 * Load the domains from local config file
 */
export function loadLocalBlocklist() {
  try {
    const parentDir = path.dirname(LOCAL_CONF_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    if (fs.existsSync(LOCAL_CONF_PATH)) {
      const content = fs.readFileSync(LOCAL_CONF_PATH, "utf-8");
      const parsed = parseBlocklistContent(content);
      if (parsed.length > 0) {
        disposableDomainsSet = new Set(parsed);
        console.log(`[DisposableEmail] Loaded ${disposableDomainsSet.size} domains from local cache file.`);
        return;
      }
    }
  } catch (err) {
    console.error("[DisposableEmail] Error reading local blocklist file:", err);
  }
  
  // Initialize with fallbacks if no local file exists yet
  disposableDomainsSet = new Set(CORE_FALLBACKS);
  console.log(`[DisposableEmail] Initialized with ${disposableDomainsSet.size} hardcoded core fallback domains.`);
}

/**
 * Async background update to fetch the latest blocklist from GitHub
 */
export async function updateBlocklistFromGitHub() {
  try {
    console.log("[DisposableEmail] Fetching latest disposable email blocklist from GitHub...");
    const response = await fetch(BLOCKLIST_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const parsed = parseBlocklistContent(text);
    if (parsed.length > 0) {
      // Save it to disk for offline persistent caching
      const parentDir = path.dirname(LOCAL_CONF_PATH);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(LOCAL_CONF_PATH, text, "utf-8");
      
      // Update the active memory set
      disposableDomainsSet = new Set(parsed);
      console.log(`[DisposableEmail] Successfully fetched, saved, and updated to ${disposableDomainsSet.size} domains.`);
    }
  } catch (err: any) {
    console.error("[DisposableEmail] Failed to fetch latest blocklist from GitHub. Using existing cache. Error:", err.message);
  }
}

/**
 * Get total cached/loaded domains count
 */
export function getDisposableDomainCount(): number {
  return disposableDomainsSet.size;
}

/**
 * Check if a domain is a disposable email domain (exact or subdomain match)
 */
export function isDisposableDomain(domain: string): boolean {
  const normalizedDomain = domain.trim().toLowerCase();
  
  // 1. Direct exact match
  if (disposableDomainsSet.has(normalizedDomain)) {
    return true;
  }

  // 2. Subdomain matches
  const parts = normalizedDomain.split(".");
  // We check parts from right to left, e.g., for test.sub.noyavip.com
  // We check: noyavip.com, sub.noyavip.com, test.sub.noyavip.com
  for (let i = 1; i < parts.length - 1; i++) {
    const parentDomain = parts.slice(i).join(".");
    if (disposableDomainsSet.has(parentDomain)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if an email address belongs to a disposable email provider
 */
export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes("@")) {
    return false;
  }
  const parts = email.trim().split("@");
  if (parts.length < 2) {
    return false;
  }
  const domain = parts[parts.length - 1];
  return isDisposableDomain(domain);
}

// Automatically load local file at start
loadLocalBlocklist();
// Kick off async update from GitHub (runs in the background without blocking)
updateBlocklistFromGitHub().catch(() => {});
