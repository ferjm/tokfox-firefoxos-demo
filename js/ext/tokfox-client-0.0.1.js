/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

/* exported TokFoxClient */

var TokFoxClient = (function TokFoxClient() {
  /**
   * Default root URL for TokFox API.
   */
  var DEFAULT_ROOT_URL = 'http://tokfox-staging.herokuapp.com';

  /** Debug flag. */
  var debug = false;

  /** URL for TokFox API. */
  var rootUrl = DEFAULT_ROOT_URL;

  function Alias(type, value) {
    this.type = type;
    this.value = value;
  }

  Alias.prototype.constructor = Alias;

  Alias.prototype.toString = function() {
    return this.type + '/' + this.value;
  };

  function PushEndpoint(invitation, rejection, description) {
    this.invitation = invitation;
    this.rejection = rejection;
    this.description = description;
  }

  PushEndpoint.prototype.constructor = PushEndpoint;

  /**
   *
   */
  function createAccount(alias, pushEndpoint, callback) {
    var options = {}, error = null;

    if (!alias || !(alias instanceof Alias)) {
      error = {};
      error.message = 'Invalid alias';
    }

    if (!error &&
        (!pushEndpoint || !(pushEndpoint instanceof PushEndpoint))) {
      error = {};
      error.message = 'Invalid PUSH endpoint';
    }

    if (error &&
        callback && (typeof callback === 'function')) {
      callback(error, null);
      return;
    }

    options.method = 'POST';
    options.uri = rootUrl + '/account/';
    options.body = {};
    options.body.alias = alias;
    options.body.pushEndpoint = pushEndpoint;

    request(options, function onRequestPerformed(error, result) {
      if (callback && (typeof callback === 'function')) {
        callback(error, result);
      }
    });
  }

  /**
   *
   */
  function updateAccount(alias, newAlias, newPushEndpoint, callback) {
    var options = {}, error = null;

    if (!alias || !(alias instanceof Alias)) {
      error = {};
      error.message = 'Invalid alias';
    }

    // The user might not want to add a new alias.
    if (!error &&
        newAlias && !(newAlias instanceof Alias)) {
      error = {};
      error.message = 'New alias is invalid';
    }

    // The user might not want to update the existing PUSH endpoint.
    if (!error &&
        newPushEndpoint && !(newPushEndpoint instanceof PushEndpoint)) {
      error = {};
      error.message = 'Invalid PUSH endpoint';
    }

    if (error &&
        callback && (typeof callback === 'function')) {
      callback(error, null);
      return;
    }

    options.method = 'PUT';
    options.uri = rootUrl + '/account/' + alias.toString();
    options.body = {};
    if (newAlias) {
      options.body.alias = newAlias;
    }
    if (newPushEndpoint) {
      options.body.pushEndpoint = newPushEndpoint;
    }

    request(options, function onRequestPerformed(error, result) {
      if (callback && (typeof callback === 'function')) {
        callback(error, result);
      }
    });
  }

  function accountExist(alias, callback) {
    var options = {}, error = null;

    if (!alias || !(alias instanceof Alias)) {
      error = {};
      error.message = 'Invalid alias';
    }

    if (error &&
        callback && (typeof callback === 'function')) {
      callback(error, null);
      return;
    }

    options.uri = rootUrl + '/account/' + alias.toString();
    options.method = 'GET';

    request(options, function onDone(error, result) {
      if (callback && (typeof callback === 'function')) {
        callback(error, result);
      }
    });
  }

  /**
   *
   */
  function createSession(role, sesssioId, callback) {
    var options = {};

    options.uri = rootUrl + '/session/';
    options.method = 'POST';
    options.body = {};
    if (role) {
      options.body.role = role;
    }
    if (sesssioId) {
      options.body.sesssioId = sesssioId;
    }

    request(options, function onRequestPerformed(error, result) {
      if (callback && (typeof callback === 'function')) {
        callback(error, result);
      }
    });
  }

  /**
   *
   */
  function invite(alias, sessionId, callback) {
    var options = {}, error = null;

    if (!alias || !(alias instanceof Alias)) {
      error = {};
      error.message = 'Invalid alias';
    }

    if (error &&
        callback && (typeof callback === 'function')) {
      callback(error, null);
      return;
    }

    options.uri = rootUrl + '/session/invitation/';
    options.method = 'POST';
    options.body = {};
    options.body.alias = alias;
    options.body.sessionId = sessionId;

    request(options, function onRequestPerformed(error, result) {
      if (callback && (typeof callback === 'function')) {
        callback(error, result);
      }
    });
  }

  /**
   *
   */
  function acceptInvitation(invitationId, callback) {
    var options = {};

    options.uri = rootUrl + '/session/invitation/' + invitationId;
    options.method = 'GET';
    options.body = {};

    request(options, function onRequestPerformed(error, result) {
      if (callback && (typeof callback === 'function')) {
        callback(error, result);
      }
    });
  }

  /**
   *
   */
  function rejectInvitation(invitationId, callback) {
    var options = {};

    options.uri = rootUrl + '/session/invitation/' + invitationId;
    options.method = 'DELETE';
    options.body = {};

    request(options, function onRequestPerformed(error, result) {
      if (callback && (typeof callback === 'function')) {
        callback(error, result);
      }
    });
  }

  var _timeoutError = {
    "code": 600,
    "error": "Timeout error", // string description of the error type
    "message": "Request exceed the timeout",
    "info": "https://docs.endpoint/errors/1234" // link to more info on the error
  };

  /**
   *
   */
  function request(options, callback) {
    if (debug) {
      dump('options is ' + JSON.stringify(options));
    }

    var req = new XMLHttpRequest({mozSystem: true});
    req.open(options.method, options.uri, true);
    req.responseType = 'json';
    req.timeout = 15000;

    req.onload = function () {
      if (req.status !== 200) {
        // Response in error case. The error object is defined
        // in the API.
        callback(req.response);
        return;
      }
      // If the code is 200, we need to retrieve the response
      if (typeof callback === 'function') {
        var result = !req.response ? 'OK' : req.response;
        callback(null, result);
      }
    };

    req.onerror = function (event) {
      callback(event.target.status, null);
    };

    req.ontimeout = function () {
      callback(_timeoutError);
    };

    // Send the request
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(options.body));
  }

  /**
   *
   */
  function dump(msg) {
    if (debug) {
      console.log(msg);
    }
  }

  // Pulic API
  return {
   'Alias': Alias,
   'PushEndpoint': PushEndpoint,
   'debug': debug,
   'rootUrl': rootUrl,
   'createSession': createSession,
   'invite': invite,
   'acceptInvitation': acceptInvitation,
   'rejectInvitation': rejectInvitation,
   'createAccount': createAccount,
   'updateAccount': updateAccount,
   'accountExist': accountExist
  };
})();

if ((typeof module === 'undefined') && window) {
  window.TokFoxClient = TokFoxClient;
} else {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  module.exports = TokFoxClient;
}
