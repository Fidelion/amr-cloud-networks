const mongoose = require('mongoose');

const ArubaDownSchema = mongoose.Schema({
    deployment_mode: {
        type: String
    },
    group: {
        type: String
    },
    cluster_id: {
        type: Number
    },
    controller_name: {
        type: String
    },
    down_reason: {
        type: String
    },
    firwmare_version: {
        type: String
    },
    gateway_cluster_id: {
        type: Number
    },
    gateway_cluster_name: {
        type: String
    },
    group_name: {
        type: String
    }, 
    ip_address: {
        type: String
    },
    last_modified: {
        type: Date
    },
    macaddr: {
        type: String
    },
    mesh_role: {
        type: String
    },
    model: {
        type: String
    },
    name: {
        type: String
    },
    notes: {
        type: String
    },
    public_ip_address: {
        type: String
    },
    serial: {
        type: String
    },
    site: {
        type: String
    },
    status: {
        type: String
    },
    subnet_mask: {
        type: String
    },
    swarm_id: {
        type: String
    },
    swarm_master: {
        type: Boolean
    },
    swarm_name: {
        type: String
    },
    down_since: {
        type: Date
    }
});

module.exports = mongoose.model('ArubaDown', ArubaDownSchema);