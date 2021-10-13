const express = require('express');
const merakiRouter = express.Router();
const { middlewareDecode } = require('../../middleware/auth');


const { httpGetStatus } = require('../../controllers/api/meraki.controller');

const getStatus = httpGetStatus;
merakiRouter.get('/status', middlewareDecode, getStatus);

module.exports = {
    merakiRouter
}