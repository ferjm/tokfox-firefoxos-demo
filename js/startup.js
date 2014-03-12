/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

/* global Notifications, TokFoxClient */

var StartUp = {
  SIGN_UP_KEY: 'user.logged',

  init: function tfd_init() {
    var alias = {};
    alias.type = 'msisdn';
    alias.value = '+34666777888';

    this.signupsignin(alias, function onSignUpSignIn() {
    });
  },

  /**
   * Sign Up / Sing in the user. Performs the PUSH registration and account
   * creation dance.
   *
   * @param {Object} alias JSON object containing user's MSISDN.
   * @param {Function} callback Callback function to call once the sign in/up
   *                            process is completed.
   */
  signupsignin: function tfd_signupsignin(alias, callback) {
  }
};

window.addEventListener('load', function callSetup(evt) {
  window.removeEventListener('load', callSetup);

  StartUp.init();
});
