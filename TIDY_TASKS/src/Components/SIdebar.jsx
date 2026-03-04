import { CgNotes } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import { TiPencil } from "react-icons/ti";
import { MdLabelOutline } from "react-icons/md";
import { IoArchiveOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function SIdebar() {
  const nav = useNavigate();
  const location = useLocation();
  const { authUser, setEditLabel } = useAuthStore();

  const isActive = (path) => location.pathname === path;
  const isLabelActive = (label) => location.pathname === `/user/label/${label}`;

  const linkBase =
    "group flex items-center gap-3 w-full py-2 px-3 text-left text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer select-none";
  const linkDefault = "text-muted-foreground hover:text-foreground hover:bg-accent";
  const linkActive = "text-foreground bg-accent font-semibold";

  const getClass = (active) =>
    `${linkBase} ${active ? linkActive : linkDefault}`;

  const iconBase = "size-4 shrink-0 transition-colors";
  const iconDefault = "text-muted-foreground group-hover:text-foreground";
  const iconActive = "text-foreground";

  return (
    <aside className="w-56 border-r border-border/60 bg-background shrink-0 flex flex-col">
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">

        {/* Main nav */}
        <div className="space-y-0.5">
          <div
            onClick={() => nav("/user")}
            className={getClass(isActive("/user"))}
          >
            <CgNotes className={`${iconBase} ${isActive("/user") ? iconActive : iconDefault}`} />
            <span className="hidden sm:inline truncate">Notes</span>
          </div>
          <div
            onClick={() => nav("/user/reminders")}
            className={getClass(isActive("/user/reminders"))}
          >
            <FaRegBell className={`${iconBase} ${isActive("/user/reminders") ? iconActive : iconDefault}`} />
            <span className="hidden sm:inline truncate">Reminders</span>
          </div>
          <div
            onClick={() => setEditLabel()}
            className={getClass(false)}
          >
            <TiPencil className={`${iconBase} ${iconDefault}`} />
            <span className="hidden sm:inline truncate">Edit Labels</span>
          </div>
        </div>

        {/* Labels */}
        {authUser.labels.length > 0 && (
          <div className="pt-3">
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Labels
            </p>
            <div className="space-y-0.5">
              {authUser.labels.map((e) => (
                <div
                  key={e}
                  onClick={() => nav("/user/label/" + e)}
                  className={getClass(isLabelActive(e))}
                >
                  <MdLabelOutline className={`${iconBase} ${isLabelActive(e) ? iconActive : iconDefault}`} />
                  <span className="hidden sm:inline truncate">{e}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="pt-3">
          <div className="h-px bg-border/60 mx-1 mb-3" />
          <div className="space-y-0.5">
            <div
              onClick={() => nav("/user/archive")}
              className={getClass(isActive("/user/archive"))}
            >
              <IoArchiveOutline className={`${iconBase} ${isActive("/user/archive") ? iconActive : iconDefault}`} />
              <span className="hidden sm:inline truncate">Archive</span>
            </div>
            <div
              onClick={() => nav("/user/trash")}
              className={getClass(isActive("/user/trash"))}
            >
              <FaRegTrashAlt className={`${iconBase} ${isActive("/user/trash") ? iconActive : iconDefault}`} />
              <span className="hidden sm:inline truncate">Trash</span>
            </div>
          </div>
        </div>

      </nav>
    </aside>
  );
}

export default SIdebar;
