/*
 * View model for OctoPrint-Buttons
 *
 * Author: ntoff
 * License: AGPLv3
 * 
 * I don't even know what half of this does anymore
 * 
 */
$(function() {
    function ButtonsViewModel(parameters) {
        var self = this;

        self.settingsViewModel = parameters[1];
        self.loginState = parameters[0];
        
        //some day, turn this mess into a case statement or something that doesn't involve repeated junk
        self.showError = function() {
            var options = {
                hide: false,
                type: 'error',
                title: 'Error Test',
            }
            self.showNotify(self,options);
        };

        self.showAlert = function() {
            var options = {
                hide: false,
                type: 'alert',
                title: 'Alert Test',
            }
            self.showNotify(self,options);
        };
        
        self.showInfo = function() {
            var options = {
                hide: false,
                type: 'info',
                title: 'Info Test',
            }
            self.showNotify(self,options);
        };
        self.showSuccess = function() {
            var options = {
                hide: false,
                type: 'success',
                title: 'Success Test',
            }
            self.showNotify(self,options);
        };
        self.showAnnouncement = function() {
            var options = {
                title: "Announcement Test",
                hide: false,
                confirm: {
                    confirm: true,
                    buttons: [{
                        text: gettext("Later"),
                        click: function(notice) {
                            notice.remove();
                        }
                    }, {
                        text: gettext("Mark read"),
                        click: function(notice) {
                            notice.remove();
                        }
                    }, {
                        text: gettext("Read..."),
                        addClass: "btn-primary",
                        click: function(notice) {
                            notice.remove();
                        }
                    }]
                },
                buttons: {
                    sticker: false,
                    closer: false
                }
            };
            self.showNotify(self,options);
        }

        self.showImportantAnnouncement = function() {
            var options = {
                title: "Announcement Test",
                type: 'error',
                hide: false,
                confirm: {
                    confirm: true,
                    buttons: [{
                        text: gettext("Later"),
                        click: function(notice) {
                            notice.remove();
                        }
                    }, {
                        text: gettext("Mark read"),
                        click: function(notice) {
                            notice.remove();
                        }
                    }, {
                        text: gettext("Read..."),
                        addClass: "btn-primary",
                        click: function(notice) {
                            notice.remove();
                        }
                    }]
                },
                buttons: {
                    sticker: false,
                    closer: false
                }
            };
            self.showNotify(self,options);
        }

        self.showNotify = function(self,options) {
            if (!options.text) {
                options.text = "<a href=\"http://octopi.local\">This is a test url</a><p>This is just some text</p><p><ul><li>Item One</li><li>Item Two</li><li>Item Three</li></ul></p>"
            }
            new PNotify(options);
        };

        self.requestData = function() {
            self.settingsViewModel.requestData();
        };

        self.onBeforeBinding = function () {
            self.settings = self.settingsViewModel.settings;
            console.log("Dev Tools: Virtual printer enabled is:" + self.settingsViewModel.settings.plugins.buttons.virtualPrinterEnabled());
        };
        
        self.onSettingsShown = function() {
            self.requestData();
        };
        
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: ButtonsViewModel,
        //additionalNames: ["yourCustomViewModel"],
        dependencies: ["loginStateViewModel", "settingsViewModel"],
        //optional: ["someOtherViewModel"],
        elements: ["#tab_plugin_buttons", "#settings_plugin_buttons"]
    });
});
