const moment = require('moment');//js. A JavaScript date library for parsing, validating, manipulating, and formatting dates

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format(' h:mm a')
  };
}

module.exports = formatMessage;
