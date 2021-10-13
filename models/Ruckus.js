const mongoose = require('mongoose');

const RuckusSchema = mongoose.Schema({
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
    name: {
        type: String
    }
});

module.exports = mongoose.model('Ruckus', RuckusSchema);