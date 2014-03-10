/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var TokFoxFxOSDemo = {

  apiKey: null,
  // TODO hardcoded for now.
  sessionId: '1_MX40NDYzMjUyMn5-RnJpIE1hciAwNyAwOToxMjo0NyBQU1QgMjAxNH4wLjUxNjg5MjQzfg',
  token: null,

  init: function tfd_init() {
    // Pretty basic test of TokFox + TokBox functionality.
    window.TokFoxClient.createSession('publisher', this.sessionId,
                                      this.onTokFoxSession.bind(this));
  },

  initTokBoxSession: function initTokBoxSession() {
    this.publisher = TB.initPublisher(this.apiKey);
    this.session   = TB.initSession(this.sessionId);

    this.session.connect(this.apiKey, this.token);
    this.session.addEventListener('sessionConnected',
                                  this.sessionConnectedHandler);
    this.session.addEventListener('streamCreated', this.streamCreatedHandler);
  },

  sessionConnectedHandler: function(event) {
    this.session.publish(this.publisher);
    this.subscribeToStreams(event.streams);
  },

  subscribeToStreams: function(streams) {
    for (var i = 0; i < streams.length; i++) {
      var stream = streams[i];
      if (stream.connection.connectionId != this.session.conecctionId) {
        this.session.subscribe(stream);
      }
    }
  },

  streamCreatedHandler: function(event) {
    subscribeToStreams(event.streams);
  },

  onTokFoxSession: function onTokFoxSession(error, result) {
    if (error && result.apikey && result.token) {
      return;
    }
    console.log(JSON.stringify(result));
    this.apiKey = result.apiKey;
    this.token = result.token;
    this.initTokBoxSession();
  }

};

window.addEventListener('load', function callSetup(evt) {
  window.removeEventListener('load', callSetup);

  TokFoxFxOSDemo.init();
});
