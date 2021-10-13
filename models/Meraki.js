const mongoose = require('mongoose');

const MerakiSchema = mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    name: {
        type: String
    },
    serial: {
        type: String
    },
    mac: {
        type: String
    },
    publicIp: {
        type: String
    },
    networkId: {
        type: String
    },
    status: {
        type: String
    },
    lastReportedAt: {
        type: Date
    },
    usingCellularFailover: {
        type: Boolean
    },
    wan1Ip: {
        type: String
    },
    wan1Gateway: {
        type: String
    },
    wan1IpType: {
        type: String
    },
    wan1PrimaryDns: {
        type: String
    },
    wan1SecondaryDns: {
        type: String
    },
    wan2Ip: {
        type: String
    },
    lanIp: {
        type: String
    },
    gateway: {
        type: String
    },
    ipType: {
        type: String
    },
    primaryDns: {
        type: String
    },
    secondaryDns: {
        type: String
    }
});

module.exports = mongoose.model('Meraki', MerakiSchema);