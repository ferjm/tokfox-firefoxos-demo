/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var TokFoxFxOSDemo = (function() {
  /** Close button node */
  var closeButton = null;

  /** Localization */
  var _ = null;

  /**
   * Init function.
   */
  function tfd_init() {
    _ = navigator.mozL10n.get;

    // Retrieve the various page elements
    closeButton = document.getElementById('close');

    // Event handlers
    closeButton.addEventListener('click', tfb_onClose);

    tfb_createSession();
  }

  /**
   *
   */
  function tfb_createSession() {
    var tokfox = window.TokFoxClient;

    tokfox.createSession(
      null,
      null,
      function(error, result) {
        console.log('result is ' + JSON.stringify(result));
        console.log('error is ' + JSON.stringify(error));
    });
  }

  /**
   * Handler for closing the app.
   */
  function tfb_onClose() {
    window.close();
  }

  // Public API.
  return {
    init: tfd_init
  };
})();

window.addEventListener('load', function callSetup(evt) {
  window.removeEventListener('load', callSetup);

  TokFoxFxOSDemo.init();
});
