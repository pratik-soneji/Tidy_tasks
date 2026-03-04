import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SIdebar from "./Components/SIdebar";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore.js";
import { FaCheck } from "react-icons/fa";
import { MdDeleteOutline, MdLabelOutline } from "react-icons/md";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Collab from "./Components/Collab.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function Layout() {
  const [label, setLabel] = useState("");
  const {
    isExpanded,
    setIsExpanded,
    userAuthUpdate,
    setNav,
    collab,
  } = useAuthStore();
  const nav = useNavigate();
  const {
    authUser,
    editLabel,
    setEditLabel,
    fetchUserData,
    setUserId,
    listenForReminders,
  } = useAuthStore();

  useEffect(() => {
    const fetchDataAndConnectSocket = async () => {
      setNav(nav);
      await fetchUserData(nav);
      if (authUser) {
        setUserId();
        listenForReminders();
      }
    };
    fetchDataAndConnectSocket();
  }, [userAuthUpdate]);

  const addLabel = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4012/user/add-label",
        { label },
        { withCredentials: true }
      );
      if (response.data.data) {
        setLabel("");
        fetchUserData(nav);
      }
    } catch (error) {
      console.log("err while add lablel", error);
    }
  };

  const deleteLabel = async (label) => {
    try {
      const response = await axios.post(
        "http://localhost:4012/user/delete-label",
        { label },
        { withCredentials: true }
      );
      if (response.data.data) {
        fetchUserData(nav);
      }
    } catch (error) {
      console.log("err while add lablel", error);
    }
  };

  return (
    <>
      {authUser ? (
        <div
          className={`main min-h-screen w-screen relative bg-background ${editLabel ? "bg-muted/30" : ""
            }`}
        >
          <Navbar />

          <div
            className="flex flex-1 min-h-0 w-full min-h-[calc(100vh-4rem)]"
            onClick={() => (isExpanded ? setIsExpanded() : "")}
          >
            <SIdebar />
            <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <Outlet />
            </main>
            {editLabel && (
              <div
                className="flex justify-center items-center fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
                onClick={() => (editLabel ? setEditLabel() : "")}
              >
                <Card
                  className="w-full max-w-sm mx-4 border shadow-card-hover rounded-2xl animate-scale-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardHeader className="p-5 pb-0">
                    <CardTitle className="text-base font-semibold text-foreground">
                      Edit Labels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        type="text"
                        placeholder="Create new label…"
                        className="h-9 flex-1 text-sm bg-background"
                        onKeyDown={(e) => e.key === 'Enter' && addLabel()}
                      />
                      <Button
                        type="button"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={addLabel}
                      >
                        <FaCheck className="size-3.5" />
                      </Button>
                    </div>
                    <Separator />
                    <div className="space-y-0.5 max-h-60 overflow-y-auto">
                      {authUser.labels.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">No labels yet</p>
                      )}
                      {authUser.labels.map((text, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-accent transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <MdLabelOutline className="size-4 text-muted-foreground" />
                            <span className="text-sm">{text}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteLabel(text)}
                          >
                            <MdDeleteOutline className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {collab && <Collab />}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Layout;
