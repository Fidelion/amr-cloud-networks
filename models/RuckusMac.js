const mongoose = require('mongoose');

const RuckusMac = mongoose.Schema({
    mac: {
        type: String
    }, 
    zoneId: {
        type: String
    },
    apGroupId: {
        type: String
    },
    serial: {
        type: String
    },
    model: {
        type: String
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    location: {
        type: String
    },
    locationAdditionalInfo: {
        type: String
    },
    administrativeState: {
        type: String
    },
    altitude: [
        {
        altitudeUnit : {
            type: String,
        },
        altitudeValue : {
            type: String,
        }
        }
    ],
    version: {
        type: String
    },
    countryCode: {
        type: String
    },
    cpId: {
        type: String
    },
    dpId: {
        type: String
    },
    wifi24Channel: {
        type: String
    },
    wifi50Channel: {
        type: String
    },
    meshRole: {
        type: String
    },
    meshHop: {
        type: String
    },
    ip: {
        type: String
    },
    ipType: {
        type: String
    },
    ipv6: {
        type: String
    },
    ipv6Type: {
        type: String
    },
    externalIp: {
        type: String
    },
    externalPort: {
        type: Number
    },
    configState: {
        type: String
    },
    connectionState: {
        type: String
    },
    registrationState: {
        type: String
    },
    provisionMethod: {
        type: String
    },
    provisionStage: {
        type: String
    },
    isCriticalAP: {
        type: Boolean
    },
    approvedTime: {
        type: Date
    },
    lastSeenTime: {
        type: Date
    },
    uptime: {
        type: Number
    },
    clientCount: {
        type: Number
    },
    managementVlan: {
        type: Number
    }
});

module.exports =  mongoose.model('RuckusMac', RuckusMac);