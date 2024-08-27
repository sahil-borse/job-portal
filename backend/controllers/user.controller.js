import { User } from "../models/user.model.js";
import bcrypt from "bcrypt.js";
import jwt from "jsonwebtoken";

// Register Logic
export const register = async (req, res) => {
  try {
    const { fullname, email, mobileNumber, password, role } = req.body;

    //check all the fields are submitted
    if (!fullname || !email || !mobileNumber || !password || !role) {
      return res.status(400).json({
        message: "please submit all details.",
        success: false,
      });
    }

    // check email exist or not
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "email already exists",
        success: false,
      });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating the user in mongoDB
    await User.create({
      fullname,
      email,
      mobileNumber,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//Login logic
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    //check all the fields are submitted
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "please submit all details.",
        success: false,
      });
    }

    // check email exist
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "email or password incorrect",
        success: false,
      });
    }

    // check password is valid
    isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "email or password incorrect",
        success: false,
      });
    }

    // check role is correct
    if (role !== user.role) {
      return res.status(400).json({
        message: "please choose valid role for current account",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
      userEmail: user.email,
      role: user.role,
    };

    // jwt token signing
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      mobileNumber: user.mobileNumber,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
      });
  } catch (error) {
    console.log(error);
  }
};

//logout logic
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//profile update
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, mobileNumber, bio, skills } = req.body;
    const file = req.file;

    //check all the fields are submitted
    if (!fullname || !email || !mobileNumber || !bio || !skills) {
      return res.status(400).json({
        message: "something is missing.",
        success: false,
      });
    }

    // cloudinary yet to be done ...

    const skillArray = skills.split(",");
    const userId = req._id;

    // getting user from DB
    let user = await User.findOne({ userId });

    //mapping
    (user.fullname = fullname),
      (user.mobileNumber = mobileNumber),
      (user.email = email),
      (user.profile.bio = bio),
      (user.profile.skills = skillArray);

    // resume mapping is yet to done !!!

    // saving query to DB
    await User.Save();

    user = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        mobileNumber: user.mobileNumber,
        profile: user.profile,
      };

      return res.status(200).json({
        user,
        success:true,
        message:'profile updated successfully.'
      })
  } catch (error) {
    console.log(error);
  }
};
