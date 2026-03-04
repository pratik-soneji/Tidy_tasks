import { User } from "../models/user.model.js";
import { Note } from "../models/note.model.js";
import { Trash } from "../models/trash.model.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import { ApiResponse } from '../utills/ApiResponse.js'
import { ApiError } from '../utills/ApiError.js'
import { uploadOnCloudinary } from '../config/cloudinaryConfig.js';
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import { io } from "../app.js";
import jwt from 'jsonwebtoken';

dotenv.config();

const userExists = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    console.log("email" + email);

    if ([email, password, username].some(item => item?.trim() === "")) {
        throw new ApiError(400, "All fields are neccessary to sign up")
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    const userAlreadyExist = await User.findOne(
        {
            $or: [{ email }, { username }]
        }
    )
    console.log("userAlreadyExist" + userAlreadyExist);

    if (userAlreadyExist) {

        return res.status(200).json(new ApiResponse(200, false, "User exists"))
    }

    const otpCode = generateOTP();

    // Set OTP expiration time 
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Store OTP with expiration
    otpStore.set(email, { otp: otpCode, expiresAt });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code For Tidy Task Verification',
        text: `Your OTP for verification is: ${otpCode}`
    };
    console.log("REacehd end");

    const info = await transporter.sendMail(mailOptions);
    console.log("kjbhufhges");

    if (!info) {
        throw new ApiError(500, "ERor while sending mail")
    }
    console.log("sent");

    return res.status(200).json(new ApiResponse(200, info, "sent"))

})
const registerUser = asyncHandler(async (req, res) => {

    //check validation
    //check if user already exist
    //add middleware to upload the avatar and coverImage in localstorage 
    //check if its uploaded in local server=>avatar
    //upload them in cloudinary
    //check if they are uploaded in cloudinary
    //make a object and do a dataentry
    //check if user is added in database
    //if user added successfully then give a response without password and token
    console.log("sign up hit");

    const { email, password, username } = req.body;
    if (req.user) {
        console.log('exists');
        return res.status(200)
            .json(new ApiResponse(200, { user: req.user }, "User Already Logged In Successfully"))
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await User.create({
        email,
        password: hashedPassword,
        username,
    })

    const user = await User.findById(response._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(505, "Something went wrong when creating a user")
    }

    console.log("response");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const userLogged = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, true, "User Logged In Successfully"))
})

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your Office365 Email
        pass: process.env.EMAIL_PASS  // App Password (or your Office365 password)
    }
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const otpStore = new Map(); // Store OTP



// Function to Send OTP
const sendOTP = asyncHandler(async (req, res) => {
    const otpCode = generateOTP();
    const { recipientEmail } = req.body

    // Set OTP expiration time 
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Store OTP with expiration
    otpStore.set(recipientEmail, { otp: otpCode, expiresAt });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Your OTP Code For Tidy Task Verification',
        text: `Your OTP for verification is: ${otpCode}`
    };

    const info = await transporter.sendMail(mailOptions);
    if (!info) {
        throw new ApiError(500, "ERor while sending mail")
    }


    return res.status(200)
        .cookie('emailToken', emailToken, options)
        .json(new ApiResponse(200, info, "sent"))
})

//Function to verify OTP
const verifyOTP = asyncHandler(async (req, res) => {
    const { recipientEmail, otp } = req.body;

    if (!recipientEmail || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const storedOtpData = otpStore.get(recipientEmail);
    if (!storedOtpData) {
        throw new ApiError(400, "No OTP found for this email. Please request a new code.");
    }

    const { otp: storedOtp, expiresAt } = storedOtpData;

    if (Date.now() > expiresAt) {
        otpStore.delete(recipientEmail);
        throw new ApiError(400, "OTP has expired. Please request a new code.");
    }

    if (otp != storedOtp) {
        return res.status(200).json(new ApiResponse(200, false, "OTP is incorrect"));
    } else {
        otpStore.delete(recipientEmail);
        return res.status(200).json(new ApiResponse(200, true, "OTP verified"));
    }
});


const generateAccessAndRefreshToken = async (userid) => {
    try {
        const user = await User.findById(userid)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating token")
    }
}

const loginUser = asyncHandler(async (req, res) => {
    //check email,username and password
    //find with  email
    //check the password
    //access token and refresh token
    //send cookies 

    const { email, password } = req.body;
    if (req.user) {
        console.log('exists');
        return res.status(200)

            .json(new ApiResponse(200, { user: req.user }, "User Already Logged In Successfully"))
    }

    if (!email || !password) {
        throw new ApiError(400, "Email and Password both are required")
    }

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const userLogged = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    user.isActive = true
    await user.save({ validateBeforeSave: false })
    console.log('Poachi gyo');

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: userLogged, accessToken, refreshToken
        }, "User Logged In Successfully"))

})

