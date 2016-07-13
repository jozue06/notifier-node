'use strict';

var expect = require('chai').expect
  , notification = require('../../lib/notification')
  , sinon = require('sinon')
  , mockery = require('mockery')
  , Promise = require('bluebird');

describe('notification', function () {
  var twilioStub = function(accountSid, authToken) {
    return new TwilioClientStub();
  };

  var TwilioClientStub = sinon.stub();
  var createStub = sinon.stub().returns(Promise.resolve("for-create"));
  var listStub = sinon.stub().returns(Promise.resolve(
    [
      {
        sid: 'ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        address: '+1-415-555-5555',
        tags: ['rogue_one', 'han_solo_spinoff']
      }
    ]
  ));

  TwilioClientStub.prototype.notifications = {
    v1: {
      services: function(_) {
        return {
          notifications: {
            create: createStub,
          },
          bindings: {
            list: listStub
          }
        };
      }
    }
  };

  before(function (done) {
    mockery.enable();
    mockery.warnOnUnregistered(false);
    mockery.registerMock('twilio', twilioStub);
    require('twilio');
    done();
  });

  after(function (done) {
    mockery.deregisterMock('twilio');
    mockery.disable();
    done();
  });

  describe('#create', function () {
    it('creates a notification', function(done) {
      notification.create(['han_solo_spinoff'], 'Han Solo Spinoff new release');

      expect(createStub.calledWith({
        tag: ['han_solo_spinoff'],
        body: 'Han Solo Spinoff new release',
        sms: JSON.stringify({
          from: 'my-twilio-number'
        })
      })).to.be.true; // jshint ignore:line
      done();
    });
  });

  describe('#list', function() {
    it('list notifications', function() {
      return notification.list().then(function(bindings) {
        expect(bindings[0]).to.deep.equal(
          {
            id: 'ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            phone: '+1-415-555-5555',
            tags: ['rogue_one', 'han_solo_spinoff']
          }
        );

        expect(listStub.calledOnce).to.be.true; // jshint ignore:line
      });
    });
  });
});
