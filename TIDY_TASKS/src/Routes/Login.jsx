import { Link, useNavigate } from "react-router-dom";
import signupback from "../assets/signup.png";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function Login() {
  const checkUserLoggedIn = async () => {
    login({ email: "email", password: "password" }, nav);
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, errMessage } = useAuthStore();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({ email, password }, nav);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* ── Left: Form ── */}
      <div className="flex items-center justify-center px-6 py-16 sm:px-10 lg:px-20">
        <div className="w-full max-w-[420px] space-y-10 animate-fade-in">
          {/* Logo / Brand mark */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                <svg className="size-4 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-semibold text-foreground tracking-tight">Tidy Tasks</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed mt-1">
              Sign in to continue managing your tasks efficiently.
            </p>
          </div>

          <Card className="border shadow-card rounded-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium text-foreground">
                    Email address
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <Link
                      to="/forgot"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-background"
                  />
                </div>

                <Button type="submit" className="w-full h-11 font-medium mt-2">
                  Sign in
                </Button>

                {errMessage && (
                  <p className="text-xs text-destructive text-center bg-destructive/8 py-2 px-3 rounded-lg">
                    {errMessage}
                  </p>
                )}

                <p className="text-center text-sm text-muted-foreground pt-1">
                  Don&apos;t have an account?{" "}
                  <Link to="/" className="font-medium text-foreground hover:underline underline-offset-4">
                    Create account
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Right: Hero image ── */}
      <div className="hidden lg:block relative border-l border-border/40 overflow-hidden">
        <img
          src={signupback}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20" />
        <div className="absolute bottom-16 left-14 right-14 text-white space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
            Trusted by teams worldwide
          </div>
          <h2 className="text-3xl font-semibold leading-[1.2] tracking-tight">
            Stay organized.
            <br />
            Work smarter.
          </h2>
          <p className="text-sm text-white/75 leading-relaxed max-w-xs">
            Plan tasks, track progress, and achieve more — with one clean workflow.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;