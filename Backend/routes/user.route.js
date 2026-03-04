import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, setAvatar, createNote, getAllNotes, getAllTrashNotes, deleteNote, recoverNote, deleteTrashNote, updateNote, deleteTrash, sendOTP, verifyOTP, userExists, addLabel, deleteLabel, addCollaborator, getCollaboratorNotes, noteOwner, deleteCollaborator, forgotPass, setNewPass } from "../controllers/user.controller.js";
import { upload } from "../midddleware/multer.middleware.js"
import { VerifyJWT } from "../midddleware/auth.middleware.js";
import { preventDuplicateUser } from "../midddleware/signup.middleware.js";

const router = Router()

router.route("/signup").post(preventDuplicateUser, registerUser)
router.route("/send-otp").post(sendOTP)
router.route("/verify-otp").post(VerifyJWT, verifyOTP)
router.route("/forgot-pass").post(forgotPass)
router.route("/set-pass").post(setNewPass)

router.route('/login').post(VerifyJWT, loginUser)




//Secure routes
router.route('/logout').post(VerifyJWT, logoutUser)

router.route('/add-label').post(VerifyJWT, addLabel)

router.route('/delete-label').post(VerifyJWT, deleteLabel)

router.route("/get-current-user").post(VerifyJWT, getCurrentUser)

router.route("/set-avatar").post(VerifyJWT, upload.single('file'), setAvatar)

router.route("/create-note").post(VerifyJWT, createNote)

router.route("/get-all-notes").post(VerifyJWT, getAllNotes)

router.route("/get-all-trash-notes").post(VerifyJWT, getAllTrashNotes)

router.route("/delete-note/:noteid").post(VerifyJWT, deleteNote)

router.route("/recover-note/:trashnoteid").post(VerifyJWT, recoverNote)

router.route("/delete-trash-note/:trashnoteid").post(VerifyJWT, deleteTrashNote)

router.route("/empty-trash").post(VerifyJWT, deleteTrash)

router.route("/update-note").post(VerifyJWT, updateNote)

router.route('/add-collaborator').post(VerifyJWT, addCollaborator)

router.route('/remove-collaborator').post(VerifyJWT, deleteCollaborator)

router.route('/get-collaborator-notes').post(VerifyJWT, getCollaboratorNotes)

router.route('/get-owner').post(VerifyJWT, noteOwner)

export default router
