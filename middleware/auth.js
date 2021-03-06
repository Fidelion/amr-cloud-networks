const jwt = require('jsonwebtoken');
const config = require('config');

const middlewareDecode = (req, res, next) => {
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(400).json({
            msg: 'No token. Authorization deined'
        });
    }

    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        req.user = decoded.user;
        next();
    } catch(err){
        res.status(401).json({
            msg: 'Token is wrong. Access Denied' 
        });
    }
}   

module.exports = {
    middlewareDecode
}