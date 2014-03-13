/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

/* global Notifications, TokFoxClient */

window.addEventListener('load', function callSetup(evt) {
  window.removeEventListener('load', callSetup);

  Notifications.listen(function onNotification() {
  });
  Notifications.register(function onRegister(error, result) {
  });

  UIManager.init();
  ActivityHandler.init();
});
