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
        return dict(virtualPrinterEnabled=False,
                    bundleAssets=True,
                    minifyAssets=True,
                    styleSheetType="css")

    def sync_settings(self):
        #sync settings in case config.yaml was manually edited
        self.vprintEnabled = settings().getBoolean(["devel", "virtualPrinter", "enabled"])
        self.bundleAssets = settings().getBoolean(["devel", "webassets", "bundle"])
        self.minifyAssets = settings().getBoolean(["devel", "webassets", "minify"])
        self.styleSheetType = settings().get(["devel", "stylesheet"])
        self._settings.setBoolean(["virtualPrinterEnabled"], self.vprintEnabled)
        self._settings.setBoolean(["bundleAssets"], self.bundleAssets)
        self._settings.setBoolean(["minifyAssets"], self.minifyAssets)
        self._settings.set(["styleSheetType"], self.styleSheetType)

    def on_after_startup(self):
        self._logger.info("Dev Tools Loaded")
        self.sync_settings()

    def on_settings_save(self, data):
        s = self._settings
        if "styleSheetType" in data.keys():
            settings().set(["devel", "stylesheet"], data["styleSheetType"])
        if "virtualPrinterEnabled" in data.keys():
            settings().setBoolean(["devel", "virtualPrinter", "enabled"], data["virtualPrinterEnabled"])
        if "bundleAssets" in data.keys():
            settings().setBoolean(["devel", "webassets", "bundle"], data["bundleAssets"])
        if "minifyAssets" in data.keys():
            settings().setBoolean(["devel", "webassets", "minify"], data["minifyAssets"])
        self.sync_settings()

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

