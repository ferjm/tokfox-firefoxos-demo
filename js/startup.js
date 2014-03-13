/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

/* global Notifications, TokFoxClient */

window.addEventListener('load', function callSetup(evt) {
  window.removeEventListener('load', callSetup);

  Notifications.init(
    function onMessage(invitationID) {
      console.log('Mensaje push recibido por el canal');
      console.log('La invitationID es ' + invitationID);
      CallHandler.onCall(invitationID);
    },
    function onRegistered(error, endPoint) {
      console.log('Registrado ' + endPoint);
    }
  );

  UIManager.init();
  ActivityHandler.init();
});
