'use strict';

var service = require('./service').service
  , config = require('../config');

module.exports = {
  create: function(message) {
    var twilioNumber = config.TWILIO_NUMBER;

    // Send a notification to all users who have subscribed
    // for movies updates.
    service().notifications.create({
      body: message,
      sms: JSON.stringify({
        from: twilioNumber
      })
    }).catch(function(error) {
      console.log(error);
    });
  }
};
