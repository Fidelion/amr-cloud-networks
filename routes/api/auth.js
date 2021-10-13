const express = require('express');
const authRouter = express.Router();
const { middlewareDecode } = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

authRouter.get('/', middlewareDecode, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        //must return json
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).json({
            err: err.message
        })
    }
});

authRouter.post('/', 
    check("email", "Please enter valid email").isEmail(),
    check("password", "Password is required").exists()
, async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
       return res.status(401).json({
            error: errors.array()
        });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if(!user) {
           return res.status(400).json({
                error: [{msg: "Invalid credentials"}]
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            return res.status(400).json({
                error: [{msg: "Invalid credentials"}]
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        await jwt.sign(payload, 
            config.get("jwtSecret"),
            {expiresIn: 3600},
            (err, token) => {
                if(err) throw err;
                //must return object
                res.json({token});
            }
        )
    } catch(err){
        console.log(err);
        res.status(500).send("Server error");
    }
})



module.exports = {
    authRouter
}