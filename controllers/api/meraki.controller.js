const axios = require('axios');
const config = require('config');
const merakiDatabase = require('../../models/Meraki');

const meraki_key = config.get("MerakiAPIKey");

const headerConfig = {
    headers: {
        'X-Cisco-Meraki-API-Key': `${meraki_key}`,
    }
}

const httpGetStatus = async(req, res) => {
    
    try {
        const request = await axios.get(`https://api.meraki.com/api/v1/organizations/${your_organization_id}/devices/statuses`, headerConfig);
        const merakiDocs = request.data;
        const doc = {};

        for(merakiDoc of merakiDocs) {
            const doc = {
                name: merakiDoc["name"],
                serial: merakiDoc["serial"],
                mac: merakiDoc["mac"],
                publicIp: merakiDoc["publicIp"],
                networkId: merakiDoc["networkId"],
                status: merakiDoc["status"],
                lastReportedAt: merakiDoc["lastReportedAt"],
                usingCellularFailover: merakiDoc["usingCellularFailover"],
                wan1Ip: merakiDoc["wan1Ip"],
                wan1Gateway: merakiDoc["wan1Gateway"],
                wan1IpType: merakiDoc["wan1IpType"],
                wan1PrimaryDns: merakiDoc["wan1PrimaryDns"],
                wan1SecondaryDns: merakiDoc["wan1SecondaryDns"],
                wan2Ip: merakiDoc["wan2Ip"],
                lanIp: merakiDoc["lanIp"],
                gateway: merakiDoc["gateway"],
                ipType: merakiDoc["ipType"],
                primaryDns: merakiDoc["primaryDns"],
                secondaryDns: merakiDoc["secondaryDns"]
            }

            await saveData(doc);
        }

        return res.status(200).json({
            merakiDocs
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }

}


const saveData = async(data) => {
    await merakiDatabase.insertMany(data);
}


module.exports = {
    httpGetStatus
}