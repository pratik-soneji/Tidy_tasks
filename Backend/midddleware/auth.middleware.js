import { ApiError } from "../utills/ApiError.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
export const VerifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken 
        
        
        if (!token) {
            console.log("token nathi");
            
            return next()
            // throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        let user
        
        if(decodedToken.password == process.env.ADMIN_PASS){
           return next()
        }
        if (decodedToken._id) {
            user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        } else {
            user = decodedToken.password == process.env.ADMIN_PASS
        }

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token")
    }
})