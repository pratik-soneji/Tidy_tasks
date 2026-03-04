import { ApiError } from "./ApiError.js"

const asyncHandler = (fn)=>{

    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((error)=>{
            if(error instanceof ApiError){
                return res.status(error.statusCode).json({
                    statusCode:error.statusCode,
                    message:error.message
                })
            }
        })
    }
}

export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = (fn) => async() => {}
// const asyncHandler = (fn) => {async() => {}} this two is same

// try catch function
// const asyncHandler = (fn) => async(req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }