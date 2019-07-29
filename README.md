# reveal.js-fontsfirst
A plugin for [Reveal.js](https://revealjs.com) that makes sure that your fonts get loaded before initialising Reveal.js.

Sometimes when you use a Google or Typekit font, it takes some time to load the font. Your presentation will then first show in a default font and then jump to the correct font (known as a 'FOUT', a Flash Of Unstyled Text). 

Also, if you use an Adblocker like Ghostery, it is possible that the remote font will also not load at all. This plugin fixes that, but you do need to provide your self-hosted fallback fonts.

Here's a [demo](https://martinomagnifico.github.io/reveal.js-fontsfirst/demo.html) of a simple project that uses the FontsFirst.js plugin.


FontsFirst.js works like this:

* It uses WebFontLoader.js to load remote fonts.
* WebFontLoader.js checks if the remote loading works.
* WebFontLoader.js uses a timeout. If the time is up and remote fonts do not work, it provides a function in which you can provide your self-hosted fonts.
* To avoid the timeout each time the page is reloaded, the currently set way of loading the font is saved in a sessionStorage. This is reset only if the browser is quit.
* FontsFirst.js is a wrapper around WebFontloader and the sessionStorage: If either a remote font or self-hosted font is loaded, it will let Reveal.js continue loading. 
* This technique for loading plugins is new in Reveal 3.8.0 and uses 'Promises'.
* Browsers like IE11 do not support Promises, but FontsFirst.js includes a polyfill to let it work anyway.




## Installation

FontsFirst.js needs an other script to be able to function: [WebFontLoader.js](https://github.com/typekit/webfontloader) by Typekit/Adobe and Google. This checks the availability of the remotely hosted webfonts.

Copy the fontsfirst folder to the plugins folder of the reveal.js folder, like this: `plugin/fontsfirst`. Now add it to the dependencies of Reveal.js. The script for WebFontLoader is on a CDN, we add it as a dependency as well.


```javascript
Reveal.initialize({
	// ...
	dependencies: [
		// ... 
		{ src: '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'},
		{ src: 'assets/js/revealjs/plugin/fontsfirst/fontsfirst.js'}
		// ... 
	]
});
```



## Configuration

There are a few options that you can change from the Reveal.js options. The values below are default. It would be wise to change at least the modules and the selfhostcss options. 

```javascript
Reveal.initialize({
	// ...
	fontsfirst: {
		debug: false,
		modules: {
			google: {
				families: ['Roboto']
			}
		},
		selfhostcss : "/path/to/selfhostedfont.css",
		timeout: 1000,
		promisepoly: true
	},
	dependencies: [
	// ... 
	]
});
```
The modules option is where you set your Google, Typekit, Fontdeck or custom font. If you keep to the syntax described at [https://github.com/typekit/webfontloader](https://github.com/typekit/webfontloader), it will simply work. Just make sure that both the module and the selfhostcss refer to one font that you also use in your styling.

```css
	.reveal h3 {
		font-family: 'Roboto';
	}
```



The option 'debug' will report in the console what gets loaded by WebFontLoader and what gets set in the sessionStorage.  

The option 'promisepoly' makes sure that old browsers can use the Promise technique. If you're sure that the viewer has a modern browser, you can turn it off.  



## Like it?

If you like it, please star this repo.




## License
MIT licensed

Copyright (C) 2019 Martijn De Jongh (Martino)
