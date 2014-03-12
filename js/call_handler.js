'use strict';

(function(exports) {
  var debug = true;
  // TODO Check options for tuning the performance
  var publisherOptions = {
    publishAudio:true,
    publishVideo:false // Disabled by default
  };
    
  var publisher, session;

  function _sessionConnectedHandler (event, callback) {
    if (typeof callback !== 'function') {
      callback = function() {};
    }
    debug && console.log('DEBUG CallHandler: Session connected');
    debug && console.log('DEBUG CallHandler: Currently we have ' + event.streams);
    session.publish(publisher, null, function(error) {
      if (error) {
        debug && console.log('DEBUG CallHandler: Own stream NOT published');
        callback('Error while publishing');
      } else {
        debug && console.log('DEBUG CallHandler: Own stream published!!!');
        callback();
      }
    });
  };

  function _streamCreatedHandler(event, callback) {
    if (typeof callback !== 'function') {
      callback = function() {};
    }
    debug && console.log('DEBUG CallHandler: Stream created/connected ' + event.streams.length);
    _subscribeToStreams(event.streams);
    callback();
  }

  function _subscribeToStreams(streams) {
    for (var i = 0; i < streams.length; i++) {
      var stream = streams[i];
      if (stream.connection.connectionId 
           != session.connection.connectionId) {
        session.subscribe(stream);
      }
    }
  }

  var CallHandler = {
    /**
     * Setup all the headers needed in the application for any request to the
     * server.
     * @param sessionID String Session ID which represent a 'room'
     * @param apiKey String TokBox Api Key
     * @param token String Provisional token for the session
     * @param target String DOM ID where the stream is going to be published
     * @param onConnected Function Connected to the session
     * @param onStream String New stream registered in the session
     */
    join: function ch_join(apiKey, sessionID, token, target, onConnected, onStream) {
      publisher = TB.initPublisher(apiKey, target, publisherOptions);
      session   = TB.initSession(sessionID);
      session.connect(apiKey, token);

      session.addEventListener(
        'sessionConnected', 
        function onConnectedHandler(event) {
          _sessionConnectedHandler(event, onConnected);
        }
      );
      
      session.addEventListener(
        'streamCreated', 
        function onStreamHandler(event) {
          _streamCreatedHandler(event, onStream);
        }
      );
    },
    /**
     * Setup all the headers needed in the application for any request to the
     * server.
     * @param alias Object Must contains 'type' (MSISDN, mail...) & value
     */
    dial: function ch_dial(alias, callback) {
      TokFoxClient.createSession('publisher', null, function(error, result) {
        if (error) {
          callback('Error while creating a session');
          return;
        }

        // Retrieve credentials to be used for inviting
        var apiKey = result.apiKey;
        var sessionId = result.sessionId;
        var token = result.token;

        if (!token || !apiKey || !sessionId) {
          callback('Result from /Session is not valid');
          return;
        }

        TokFoxClient.invite(alias.type, alias.value, sessionId, callback);
      });
    },

    disconnect: function ch_disconnect() {
      // TODO Add tokbox disconnect
      publisher = null;
      session = null;
    }
  }

  exports.CallHandler = CallHandler;

}(this));
