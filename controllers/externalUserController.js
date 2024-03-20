const UserFile = require('../models/externalUser.js');
const cloudinary = require('../middlewares/cloudinary.js');
const upload = require('../middlewares/multer.js');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegistration = async (req, res)=>{
  const {name, email, password, Role} = req.body;
  const user = await UserFile.findOne({email:email});
  if(user){
      res.send({"status": "failed", "messege": "Email allready exists"})
  }else{
      if(name && email && password && Role){
              try {
                  const salt = await bcrypt.genSalt(10)
                  const hashPassword = await bcrypt.hash(password, salt);
                  const doc = new UserFile({
                  name: name,
                  email: email,
                  password: hashPassword,
                  Role: Role
              })
              await doc.save()

              // for token
              const saved_user = await UserFile.findOne({email: email})

              // Generate JWT Token
              const token = jwt.sign({userID: saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "6d"});

              res.status(201).send({"status": "success", "messege": "Registration Success", "token": token})
              } catch (error) {
                  console.log(error)
                  res.send({"status": "failed", "messege": "Unable to Register"})
                  
              }

      }else{
          res.send({"status": "failed", "messege": "All fields are required"})
      }
  }
}

// Function for login
const userLogin = async (req, res) =>{
  try {
      const {name, email, password} = req.body;
      if(name && email && password){
          const user = await UserFile.findOne({email: email});
          if(user != null){
              const isMatch = await bcrypt.compare(password, user.password);
              if((user.name === name && user.email === email) && isMatch){

                  // for token
                  // Generate JWT Token
                  const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "6d"});

                  res.send({"status": "success", "messege": "Longin Success", "token": token})
              }else{
                  res.send({"status": "failed", "messege": "Email or Password is not Valid"})
              }
          }else{
              res.send({"status": "failed", "messege": "You are not a Registered User"})
          }
          }else{
              res.send({"status": "failed", "messege": "All fields are required"})
      }
  } catch (error) {
      console.log(error);
      res.send({"status": "failed", "messege": "Unable to Login"})
  }
}

const uploadFileToCloudinary = async (req, res) => {
    try {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
      const newUserFile = new UserFile({
        imageUrl: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        name: req.body.name, // Name of the sender
            fileName: req.file.originalname // Assuming fileName is the original name of the file
      });
      await newUserFile.save();
      return res.status(200).json({
        success: true,
        message: 'Uploaded',
        data: cloudinaryResult,
        senderName: req.body.name
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error',
      });
    }
  };


  const getAllFiles = async (req, res) => {
    try {
        const files = await UserFile.find();

        if (!files || files.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No files found",
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Successfully retrieved all files",
                data: files,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while getting the files",
        });
    }
};


  const getUploadedFile = async (req, res) => {
    try {
      const { publicId } = req.params;
      console.log("Received publicId:", publicId);
  
      const fileToShow = await UserFile.findOne({ publicId: publicId }); // Change this line
  
      if (!fileToShow) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Successfully got user upload file",
          data: fileToShow,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while getting the file",
      });
    }
  };


  const approveFile = async (req, res) => {
  try {
      const { publicId } = req.params;
      console.log("Approving file with publicId:", publicId);

      const fileToUpdate = await UserFile.findOne({ publicId });

      if (!fileToUpdate) {
          return res.status(404).json({
              success: false,
              message: "File not found",
          });
      }

      // Update file status to approved
      fileToUpdate.status = 'approved';
      await fileToUpdate.save();
      return res.status(200).json({
          success: true,
          message: "File approved successfully",
          data: fileToUpdate,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "An error occurred while approving the file",
      });
  }
};


  const rejectFile = async (req, res) => {
  try {
      const { publicId } = req.params;
      console.log("Rejecting file with publicId:", publicId);

      const fileToUpdate = await UserFile.findOne({ publicId });

      if (!fileToUpdate) {
          return res.status(404).json({
              success: false,
              message: "File not found",
          });
      }

      // Update file status to rejected
      fileToUpdate.status = 'rejected';
      await fileToUpdate.save();
      return res.status(200).json({
          success: true,
          message: "File rejected successfully",
          data: fileToUpdate,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "An error occurred while rejecting the file",
      });
  }
};


  module.exports = {
    userRegistration,
    userLogin,
    uploadFileToCloudinary,
    getUploadedFile,
    getAllFiles,
    approveFile,
    rejectFile,
};