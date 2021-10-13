const express = require('express');
const { middlewareDecode } = require('../../middleware/auth');
const { httpGetStatus, httpLoginUser, httpFindMacAddr, httpFindAllMac} = require('../../controllers/api/ruckus.controller');
const ruckusRouter = express.Router();

ruckusRouter.get('/login', middlewareDecode, httpLoginUser);
ruckusRouter.get('/status', middlewareDecode, httpGetStatus);
ruckusRouter.get('/all', middlewareDecode, httpFindMacAddr);
ruckusRouter.get('/macs', middlewareDecode, httpFindAllMac);

module.exports = {
    ruckusRouter
}