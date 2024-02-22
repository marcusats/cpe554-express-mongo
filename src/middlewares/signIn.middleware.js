const bcrypt = require('bcrypt');
const User = require('../models/user.models');

async function signIn(req, res, next) {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid username or password');
        }


        req.session.userId = user._id;
        req.session.username = user.username;


        res.status(200).json({ _id: user._id, username: user.username });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).send('Error signing in');
    }
    next();
}

module.exports = signIn;