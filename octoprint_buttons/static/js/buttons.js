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
        var counter=0;
        self.settingsViewModel = parameters[1];
        self.loginState = parameters[0];
        //whack a button up in the navbar to close all notifications, all those pesky notifications, we hates them. 
        //stupid fat notificationses, they steals all our screen space they does. we hates them.
        $('#navbar_plugin_announcements').before("\
        <li id=\"navbar_announcements_close\">\
        <a title=\"stupid fat notificationses. we hates them.\" href=\"javascript:void(0)\" data-bind=\"click: function() { closeAllNotices() }\">\
        <i class=\"fa  fa-bell-slash-o\"></i>\
        </a>\
        </li>");

        self.closeAllNotices = function() {
            PNotify.removeAll();
            counter=0;
        }

        self.genericAlert = function(alerType, alerTitle, alertName) {
            var options = {
                hide: false,
                type: alerType,
                title: alerTitle + " Test " + counter,
                addclass:  "notify-"+alertName,
                name: alertName
            }
            
            //somehow detect if one has shown up, don't combine, but do notify that more of the same notification type as shown.
            if ($(".notify-"+alertName).length < 1) {
                counter++;
                self.showNotify(self,options);
            }
            else if ($(".notify-"+alertName).length >= 1) {  //wait, is else if actually a thing? I typed that by mistake
                counter++;
                PNotify.removeAll();  //don't do this...
                //should do something like this
                /* 
                 * for each PNotify.notices[0].state that's "open"
                 * i = notice number, how do we get that? voodoomagic eh
                 * if notice[i].name = notify-alertName
                 * PNotify.notices[i].remove()
                 * 
                 * so we only remove the notifications of the same type
                 */
                self.showNotify(self,options);  //this should go to another thing which gets a thing which goes "hey I removed your last thing, you've got multiple things of the same thing, deal with it"
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
        elements: ["#tab_plugin_buttons", "#settings_plugin_buttons", "#navbar_announcements_close"]
    });
});
