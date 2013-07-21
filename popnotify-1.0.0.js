/*!
 * popNotify Javascript Plugin v1.0.0
 * https://github.com/clintioo/popnotify
 *
 * Copyright 2013 Clint Brown
 * Released under the MIT license
 *
 * Date: 2013-07-21T10:39Z
 */
(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define('popnotify', [], function () {
            return factory(root, document);
        });
    } else {
        root.popNotify = factory(root, document);
    }

}(this, function (window, document) {

	"use strict";

    var popNotify = function (options) {
    	this.ua = null;
      	this.note = null;
    	this.opts = {
    		enable: options.enable,
    		enableText: options.enableText,
    		callback: options.callback,
    		noteDisplayTime: options.noteDisplayTime
    	};

   		if (!this.opts.enableText) {
   			this.opts.enableText = 'Enable Notifications';
   		}

   		if (!this.opts.noteDisplayTime) {
   			this.opts.noteDisplayTime = 0;
   		}

        if (!this.isSupported()) {
            return;
        }

        this.init();
    };

    popNotify.prototype.isSupported = function () {
    	// Chrome 22-28 supports the old webkitNotifications spec
        if (window.webkitNotifications) {
        	return this.ua = 'chrome';
        // Firefox 22+ and Safari 6+ (Mountain Lion only) supports the new Notification spec
        } else if (window.Notification) {
        	return this.ua = 'firefoxSafari';
        // Firefox Mobile 22 supports the old mozNotification spec
        } else if (navigator.mozNotification) {
        	return this.ua = 'firefoxMobile';
        }
        
        return false;
    };

    popNotify.prototype.isEnabled = function () {
    	switch (this.ua) {
			case 'chrome':
				return (window.webkitNotifications.checkPermission() === 0) ? true : false;
				break;
			case 'firefoxSafari':
				return Notification.permission === 'granted' ? true : false;
				break;
			case 'firefoxMobile':
				return true;
				break;
			default:    			
				return false;
		} 
    }

	popNotify.prototype.requestPermission = function () {
		var self = this;

		switch (this.ua) {
			case 'chrome':
			window.webkitNotifications.requestPermission(function () {
				self.enableBtn.style.display = 'none';
				self.opts.callback();
				return true;
			});
			break;
			case 'firefoxSafari':
			Notification.requestPermission(function () {
				self.enableBtn.style.display = 'none';
				self.opts.callback();
				return true;
			});
			break;
			default:    			
				return false;
		}     	    		      
    };

	popNotify.prototype.showNotification = function (title, options, length) {
		var self = this,
			note;

		// If notifications are enabled, show notification; else request notifications permission
		if (this.isEnabled()) {
    		if (this.ua === 'chrome') {
    			note = window.webkitNotifications.createNotification(options.iconUrl, title, options.body);
    			note.show();

				note.ondisplay = function () {
					self.hideNotification(note, self.opts);
				};
    		} else if (this.ua === 'firefoxSafari') {
    			// Firefox having trouble displaying multiple notifications at once without setTimeout (?)
    			setTimeout(function () {
	    			note = new Notification(title, options);

	    			note.onshow = function () {
	   					self.hideNotification(note, self.opts);
	   				}
	    		}, Math.floor((Math.random()*self.opts.noteDisplayTime)+1));
    		} else if (this.ua === 'firefoxMobile') {
    			note = navigator.mozNotification.createNotification(title, options.body, options.iconUrl);
    			note.show();
    		}
		} else {
			this.requestPermission();
		}
	};

	popNotify.prototype.hideNotification = function (note, opts) {
		// If note display time exists, hide notification after this period
		if (opts.noteDisplayTime !== 0) {
			setTimeout(function () {
				if (this.ua === 'chrome') {
					note.cancel()
				} else {
					note.close();
				}
			}, opts.noteDisplayTime)
		}
	};

    popNotify.prototype.init = function () {
    	var self = this;

		// If browser supports notifications 	
		if (this.isSupported()) {
			// If notifications have not been enabled
	        if (this.isEnabled() === false) {
				// Append notifications button
		    	this.enableBtn = document.createElement('button');
		    	if (this.opts.enable.charAt(0) === '#') {
		    		this.enableBtn.setAttribute('id', this.opts.enable.substr(1));
		    	} else {
		    		this.enableBtn.setAttribute('class', this.opts.enable.substr(1));
		    	}
		    	this.enableBtn.setAttribute('href', '#');
		    	document.getElementsByTagName("body")[0].appendChild(this.enableBtn);
		    	this.enableBtn.innerHTML = this.opts.enableText;

		    	// Ask for notifications permission - must be intialised by user event
				this.enableBtn.addEventListener('click', function () {
	        		self.requestPermission();
	        	}, false);
	        } else if (this.opts.callback) {
		        this.opts.callback();
	        }
		}
    }

    return popNotify;

}));