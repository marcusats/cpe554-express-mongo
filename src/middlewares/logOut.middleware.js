
async function logOut(req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out');
        }
        
        res.clearCookie('connect.sid'); 

        res.send('You have been logged out');
    });

    next();
}

module.exports = logOut;
   