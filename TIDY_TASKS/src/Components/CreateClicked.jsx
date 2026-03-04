import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BiBellPlus } from "react-icons/bi";
import { IoColorPaletteOutline, IoPersonAddOutline } from "react-icons/io5";
import { useAuthStore } from "../store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function CreateClicked({ setCreateClick }) {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleBlur = async (e) => {
    if (!noteData.title.length || !noteData.text.length) {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setCreateClick();
      }
    } else {
      await handleSubmit(e);
    }
  };

  const [pin, setPin] = useState(false);
  const [colorOpt, setColorOpt] = useState(false);

  const colorClasses = [
    "bg-white",
    "bg-red-300",
    "bg-orange-300",
    "bg-yellow-100",
    "bg-lime-100",
    "bg-emerald-200",
    "bg-slate-200",
    "bg-slate-300",
    "bg-zinc-300",
    "bg-red-100",
    "bg-stone-200",
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
  const [selectedImg, setSelectedImg] = useState("");

  const [noteData, setNoteData] = useState({
    title: "",
    text: "",
    color: "",
    pinned: false,
    archived: false,
    reminder: null,
    backgroundImage: null,
  });

  const { setDataUpdate } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4012/user/create-note",
        { noteData },
        { withCredentials: true }
      );
      if (response) {
        setCreateClick();
        setDataUpdate();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleColorClick = (colorClass) => {
    setSelectedColor(colorClass);
    setSelectedImg("");
    setNoteData({ ...noteData, color: colorClass, backgroundImage: "" });
  };

  const handleImageClick = (wallpaperImageUrl) => {
    setSelectedImg(wallpaperImageUrl);
    setNoteData({ ...noteData, color: "", backgroundImage: wallpaperImageUrl });
  };

  return (
    <div
      className={`relative z-50 w-full max-w-[540px] mx-4 overflow-hidden top-[28%] rounded-xl border border-border/80 bg-card shadow-card-hover ${selectedColor}`}
      onClick={(e) => e.stopPropagation()}
      tabIndex={-1}
    >
      <div className="relative z-10 p-4 space-y-2">
        {/* Title */}
        <Input
          type="text"
          name="title"
          placeholder="Title"
          value={noteData.title}
          onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
          className="h-10 border-0 shadow-none focus-visible:ring-0 px-0 font-semibold text-sm bg-transparent placeholder:text-muted-foreground/50"
        />

        {/* Body */}
        <textarea
          ref={inputRef}
          className="w-full min-h-[100px] resize-none border-0 bg-transparent px-0 py-1 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 leading-relaxed"
          placeholder="Take a note…"
          value={noteData.text}
          rows={1}
          onChange={(e) => setNoteData({ ...noteData, text: e.target.value })}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40">
          <div className="flex items-center gap-0.5">
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Add reminder">
              <BiBellPlus className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Collaborators">
              <IoPersonAddOutline className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setColorOpt(!colorOpt)}
              title="Background options"
            >
              <IoColorPaletteOutline className="size-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleBlur}
          >
            Close
          </Button>
        </div>

        {/* Color / wallpaper picker */}
        {colorOpt && (
          <div className="mt-2 p-3 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-card animate-fade-in">
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

      {/* Background image overlay */}
      {selectedImg ? (
        <img
          src={selectedImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-90"
        />
      ) : null}
    </div>
  );
}

export default CreateClicked;
