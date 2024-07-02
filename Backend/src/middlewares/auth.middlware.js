import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from '../models/user.model.js';

export const verifyJWT = asyncHandler( async(req, _, next) => {

    try {

        // may be user is using phone so cookies does not have access to accessToken, so use another method
        // whya accessToken is used?
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if( !token ) {
            console.log("token", token);
            throw new ApiError(401, "Unauthorized Access")
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id)
        .select("-password -refreshToken");

        if(!user) {
            // discussion
            throw new ApiError(401, "Invalid Access Token")
        }
        
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
} )