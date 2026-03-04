import axios from 'axios';
import { create } from 'zustand'
import { io } from "socket.io-client";
import { toast } from 'react-toastify';
const socket = io("http://localhost:4012", {
    transports: ["websocket", "polling"], // Ensures a proper connection method
    withCredentials: true,
});
export const useAuthStore = create((set, get) => ({
    socket,
    authUser: null,
    userAuth: false,
    userAuthUpdate: () => {
        get().fetchUserData()
    },
    nav: null,
    searchQuery: '',
    setSearchQuery: (query) => {
        set({ searchQuery: query })
    },
    setUserId: () => {
        socket.emit("user-online", get().authUser._id ? get().authUser._id : ''); // Notify server user is online
    },
    listenForReminders: () => {
        console.log(get().nav);

        socket.off("reminder"); // Remove previous listeners
        socket.on("reminder", (note) => {
            console.log("Listen for Reminders");
            toast.info(note.title, {
                position: "top-right", autoClose: false, closeOnClick: false, draggable: true, pauseOnHover: true, onClick: () => {
                    console.log(get().nav);

                    if (get().nav) {
                        get().nav('/user', note); // Call the navigation function
                    }
                    toast.dismiss();
                }
            });
            get().setDataUpdate();
        });
        socket.off("note-update");
        socket.on("note-update", (note) => {
            console.log("Collaborator Note Updated", note);
            get().setDataUpdate(); // Only update UI without showing toast
        });
    },
    setNav: (nav) => {
        set({ nav: nav }); // Save nav function inside Zustand store
    },

    disconnectSocket: () => {
        socket.disconnect();
        set({ userId: null });
    },
    note: null,
    setNote: (note) => {
        set({ note: note })
    },
    isSigningUp: false,
    isLogggingUp: false,
    view: false,
    editLabel: false,
    message: '',
    errMessage: '',
    resMessage: false,
    data: [],
    dataUpdate: false,
    isExpanded: false,
    collab: false,
    setCollab: () => {
        set({ collab: !get().collab })
    },
    setEditLabel: () => {
        set({ editLabel: !get().editLabel })
    },
    setIsSigningUp: () => {

        set({ isSigningUp: !get().isSigningUp })

    },
    setMessage: (message) => {
        set({ message: message })
    },
    setIsExpanded: () => {
        set({ isExpanded: !get().isExpanded })
    },
    setDataUpdate: () => {
        set({ dataUpdate: !get().dataUpdate })
    },
    /** @param {{ email: string, username: string, password: string }} data @param {Function} nav */
    signUp: async (data, nav) => {
        try {
            // Backend returns { data: true } on success — fetch user after signup
            await axios.post(`http://localhost:4012/user/signup`, data, { withCredentials: true });
            const userRes = await axios.post('http://localhost:4012/user/get-current-user', {}, { withCredentials: true });
            set({ authUser: { ...userRes.data.data } });
            nav('/user');
        } catch (error) {
            console.error('Sign up error:', error);
            throw error; // re-throw so caller can set message
        }
    },

    /** @param {Record<string, unknown>} data @param {Function} nav */
    login: async (data, nav) => {
        set({ isLoggingIn: true });
        try {
            // console.log(data);

            const res = await axios.post("http://localhost:4012/user/login", data, { withCredentials: true });

            if (res) {
                set({ authUser: res.data.data.user });
            }

            nav('/user')
        } catch (error) {
            set({ errMessage: error.response.data.message })
            setTimeout(() => {
                set({ errMessage: "" });
            }, 3000);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    setView: () => (set({ view: !get().view })),
    fetchUserData: async (nav) => {
        try {
            const response = await axios.post('http://localhost:4012/user/get-current-user', {}, { withCredentials: true })
            set({ authUser: { ...response.data.data } })
            console.log(get().authUser);
            console.log(nav);
            socket.emit("join-room", response.data.data._id);

        } catch (error) {
            console.error('fetch user data err', error);
            nav('/login')
        }
    },
    getAll: async () => {
        try {
            const response = await axios.post('http://localhost:4012/user/get-all-notes', {}, { withCredentials: true })

            if (response.data.data.length) {
                set({ data: response.data.data })
                set({ resMessage: true })
                response.data.data.forEach((note) => {
                    if (note.collaborators?.length) {
                        socket.emit("join-note-room", note._id);
                    }
                });
                console.log('data');
                console.log('updated');

                console.log(get().data);

                // return get().data
            } else {
                set({ errMessage: response.data.message })
                set({ resMessage: false })
            }
        } catch (error) {
            console.log(error);
            set({ errMessage: error })
        }

    },
    getCollaboratorNotes: async () => {
        try {
            const response = await axios.post('http://localhost:4012/user/get-all-notes', {}, { withCredentials: true })
            if (response.data.data.length) {
                set({ data: response.data.data })
                set({ resMessage: true })
                response.data.data.forEach((note) => {
                    if (note.collaborators?.length) {
                        socket.emit("join-note-room", note._id);
                    }
                });
                return get().data
            } else {
                set({ errMessage: response.data.message })
                set({ resMessage: false })
            }
        } catch (error) {
            console.log(error);
            set({ errMessage: error })
        }

    },
    deleteNote: async (e) => {

        try {
            const response = await axios.post('http://localhost:4012/user/delete-note/' + e._id, {}, { withCredentials: true })
            console.log(response);
            get().setDataUpdate()
        } catch (error) {

            console.log(error);
        }
    },
    handleUpdate: async (note) => {
        console.log('reach');
        console.log(note);


        try {
            const response = await axios.post('http://localhost:4012/user/update-note', { note }, { withCredentials: true })
            get().setDataUpdate()
            console.log(response);
            socket.emit("note-update", note);
        } catch (error) {
            console.log("err in pudate note", error);

        }
    }
}))