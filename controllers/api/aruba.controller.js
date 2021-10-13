const axios = require('axios');
const config = require('config');
const arubaDatabase = require('../../models/Aruba');
const arubaDownDatabase = require('../../models/ArubaDown');
// const User = require('../../models/User');


const aruba_api = config.get("ARUBA_API");
const aruba_login = config.get("ARUBA_LOGIN_AUTH");
const aruba_auth = config.get("ARUBA_AUTHENTICATE");
let _csrf_token = "";
let _session_id = "";
let authCode = "";
let accessToken = "";
let refreshToken = "";

const headerConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

const loginParams = {
        username: "your_username",
        password: "your_password"
    };

const authParams = {
    customer_id: "your_id"
};


const httpArubaLogin = async(req, res) => {
    try {
        const requestLogin = await axios.post(aruba_login, loginParams, headerConfig);
    
        // const user = User.findOne({user: req.user.id});
        _csrf_token = requestLogin.headers['set-cookie'][0];
        _session_id = requestLogin.headers['set-cookie'][1];
    
        console.log(_csrf_token.valueOf() + ' ' + _session_id);

        return res.status(200).json({
            message: requestLogin.data
        });
    } catch (error) {
        return res.status(401).json({
            error: err.message
        });
    }
    
}


const httpArubaAuth = async(req, res) => {

    const authHeaderParams = {
    headers: {
            'Content-Type': 'application/json',
            'Cookie': _session_id,
            'X-CSRF-Token': _csrf_token
        }
}

    try {
        const request = await axios.post(aruba_auth, authParams, authHeaderParams);
        console.log(request);
        let data = request.data;
        authCode = data.auth_code;
        return res.status(200).json({
            message: authCode
        })
    } catch(err) {
        console.log(err);
        return res.status(401).json({
             error: err.message
         });
    }
    
}


const httpArubaExchange = async(req, res) => {
    const authHeaderParams = {
    headers: {
            'Content-Type': 'application/json',
            'Cookie': _session_id,
            'X-CSRF-Token': _csrf_token
        }
}

    const aruba_exchange_api = `https://apigw-prod2.central.arubanetworks.com/oauth2/token?client_id=${your_client_id}&client_secret=${your_client_secret}&grant_type=authorization_code&code=`+authCode;
    
    try {
        const response = await axios.post(aruba_exchange_api, authHeaderParams);

        if(response.status !== 200) {
        console.log('Problem downloading launch data...');
        throw new Error('Loading of launch data has failed');$
        }
        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;
        console.log(response.data);
        return res.status(200).json({
            message: accessToken
        });
    } catch (err) {
         console.log(err.message);
         console.log(aruba_exchange_api);
         return res.status(401).json({
             error: err.message
         });
    }
    
}

const httpPopulateArubaTest = async(req, res) => {
    const headerConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Cookie': _session_id,
            'X-CSRF-Token': _csrf_token
        }
    };
   const aruba_get_data = "https://apigw-prod2.central.arubanetworks.com/monitoring/v1/aps?limit=1000&offset=1069";

   try {
        const request = await axios.get(aruba_get_data, headerConfig);

        res.status(200).json({
          message: request.data.aps
        });
   } catch (err) {
       return res.status(500).json({
           error: err.message
       });
   }
}

