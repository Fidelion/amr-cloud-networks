const axios = require('axios');
const https = require('https');

const ruckusDatabase = require ('../../models/Ruckus');
const ruckusMacDb = require('../../models/RuckusMac');

//const { EWOULDBLOCK } = require('constants');
let _cookie = "";
const instance = axios.create({
    httpsAgent: new https.Agent({  
        rejectUnauthorized: false
    })
    });


const headerConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

const loginParams = {
        username: "your_username",
        password: "your_password",
    };

const httpLoginUser = async(req, res) => {
  
    try {
        const ruckus_url_login = `https://162.220.133.125:8443/wsg/api/public/v8_2/session`;
        const request = await instance.post(ruckus_url_login, loginParams);
        _cookie = request.headers['set-cookie'];

        return res.status(200).json({
            message: request.data
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
    
}

const httpGetStatus = async(req, res) => {
    const authHeaderParams = {
    headers: {
                    'Content-Type': 'application/json',
                    'Cookie': _cookie,
                }
        }

    try {   
        let index = 0;
        let loop = true;
        while(loop){
            const ruckus_get_data = `https://${your_ip}:${your_port}/wsg/api/public/v8_2/aps?listSize=100&index=${index}`;
             const request = await instance.get(ruckus_get_data, authHeaderParams);
            index = index + 100;

            const ruckusDocs = request.data.list;
            for(ruckusDoc of ruckusDocs) {
                    const docs = {
                        mac: ruckusDoc["mac"],
                        zoneId: ruckusDoc["zoneId"],
                        apGroupId: ruckusDoc["apGroupId"],
                        serial: ruckusDoc["serial"],
                        name: ruckusDoc["name"]
                    }
                    // console.log(docs);
                    // console.log(index);
                    await saveRuckus(docs);
                    console.log(request.data.hasMore);
                }
        }
            if(request.data.hasMore === false){
                return res.status(200).json({
                    message: "Data successfully saved"
            });
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
}

const httpFindMacAddr = async(req, res) => {
    try {
        const macAddr = await findMacAddress();
        res.status(200).json(macAddr);
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
}

const httpFindAllMac = async(req, res) => {
      const authHeaderParams = {
            headers: {
                    'Content-Type': 'application/json',
                    'Cookie': _cookie,
                }
            }
    try{
        const macAddresses = await findMacAddress();
            for(macAddress of macAddresses) {
            const address = macAddress["mac"];
             const ruckus_get_data = `https://${your_ip}:${your_port}/wsg/api/public/v8_2/aps/${address}/operational/summary`;
             const request = await instance.get(ruckus_get_data, authHeaderParams);
             const data = request.data;
                mac = {
                    mac: data["mac"],
                    zoneId: data["zoneId"],
                    apGroupId: data["apGroupId"],
                    serial: data["serial"],
                    model: data["model"],
                    name: data["name"],
                    description: data["description"],
                    latitude: data["latitude"],
                    longitude: data["longitude"],
                    location: data["location"],
                    locationAdditionalInfo: data["locationAdditionalInfo"],
                    administrativeState: data["administrativeState"],
                   // altitude: [{altitudeUnit: data["altitudeUnit"], altitudeValue: data["altitudeValue"]}],
                    version: data["version"],
                    countryCode: data["countryCode"],
                    cpId: data["cpId"],
                    dpId: data["dpId"],
                    wifi24Channel: data["wifi24Channel"],
                    wifi50Channel: data["wifi50Channel"],
                    meshRole: data["meshRole"],
                    meshHop: data["meshHop"],
                    ip: data["ip"],
                    ipType: data["ipType"],
                    ipv6: data["ipv6"],
                    ipv6Type: data["ipv6Type"],
                    externalIp: data["externalIp"],
                    externalPort: data["externalPort"],
                    configState: data["configState"],
                    connectionState: data["connectionState"],
                    registrationState: data["registrationState"],
                    provisionMethod: data["provisionMethod"],
                    provisionStage: data["provisionStage"],
                    isCriticalAP: data["isCriticalAP"],
                    approvedTime: data["approvedTime"],
                    lastSeenTime: data["lastSeenTime"],
                    uptime: data["uptime"],
                    clientCount: data["clientCount"],
                    managementVlan: data["managementVlan"]
                }
                console.log(mac);
                await saveMac(mac);
            }
            res.status(200).json({
                message: 'Mac addresses successfully saved.'
            })
    } catch(err) {
        res.status(500).json({
            error: err.message
        });
    }
}

const findMacAddress = async() => {
   return await ruckusDatabase.find({} , {mac: 1, _id: 0});
}

const saveRuckus = async(data) => {
    await ruckusDatabase.insertMany(data);
}

const saveMac = async(data) => {
    await ruckusMacDb.insertMany(data);
}

module.exports = {
    httpLoginUser,
    httpGetStatus,
    httpFindMacAddr,
    httpFindAllMac
}