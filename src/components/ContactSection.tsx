import React, { useState } from "react";
import { FadeIn } from "./ui/FadeIn";
import { CheckCircle, AlertTriangle, RefreshCw, Mail, ArrowUpRight } from "lucide-react";
import { COUNTRIES } from "../constants/countries";

function inferCountryCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return "US";

    if (tz.includes("Karachi")) return "PK";
    if (tz.includes("Calcutta") || tz.includes("Kolkata")) return "IN";
    if (tz.includes("London")) return "GB";
    if (tz.includes("New_York") || tz.includes("Los_Angeles") || tz.includes("Chicago") || tz.includes("Denver") || tz.includes("Anchorage") || tz.includes("Honolulu")) return "US";
    if (tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Montreal") || tz.includes("Winnipeg")) return "CA";
    if (tz.includes("Sydney") || tz.includes("Melbourne") || tz.includes("Brisbane") || tz.includes("Adelaide") || tz.includes("Perth")) return "AU";
    if (tz.includes("Dubai")) return "AE";
    if (tz.includes("Riyadh")) return "SA";
    if (tz.includes("Berlin") || tz.includes("Frankfurt")) return "DE";
    if (tz.includes("Paris")) return "FR";
    if (tz.includes("Tokyo")) return "JP";
    if (tz.includes("Singapore")) return "SG";
    
    const zoneLower = tz.toLowerCase();
    if (zoneLower.startsWith("america/")) return "US";
    if (zoneLower.startsWith("europe/")) {
      if (zoneLower.includes("london")) return "GB";
      if (zoneLower.includes("paris")) return "FR";
      if (zoneLower.includes("berlin")) return "DE";
      if (zoneLower.includes("rome")) return "IT";
      if (zoneLower.includes("madrid")) return "ES";
    }
  } catch (e) {
    // Graceful fallback
  }
  return "US";
}

