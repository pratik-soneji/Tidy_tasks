import { Link, useNavigate } from "react-router-dom";
import signupback from "../assets/signup.png";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import Loader from "../Components/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function ForgotPass() {
  const nav = useNavigate();
  const otpRefs = useRef([]);
  
  // step: 0 = enter email, 1 = verify OTP, 2 = set new password
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [localMsg, setLocalMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();

  // Silently restore session — navigate away if already logged in
  useEffect(() => {
    login({ email: "", password: "" }, nav).catch(() => { });
  }, []);

  // ── OTP input helpers ──────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < otp.length - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((ch, i) => { newOtp[i] = ch; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ── Step 0: Send OTP ───────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLocalMsg("");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:4012/user/forgot-pass",
        { email },
        { withCredentials: true }
      );
      setStep(1);
    } catch (err) {
      const axiosErr = /** @type {any} */ (err);
      setLocalMsg(
        axiosErr?.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1: Verify OTP ─────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setLocalMsg("Please enter all 6 digits");
      return;
    }
    setLocalMsg("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4012/user/verify-otp",
        { recipientEmail: email, otp: enteredOtp },
        { withCredentials: true }
      );
      if (response.data.data) {
        setStep(2);
      } else {
        setLocalMsg(response.data.message || "Incorrect OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } catch (err) {
      const axiosErr = /** @type {any} */ (err);
      setLocalMsg(
        axiosErr?.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Set new password ───────────────────────────────────────────────
  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setLocalMsg("Password must be at least 6 characters");
      return;
    }
    if (newPass !== confirmPass) {
      setLocalMsg("Passwords do not match");
      return;
    }
    setLocalMsg("");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:4012/user/set-pass",
        { email, newPass },
        { withCredentials: true }
      );
      await login({ email, password: newPass }, nav);
    } catch (err) {
      const axiosErr = /** @type {any} */ (err);
      setLocalMsg(
        axiosErr?.response?.data?.message || "Failed to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Email", "Verify", "Reset"];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* ── Left: Form ── */}
      <div className="flex items-center justify-center px-6 py-16 sm:px-10 lg:px-20">
        <div className="w-full max-w-[420px] space-y-8 animate-fade-in">

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-0">
                <div className={`flex items-center gap-2 text-xs font-medium transition-colors
                  ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all
                    ${i < step ? "bg-foreground text-background" : i === step ? "border-2 border-foreground text-foreground" : "border border-border text-muted-foreground"}`}>
                    {i < step ? (
                      <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px w-8 sm:w-12 mx-2 transition-colors
                    ${i < step ? "bg-foreground" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── Step 0: Enter email ── */}
          {step === 0 && (
            <>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Forgot password?
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                  Enter your email and we&apos;ll send you a verification code.
                </p>
              </div>
              <Card className="border shadow-card rounded-2xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" className="text-sm font-medium">
                        Email address
                      </Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="h-11 bg-background"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-11 font-medium">
                      {loading ? (
                        <span className="flex items-center gap-2"><Loader size={14} /> Sending…</span>
                      ) : "Send verification code"}
                    </Button>
                    {localMsg && (
                      <p className="text-xs text-destructive text-center bg-destructive/8 py-2 px-3 rounded-lg">
                        {localMsg}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-1">
                      <Link to="/" className="font-medium text-foreground hover:underline underline-offset-4">Sign up</Link>
                      <span className="text-border">·</span>
                      <Link to="/login" className="font-medium text-foreground hover:underline underline-offset-4">Sign in</Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </>
          )}

          {/* ── Step 1: OTP ── */}
          {step === 1 && (
            <>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Check your email
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
              <Card className="border shadow-card rounded-2xl">
                <CardContent className="p-8">
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          disabled={loading}
                          className="h-12 w-12 text-center text-lg p-0 font-semibold bg-background"
                        />
                      ))}
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-11 font-medium">
                      {loading ? (
                        <span className="flex items-center gap-2"><Loader size={14} /> Verifying…</span>
                      ) : "Verify code"}
                    </Button>
                    {localMsg && (
                      <p className={`text-xs text-center py-2 px-3 rounded-lg ${localMsg === "OTP resent!"
                        ? "text-green-600 bg-green-500/10"
                        : "text-destructive bg-destructive/8"
                        }`}>
                        {localMsg}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                      <span>Didn&apos;t receive a code?</span>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={async () => {
                          setLoading(true);
                          setLocalMsg("");
                          try {
                            await axios.post(
                              "http://localhost:4012/user/forgot-pass",
                              { email },
                              { withCredentials: true }
                            );
                            setLocalMsg("OTP resent!");
                            setOtp(["", "", "", "", "", ""]);
                            otpRefs.current[0]?.focus();
                          } catch {
                            setLocalMsg("Failed to resend. Please try again.");
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="font-medium text-foreground hover:underline underline-offset-4 disabled:opacity-50"
                      >
                        Resend
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setStep(0); setLocalMsg(""); setOtp(["", "", "", "", "", ""]); }}
                      className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Back
                    </button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}

          {/* ── Step 2: Set new password ── */}
          {step === 2 && (
            <>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Set new password
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                  Choose a strong password for your account.
                </p>
              </div>
              <Card className="border shadow-card rounded-2xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSetPassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">New password</Label>
                      <Input
                        type="password"
                        placeholder="At least 6 characters"
                        required
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        disabled={loading}
                        className="h-11 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Confirm password</Label>
                      <Input
                        type="password"
                        placeholder="Repeat your new password"
                        required
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        disabled={loading}
                        className="h-11 bg-background"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-11 font-medium mt-2">
                      {loading ? (
                        <span className="flex items-center gap-2"><Loader size={14} /> Updating…</span>
                      ) : "Update password"}
                    </Button>
                    {localMsg && (
                      <p className={`text-xs text-center py-2 px-3 rounded-lg ${localMsg === "Passwords do not match" || localMsg.includes("failed")
                        ? "text-destructive bg-destructive/8"
                        : "text-green-600 bg-green-500/10"
                        }`}>
                        {localMsg}
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </>
          )}

        </div>
      </div>

      {/* ── Right: Hero image ── */}
      <div className="hidden lg:block relative border-l border-border/40 overflow-hidden">
        <img src={signupback} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20" />
        <div className="absolute bottom-16 left-14 right-14 text-white space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
            🔒 Bank-grade security
          </div>
          <h2 className="text-3xl font-semibold leading-[1.2] tracking-tight">
            Stay organized.<br />Work smarter.
          </h2>
          <p className="text-sm text-white/75 leading-relaxed max-w-xs">
            Reset your password and get back to your tasks in seconds.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPass;
