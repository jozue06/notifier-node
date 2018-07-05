'use strict';

var parser = require('./parser')
  , messageCreator = require('./message-creator');


var process = function(requestBody) {
  var message = requestBody.Body
    , options = parser.parse(message);

  
  return messageCreator.create(options);
};

module.exports.process = process;