export function ContactSection() {
  const defaultCountryCode = inferCountryCode();
  const defaultCountry = COUNTRIES.find((c) => c.code === defaultCountryCode) || 
                         COUNTRIES.find((c) => c.code === "US") || 
                         { name: "United States", code: "US", dialCode: "+1" };
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    website: "",
    service: "",
    budget: "",
    message: ""
  });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState<React.ReactNode>("");

  const getPhonePlaceholder = () => {
    if (selectedCountry.code === "US" || selectedCountry.code === "CA") {
      return "555 123 4567";
    }
    if (selectedCountry.code === "PK") {
      return "300 1234567";
    }
    if (selectedCountry.code === "GB") {
      return "7911 123456";
    }
    return "Enter phone number";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorText("");

    // Anti-spam honeypot check: if filled, silently succeed in UI but do not send
    if (honeypot.trim() !== "") {
      setTimeout(() => {
        setStatus("success");
      }, 1000);
      return;
    }

    // Reasonably check for at least some digits without overly restricting country formats
    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 5) {
      setStatus("error");
      setErrorText("Please enter a valid phone number with at least 5 digits.");
      return;
    }

    const controller = new AbortController();
    
    // UI independent fail-safe timeout to guarantee loading stops after 18 seconds
    const uiTimeoutId = setTimeout(() => {
      controller.abort();
      setStatus("error");
      setErrorText(
        <span>
          Something went wrong. Please email us directly at{" "}
          <a href="mailto:ahsanzulfiqar655@gmail.com" className="underline text-cyan-400 hover:text-cyan-300 font-bold">
            ahsanzulfiqar655@gmail.com
          </a>.
        </span>
      );
    }, 18000);

    try {
      const combinedPhoneString = `${selectedCountry.name} (${selectedCountry.dialCode}) ${formData.phone.trim()}`;
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          phone: combinedPhoneString,
          countryName: selectedCountry.name,
          countryDialCode: selectedCountry.dialCode,
          localPhone: formData.phone.trim(),
          honeypot
        }),
        signal: controller.signal
      });

      clearTimeout(uiTimeoutId);

      // Check content type to prevent crash on non-JSON response HTML
      const contentType = response.headers.get("content-type");
      let data: any = null;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Invalid response content type from server");
      }

      if (response.ok && data && data.success) {
        setStatus("success");
        setFormData({
          name: "",
          phone: "",
          email: "",
          company: "",
          website: "",
          service: "",
          budget: "",
          message: ""
        });
      } else {
        setStatus("error");
        
        // Handle specifically disposable email rejection or others
        const messageStr = (data?.message || data?.error || "").toLowerCase();
        if (messageStr.includes("disposable") || messageStr.includes("temp") || messageStr.includes("blocklist")) {
          setErrorText("Please use a real business or personal email address. Temporary email addresses are not accepted.");
        } else {
          setErrorText(
            <span>
              Something went wrong. Please email us directly at{" "}
              <a href="mailto:ahsanzulfiqar655@gmail.com" className="underline text-cyan-400 hover:text-cyan-300 font-bold">
                ahsanzulfiqar655@gmail.com
              </a>.
            </span>
          );
        }
      }
    } catch (err: any) {
      clearTimeout(uiTimeoutId);
      console.error("Fetch contact error:", err);
      setStatus("error");
      
      setErrorText(
        <span>
          Something went wrong. Please email us directly at{" "}
          <a href="mailto:ahsanzulfiqar655@gmail.com" className="underline text-cyan-400 hover:text-cyan-300 font-bold">
            ahsanzulfiqar655@gmail.com
          </a>.
        </span>
      );
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorText("");
  };

  return (
    <section id="contact" className="bg-black px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-35 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-start">
        <div className="md:w-[45%] flex flex-col items-start relative">
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-3 mb-6 bg-[#7B61FF]/10 border border-[#7B61FF]/20 px-4 py-2 rounded-full">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B61FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7B61FF]"></span>
              </span>
              <span className="text-[#7B61FF] font-mono text-sm tracking-widest uppercase font-bold drop-shadow-[0_0_8px_rgba(123,97,255,0.4)]">Qualify Your Growth</span>
            </div>
            <h2 className="text-[#D7E2EA] font-display font-black uppercase text-[clamp(2.5rem,6vw,70px)] leading-[1] tracking-tight mb-8">
              Let's Secure Your Incoming Leads.
            </h2>
            <p className="text-[#D7E2EA]/70 font-light text-lg sm:text-xl leading-relaxed mb-6 max-w-md">
              Stop guessing with marketing. Tell us a bit about your business and the challenges you're facing, and we’ll establish exactly how to scale your operations.
            </p>
            <p className="text-[#D7E2EA]/70 font-light text-lg sm:text-xl leading-relaxed mb-8 max-w-md">
              Provide a few details below to qualify your lead tier, and we'll reach out to handle the rest.
            </p>
          </FadeIn>
        </div>
        
        <div id="lead-capture-form" className="md:w-[55%] w-full">
          <FadeIn delay={0.2}>
            {status === "success" ? (
              <div className="bg-[#090D1A]/95 border-2 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)] rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center gap-6 transform transition-all duration-500 scale-100">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white uppercase">Lead Profile Registered!</h3>
                <p className="text-gray-300 font-sans font-light leading-relaxed max-w-md">
                  Thank you for submitting your detailed profile. We have captured your core metrics and our growth strategist will review your application. We will reach out to you within 24 hours to secure your pipeline.
                </p>
                <button 
                  onClick={handleReset}
                  className="mt-4 px-6 py-2.5 rounded-xl border border-white/10 hover:border-[#7B61FF] text-xs font-mono font-bold uppercase tracking-widest text-[#7B61FF] hover:text-white transition-all cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : status === "error" ? (
              <div className="bg-[#090D1A]/95 border-2 border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.1)] rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display font-bold text-white uppercase">Inquiry Failed</h3>
                <p className="text-rose-200/80 font-mono text-xs bg-rose-950/20 border border-rose-800/30 px-4 py-3 rounded-xl max-w-md break-words">
                  {errorText}
                </p>
                <div className="flex flex-col gap-3 w-full max-w-md">
                  <a 
                    href="mailto:ahsanzulfiqar655@gmail.com"
                    className="group inline-flex items-center justify-center gap-2 w-full bg-white text-black font-bold font-mono py-3.5 rounded-xl hover:bg-[#714AFE] hover:text-white transition-all duration-300 shadow-lg cursor-pointer text-xs uppercase tracking-widest"
                  >
                    <Mail className="w-4 h-4" />
                    Email Us Directly
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  <button 
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-white uppercase tracking-widest cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                className="bg-[#090D1A]/95 backdrop-blur-3xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] hover:border-[#7B61FF]/40 transition-[border-color] duration-500 rounded-3xl p-8 sm:p-10 flex flex-col gap-6"
              >
                {/* Anti-spam honeypot hidden field - completely invisible to real users */}
                <div className="hidden absolute w-0 h-0 overflow-hidden" aria-hidden="true">
                  <input 
                    type="text" 
                    tabIndex={-1} 
                    autoComplete="off" 
                    value={honeypot} 
                    onChange={(e) => setHoneypot(e.target.value)} 
                    placeholder="Your site url" 
                  />
                </div>

                <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-4">
                  <h3 className="text-2xl text-white font-display font-bold">Express Interest</h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/15 border border-[#00E5FF]/20 px-3 py-1 rounded-full font-black select-none">
                    LEAD CRITERIA
                  </span>
                </div>
                
                {/* Grid 1: Name and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-white/70 font-mono text-xs uppercase tracking-wider font-semibold">First & Last Name <span className="text-[#7B61FF] font-bold">*</span></label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-[#000000]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B61FF]/60 focus:ring-1 focus:ring-[#7B61FF]/60 transition-all font-sans placeholder-white/30" 
                      required 
                      disabled={status === "submitting"}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-white/70 font-mono text-xs uppercase tracking-wider font-semibold">
                      Phone Number <span className="text-[#7B61FF] font-bold">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3 w-full min-w-0">
                      {/* Compact Country Selector with native overlay */}
                      <div className="relative w-full sm:w-[130px] shrink-0 h-[46px] bg-[#000000]/50 border border-white/10 rounded-xl flex items-center justify-between px-3 focus-within:border-[#7B61FF]/60 focus-within:ring-1 focus-within:ring-[#7B61FF]/60 transition-all font-sans select-none">
                        <span className="text-white text-xs sm:text-sm truncate font-medium">
                          {selectedCountry.code} ({selectedCountry.dialCode})
                        </span>
                        <span className="text-white/40 text-[10px] ml-1">▼</span>
                        
                        <select
                          id="country-selector"
                          name="country-selector"
                          value={selectedCountry.code}
                          onChange={(e) => {
                            const found = COUNTRIES.find((c) => c.code === e.target.value);
                            if (found) {
                              setSelectedCountry(found);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          disabled={status === "submitting"}
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-black text-white text-xs sm:text-sm">
                              {c.name} ({c.dialCode})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Real Phone Input Field */}
                      <input 
                        type="tel" 
                        id="phone" 
                        placeholder={getPhonePlaceholder()} 
                        value={formData.phone}
                        onChange={handleChange}
                        className="flex-grow min-w-0 bg-[#000000]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B61FF]/60 focus:ring-1 focus:ring-[#7B61FF]/60 transition-all font-sans placeholder-white/30 text-xs sm:text-sm h-[46px]" 
                        required 
                        disabled={status === "submitting"}
                      />
                    </div>
                  </div>
                </div>

                {/* Grid 2: Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-white/70 font-mono text-xs uppercase tracking-wider font-semibold">Email Address <span className="text-[#7B61FF] font-bold">*</span></label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-[#000000]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B61FF]/60 focus:ring-1 focus:ring-[#7B61FF]/60 transition-all font-sans placeholder-white/30" 
                    required 
                    disabled={status === "submitting"}
                  />
                </div>

                {/* Grid 3: Company and Website (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company" className="text-white/70 font-mono text-xs uppercase tracking-wider font-semibold">Company Name <span className="text-white/30 font-light">(Optional)</span></label>
                    <input 
                      type="text" 
                      id="company" 
                      placeholder="My Business LLC" 
                      value={formData.company}
                      onChange={handleChange}
                      className="bg-[#000000]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B61FF]/60 focus:ring-1 focus:ring-[#7B61FF]/60 transition-all font-sans placeholder-white/30" 
                      disabled={status === "submitting"}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="website" className="text-white/70 font-mono text-xs uppercase tracking-wider font-semibold">Current Website <span className="text-white/30 font-light">(Optional)</span></label>
                    <input 
                      type="text" 
                      id="website" 
                      placeholder="www.mybusiness.com" 
                      value={formData.website}
                      onChange={handleChange}
                      className="bg-[#000000]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B61FF]/60 focus:ring-1 focus:ring-[#7B61FF]/60 transition-all font-sans placeholder-white/30" 
                      disabled={status === "submitting"}
                    />
                  </div>
                </div>

                {/* Grid 4: Service and Budget (Optional drop-downs to qualify conversion priority) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="service" className="text-white/70 font-mono text-xs uppercase tracking-wider font-semibold">Selected Service <span className="text-white/30 font-light">(Optional)</span></label>
                    <select 
                      id="service" 
                      value={formData.service}
                      onChange={handleChange}
                      className="h-[46px] w-full bg-[#000000]/50 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[#7B61FF]/60 focus:ring-1 focus:ring-[#7B61FF]/60 transition-all font-sans text-sm select-dark-bg cursor-pointer"
                      disabled={status === "submitting"}
                    >
                      <option value="" className="bg-black text-gray-400">Select a growth tract...</option>
                      <option value="Web Design & Speed" className="bg-black text-white">Web Design & Speed Optimization</option>
                      <option value="Core SEO Optimization" className="bg-black text-white">First-Page GMB & SEO Strategy</option>
                      <option value="Paid Lead Acquisition" className="bg-black text-white">Paid Traffic & Lead Funnels</option>
                      <option value="Full Digital Infrastructure" className="bg-black text-white">100% Comprehensive Acquisition (All)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="budget" className="text-white/70 font-mono text-xs uppercase tracking-wider font-semibold">Estimated Monthly Budget <span className="text-white/30 font-light">(Optional)</span></label>
                    <select 
                      id="budget" 
                      value={formData.budget}
                      onChange={handleChange}
                      className="h-[46px] w-full bg-[#000000]/50 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[#7B61FF]/60 focus:ring-1 focus:ring-[#7B61FF]/60 transition-all font-sans text-sm select-dark-bg cursor-pointer"
                      disabled={status === "submitting"}
                    >
                      <option value="" className="bg-black text-gray-400">Select budget allocation...</option>
                      <option value="Under $2,000/mo" className="bg-black text-white">Under $2,000 / month</option>
                      <option value="$2,000 - $5,000/mo" className="bg-black text-white">$2,000 - $5,000 / month</option>
                      <option value="$5,000 - $10,000/mo" className="bg-black text-white">$5,000 - $10,000 / month</option>
                      <option value="$10,000+/mo" className="bg-black text-white">$10,000+ / month</option>
                    </select>
                  </div>
                </div>
                
                {/* Field 5: Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-white/70 font-mono text-xs uppercase tracking-wider font-semibold">What is your biggest current problem? <span className="text-[#7B61FF] font-bold">*</span></label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    placeholder="e.g., Low lead quality, low traffic, not enough calls, difficult follow-ups..." 
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-[#000000]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B61FF]/60 focus:ring-1 focus:ring-[#7B61FF]/60 transition-all font-sans resize-none placeholder-white/30 text-sm" 
                    required 
                    disabled={status === "submitting"}
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={status === "submitting"}
                    className="w-full bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#7B61FF] disabled:from-gray-700 disabled:to-gray-800 disabled:opacity-50 text-white font-bold uppercase tracking-wider font-mono py-4 rounded-xl hover:opacity-95 transition-all duration-300 shadow-[0_0_20px_rgba(123,97,255,0.4)] disabled:shadow-none cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    {status === "submitting" ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Transmitting Inquiry Profiles...
                      </>
                    ) : (
                      "Submit & Request Contact"
                    )}
                  </button>
                </div>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
