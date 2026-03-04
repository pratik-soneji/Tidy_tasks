import { AiOutlineMenu } from "react-icons/ai";
import { IoRefresh } from "react-icons/io5";
import { TbLayoutList } from "react-icons/tb";
import { SlGrid } from "react-icons/sl";
import { AiOutlineSetting } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import logo from "../assets/logo.png";
import profileButtonPicture from "../assets/avatar.jpg";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function Navbar() {
  const {
    authUser,
    view,
    setView,
    searchQuery,
    userAuthUpdate,
    setSearchQuery,
  } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [settings, setSettings] = useState(false);
  const settingHandle = () => setSettings(!settings);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileset = () => setProfileOpen(!profileOpen);
  const [picture, setPicture] = useState(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAndSet = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", picture);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4012/user/set-avatar",
        formData,
        { withCredentials: true }
      );
      if (response) {
        userAuthUpdate();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4012/user/logout",
        {},
        { withCredentials: true }
      );
      if (response) {
        nav("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [drop, setDrop] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1800px]">
          <div className="flex items-center justify-between h-14 gap-4">

            {/* ── Left: Logo + Search ── */}
            <div className="flex items-center flex-1 min-w-0 gap-4">
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center shrink-0">
                  <svg className="size-3.5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="hidden sm:block text-sm font-semibold text-foreground tracking-tight">
                  Tidy Tasks
                </span>
              </div>

              {/* Search bar */}
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <Input
                    type="text"
                    placeholder="Search notes…"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="h-9 pl-9 pr-3 bg-muted/60 border-transparent focus-visible:border-border focus-visible:bg-background text-sm placeholder:text-muted-foreground/70 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ── Right: Actions ── */}
            <div className="flex items-center gap-0.5 shrink-0">
              {/* Desktop actions */}
              <div className="hidden md:flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  title="Refresh"
                >
                  <IoRefresh className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={setView}
                  title={view ? "List view" : "Grid view"}
                >
                  {view ? (
                    <TbLayoutList className="size-4" />
                  ) : (
                    <SlGrid className="size-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={settingHandle}
                  title="Settings"
                >
                  <AiOutlineSetting className="size-4" />
                </Button>
              </div>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setDrop(!drop)}
              >
                <AiOutlineMenu className="size-4" />
              </Button>

              {/* Separator */}
              <div className="hidden md:block mx-1 h-5 w-px bg-border" />

              {/* Profile dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-9 px-2 rounded-lg text-muted-foreground hover:text-foreground"
                  onClick={profileset}
                >
                  <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">
                    {authUser.username}
                  </span>
                  <div className="size-7 rounded-full overflow-hidden border border-border shrink-0 ring-1 ring-transparent hover:ring-ring transition-all">
                    <img
                      src={authUser.avatar || profileButtonPicture}
                      alt="Profile"
                      className="size-full object-cover"
                    />
                  </div>
                </Button>

                {profileOpen && (
                  <Card className="absolute right-0 top-full mt-2 w-72 border shadow-card-hover rounded-xl z-50 animate-scale-in">
                    <CardContent className="p-0">
                      {/* Profile info header */}
                      <div className="p-4 border-b border-border/60">
                        <p className="text-xs text-muted-foreground truncate">{authUser.email}</p>
                        <p className="text-sm font-medium mt-0.5 truncate">{authUser.username}</p>
                      </div>

                      {/* Avatar section */}
                      <div className="p-4 flex flex-col items-center gap-4 border-b border-border/60">
                        <div className="size-20 rounded-full overflow-hidden bg-muted ring-2 ring-border">
                          <img
                            src={authUser.avatar || profileButtonPicture}
                            alt=""
                            className="size-full object-cover"
                          />
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 w-full">
                          <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/70 transition-colors">
                            <input
                              type="file"
                              className="hidden"
                              name="file"
                              onChange={handleAndSet}
                            />
                            <MdOutlineEdit className="size-3.5" />
                            Change photo
                          </label>
                          {!loading && picture && (
                            <Button type="submit" size="sm" className="w-full h-9 text-xs">
                              Upload photo
                            </Button>
                          )}
                          {loading && (
                            <div className="h-9 flex items-center justify-center">
                              <Loader />
                            </div>
                          )}
                        </form>
                      </div>

                      {/* Logout */}
                      <div className="p-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-9 gap-2 text-sm font-normal text-muted-foreground hover:text-destructive hover:bg-destructive/8"
                          onClick={handleLogout}
                        >
                          <IoIosLogOut className="size-4" />
                          Sign out
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Mobile dropdown */}
          {drop && (
            <div className="md:hidden py-2 border-t border-border/60 flex items-center justify-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                <IoRefresh className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground"
                onClick={setView}
              >
                {view ? (
                  <TbLayoutList className="size-4" />
                ) : (
                  <SlGrid className="size-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground"
                onClick={settingHandle}
              >
                <AiOutlineSetting className="size-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Settings panel */}
        {settings && (
          <Card className="absolute right-4 sm:right-6 top-full mt-2 w-52 border shadow-card-hover rounded-xl z-50 animate-scale-in">
            <CardContent className="p-1.5">
              <Button variant="ghost" className="w-full justify-start h-9 text-sm font-normal">
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start h-9 text-sm font-normal">
                Enable dark theme
              </Button>
            </CardContent>
          </Card>
        )}
      </nav>
    </>
  );
}

export default Navbar;
