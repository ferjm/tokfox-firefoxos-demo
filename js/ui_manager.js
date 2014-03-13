'use strict';

(function(exports) {
  var _initialized = false;
  var hangupButton, countryCodeSelect, phoneNumberInput, sendMSISDN;
  var contactNameDOM, contactPhoneNumberDOM;
  var UIManager = {
    init: function() {
      if (_initialized) {
        return;
      }
      hangupButton = document.getElementById('call-hangup');
      countryCodeSelect = document.getElementById('country-code');
      phoneNumberInput = document.getElementById('telephone');
      sendMSISDN = document.getElementById('send-msisdn-button');
      contactNameDOM = document.getElementById('call-contact-name');
      contactPhoneNumberDOM = document.getElementById('call-contact-phone');

      phoneNumberInput.addEventListener('input', function() {
        if (phoneNumberInput.value.length > 0) {
          sendMSISDN.classList.remove('disabled');
        } else {
          sendMSISDN.classList.add('disabled');
        }
      });

      
      _initialized = true;
    },
    call: function(name, phoneNumber, onHangup) {
      document.body.dataset.layout = 'call';

      if (!name) {
        contactNameDOM.textContent = phoneNumber;
        contactPhoneNumberDOM.textContent = 'Tokfox user';
      } else {
        contactNameDOM.textContent = name;
        contactPhoneNumberDOM.textContent = phoneNumber;
      }

      hangupButton.addEventListener('click', function hang() {
        hangupButton.removeEventListener('click', hang);
        if (typeof onHangup === 'function') {
          onHangup();
        }
      });
    },
    register: function(onRegistered) {
      document.body.dataset.layout = 'register';
      sendMSISDN.addEventListener('click', function send() {
        // sendMSISDN.removeEventListener('click', send);
        if (typeof onRegistered === 'function') {
          var phone =
            countryCodeSelect.options[countryCodeSelect.selectedIndex].value +
            phoneNumberInput.value;
          onRegistered(phone);
        }
      });
    }
  };

  exports.UIManager = UIManager;
}(this));

UIManager.init();