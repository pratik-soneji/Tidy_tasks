import { Router } from "express";
import { adminLogin, deleteUser, getAllNotes, getAllUser, getUser } from "../controllers/admin.controller.js";
import { VerifyJWT } from "../midddleware/auth.middleware.js";
const router = Router()

router.route("/login").post(adminLogin)

router.route("/get-all-user").post(VerifyJWT,getAllUser)

router.route('/admin-all-notes').post(VerifyJWT,getAllNotes)

router.route('/admin-user-note/:id').post(VerifyJWT,getUser)

router.route('/admin-delete/:userid').post(VerifyJWT,deleteUser)
export default router