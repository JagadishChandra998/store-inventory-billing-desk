import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Register User
export const registerUser = async (req, res) => {

    //get user details from frontend
    //validation - not empty
    //check if user already exites: username, mail
    //create user object - create entry in db
    //remove password and refresh token field from respone
    //check  for the user creation
    //return respone

    try {

        //get user details from frontend
        const { fullname, email, password } = req.body;

        //validation - not empty
        if (!fullname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill the empty fields",
            });
        }

        //check if user already exites: username, mail
        const existingUser = await User.findOne({ $or: [{ fullname }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "this email already exit",
            });
        }

        //HASH passwords
        const hashPassword = await bcrypt.hash(password, 10);

        //create user object - create entry in db
        const user = await User.create({
            fullname,
            email,
            password: hashPassword,

        });
        res.status(201).json({
            success: true,
            message: "Registation successful",
            user: {
                // id: user._id,
                // name: user.name,
                // email: user.email,

                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            },
        });

    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


//Login user

export const loginUser = async (req, res) => {

    // console.log("Headers:", req.headers);
    // console.log("Body:", req.body);

    try {
        const { email, password } = req.body;

        //chech for empty field
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill the empty fields",
            });
        }

        //find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email Or password",
            });
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password ..",
            });
        }

        //Generate jwt
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.jwt_secret,
            {
                expiresIn: '5d',
            }
        );
        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user
        });

    }

    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
