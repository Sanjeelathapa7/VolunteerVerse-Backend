


const { config } = require("dotenv");
const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
// const { resetCode, mailConfig } = require("../utils/resetPassword");
// const ResetCode = require("../model/resetcodeModel");
const cloudinary = require("cloudinary");
// Load environment variables
config();

// // Mail transporter configuration
// const transporter = nodemailer.createTransport({
//   service: "gmail", // Assuming Gmail for simplicity; adjust as needed
//   auth: {
//     user: process.env.EMAIL, // Ensure these are set in your .env file
//     pass: process.env.PASSWORD,
//   },
// });

// const sendResetPasswordMail = async (firstName, email, resetCode) => {
//   const mailOptions = {
//     from: process.env.EMAIL, // Sender email address
//     to: email,
//     subject: "Password Reset Request",
//     html: `<p>Hello ${firstName},</p>
//            <p>Please use the following code to reset your password: <strong>${resetCode}</strong></p>
//            <p>If you did not request a password reset, please ignore this email.</p>`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Reset password email sent.");
//   } catch (error) {
//     console.error("Error sending reset password email:", error);
//     throw error; // Rethrow to handle it in the calling function
//   }
// };

const createUser = async (req, res) => {
  const { firstName, lastName, email, password,confirmPassword } = req.body;
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please enter all the fields.",
    });
  }

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Users({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields.",
    });
  }

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign({ id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" });

    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      token: token,
      userData: user,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// const resetPassword = async (req, res) => {
//   const UserData = req.body;
//   console.log(UserData)
//   const user = await Users.findOne({ email: UserData?.email });
//   const OTP = resetCode;
//   console.log(user.id);
//   console.log(OTP);
//   await ResetCode.findOneAndUpdate({
//     userId: user.id
//   }, {
//     resetCode: OTP
//   }, { upsert: true })
//   console.log(user);
//   const MailConfig = mailConfig();

//   const mailOptions = {
//     from: 'sanjeelathapamagar1234@gmail.com', // Replace with your email
//     to: UserData?.email,
//     subject: 'Password Reset Code',
//     text: `Your password reset code is: ${OTP}`
//   };

//   try {
//     await MailConfig.sendMail(mailOptions);
//     return res.json({
//       success: true,
//       message: "Reset code email sent successfully!"
//     })
//     // console.log('Reset code email sent successfully!');
//   } catch (error) {
//     console.log(error)
//     return res.json({
//       success: false,
//       message: 'Error sending reset code email:' + error.message,
//     })
//   }
// }

// const verifyResetCode = async (req, res) => {

//   const { resetCode, email } = req.body;
//   try {
//     const user = await Users.findOne({ email });
//     if (!user) {
//       return res.json({
//         success: false,
//         message: "User not found with the provided email."
//       });
//     } else {
//       const savedResetCode = await ResetCode.findOne({ userId: user._id });
//       if (!savedResetCode || savedResetCode.resetCode != resetCode) {
//         return res.json({
//           success: false,
//           message: "Invalid reset code."
//         });
//       } else {
//         return res.json({
//           success: true,
//           message: "Reset code verified successfully."
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error in verifyResetCode:", error);
//     return res.json({
//       success: false,
//       message: 'Server Error: ' + error.message,
//     });
//   }    //set opt code null
// };


// const updatePassword = async (req, res) => {
//   const { email, password } = req.body;
//   // console.log(email, password);

//   try {
//     // Update the user's password
//     const randomSalt = await bcrypt.genSalt(10);
//     const encryptedPassword = await bcrypt.hash(password, randomSalt);

//     await Users.findOneAndUpdate({ email }, { password: encryptedPassword });

//     return res.json({
//       success: true,
//       message: "Password reset successfully."
//     });

//   } catch (error) {
//     console.log(error);
//     return res.json({
//       success: false,
//       message: 'Server Error: ' + error.message,
//     });
//   }
// };

// //Profile

// const getUserProfile = async (req, res) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];

//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//     const userId = decodedToken.id;
//     const user = await Users.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "User profile retrieved successfully",
//       userProfile: {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         contact: user.contact,
//         location: user.location,
//         profileImage: user.profileImage,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({
//       success: false,
//       message: "Unauthorized",
//     });
//   }
// };
// const updateUserProfile = async (req, res) => {
//   console.log(req.files);
//   try {
//     // Check if user object exists in the request
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: User not authenticated.",
//       });
//     }

//     const user = await Users.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//     const { firstName, lastName, email, contact, location, profileImage } = req.body;

//     if (firstName) user.firstName = firstName;
//     if (lastName) user.lastName = lastName;
//     if (email) user.email = email;
//     if (contact) user.contact = contact;
//     if (location) user.location = location;
//     if (req.files) {
//       const uploadedImage = await cloudinary.v2.uploader.upload(
//         req.files.profileImage.path,
//         {
//           folder: "profile_images",
//           crop: "scale",
//         }
//       );
//       user.profileImage = uploadedImage.secure_url;
//     }
//     await user.save();

//     // Return the updated user profile data
//     res.status(200).json({
//       success: true,
//       message: "User profile updated successfully",
//       userProfile: {
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         contact: user.contact,
//         location: user.location,
//         profileImage: user.profileImage,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

module.exports = {
  createUser,
  loginUser,
  // resetPassword,
  // verifyResetCode,
  // updatePassword,
  // updateUserProfile,
  // getUserProfile,
};