const forgotPass = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({ email });
    console.log('user');
    console.log(user);

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    const otpCode = generateOTP();

    // Set OTP expiration time 
    const expiresAt = Date.now() + 10 * 60 * 1000;
    console.log('otp generated');

    // Store OTP with expiration
    otpStore.set(email, { otp: otpCode, expiresAt });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code For Tidy Task Verification',
        text: `Your OTP for verification is: ${otpCode}`
    };
    console.log('mailsent');

    const emailToken = jwt.sign(
        {
            email: email
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
    console.log('email token generated');

    const info = await transporter.sendMail(mailOptions);
    console.log('info');
    console.log(info);


    if (!info) {
        throw new ApiError(500, "ERor while sending mail")
    }
    console.log('arrive');

    return res.status(200)
        .cookie('emailToken', emailToken, {
            httpOnly: true,
            secure: false  // allow over HTTP (localhost dev)
        })
        .json(new ApiResponse(200, true, "OTP sent"))
})

const setNewPass = asyncHandler(async (req, res) => {
    const { email, newPass } = req.body
    const token = req.cookies?.emailToken

    if (!token) {
        console.log("token nathi");
        throw new ApiError(401, "Unauthorized request")
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    if (decodedToken.email != email) {
        throw new ApiError(400, "Unauthorized request")
    }
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    const hashedPassword = await bcrypt.hash(newPass, 10);

    user.password = hashedPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200, true, "password changed"))
})

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }, { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    user.isActive = false
    await user.save({ validateBeforeSave: false })
    return res.status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    console.log(req.user);

    return res.status(200).json(new ApiResponse(200, req.user, "Provided User"))
})

const setAvatar = asyncHandler(async (req, res) => {

    const localpath = req.file.path

    if (!localpath) {
        throw new ApiError(500, "Avatar is not provided")
    }

    const avatar = await uploadOnCloudinary(localpath)

    if (!avatar) {
        throw new ApiErrors(500, "something went wrong when uploading your avatar on cloudnary")
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: avatar.url
        }
    }, { new: true }).select("-password")

    return res.status(200)
        .json(new ApiResponse(200, user, "Avatar Changed"))
})

const addLabel = asyncHandler(async (req, res) => {
    const { label } = req.body
    if (!label.trim()) {
        throw new ApiError(500, "Provide Label")
    }
    if (req.user.labels.includes(label)) {
        throw new ApiError(500, "Provide a unique Label")
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $push: { labels: label }
    }, { new: true })
    return res.status(200)
        .json(new ApiResponse(200, true, "Label Added"))
})

const deleteLabel = asyncHandler(async (req, res) => {
    const { label } = req.body
    if (!label.trim()) {
        throw new ApiError(500, "Provide Label")
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { labels: label }
    }, { new: true })
    if (!user) {
        throw new ApiError(500, "No such Label exists")
    }
    return res.status(200)
        .json(new ApiResponse(200, true, "Label Deleted"))
})

const createNote = asyncHandler(async (req, res) => {

    const { noteData } = req.body

    if (!noteData) {
        throw new ApiError(500, "Note data is not provided")
    }

    if (!noteData.title || !noteData.text) {
        throw new ApiError(500, "Please Provide Note Title and Text Both")
    }

    const newNote = new Note({
        ...noteData,
        userId: req.user._id,
    });

    if (!newNote) {
        throw new ApiError(505, "Something went wrong when creating a note")
    }

    await newNote.save();
    return res.status(201).json(new ApiResponse(200, newNote, "Note Created Successfully"));

})

const getAllNotes = asyncHandler(async (req, res) => {

    const allNotes = await Note.find({
        $or: [
            { userId: req.user._id }, // Fetch Notes where user is Owner
            { collaborators: { $in: [req.user._id] } }, // Fetch Notes where user is Collaborator
        ],
    })
        .populate("collaborators")

    if (!allNotes) {
        throw new ApiError(500, "Something went wrong while fetching notes")
    }

    if (allNotes.length === 0) {
        return res.status(201).json(new ApiResponse(200, [], "No notes found"));
    } else {
        return res.status(201).json(new ApiResponse(200, allNotes, "Notes fetched"));
    }
})

