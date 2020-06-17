const Plugin = () => {


	const checkFonts = function (deck, options) {

		const debugLog = function (text) {
			if (options.debug) console.log(text);
		}
	
		const selfhost = function() {
			var fontCSS, head;
			fontCSS = document.createElement('link');
			fontCSS.rel = "stylesheet";
			fontCSS.type = "text/css";
			fontCSS.href = options.selfhostcss;
			head = (document.getElementsByTagName('head'))[0];
			head.insertBefore(fontCSS, head.childNodes[0]);
			document.documentElement.classList.add("wf-active","selfhostfonts");
			debugLog("Selfhost fonts");
		}
	
		let WebFontConfig = {
			active: function() {
				sessionStorage['FontsFirstSettingsStorage'] = 'cdnhost';
				debugLog("CDN fonts");
			},
			inactive: function() {
				selfhost();
				sessionStorage['FontsFirstSettingsStorage'] = 'selfhost';
			},
			timeout: options.timeout
		}

		for (let modulename in options.modules) { 
			WebFontConfig[modulename] = options.modules[modulename]; 
		}
		if (window.Promise) {

			debugLog("Promise supported");

			return new Promise(function( resolve ) {

				if (typeof WebFont !== "undefined") { 

					WebFontConfig['active'] = function(){
						sessionStorage['FontsFirstSettingsStorage'] = 'cdnhost';
						resolve();
						debugLog("CDN fonts");
					}
	
					WebFontConfig['inactive'] = function(){
							selfhost();
							resolve();
							sessionStorage['FontsFirstSettingsStorage'] = 'selfhost';
					}
		
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

	const init = function (deck) {

		let defaultOptions = {
			debug: false,
			modules: {
				google: {
					families: ['Roboto']
				}
			},
			selfhostcss : "/path/to/selfhostedfont.css",
			timeout: 1000
		};

		const defaults = function (options, defaultOptions) {
			for ( let i in defaultOptions ) {
				if ( !options.hasOwnProperty( i ) ) {
					options[i] = defaultOptions[i];
				}
			}
		}

		let options = deck.getConfig().fontsfirst || {};

		defaults(options, defaultOptions);
		checkFonts(deck, options);
	};

	return {
		id: 'fontsfirst',
		init: init
	};
};

export default Plugin;