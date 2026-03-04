import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { CgClose } from "react-icons/cg";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IoPersonAddOutline } from "react-icons/io5";

function Collab() {
  const {
    note,
    socket,
    setNote,
    setMessage,
    message,
    setCollab,
    authUser,
    setDataUpdate,
  } = useAuthStore();
  const [mail, setMail] = useState("");

  const addEmail = async () => {
    if (!mail) return;
    try {
      const response = await axios.post(
        "http://localhost:4012/user/add-collaborator",
        { noteId: note._id, collaboratorEmail: mail },
        { withCredentials: true }
      );
      if (response) {
        setMessage(response.data.message);
        setNote(response.data.note);
        setDataUpdate();
        socket.emit("note-update", note);
      }
    } catch (error) {
      setMessage(error.response?.data?.message);
      console.log(error);
    }
  };

  const removeCollaborator = async (e) => {
    try {
      const response = await axios.post(
        "http://localhost:4012/user/remove-collaborator",
        { noteId: note._id, collaboratorEmail: e.email },
        { withCredentials: true }
      );
      if (response) {
        setMessage(response.data.message);
        setNote(response.data.note);
        setDataUpdate();
        socket.emit("note-update", note);
      }
    } catch (error) {
      setMessage(error.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
      onClick={() => setCollab()}
    >
      <Card
        className="w-full max-w-sm mx-4 border shadow-card-hover rounded-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="p-5 pb-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <IoPersonAddOutline className="size-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold text-foreground">
              Collaborators
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => setCollab()}>
            <CgClose className="size-3.5" />
          </Button>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-4">
          {/* Owner */}
          <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted/50">
            <div className="size-8 rounded-full bg-foreground flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-background uppercase">
                {authUser.username?.[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{authUser.username}</p>
              <p className="text-xs text-muted-foreground truncate">{authUser.email}</p>
            </div>
            <span className="ml-auto text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
              Owner
            </span>
          </div>

          {/* Collaborators list */}
          {note.collaborators.length > 0 && (
            <div className="space-y-1">
              <Separator />
              {note.collaborators.map((e) => (
                <div key={e.email} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-accent transition-colors group">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
                    <span className="text-xs font-semibold uppercase">
                      {e.username?.[0]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{e.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{e.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeCollaborator(e)}
                  >
                    <CgClose className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add collaborator */}
          <div className="space-y-2 pt-1">
            {message && (
              <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-xl border border-border/60">
                {message}
              </p>
            )}
            <Label htmlFor="collab-email" className="text-xs font-medium text-muted-foreground">
              Invite by email
            </Label>
            <div className="flex gap-2">
              <Input
                id="collab-email"
                type="email"
                placeholder="name@example.com"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                className="h-9 flex-1 text-sm bg-background"
                onKeyDown={(e) => e.key === "Enter" && addEmail()}
              />
              <Button className="h-9 px-4 text-sm" onClick={addEmail}>
                Invite
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Collab;
