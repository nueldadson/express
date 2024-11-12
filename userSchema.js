const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create schema
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    number: {type: String, required: true},
    password: {type: String, required: true},
});

//encrypt password
userSchema.pre('save', async function(next){
    try{
        const hashPassword = await bcrypt.hash(this.password, 10);
        this.password = hashPassword
        return next();
    }
    catch(error) {
        return next();
    }
});

//linking my schma to my database collection
const Userdetails = mongoose.models.Userdetails || mongoose.model('Userdetail', userSchema);

module.exports = Userdetails;