const express = require('express');
const userRouter = express.Router();
const { httpCreateUser } = require('../../controllers/users.controller');
const { check, validationResult } = require('express-validator');


userRouter.post('/', [
    check("name", "Name field must not be empty").not().isEmpty(),
    check("email", "Please enter valid email").isEmail(),
    check("password", "Please enter the password with minimum 6 characters").isLength({
        min: 6
    })
], httpCreateUser);


module.exports = {
    userRouter
}