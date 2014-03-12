'use strict';

(function(exports) {
  function _handle(activity) {
    if (activity.source.name != 'dial') {
      return;
    }

    var number = activity.source.data.number;
    if (!number) {
      return;
    }

    CallHandler.dial({
      type: 'msisdn',
      alias: number
    });
  }

  var ActivityHandler = {
    init: function ah_init() {
      window.navigator.mozSetMessageHandler('activity', _handle);
    }
  };
  exports.ActivityHandler = ActivityHandler;
})(this);
