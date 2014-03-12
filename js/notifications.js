/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

/* global PushHelper */

/* exported Notifications */

var Notifications = (function() {

  /** Callback funtion to call when the registration gets done. */
  var onRegister = null;

  /**
   * Call the callback function once it gets notifications from the server.
   *
   * @param {Function} callback Callback function to be called once it gets the
   *                            notification from the server.
   */
  function n_listen(callback) {
    window.PushHelper.listen('tokfox', null, callback);
  }

  /**
   * Register the device
   *
   * @param {Function} callback Callback function to be called once the
   *                            registration process gets done. An error object
   *                            will be passed as the first parameter for the
   *                            callback function. The PUSH enpoind will be
   *                            passed as the second parameter for the callback
   *                            function.
   */
  function n_register(callback) {

    // Save the callback to call once the process gets done.
    onRegister = callback;

    // Return the end point if it is already stored into local store area.
    if (localStorage['tokfox']) {
      n_registerNotifications();
      return;
    }

    var pushServer = window.PushHelper;
    pushServer.register(n_registerNotifications);
    pushServer.init();
  }

  /**
   * Helper function.
   */
  function n_registerNotifications() {
    var error = null, result = null;

    try {
      result = {};
      result.endPoint = JSON.parse(localStorage['tokfox']).endPoint;
    } catch(e) {
      result = null;
      error = {};
      error.msg = 'Unable to retrieve the end point.';
    }

    // Call the callback function once we get the end point.
    if (typeof onRegister === 'function') {
      onRegister(error, result);
    }
  }

  return {
    listen: n_listen,
    register: n_register
  };
})();
