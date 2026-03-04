import { User } from "../models/user.model.js";
import { Note } from "../models/note.model.js";
import { Trash } from "../models/trash.model.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import { ApiResponse } from '../utills/ApiResponse.js'
import { ApiError } from '../utills/ApiError.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from "mongoose";

const adminLogin = asyncHandler(async (req, res) => {

    const { password } = req.body;
    console.log(password);

    if (!password) {
        throw new ApiError(400, "Password  required")
    }

    if (password != process.env.ADMIN_PASS) {
        throw new ApiError(401, "Invalid User Credentitals")
    }

    const accessToken = jwt.sign(
        {
            password: password
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, {
            accessToken
        }, "Admin Logged In Successfully"))

})

const getAllUser = asyncHandler(async (req, res) => {  
    const Users = await User.find()
        if (Users.length > 0) {
          return res.send({ success: true, data: Users, message: 'Users fetched' })
        }
        return res.send({ success: true, message: 'No Users Available' })
})

const getAllNotes = async (req, res) => {

  try {
    const allNotes = await Note.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user' 
        }
      },
      {
        $unwind: '$user' // Convert array to an object (since one note has one user)
      },
      {
        $project: {
          _id: 1,
          title: 1,
          text: 1,
          createdAt: 1,
          updatedAt: 1,
          username: '$user.username' // Extract only the username
        }
      }
    ]);
    // console.log(allNotes);
    if (allNotes.length == 0) {
      res.status(201).send({ success: true, message: 'No Notes Found' });
    } else {
      res.status(201).send({ success: true, message: 'data', data: allNotes });

    }

  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: 'error while fetching notes:' });
  }
}


const getUser = async (req, res) => {

  try {
    const {id}=req.params
    const allNotes = await Note.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'users', // The referenced collection (MongoDB uses lowercase collection names)
          localField: 'userId',
          foreignField: '_id',
          as: 'user' // Store the joined user data in "user" field
        }
      },
      {
        $unwind: '$user' // Convert array to an object (since one note has one user)
      },
      {
        $project: {
          _id: 1,
          title: 1,
          text: 1,
          createdAt: 1,
          updatedAt: 1,
          username: '$user.username' // Extract only the username
        }
      }
    ]);
    console.log('allNotes');
    console.log(allNotes);
    
    
    if (allNotes.length == 0) {
      res.status(201).send({ success: true, message: 'No Notes Found' });
    } else {
      res.status(201).send({ success: true, message: 'data', data: allNotes });

    }

  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: 'error while fetching notes:' });
  }
}

 const deleteUser = async (req, res) => {
  const { userid } = req.params
  try {
    await Note.deleteMany({ userId: userid })
    await User.findByIdAndDelete(userid)

    res.status(200).send({ success: true, message: 'user deleted' })
  } catch (error) {
    res.status(500).send({ success: false, error: 'error while deleting users:' });
  }
}

export { adminLogin, getAllUser , getAllNotes, getUser, deleteUser }