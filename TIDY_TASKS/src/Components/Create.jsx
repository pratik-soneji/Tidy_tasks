import { Input } from "@/components/ui/input";
import { TiPencil } from "react-icons/ti";

function Create({ setCreateClick }) {
  return (
    <div
      className="absolute z-40 top-0 w-full max-w-[540px] px-4 pt-5"
      onClick={setCreateClick}
    >
      <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card shadow-card hover:shadow-card-hover transition-all duration-200 px-4 h-14 cursor-text">
        <TiPencil className="size-4 text-muted-foreground/60 shrink-0" />
        <span className="text-sm text-muted-foreground/70 select-none flex-1">
          Take a note…
        </span>
      </div>
    </div>
  );
}

export default Create;
