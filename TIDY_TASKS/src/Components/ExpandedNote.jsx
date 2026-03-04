import { BiSolidBellPlus } from "react-icons/bi";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoColorPaletteOutline, IoImageOutline } from "react-icons/io5";
import { LuArchiveRestore } from "react-icons/lu";
import { IoMdMore } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { TbArchiveOff } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ExpandedNote() {
  const inputRef = useRef(null);
  const [reminder, setReminder] = useState(null);
  const {
    handleUpdate,
    setIsExpanded,
    deleteNote,
    note,
    setNote,
    authUser,
    collab,
    setCollab,
  } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsLabelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [colorOpt, setColorOpt] = useState(false);
  const [oldNote, setOldNote] = useState(note);

  const colorClasses = [
    "bg-white", "bg-red-300", "bg-orange-300", "bg-yellow-100",
    "bg-lime-100", "bg-emerald-200", "bg-slate-200", "bg-slate-300",
    "bg-zinc-300", "bg-red-100", "bg-stone-200",
  ];
  const [selectedColor, setSelectedColor] = useState("bg-white");
  const wallpaperImageUrls = [
    "https://th.bing.com/th/id/OIP.enaBU3gfWAP-zwJT0i_NogHaEB?rs=1&pid=ImgDetMain",
    "https://www.gstatic.com/keep/backgrounds/grocery_light_thumb_0615.svg",
    "https://www.gstatic.com/keep/backgrounds/food_light_thumb_0615.svg",
    "https://www.gstatic.com/keep/backgrounds/music_light_thumb_0615.svg",
    "https://www.gstatic.com/keep/backgrounds/recipe_light_thumb_0615.svg",
    "https://www.gstatic.com/keep/backgrounds/notes_light_thumb_0615.svg",
    "https://www.gstatic.com/keep/backgrounds/places_light_thumb_0615.svg",
    "https://www.gstatic.com/keep/backgrounds/travel_light_thumb_0615.svg",
    "https://www.gstatic.com/keep/backgrounds/video_light_thumb_0615.svg",
    "https://www.gstatic.com/keep/backgrounds/celebration_light_thumb_0715.svg",
    "https://4kwallpapers.com/images/walls/thumbs_2t/19821.jpg",
  ];
  const [selectedImg, setSelectedImg] = useState(
    "https://th.bing.com/th/id/OIP.enaBU3gfWAP-zwJT0i_NogHaEB?rs=1&pid=ImgDetMain"
  );

  const handleColorClick = (colorClass) => {
    setSelectedImg("");
    setSelectedColor(colorClass);
    setNote({ ...note, color: colorClass, backgroundImage: "" });
  };

  const handleImageClick = (wallpaperImageUrl) => {
    setSelectedImg(wallpaperImageUrl);
    setNote({ ...note, color: "" });
    setNote({ ...note, backgroundImage: wallpaperImageUrl });
  };

  const handleArchive = () => {
    const updatedNote = { ...note, archived: !note.archived };
    handleUpdate(updatedNote);
  };

  const update = (note) => {
    if (note == oldNote) {
      setIsExpanded();
    } else {
      handleUpdate(note);
      setIsExpanded();
    }
  };

  const toggleLabel = (note, label, e) => {
    if (e.target.checked) {
      note.labels = [...note.labels, label];
    }
    if (!e.target.checked) {
      note.labels = note.labels.filter((l) => l != label);
    }
    handleUpdate(note);
  };

  let currDate;
  const date = () => {
    currDate = new Date();
    currDate = currDate.toISOString().slice(0, 16);
  };

  const isMine = note.userId == authUser._id;

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-30 flex items-start justify-center pt-[10vh] px-4 bg-black/30 backdrop-blur-[2px] animate-fade-in">
      <div
        className={`relative w-full max-w-[560px] rounded-2xl border border-border/80 bg-card shadow-card-hover animate-scale-in ${note.color ? note.color : "bg-card"}`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative z-10 p-5 space-y-3">
          {/* Title */}
          <Input
            type="text"
            name="title"
            placeholder="Title"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="h-10 border-0 shadow-none focus-visible:ring-0 px-0 font-semibold text-base bg-transparent placeholder:text-muted-foreground/50"
          />

          {/* Body */}
          <textarea
            className="w-full min-h-[120px] max-h-[50vh] resize-none border-0 bg-transparent px-0 py-1 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 leading-relaxed overflow-y-auto"
            placeholder="Take a note…"
            value={note.text}
            rows={1}
            onChange={(e) => setNote({ ...note, text: e.target.value })}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
            }}
          />

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-1 border-t border-border/40">
            <div className="flex flex-wrap items-center gap-0.5" ref={dropdownRef}>
              {/* Hidden datetime picker */}
              <input
                type="datetime-local"
                ref={inputRef}
                onClick={(e) => e.preventDefault()}
                value={reminder}
                onChange={(e) =>
                  setNote({
                    ...note,
                    reminder:
                      e.target.value > currDate
                        ? e.target.value.replace(".000Z", "").slice(0, 16)
                        : "",
                  })
                }
                className="absolute left-0 bottom-0 z-0 opacity-0 w-0 h-0"
              />

              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => (date(), inputRef.current?.showPicker())} title="Set reminder">
                <BiSolidBellPlus className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 text-muted-foreground hover:text-foreground ${isMine ? "" : "hidden"}`} onClick={() => (setCollab(), setIsExpanded())} title="Collaborators">
                <IoPersonAddOutline className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setColorOpt(!colorOpt)} title="Background options">
                <IoColorPaletteOutline className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Add image">
                <IoImageOutline className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleArchive} title={note.archived ? "Unarchive" : "Archive"}>
                {note.archived ? <TbArchiveOff className="size-4" /> : <LuArchiveRestore className="size-4" />}
              </Button>
              <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 text-muted-foreground hover:text-foreground ${isMine ? "" : "hidden"}`} onClick={() => setIsOpen((o) => !o)} title="More options">
                <IoMdMore className="size-4" />
              </Button>

              {/* More dropdown */}
              {isOpen && (
                <div className="absolute right-0 top-10 w-44 rounded-xl border border-border/80 bg-card shadow-card-hover py-1 z-20 animate-scale-in">
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    onClick={() => (deleteNote(note), setIsExpanded())}
                  >
                    Delete note
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    onClick={() => (setIsOpen(false), setIsLabelOpen((l) => !l))}
                  >
                    Add label
                  </button>
                </div>
              )}

              {/* Label picker */}
              {isLabelOpen && (
                <div className="absolute right-0 top-10 w-60 rounded-xl border border-border/80 bg-card shadow-card-hover p-3 z-20 animate-scale-in">
                  <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Label note
                  </p>
                  <div className="space-y-0.5">
                    {authUser.labels.map((label) => (
                      <label
                        key={label}
                        className="flex items-center gap-2.5 px-2 py-2 hover:bg-accent rounded-lg cursor-pointer text-sm transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={note.labels?.includes(label)}
                          onChange={(e) => toggleLabel(note, label, e)}
                          className="rounded border-input h-3.5 w-3.5 accent-foreground"
                        />
                        <span className="truncate">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground hover:text-foreground self-end sm:self-auto"
              onClick={() => update(note)}
            >
              Close
            </Button>
          </div>

          {/* Color / wallpaper picker */}
          {colorOpt && (
            <div className="p-3 rounded-xl border border-border/60 bg-card/90 shadow-card animate-fade-in">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Colors</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {colorClasses.map((colorClass) => (
                  <button
                    key={colorClass}
                    type="button"
                    className={`size-7 rounded-full border-2 shrink-0 transition-all ${colorClass} ${selectedColor === colorClass ? "border-foreground scale-110" : "border-border"}`}
                    onClick={() => handleColorClick(colorClass)}
                  />
                ))}
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Backgrounds</p>
              <div className="flex flex-wrap gap-2">
                {wallpaperImageUrls.map((url) => (
                  <button
                    key={url}
                    type="button"
                    className={`size-7 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${selectedImg === url ? "border-foreground scale-110" : "border-border"}`}
                    onClick={() => handleImageClick(url)}
                  >
                    <img src={url} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Background image */}
        {note.backgroundImage ? (
          <img
            src={note.backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none rounded-2xl opacity-80"
          />
        ) : null}
      </div>
    </div>
  );
}

export default ExpandedNote;
