const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const gravatar = require('gravatar');

const httpCreateUser = async(req, res) => {
   
    const errors = validationResult(req);

    if(!errors.isEmpty()){
       return res.status(401).json({
            error: errors.array()
        });
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if(user) {
           return res.status(400).json({
                error: [{msg: "User already exists"}]
            });
        }

        const avatar = gravatar.url({
            s: "200",
            r: "pg",
            d: "mm"
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
        
        const payload = {
            user: {
                id: user.id
            }
        };

        await jwt.sign(payload, 
            config.get("jwtSecret"),
            {expiresIn: 360000},
            (err, token) => {
                if(err) throw err;
                res.json(token);
            }
        )
    } catch(err){
        console.log(err);
        res.status(500).send("Server error");
    }
}

module.exports = {
    httpCreateUser,
}