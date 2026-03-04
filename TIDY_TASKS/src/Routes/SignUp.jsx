import { useDebugValue, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signup from "../assets/signup.png";
import { useAuthStore } from "../store/useAuthStore";
import Loader from "../Components/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";

function SignUp() {
  const nav = useNavigate();
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
    // // setCount(count + 2);
    // setCount(count + 3);
    console.log(count);
  }
  const call = async () => {
    const data = await axios.get("https://dummyjson.com/products")
    console.log(data);

  }
  // useEffect(() => {
  //   call();
  // }, [count])
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { signUp, login, message, setMessage, setIsSigningUp, isSigningUp } =
    useAuthStore();

  // Silently restore session — if already logged in, navigate away
  useEffect(() => {
    setMessage("");
    login({ email: "", password: "" }, nav).catch(() => { });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setMessage("");
    setIsSigningUp();
    try {
      await signUp({ email, username, password }, nav);
    } catch (err) {
      const axiosErr = /** @type {any} */ (err);
      setMessage(
        axiosErr?.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSigningUp();
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* ── Left: Form ── */}
      <div className="flex items-center justify-center px-6 py-16 sm:px-10 lg:px-20">
        <div className="w-full max-w-[420px] space-y-10 animate-fade-in">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                <svg
                  className="size-4 text-background"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span className="font-semibold text-foreground tracking-tight">
                Tidy Tasks
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed mt-1">
              Get started with Tidy Tasks. Enter your details below.
            </p>
          </div>

          <Card className="border shadow-card rounded-2xl">
            <CardContent className="p-8">
              <div className="relative">
                {isSigningUp && (
                  <div className="absolute right-0 top-0 flex items-center justify-center">
                    <Loader size={16} />
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSigningUp}
                      className="h-11 bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isSigningUp}
                      className="h-11 bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSigningUp}
                      className="h-11 bg-background"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSigningUp}
                    className="w-full h-11 font-medium mt-2"
                  >
                    {isSigningUp ? (
                      <span className="flex items-center gap-2">
                        <Loader size={14} /> Creating account…
                      </span>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                  {message && (
                    <p className="text-xs text-destructive text-center bg-destructive/8 py-2 px-3 rounded-lg">
                      {message}
                    </p>
                  )}
                  <p className="text-center text-sm text-muted-foreground pt-1">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-foreground hover:underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Right: Hero image ── */}
      <div className="hidden lg:block relative border-l border-border/40 overflow-hidden">
        <img
          src={signup}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20" />
        <div className="absolute bottom-16 left-14 right-14 text-white space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
            ✦ Free to get started
          </div>
          <h2 className="text-3xl font-semibold leading-[1.2] tracking-tight">
            Every new task is
            <br />a new adventure.
          </h2>
          <p className="text-sm text-white/75 leading-relaxed max-w-xs">
            Sign up to organize your work and stay on track with Tidy Tasks.
          </p>
        </div>
      </div>
      <button onClick={handleClick}>Count : {count}</button>
    </div>
  );
}

export default SignUp;