const getAllTrashNotes = asyncHandler(async (req, res) => {

    const allTrashNotes = await Trash.find({ userId: req.user._id })

    if (!allTrashNotes) {
        throw new ApiError(500, "Something went wrong while fetching notes")
    }

    if (allTrashNotes.length === 0) {
        return res.status(201).json(new ApiResponse(200, [], "No Trash notes found"));
    } else {
        return res.status(201).json(new ApiResponse(200, allTrashNotes, "Trash Notes fetched"));
    }
})

const deleteNote = asyncHandler(async (req, res) => {

    const { noteid } = req.params

    const noteExist = await Note.findById(noteid)
    // console.log("reached");

    if (!noteExist) {
        throw new ApiError(500, "No such Note Exist")
    }

    const note = await Note.findByIdAndDelete(noteExist._id)
    console.log("reached delete");
    const newTrashNote = new Trash({
        userId: note.userId,
        title: note.title,
        text: note.text,
        labels: note.labels,
        color: note.color,
        pinned: note.pinned,
        archived: note.archived,
        reminder: note.reminder,
        backgroundImage: note.backgroundImage
    });

    // console.log('trash created');

    if (!newTrashNote) {
        throw new ApiError(500, "Err while deleting Note")
    }

    await newTrashNote.save();

    return res.status(201).json(new ApiResponse(200, newTrashNote, "Note deleted"))

})
const recoverNote = asyncHandler(async (req, res) => {

    const { trashnoteid } = req.params

    const trashNoteExist = await Trash.findById(trashnoteid)

    if (!trashNoteExist) {
        throw new ApiError(500, "No such Note Exist")
    }

    const note = await Trash.findByIdAndDelete(trashNoteExist._id)

    const recoverNote = new Note({
        userId: note.userId,
        title: note.title,
        text: note.text,
        labels: note.labels,
        color: note.color,
        pinned: note.pinned,
        archived: note.archived,
        reminder: note.reminder,
        backgroundImage: note.backgroundImage
    });

    if (!recoverNote) {
        throw new ApiError(500, "Err while recovering Note")
    }

    await recoverNote.save();

    return res.status(201).json(new ApiResponse(200, recoverNote, "Note recovered"))

})

const deleteTrashNote = asyncHandler(async (req, res) => {

    const { trashnoteid } = req.params

    const trashNoteExist = await Trash.findById(trashnoteid)

    if (!trashNoteExist) {
        throw new ApiError(500, "No such Note Exist")
    }

    await Trash.findByIdAndDelete(trashNoteExist._id)

    return res.status(201).json(new ApiResponse(201, {}, "Trash Note deleted successfully"))

})

// const updateNote = asyncHandler(async(req,res)=>{
//     const { note } = req.body
//         const noteExist = await Note.findById(note._id)

//         if(!noteExist){
//             throw new ApiError(500, 'no such note found')
//         }

//         noteExist.title = note.title || noteExist.title
//         noteExist.text = note.text || noteExist.text
//         noteExist.pinned = note.pinned || noteExist.pinned
//         noteExist.archived = note.archived 
//         noteExist.labels = note.labels

//         if (note.backgroundImage) {
//           noteExist.backgroundImage = note.backgroundImage
//           noteExist.color = ''
//         }
//         else if (note.color) {
//           noteExist.color = note.color
//           noteExist.backgroundImage = ''
//         }
//           noteExist.reminder = note.reminder

//         await noteExist.save({ validateBeforeSave: false })

//         io.emit(`update-${note._id}`, note);
//         return res.status(200).json(new ApiResponse(200, noteExist, "Note Updated Successfully"))
// })
const updateNote = asyncHandler(async (req, res) => {
    const { note } = req.body;

    const noteExist = await Note.findById(note._id).populate('collaborators'); // Populate collaborators

    if (!noteExist) {
        throw new ApiError(500, 'No such note found');
    }

    // Update Fields
    noteExist.title = note.title ?? noteExist.title;
    noteExist.text = note.text ?? noteExist.text;
    noteExist.pinned = note.pinned ?? noteExist.pinned;
    noteExist.archived = note.archived ?? noteExist.archived;
    noteExist.labels = note.labels ?? noteExist.labels;
    noteExist.reminder = note.reminder ?? noteExist.reminder;

    if (note.backgroundImage) {
        noteExist.backgroundImage = note.backgroundImage;
        noteExist.color = '';
    } else if (note.color) {
        noteExist.color = note.color;
        noteExist.backgroundImage = '';
    }

    await noteExist.save({ validateBeforeSave: false });

    //  Emit Socket Events for Real-Time Sync
    if (noteExist.collaborators.length > 0) {
        io.emit(`update-${noteExist.userId}`, noteExist); // Notify Owner
        noteExist.collaborators.forEach((collaborator) => {
            io.emit(`update-${collaborator._id}`, noteExist); // Notify Collaborators
        });
    } else {
        io.emit(`update-${noteExist.userId}`, noteExist); // Notify Only Owner
    }

    return res.status(200).json(new ApiResponse(200, noteExist, "Note Updated Successfully"));
});

