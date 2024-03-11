const UserFile = require('../models/externalUser.js');
const cloudinary = require('../middlewares/cloudinary.js');
const upload = require('../middlewares/multer.js');

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
    uploadFileToCloudinary,
    getUploadedFile,
    getAllFiles,
    approveFile,
    rejectFile,
};