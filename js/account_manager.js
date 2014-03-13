/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

(function(exports) {
  var AccountManager = {
    get account() {
      return localStorage['msisdn'] || null;
    },

    register: function(callback) {
      UIManager.register(function(phoneNumber) {
        Notifications.register(function onRegister(r_error, r_result) {
          if (r_error) {
            // TODO: Improve the way this error is handled.
            alert('Unable to register the user.');
            window.close();
            return;
          }
          TokFoxClient.createAccount('msisdn', phoneNumber, r_result.endPoint,
                                     function(ca_error, ca_result) {
            if (!ca_error) {
              localStorage['msisdn'] = phoneNumber;
              callback && callback();
              return;
            }
            // TODO: Handle error if any.
            alert('Unable to register the user.');
            window.close();
          });
        });
      });
    }, 
  };

  exports.AccountManager = AccountManager;
})(this);
