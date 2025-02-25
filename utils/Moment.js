const moment = require('moment');
require('moment-timezone');

var clientTimezone = 'Africa/Algiers';

const getCurrentDateTime = () => {
    return moment().utc(1);
}

const processClientDate = (clientDate) => {
    // Convert the client datetime to UTC timezone
    let utcMoment = moment.tz(clientDate, 'YYYY-MM-DD', clientTimezone).utc(1);
    
    return utcMoment.format('YYYY-MM-DD');
}


module.exports = {
    getCurrentDateTime, processClientDate
}