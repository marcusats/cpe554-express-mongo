function validateUser(req, res, next) {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).send('All fields (name, username, password) are required.');
    }


    next(); 
}

module.exports = validateUser;
