const express = require('express');
const arubaRouter = express.Router();
const { httpArubaLogin, httpArubaAuth, httpArubaExchange, httpPopulateArubaTest, httpPopulateArubaDb, httpGetStatusDown, httpRefreshToken } = require('../../controllers/api/aruba.controller');
const { middlewareDecode } = require('../../middleware/auth');

const arubaLogin = httpArubaLogin;

const arubaAuthenticate = httpArubaAuth;

const arubaExchange = httpArubaExchange;

const arubaPopulate = httpPopulateArubaDb;

arubaRouter.get('/login', middlewareDecode, arubaLogin);
arubaRouter.get('/auth', middlewareDecode, arubaAuthenticate);
arubaRouter.get('/exchange', middlewareDecode, arubaExchange);
arubaRouter.get('/test', middlewareDecode, httpPopulateArubaTest);
arubaRouter.get('/load', middlewareDecode, arubaPopulate);
arubaRouter.get('/down', middlewareDecode, httpGetStatusDown);
arubaRouter.get('/refresh-token', middlewareDecode, httpRefreshToken);

module.exports = {
    arubaRouter
}