const deleteTrash = asyncHandler(async (req, res) => {


    const result = await Trash.deleteMany({ userId: req.user._id });
    console.log(result);

    if (!result) {
        throw new ApiError(500, "Error while emptying trash")
    }
    return res.status(201).json(new ApiResponse(201, {}, "Trash empty successfully"))

})

const addCollaborator = asyncHandler(async (req, res) => {
    const { noteId, collaboratorEmail } = req.body;
    const note = await Note.findById(noteId).populate("collaborators");

    if (!note) {
        throw new ApiError(404, "note not found")
    }

    if (note.userId.toString() !== req.user.id) {
        throw new ApiError(404, "Only the owner can add collaborators")
    }
    const collaborator = await User.findOne({ email: collaboratorEmail });
    if (!collaborator) {
        throw new ApiError(404, "User not found with this email")
    }
    if (note.collaborators.includes(collaborator._id)) {
        throw new ApiError(404, "Collaborator already added")
    }
    if (!note.collaborators.includes(collaborator)) {
        note.collaborators.push(collaborator);
        await note.save();
    }
    console.log(note);

    io.emit(`update-${note.userId}`, note); // Notify Owner
    note.collaborators.forEach((collaborator) => {
        io.emit(`update-${collaborator._id}`, note); // Notify Collaborators
        console.log("sent to collb");

    });
    io.emit(`update-${collaborator._id}`, note);
    console.log("sent to last one");
    res.status(200).json({ note: note, message: 'Collaborator added successfully' });
})

const deleteCollaborator = asyncHandler(async (req, res) => {
    const { noteId, collaboratorEmail } = req.body;

    // Find the note by ID
    const note = await Note.findById(noteId);
    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    // Only the owner can remove collaborators
    if (note.userId.toString() !== req.user.id) {
        throw new ApiError(403, "Only the owner can remove collaborators");
    }

    // Find the collaborator by email
    const collaborator = await User.findOne({ email: collaboratorEmail });
    if (!collaborator) {
        throw new ApiError(404, "User not found with this email");
    }

    // Check if the collaborator exists in the array
    if (!note.collaborators.includes(collaborator._id)) {
        throw new ApiError(400, "Collaborator not found in this note");
    }

    // Remove the collaborator from the array
    note.collaborators = note.collaborators.filter(
        (id) => id.toString() !== collaborator._id.toString()
    );

    await note.save();
    io.emit(`update-${note.userId}`, note); // Notify Owner
    note.collaborators.forEach((collaborator) => {
        io.emit(`update-${collaborator._id}`, note); // Notify Collaborators
    });
    res.status(200).json({ note, message: "Collaborator removed successfully" });
});

const getCollaboratorNotes = asyncHandler(async (req, res) => {
    const { collaboratorId } = req.body;
    const allNotes = await Note.find({
        collaborators: { $in: [collaboratorId] }
    });

    if (!allNotes) {
        throw new ApiError(500, "Something went wrong while fetching notes")
    }

    if (allNotes.length === 0) {
        return res.status(201).json(new ApiResponse(200, [], "No notes found"));
    } else {
        return res.status(201).json(new ApiResponse(200, allNotes, "Notes fetched"));
    }
})

const noteOwner = asyncHandler(async (req, res) => {
    const { id } = req.body
    const owner = await User.findById(id).select("-password")
    if (!owner) {
        throw new ApiError(404, "Oener not found")
    }
    res.status(200).send(owner)
})


export { setNewPass, forgotPass, deleteCollaborator, noteOwner, transporter, getCollaboratorNotes, addLabel, deleteLabel, userExists, registerUser, verifyOTP, sendOTP, loginUser, logoutUser, getCurrentUser, setAvatar, createNote, getAllNotes, getAllTrashNotes, deleteNote, recoverNote, deleteTrashNote, updateNote, deleteTrash, addCollaborator }
