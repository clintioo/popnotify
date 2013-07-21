popNotify.js
=========

popNotify.js is a simple Javascript plugin (2.6KB minified) providing support for HTML5 notifications. It uses a combination of vendor-specific implementations for [Chrome](http://www.chromium.org/developers/design-documents/desktop-notifications/api-specification) and [mobile Firefox](https://developer.mozilla.org/en-US/docs/Web/API/notification) and the current [Web Notifications](http://www.w3.org/TR/notifications/) spec for Firefox and Safari.

## Currently Supported ##

- Chrome 22+
- Firefox 22+
- Firefox Mobile 4+
- Safari 6+ (OS X 10.8 Mountain Lion required)

## Usage ##

1. Add the script to your page

    https://raw.github.com/clintioo/popnotify/master/popnotify-1.0.0-min.js

2. Initialise the plugin

		var pop = new popNotify({
		              enable: '.enable',
		              enableText: 'Enable Notifications',
		              callback: yourCallbackFunction,
		              noteDisplayTime: 6000
	    });

	
	Config options (optional)

		enable (string)        ID or classname of button to enable notifications
		enableText (string)    Text of button to enable notifications
		callback (func)        Callback function when notifications are enabled
		noteDisplayTime (int)  Time in milliseconds to display each notification

3. Display a notification

		pop.showNotification('Your Title', {
			body: 'Your Body Text', 
			iconUrl: 'http://your.image/url',
			dir: 'auto',
			lang: '',
			tag: ''});

## Licence ##

popNotify.js is released under the MIT license.