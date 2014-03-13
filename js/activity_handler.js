/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

/* global UIManager, CallHandler, Notifications */

/* exported ActivityHandler */

(function(exports) {
  function _handle(activity) {
    if (activity.source.name != 'dial') {
      return;
    }

    var number = activity.source.data.number;
    if (!number) {
      return;
    }

    if (!localStorage['msisdn']) {
      UIManager.register(function(phoneNumber) {
        Notifications.register(function onRegister(r_error, r_result) {
          if (!r_error) {
            TokFoxClient.createAccount(
              'msisdn',
              phoneNumber,
              r_result.endPoint,
              function(ca_error, ca_result) {
                if (!ca_error) {
                  _makeCall(number);
                  localStorage['msisdn'] = number;
                  return;
                }
                // TODO: Handle error if any.
                alert('Unable to register the user.');
                window.close();
                return;
            });
            return;
          }
          // TODO: Improve the way this error is handled.
          alert('Unable to register the user.');
          window.close();
        });
      });
    } else {
      _makeCall(number);
    }
  }

  function _makeCall(number) {
    UIManager.call(null, number, function() {
      window.close();
    });

    CallHandler.dial({
       type: 'msisdn',
       alias: number
    }, function() {
      // TODO NiceToHave: Update the UI consequently
    });
  }

  var ActivityHandler = {
    init: function ah_init() {
      window.navigator.mozSetMessageHandler('activity', _handle);
    }
  };
  exports.ActivityHandler = ActivityHandler;
})(this);
