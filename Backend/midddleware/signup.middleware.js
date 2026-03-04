import { User } from "../models/user.model.js";
import { ApiError } from "../utills/ApiError.js";
import { asyncHandler } from "../utills/asyncHandler.js";

/**
 * Middleware: block signup if email or username is already taken.
 * Attach validated fields to req.signupData so registerUser can use them.
 */
export const preventDuplicateUser = asyncHandler(async (req, res, next) => {
    const { email, password, username } = req.body;

    if (!email?.trim() || !password?.trim() || !username?.trim()) {
        throw new ApiError(400, "Email, username and password are all required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });

    if (existing) {
        const field = existing.email === email ? "email" : "username";
        throw new ApiError(409, `An account with that ${field} already exists`);
    }

    next();
});
