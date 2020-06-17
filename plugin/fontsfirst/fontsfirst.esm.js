
/*****************************************************************
 * @author: Martijn De Jongh (Martino), martijn.de.jongh@gmail.com
 * https://github.com/Martinomagnifico
 *
 * FontsFirst.js for Reveal.js 
 * Version 1.0.1
 * 
 * @license 
 * MIT licensed
 *
 * Thanks to:
 *  - Hakim El Hattab, Reveal.js 
 *  - Typekit/Google, Webfontloader.js
 ******************************************************************/


var Plugin = function Plugin() {
  var checkFonts = function checkFonts(deck, options) {
    var debugLog = function debugLog(text) {
      if (options.debug) console.log(text);
    };

    var selfhost = function selfhost() {
      var fontCSS, head;
      fontCSS = document.createElement('link');
      fontCSS.rel = "stylesheet";
      fontCSS.type = "text/css";
      fontCSS.href = options.selfhostcss;
      head = document.getElementsByTagName('head')[0];
      head.insertBefore(fontCSS, head.childNodes[0]);
      document.documentElement.classList.add("wf-active", "selfhostfonts");
      debugLog("Selfhost fonts");
    };

    var WebFontConfig = {
      active: function active() {
        sessionStorage['FontsFirstSettingsStorage'] = 'cdnhost';
        debugLog("CDN fonts");
      },
      inactive: function inactive() {
        selfhost();
        sessionStorage['FontsFirstSettingsStorage'] = 'selfhost';
      },
      timeout: options.timeout
    };

    for (var modulename in options.modules) {
      WebFontConfig[modulename] = options.modules[modulename];
    }

    if (window.Promise) {
      debugLog("Promise supported");
      return new Promise(function (resolve) {
        if (typeof WebFont !== "undefined") {
          WebFontConfig['active'] = function () {
            sessionStorage['FontsFirstSettingsStorage'] = 'cdnhost';
            resolve();
            debugLog("CDN fonts");
          };

          WebFontConfig['inactive'] = function () {
            selfhost();
            resolve();
            sessionStorage['FontsFirstSettingsStorage'] = 'selfhost';
          };

          if (sessionStorage['FontsFirstSettingsStorage']) {
            if (sessionStorage['FontsFirstSettingsStorage'] == "selfhost") {
              debugLog("FontsFirst.js sessionStorage already set to selfhost");
              selfhost();
              resolve();
            } else if (sessionStorage['FontsFirstSettingsStorage'] == "cdnhost") {
              debugLog("FontsFirst.js sessionStorage already set to cdnhost");
              WebFont.load(WebFontConfig);
            }
          } else {
            debugLog("First time load of FontsFirst.js");
            WebFont.load(WebFontConfig);
          }
        } else {
          debugLog("Webfont.js is not loaded, setting fonts to selfhost");
          selfhost();
          resolve();
          sessionStorage['FontsFirstSettingsStorage'] = 'selfhost';
        }
      });
    } else {
      debugLog("Promise not supported");

      if (typeof WebFont !== "undefined") {
        WebFont.load(WebFontConfig);
      } else {
        selfhost();
      }
    }
  };

  var init = function init(deck) {
    var defaultOptions = {
      debug: false,
      modules: {
        google: {
          families: ['Roboto']
        }
      },
      selfhostcss: "/path/to/selfhostedfont.css",
      timeout: 1000
    };

    var defaults = function defaults(options, defaultOptions) {
      for (var i in defaultOptions) {
        if (!options.hasOwnProperty(i)) {
          options[i] = defaultOptions[i];
        }
      }
    };

    var options = deck.getConfig().fontsfirst || {};
    defaults(options, defaultOptions);
    checkFonts(deck, options);
  };

  return {
    id: 'fontsfirst',
    init: init
  };
};

export default Plugin;
