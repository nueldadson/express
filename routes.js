const express = require("express");
const App = express();
const Userdetails = require("./userSchema");
const cors = require("cors"); 
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

App.use(express.json());
App.use(cors());

mongoose.connect("mongodb+srv://emmanuel:nueldadson@eliteheads.hnyqjxn.mongodb.net/EliteHeads?retryWrites=true&w=majority&appName=EliteHeads");

App.post("/api/checkUsername", async (req, res) => {
    const { username } = req.body;
    const existingUser = await Userdetails.findOne({ username });
    res.json({ exists: !!existingUser });
});

App.post("/api/editedCheckUsername", async (req, res) => {
    const { editedUsername, initialEditUsername } = req.body;

    if (initialEditUsername === editedUsername) {
        console.log("same text");
    }
    else if(initialEditUsername !== editedUsername) {
        const existingUser = await Userdetails.findOne({ editedUsername });
        res.json({ exists: !!existingUser });
    }
});

App.post("/api/checkEmail", async (req, res) => {
    const { email } = req.body;
    const existingUser = await Userdetails.findOne({ email });
    res.json({ exists: !!existingUser });
});

App.post("/api/editedCheckEmail", async (req, res) => {
    const { editedEmail, initialEditEmail } = req.body;

    if(initialEditEmail === editedEmail) { 
        console.log("same text");
    }
    else if(initialEditEmail !== editedEmail) {
        const existingUser = await Userdetails.findOne({ editedEmail });
        res.json({ exists: !!existingUser });
    }
});

App.post("/api/checkNumber", async (req, res) => {
    const { number } = req.body;
    const existingUser = await Userdetails.findOne({ number });
    res.json({ exists: !!existingUser });
});

App.post("/api/editedCheckNumber", async (req, res) => {
    const { editedNumber, initialEditNumber } = req.body;

    if(initialEditNumber === editedNumber) {
        console.log("Same here");
    }
    else if(initialEditNumber !== editedNumber) {
        const existingUser = await Userdetails.findOne({ editedNumber });
        res.json({ exists: !!existingUser });
    }
});

//sending to my database
App.post("/api/Userdetails", async (req, res) => {
    try{
        // res.json({AdminLocation: "User Details"});
        const newUserdetails = new Userdetails(req.body)
        const saveUserdetails = await newUserdetails.save();

        if(saveUserdetails) {
            return res.status(200).json({message: "Registered"})
        }
    }catch(error){
        res.status(400).json({message: "Error sending"})
    }
});

App.post("/api/login/Userdetail", async (req, res) => {
    try {  
        const { email, password } = req.body;
        
        const emailAuth = await Userdetails.findOne({ email });
        if (!emailAuth) {
            return res.status(401).json({message: "Invalid Username or Password"})
    };
    
    const emailPassword = emailAuth.password;
    
    const validatePassword = await bcrypt.compare(password, emailPassword);
    
    if (validatePassword) {
        res.status(200).json({ message: 'Login Successful', id: emailAuth._id, username: emailAuth.username });
    } else {
        res.status(401).json({ message: 'Invalid Username or Password'});
    }
} catch(error) {
    console.log(error);
    res.status(500).json({message: "Server Error"});
}
});

App.get("/api", (req, res) => {
	res.json({Admin: "Elite Heads Database"});
	res.end();
});

App.get('/api/userCount', async (req, res) => {
    const countUsers = await Userdetails.countDocuments();
    if(countUsers) {
        res.json({ countedUsers: countUsers });
    }
});

App.get('/api/getUserRecords', async (req, res) => {
    const userRecord = await Userdetails.find().sort({_id: -1});

    if(userRecord) {
        res.json(userRecord);
    }
});

App.delete('/api/deleteUserRecord/:userId', async (req, res) => {
    const userId = req.params.userId;
    
    try {
        await Userdetails.findByIdAndDelete(userId);
        
        res.status(200).json({ message: "User Record Deleted" });
    } catch (error) {
        console.log(error)
        redirect.status(500).json({ message: "internal Server Error" })
    }
});

App.get('/api/editUserRecord/:userId', async (req, res) => {
    
    try {
    const userId = req.params.userId;

    const editUser = await Userdetails.findOne({ _id: userId });

    if (!editUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send the user details to the frontend
    res.json(editUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

App.listen(4300, () => {
	console.log("EliteHeads Server on Port 4300 Started well");
});