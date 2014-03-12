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

    UIManager.call(null, number, function() {
      window.close();
    });

    CallHandler.dial({
       type: 'msisdn',
       alias: number
    }, function() {
      console.log('Yay!');
    });
  }

  var ActivityHandler = {
    init: function ah_init() {
      window.navigator.mozSetMessageHandler('activity', _handle);
    }
  };
  exports.ActivityHandler = ActivityHandler;
})(this);
