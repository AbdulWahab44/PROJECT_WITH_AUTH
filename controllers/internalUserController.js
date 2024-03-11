const UserFile = require('../models/internalUser.js');
const cloudinary = require('../middlewares/cloudinary.js');
const upload = require('../middlewares/multer.js');
const internaluserfiles = require("../models/externalUser.js")

  const uploadFileToCloudinary = async (req, res) => {
    try {
        // Upload file to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

        // Create a new document for the uploaded file
        const newUserFile = new UserFile({
            imageUrl: cloudinaryResult.secure_url,
            publicId: cloudinaryResult.public_id,
            name: req.body.name, // Name of the sender
            fileName: req.file.originalname // Assuming fileName is the original name of the file
        });
        await newUserFile.save();

        const otherData = new internaluserfiles({
            senderName: req.body.name,
            imageUrl: cloudinaryResult.secure_url,
            publicId: cloudinaryResult.public_id,
            name: req.body.name, // Name of the sender
            fileName: req.file.originalname // Assuming fileName is the original name of the file
        });
        // Save the additional data to the other collection
        await otherData.save();
        // Respond with success message
        return res.status(200).json({
            success: true,
            message: 'Uploaded',
            data: cloudinaryResult,
            senderName: req.body.name
        });
    } catch (error) {
        console.error(error);
        // Respond with error message
        return res.status(500).json({
            success: false,
            message: 'Error',
        });
    }
};



  const deleteUserFile = async (req, res) => {
    try {
      const { publicId } = req.params;
  
      const imageToDelete = await UserFile.findOne({ publicId });
  
      if (!imageToDelete) {
        return res.status(404).json({
          success: false,
          message: "Image not found"
        });
      }
      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(imageToDelete.publicId);
      // Delete the image document from MongoDB
      await UserFile.deleteOne({ publicId });
      // Respond with success message
      return res.status(200).json({
        success: true,
        message: "Image deleted successfully"
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Error in deleting image"
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

module.exports = {
  uploadFileToCloudinary, 
  getAllFiles, 
  getUploadedFile, 
  deleteUserFile,
};