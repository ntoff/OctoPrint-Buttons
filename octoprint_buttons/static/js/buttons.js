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
        
        self.closeAllNotices = function() {
            PNotify.removeAll();
        }

        self.genericAlert = function(alerType, alerTitle, alertName) {
            var options = {
                hide: false,
                type: alerType,
                title: alerTitle + " Test",
                addclass:  "notify-"+alertName,
                name: alertName
            }
            //somehow detect if one has shown up, don't combine, but do notify that more of the same notification type as shown.
            if ($(".notify-"+alertName).length < 1) {
                self.showNotify(self,options);
            }
        };

        self.showAnnouncement = function(alerType, alerTitle, alertName) {
            var options = {
                title: "Announcement Test",
                addclass:  "notify-"+alertName,
                type: alerType,
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
            if ($(".notify-"+alertName).length < 1) {
                self.showNotify(self,options);
            }
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
        additionalNames: ["yourCustomViewModel"],
        dependencies: ["loginStateViewModel", "settingsViewModel"],
        //optional: ["someOtherViewModel"],
        elements: ["#tab_plugin_buttons", "#settings_plugin_buttons"]
    });
});
