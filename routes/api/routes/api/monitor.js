const express = require('express');
const monitorDatabase = require('../../models/Monitor');
const axios = require('axios');
const https = require('https');
const config = require('config');
const router = express.Router();
axios.defaults.withCredentials = true;
const token = config.get("tokenAruba");

//Cookie Support
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);
let cookieJar = {};
let instance = {};

const aruba_api = config.get("ARUBA_API");
const aruba_login = config.get("ARUBA_LOGIN_AUTH");
const aruba_auth = config.get("ARUBA_AUTHENTICATE");

const options = {
  hostname: aruba_login,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    'username': 'ctc_kurt@mail2.calltekcenter.com',
    'password': 'SN@H3lp#114!'
  }
}

 const headerConfig = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': 'Fetch'
        }
    };

const loginParams = {
        username: "ctc_kurt@mail2.calltekcenter.com",
        password: "SN@H3lp#114!"
    };

const authParams = {
    customer_id: "2001551"
};


const arubaLogin = async() => {
    cookieJar = new tough.CookieJar();
    let instance = await axios.create({
		jar:cookieJar,
		withCredentials: true,
		httpsAgent: new https.Agent({ rejectUnauthorized: false, requestCert: true, keepAlive: true})
	});

    const requestLogin = await axios.post(aruba_login, loginParams);
    let data = requestLogin.data;
    
    if(requestLogin.status !== 200) {
        return console.log("Problem Login to aruba");
    } else {
        console.log("Successfull login");
        console.log(data);
    }
}

const arubaAuthenticate = async(requestReq) => {
//    console.log();
    try {
        const request = await axios.post(aruba_auth, authParams);
        console.log(request);
        let data = request.data;
    if(request.status !== 200) {
        return console.log(data.error);
    } else {
        console.log("Successfull login");
        console.log(data);
    }
    } catch(err) {
        console.log(err.message);
    }
    
}

const populateMonitorDb = async() => {
    const response = await axios.get(aruba_api, headerConfig);

    if(response.status !== 200) {
        console.log('Problem downloading launch data...');
        throw new Error('Loading of launch data has failed');
    }

    console.log(response);
}

const monitorRouter = router.get('/', async (req, res) => {
   
    await arubaLogin();
    await arubaAuthenticate();
});


module.exports = {
    monitorRouter
}