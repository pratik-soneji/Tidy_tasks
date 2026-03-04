import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";
import { useContext, useEffect, useRef, useState } from 'react';
import UserContext from '../Features/context.js';
import ExpandedNote from "../Components/ExpandedNote.jsx";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore.js";
import { Button } from "@/components/ui/button";

function Trash() {
    const { view } = useAuthStore();
    const { setDataUpdate } = useAuthStore();
    const [trash, setTrash] = useState([]);
    const [resTrashMessage, setResTrashMessage] = useState(false);
    const [trashUpdate, setTrashUpdate] = useState(false);

    const getAllTrash = async () => {
        try {
            const response = await axios.post('http://localhost:4012/user/get-all-trash-notes', {}, { withCredentials: true });
            if (response) {
                setTrash(response.data.data);
                if (response.data.data.length) {
                    setResTrashMessage(true);
                } else {
                    setResTrashMessage(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllTrash();
    }, [trashUpdate]);

    const deleteTrash = async (e) => {
        try {
            const response = await axios.post('http://localhost:4012/user/delete-trash-note/' + e._id, {}, { withCredentials: true });
            setTrashUpdate(!trashUpdate);
        } catch (error) {
            console.log(error);
            console.log(error.message);
        }
    };

    const recoverNote = async (e) => {
        try {
            const response = await axios.post('http://localhost:4012/user/recover-note/' + e._id, {}, { withCredentials: true });
            if (response) {
                setTrashUpdate(!trashUpdate);
                setDataUpdate();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const emptyTrash = async () => {
        try {
            const response = await axios.post('http://localhost:4012/user/empty-trash', {}, { withCredentials: true });
            setTrashUpdate(!trashUpdate);
        } catch (error) {
            console.log(error);
            console.log(error.message);
        }
    };

    return (
        <div className="flex flex-1 flex-col min-h-0">
            {resTrashMessage && (
                <div className="flex-1 flex flex-col min-h-0 overflow-auto p-5 md:p-7">
                    {/* Page header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <FaRegTrashAlt className="size-3.5 text-muted-foreground" />
                            <h1 className="text-sm font-semibold text-foreground tracking-tight">Trash</h1>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {trash.length}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40"
                            onClick={emptyTrash}
                        >
                            Empty trash
                        </Button>
                    </div>

                    {/* Info banner */}
                    <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-muted/50 border border-border/60">
                        <svg className="size-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-muted-foreground">
                            Notes in trash are permanently deleted after 7 days.
                        </p>
                    </div>

                    {/* Notes grid */}
                    <div className={`${view
                        ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                        : "flex flex-col gap-3 max-w-lg mx-auto"
                        }`}>
                        {trash.map((e) => {
                            const dateUpdated = new Date(e.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

                            return (
                                <div
                                    key={e._id}
                                    className={`group relative rounded-xl overflow-hidden border border-border/70 bg-card shadow-card hover:shadow-card-hover transition-all duration-200 cursor-default opacity-80 hover:opacity-100
                    ${view ? "h-auto" : "w-full max-w-lg"}
                    ${e.backgroundImage ? "" : e.color ? e.color : "bg-card"}`}
                                >
                                    {e.backgroundImage && (
                                        <img src={e.backgroundImage} className="absolute inset-0 w-full h-full object-cover z-0 opacity-80" alt="" />
                                    )}

                                    <div className="relative z-10 p-4 flex flex-col gap-2 min-h-[120px]">
                                        {e.title && (
                                            <h2 className="text-sm font-semibold leading-snug line-clamp-2">
                                                {e.title.length > 40 ? e.title.slice(0, 40) + "…" : e.title}
                                            </h2>
                                        )}
                                        {e.text && (
                                            <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed">
                                                {e.text.length > 120 ? e.text.slice(0, 120) + "…" : e.text}
                                            </p>
                                        )}
                                    </div>

                                    <div className="relative z-10 px-4 pb-3">
                                        <p className="text-[10px] text-muted-foreground/70">Updated {dateUpdated}</p>
                                    </div>

                                    {/* Hover: delete + restore */}
                                    <div className="absolute top-2.5 right-2.5 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            className="h-7 w-7 rounded-full bg-background/90 border border-border shadow-sm hover:bg-destructive/10 hover:border-destructive/30 inline-flex items-center justify-center transition-all"
                                            onClick={(event) => { event.stopPropagation(); deleteTrash(e); }}
                                            title="Delete permanently"
                                        >
                                            <RiDeleteBin6Line className="size-3.5 text-muted-foreground" />
                                        </button>
                                        <button
                                            type="button"
                                            className="h-7 w-7 rounded-full bg-background/90 border border-border shadow-sm hover:bg-muted inline-flex items-center justify-center transition-all"
                                            onClick={(event) => { event.stopPropagation(); recoverNote(e); }}
                                            title="Restore note"
                                        >
                                            <MdOutlineSettingsBackupRestore className="size-3.5 text-muted-foreground" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!resTrashMessage && (
                <div className="flex-1 flex flex-col justify-center items-center gap-5 px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                        <FaRegTrashAlt className="size-7 text-muted-foreground/60" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Trash is empty</h2>
                        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                            Deleted notes will appear here for 7 days before being removed.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Trash;
