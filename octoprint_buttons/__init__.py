# coding=utf-8
from __future__ import absolute_import


import octoprint.plugin
from octoprint.settings import settings

class ButtonsPlugin(octoprint.plugin.SettingsPlugin,
                    octoprint.plugin.AssetPlugin,
                    octoprint.plugin.TemplatePlugin,
                    octoprint.plugin.StartupPlugin):
                    
    def get_template_configs(self):
        return [
            dict(type="tab", name="Dev Buttons"),
            dict(type="settings", name="Dev Tools Settings")
        ]

    def get_settings_defaults(self):
        return dict(virtualPrinterEnabled=False)

    def on_after_startup(self):
        self._logger.info("Dev Tools Loaded")
        self.vprintEnabled = settings().getBoolean(["devel", "virtualPrinter", "enabled"])
        self._settings.setBoolean(["virtualPrinterEnabled"], self.vprintEnabled)
    
    #def on_settings_load(self):
    #    self.vprintEnabled = settings().getBoolean(["devel", "virtualPrinter", "enabled"])
    #    self._settings.setBoolean(["plugins", "buttons", "virtualPrinterEnabled"], self.vprintEnabled)
    #    return data
        
    def on_settings_save(self, data):
        for keys,value in data.items():
            settings().setBoolean(["devel", "virtualPrinter", "enabled"], value)
            self._settings.setBoolean(["virtualPrinterEnabled"], value)
        #octoprint.plugin.SettingsPlugin.on_settings_save(self, data)
        #self.vprintEnabled = self._settings.getBoolean(["virtualPrinterEnabled"])
        #settings().setBoolean(["devel", "virtualPrinter", "enabled"], self.vprintEnabled)

    def get_assets(self):
        return dict(
            js=["js/buttons.js"],
            css=["css/buttons.css"],
            less=["less/buttons.less"]
        )

    ##~~ Softwareupdate hook

    def get_update_information(self):
        return dict(
            buttons=dict(
                displayName="Buttons Plugin",
                displayVersion=self._plugin_version,

                # version check: github repository
                type="github_release",
                user="ntoff",
                repo="OctoPrint-Buttons",
                current=self._plugin_version,

                # update method: pip
                pip="https://github.com/ntoff/OctoPrint-Buttons/archive/{target_version}.zip"
            )
        )


# If you want your plugin to be registered within OctoPrint under a different name than what you defined in setup.py
# ("OctoPrint-PluginSkeleton"), you may define that here. Same goes for the other metadata derived from setup.py that
# can be overwritten via __plugin_xyz__ control properties. See the documentation for that.
__plugin_name__ = "Dev Tools"

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = ButtonsPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }

