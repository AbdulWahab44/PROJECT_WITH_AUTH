const UserModel = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class userController{
    static SignUp = async (req, res) =>{
        const {name, email, password} = req.body;

        const user = await UserModel.findOne({email:email});
        if(user){
            res.send({"status": "failed", "message": "Email allready exists"});
        }else{
            if(name && email && password){
                try {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt);
                    const doc = new UserModel({
                        name: name,
                        email: email,
                        password: hashPassword
                    })
                    await doc.save()

                    // for token
                    const saved_user = await UserModel.findOne({email: email})
                    // Generate JWT Token
                    const token = jwt.sign({userID: saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "6d"});

                    res.status(201).send({"status": "success", "message": "User Added Successfully", "token": token});
                } catch (error) {
                    console.log(error);
                    res.send({"status": "failed", "message": "Unable to Register"});     
                }
            }else{
                res.send({"status": "failed", "message": "All fields are required"});
            }
        }
    }


    static Login = async (req, res) =>{
        try {
            const {name, email, password} = req.body;
            if(name && email && password){
                const user = await UserModel.findOne({email:email});
                if(user != null){
                    const isMatch = await bcrypt.compare(password, user.password);
                    if((user.name === name && user.email === email) && isMatch){

                        // for token
                        // Generate JWT Token
                        const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "6d"});
                        res.send({"status": "success", "messege": "Longin Success", "token": token})
                    }else{
                        res.send({"status": "failed", "messege": "Name or Email or Password is not Valid"})
                    }

                }else{
                    res.send({"status": "failed", "messege": "You are not a Registered User"})
                }
            }else{
                res.send({"status": "failed", "message": "All fields are required"});
            }
        } catch (error) {
            console.log(error)
            res.send({"status": "failed", "message": "Unable to Login"});   
            
        }
    }
}

module.exports = userController;