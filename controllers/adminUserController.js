const UserModel = require("../models/adminUsers.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


    const userRegistration = async (req, res)=>{
        const {name, email, password, Role} = req.body;
        const user = await UserModel.findOne({email:email});
        if(user){
            res.send({"status": "failed", "messege": "Email allready exists"})
        }else{
            if(name && email && password && Role){
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt);
                        const doc = new UserModel({
                        name: name,
                        email: email,
                        password: hashPassword,
                        Role: Role
                    })
                    await doc.save()

                    // for token
                    const saved_user = await UserModel.findOne({email: email})

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
            if(name, email && password){
                const user = await UserModel.findOne({email: email});
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



// Add User
const User_Create = async (req, res) => {
    const {name, email, password, Role} = req.body;

    const user = await UserModel.findOne({email:email});
    if(user){
        res.send({"status": "failed", "message": "Email allready exists"});
    }else{
        if(name && email && password && Role){
            try {
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt);
                const doc = new UserModel({
                    name: name,
                    email: email,
                    password: hashPassword,
                    Role: Role
                })
                await doc.save()

                res.status(201).send({"status": "success", "message": "User Added Successfully"});
            } catch (error) {
                console.log(error);
                res.send({"status": "failed", "message": "Unable to Create"});     
            }
        }else{
            res.send({"status": "failed", "message": "All fields are required"});
        }
    }
}

// Get All User Details
const getAll_User_Details = async (req, res) => {
    try {
        const userData = await UserModel.find();
        if(!userData){
            res.status(404).json({ message: "User not found"});
        }
        return res.status(200).json(userData)

    } catch (error) {
        res.status(500).json(err.message || "Something Went Wrong");
    }
}

// Get Sigle User Details
const Single_User_Detaile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userExist = await UserModel.findById(userId);
        
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json( userExist );

    } catch (error) {
        console.error(error);
        res.status(500).json(err.message || "Something Went Wrong");
    }
}

// Update User
    const User_Update = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userExist = await UserModel.findById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the password if it's provided in the request body
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        }

        const updatedData = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
        res.status(200).json({ message: "User updated successfully", updatedData });
    } catch (error) {
        res.status(500).json(err.message || "Something Went Wrong");
    }
};


// Delete User
const User_Delete = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userExist = await UserModel.findById(userId);
        if(!userExist){
            return res.status(404).json({ message: "User not found" });
        }

        await UserModel.findByIdAndDelete(userId);
        res.status(200).json({ message: "User Deleted Successfully"})
    } catch (error) {
        res.status(500).json(err.message || "Something Went Wrong"); 
    }
}
module.exports = {
    userRegistration,
    userLogin,
    User_Create,
    getAll_User_Details,
    Single_User_Detaile,
    User_Update,
    User_Delete
}