const httpPopulateArubaDb = async(req, res) => {
    const headerConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Cookie': _session_id,
            'X-CSRF-Token': _csrf_token
        }
    };
    
   try {
    let offset = 1069;

    //URL Has To Be Within the loop
     const aruba_get_data = `https://apigw-prod2.central.arubanetworks.com/monitoring/v1/aps?limit=1000&offset=${offset}`;

    // let limit = 0;
    let loop = true;
    while(loop) {
        console.log(aruba_get_data);
        const aruba_new_data = `https://apigw-prod2.central.arubanetworks.com/monitoring/v1/aps?limit=1000&offset=${offset}`;

        const response = await axios.get(aruba_new_data, headerConfig);

        let count = response.data.count;
        offset = offset + 1;
        const monitorDocs = response.data.aps;
                for(monitorDoc of monitorDocs){
                    const monitors = {
                            deployment_mode: monitorDoc["ap_deployment_mode"],
                            group: monitorDoc["ap_group"],
                            cluster_id: monitorDoc["cluster_id"],
                            controller_name: monitorDoc["controller_name"],
                            down_reason: monitorDoc["down_reason"],
                            firwmare_version: monitorDoc["firwmare_version"],
                            gateway_cluster_id: monitorDoc["gateway_cluster_id"],
                            gateway_cluster_name: monitorDoc["gateway_cluster_name"],
                            group_name: monitorDoc["group_name"],
                            ip_address: monitorDoc["ip_address"],
                            last_modified: monitorDoc["last_modified"],
                            macaddr: monitorDoc["macaddr"],
                            mesh_role: monitorDoc["mesh_role"],
                            model: monitorDoc["model"],
                            name: monitorDoc["name"],
                            notes: monitorDoc["notes"],
                            public_ip_address: monitorDoc["public_ip_address"],
                            serial: monitorDoc["serial"],
                            site: monitorDoc["site"],
                            status: monitorDoc["status"],
                            subnet_mask: monitorDoc["subnet_mask"],
                            swarm_id: monitorDoc["swarm_id"],
                            swarm_master: monitorDoc["swarm_master"],
                            swarm_name: monitorDoc["swarm_name"]
                        }
                    console.log(monitors);
                    await saveMonitorData(monitors);
                    console.log(offset);
                    console.log(count);
                    if(count === 0) {
                            loop = false;
                        }
                }
          
    }
            return res.status(200).json({
                message: "data successfully stored"
            });
        // let monitor = new arubaDatabase(monitors);
        // console.log(monitorDoc);
    } catch (err) {
        console.log(err);
        return res.status(401).json({
             error: err.message
         });
   }

}

const httpRefreshToken = async(req, res) => {
    const api_refresh = `https://apigw-prod2.central.arubanetworks.com/oauth2/token?client_id=${your_client_id}&client_secret=${your_client_secret}&grant_type=refresh_token&refresh_token=${refreshToken}`;
    const authHeaderParams = {
        headers: {
                'Content-Type': 'application/json',
                'Cookie': _session_id,
                'X-CSRF-Token': _csrf_token
            }
    }
   try {
       const request = axios.post(api_refresh, authHeaderParams);

       const access_token = request.data.access_token;
       console.log(access_token);
       console.log(request);
   } catch (err) {
       res.status(500).json({
          error: err.message
       });
   }
}


const httpGetStatusDown = async(req, res) => {
    const headerConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Cookie': _session_id,
            'X-CSRF-Token': _csrf_token
        }
    };

    // const { status } = req.query.params;
    const api_req = `https://apigw-prod2.central.arubanetworks.com/monitoring/v1/aps?status=Down&limit=1000`;
        try {
                const response = await axios.get(api_req, headerConfig);
                const monitorDocs = response.data.aps;
                for(monitorDoc of monitorDocs){
                    const monitors = {
                            deployment_mode: monitorDoc["ap_deployment_mode"],
                            group: monitorDoc["ap_group"],
                            cluster_id: monitorDoc["cluster_id"],
                            controller_name: monitorDoc["controller_name"],
                            down_reason: monitorDoc["down_reason"],
                            firwmare_version: monitorDoc["firwmare_version"],
                            gateway_cluster_id: monitorDoc["gateway_cluster_id"],
                            gateway_cluster_name: monitorDoc["gateway_cluster_name"],
                            group_name: monitorDoc["group_name"],
                            ip_address: monitorDoc["ip_address"],
                            last_modified: monitorDoc["last_modified"],
                            macaddr: monitorDoc["macaddr"],
                            mesh_role: monitorDoc["mesh_role"],
                            model: monitorDoc["model"],
                            name: monitorDoc["name"],
                            notes: monitorDoc["notes"],
                            public_ip_address: monitorDoc["public_ip_address"],
                            serial: monitorDoc["serial"],
                            site: monitorDoc["site"],
                            status: monitorDoc["status"],
                            subnet_mask: monitorDoc["subnet_mask"],
                            swarm_id: monitorDoc["swarm_id"],
                            swarm_master: monitorDoc["swarm_master"],
                            swarm_name: monitorDoc["swarm_name"],
                            down_since: Date.now()
                        }
                        console.log(monitors);
                        await saveDownMonitorData(monitors);
                    }
                const body = response.data.aps;

                return res.status(200).json({
                        success: body
                });
   } catch (err) {
       console.log(err.message);
       res.status(500).json({
           err
       })
   }
}

async function saveMonitorData(monitors) {
    await arubaDatabase.insertMany(monitors);
}

async function saveDownMonitorData(monitors) {
    await arubaDownDatabase.insertMany(monitors);
}

module.exports = {
    httpArubaLogin,
    httpArubaAuth,
    httpArubaExchange,
    httpPopulateArubaTest,
    httpPopulateArubaDb,
    httpGetStatusDown,
    httpRefreshToken
}