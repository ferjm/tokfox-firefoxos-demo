/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

/* exported TokFoxClient */

var TokFoxClient = (function TokFoxClient() {
  /**
   * Default root URL for TokFox API.
   */
  var DEFAULT_ROOT_URL = 'http://tokfox.herokuapp.com';

  /** Debug flag. */
  var debug = false;

  /** URL for TokFox API. */
  var rootUrl = DEFAULT_ROOT_URL;

  /**
   *
   */
  function createAccount(aliasType, aliasValue, pushEndpoint, callback) {
    var options = {};

    options.uri = rootUrl + '/account/';
    options.method = 'POST';
    options.body = {};
    options.body.alias = {};
    options.body.alias.type = aliasType;
    options.body.alias.value = aliasValue;
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
  function invite(aliasType, aliasValue, sessionId, callback) {
    var options = {};

    options.uri = rootUrl + '/session/invitation/';
    options.method = 'POST';
    options.body = {};
    options.body.alias = {};
    options.body.alias.type = aliasType;
    options.body.alias.value = aliasValue;
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
  function request(options, callback) {
    var error = null, result = null;

    if (debug) {
      dump('options is ' + JSON.stringify(options));
    }

    var req = new XMLHttpRequest({mozSystem: true});
    req.open(options.method, options.uri, true);
    req.onreadystatechange = function onReadyStateChange(evt) {
      if (req.readyState === 4) {
        try {
          result = JSON.parse(req.responseText);
        } catch(e) {
        }
        if (req.status !== 200) {
         error = result || {};
         error.status = req.status;
         error.statusText = req.statusText;
         result = null;
        }
        if (debug) {
          dump('result is ' + JSON.stringify(result));
          dump('error is ' + JSON.stringify(error));
        }
        if (callback && (typeof callback === 'function')) {
          callback(error, result);
        }
      }
    };
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
   'debug': debug,
   'rootUrl': rootUrl,
   'createSession': createSession,
   'invite': invite,
   'acceptInvitation': acceptInvitation,
   'createAccount': createAccount
  };
})();

if ((typeof module === 'undefined') && window) {
  window.TokFoxClient = TokFoxClient;
} else {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  module.exports = TokFoxClient;
}
