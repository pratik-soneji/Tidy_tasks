
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import ExpandedNote from "../Components/ExpandedNote.jsx";
import Create from "../Components/Create.jsx";
import CreateClicked from "../Components/CreateClicked.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { useEffect, useState } from "react";
import { IoArchiveOutline } from 'react-icons/io5';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Notes() {
    const [createClicked, setCreateClicked] = useState(false);
    const setCreateClick = () => setCreateClicked(!createClicked);

    const nav = useNavigate();
    const {
        note, setNote, view, data, resMessage, authUser,
        deleteNote, isExpanded, setIsExpanded, getAll,
        dataUpdate, setUserId, listenForReminders, searchQuery,
    } = useAuthStore();

    useEffect(() => {
        getAll();
        setUserId();
        listenForReminders();
    }, [dataUpdate, searchQuery]);

    const handleClick = (e) => {
        console.log(e);
        setIsExpanded();
        setNote(e);
    };

    useEffect(() => {
        useAuthStore.getState().setNav((path, note) => {
            nav(path);
            console.log(note);
            if (note) {
                console.log('if');
                let e = note;
                handleClick(e);
            }
        });
    }, []);

    const getOwner = async (id) => {
        try {
            const response = await axios.post('http://localhost:4012/user/get-owner', { id: id }, { withCredentials: true });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-1 flex-col min-h-0">
            {resMessage && (
                <div className={`overflow-auto flex-1 min-h-0 p-5 md:p-7 ${isExpanded ? "opacity-40 pointer-events-none" : ""}`}>
                    {/* Page header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <CgNotes className="size-4 text-muted-foreground" />
                            <h1 className="text-sm font-semibold text-foreground tracking-tight">Notes</h1>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {data.length}
                            </span>
                        </div>
                    </div>

                    {/* Notes grid */}
                    <div className={`${view
                        ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                        : "flex flex-col gap-3 max-w-lg mx-auto"
                        }`}>
                        {data.map((e) => {
                            const isMine = e.userId == authUser._id;
                            let owner;
                            if (!isMine) {
                                owner = getOwner(e.userId);
                            }
                            const dateCreated = new Date(e.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                            const dateUpdated = new Date(e.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

                            return (
                                <div
                                    key={e._id}
                                    onClick={() => handleClick(e)}
                                    className={`group relative rounded-xl overflow-hidden border border-border/70 bg-card shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer
                    ${view ? "h-auto" : "w-full max-w-lg"}
                    ${e.backgroundImage ? "" : e.color ? e.color : "bg-card"}`}
                                >
                                    {e.backgroundImage && (
                                        <img
                                            src={e.backgroundImage}
                                            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                                            alt=""
                                        />
                                    )}

                                    {/* Content */}
                                    <div className="relative z-10 p-4 flex flex-col gap-2 min-h-[120px]">
                                        {e.title && (
                                            <h2 className="text-sm font-semibold leading-snug line-clamp-2">
                                                {String(e.title).length > 40 ? e.title.slice(0, 40) + "…" : e.title}
                                            </h2>
                                        )}
                                        {e.text && (
                                            <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed">
                                                {String(e.text).length > 120 ? e.text.slice(0, 120) + "…" : e.text}
                                            </p>
                                        )}
                                    </div>

                                    {/* Footer dates */}
                                    <div className="relative z-10 px-4 pb-3">
                                        <p className="text-[10px] text-muted-foreground/70">
                                            Updated {dateUpdated}
                                        </p>
                                    </div>

                                    {/* Action buttons — appear on hover */}
                                    <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isMine ? (
                                            <button
                                                type="button"
                                                className="h-7 w-7 rounded-full bg-background/90 border border-border shadow-sm hover:bg-destructive/10 hover:border-destructive/30 inline-flex items-center justify-center transition-all"
                                                onClick={(event) => { event.stopPropagation(); deleteNote(e); }}
                                                title="Delete note"
                                            >
                                                <RiDeleteBin6Line className="size-3.5 text-muted-foreground hover:text-destructive" />
                                            </button>
                                        ) : (
                                            owner?.avatar && (
                                                <div className="size-7 rounded-full overflow-hidden border border-border bg-muted ring-1 ring-background">
                                                    <img src={owner.avatar} className="size-full object-cover" alt="" />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {isExpanded && <ExpandedNote note={note} setNote={setNote} />}

            {/* Empty state */}
            {!resMessage && (
                <div className="flex-1 flex flex-col justify-center items-center gap-5 px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                        <CgNotes className="size-8 text-muted-foreground/60" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">No notes yet</h2>
                        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                            Click on the note creator below to capture your first thought.
                        </p>
                    </div>
                </div>
            )}

            {/* Floating create bar */}
            <div className="z-10 w-screen absolute flex justify-center items-start pt-4" onClick={setCreateClick}>
                {!createClicked && <Create setCreateClick={setCreateClick} />}
            </div>
            {createClicked && (
                <div className="z-20 w-screen h-screen absolute flex justify-center" onClick={() => createClicked ? setCreateClick(false) : ""}>
                    {createClicked && <CreateClicked setCreateClick={setCreateClick} />}
                </div>
            )}
        </div>
    );
}

export default Notes;
