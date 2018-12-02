const St = imports.gi.St;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
let Extension = imports.misc.extensionUtils.getCurrentExtension();
let Settings = Extension.imports.settings;

let corner_types = ['tl', 'tr', 'bl', 'br'];

let corners = {}; // List of corners displayed.
// let radius = 20; // This also needs to be changed 3 places in the CSS.

function Ext() {
    this._init.apply(this, arguments);
};
Ext.prototype = {}

Ext.prototype._init = function () {
    this.enabled = false
    this.unbind = function () { }
}

Ext.prototype.enable = function () {
    this.enabled = true
    var pref = (new Settings.Prefs()).RADIUS
    var binding = pref.changed(Lang.bind(this, function () {
        this.initCorners(pref.get())
    }))
    this.unbind = function () {
        pref.disconnect(binding);
        this.unbind = function () { };
    };
    this.initCorners(pref.get())
}
Ext.prototype.disable = function () {
    this.unbind()
    this.enabled = false
    this.destroyCorners()
}
Ext.prototype.initCorners = function (radius) {
    this.destroyCorners()

    let monitors = Main.layoutManager.monitors;

    for (let m in Main.layoutManager.monitors) {
        let monitor = monitors[m];

        for (let c in corner_types) {
            let corner = corner_types[c];

            corners[monitor.index + corner] = new St.Bin({
                style_class: 'corner' + corner,
                reactive: false,
                can_focus: false,
                x_fill: true,
                y_fill: false,
                track_hover: false,
                style: "width: " + radius + "px; height: " + radius + "px; background-size: " + radius + "px;"
            });
        }

        corners[monitor.index + 'tl'].x = monitor.x;
        corners[monitor.index + 'tl'].y = monitor.y;

        corners[monitor.index + 'tr'].x = monitor.x + monitor.width - radius;
        corners[monitor.index + 'tr'].y = monitor.y;

        corners[monitor.index + 'bl'].x = monitor.x;
        corners[monitor.index + 'bl'].y = monitor.y + monitor.height - radius;

        corners[monitor.index + 'br'].x = monitor.x + monitor.width - radius;
        corners[monitor.index + 'br'].y = monitor.y + monitor.height - radius;
    }

    for (let c in corners) {
        Main.uiGroup.add_actor(corners[c]);
        corners[c].set_position(corners[c].x, corners[c].y);
    }
}
Ext.prototype.destroyCorners = function () {
    for (let c in corners) {
        // Destroy the corners.
        corners[c].destroy();
    }
    corners = {}
}
function init() {
    return new Ext()
}