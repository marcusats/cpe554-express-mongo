const bcrypt = require('bcrypt');
const User = require('../models/user.models.js');
const saltRounds = 10;

async function registerUser(req, res, next) {
    try {
        const { name, username, password } = req.body;


        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const newUser = new User({
            name,
            username,
            password: hashedPassword
        });

        await newUser.save();

        req.session.userId = newUser._id;
        req.session.username = newUser.username;

        const userToReturn = { _id: newUser._id, name, username };

        res.status(201).json(userToReturn);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Error registering user');
    }
    next();
}

module.exports = registerUser;
