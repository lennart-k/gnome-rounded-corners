import St from "gi://St"
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Gio from "gi://Gio"
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class extends Extension {
    _monitorListener = null
    _bindHandle = null

    constructor(metadata) {
        super(metadata)
        this.corners = {}
    }

    enable() {
        this._settings = this.getSettings();
        this._bindHandle = this._settings.connect('changed::corner-radius', () => this.drawCorners())
        this._monitorListener = Gio.DBus.session.signal_subscribe(
            'org.gnome.Mutter.DisplayConfig',
            'org.gnome.Mutter.DisplayConfig',
            'MonitorsChanged',
            '/org/gnome/Mutter/DisplayConfig',
            null,
            Gio.DBusSignalFlags.NONE,
            () => this.drawCorners()
        )
        this.drawCorners()
    }

    disable() {
        this.destroyCorners()
        if (this._monitorListener) Gio.DBus.session.signal_unsubscribe(this._monitorListener)
        this._settings.disconnect(this._bindHandle)
        this._settings = null
    }

    drawCorners() {
        const radius = this._settings.get_int('corner-radius')
        const cornerDir = this.dir.get_child('corners').get_path();
        this.destroyCorners()

        for (let monitor of Main.layoutManager.monitors) {
            let geometryScale = monitor.geometry_scale || 1

            for (let corner of ['tl', 'tr', 'bl', 'br']) {
                let x = monitor.x + ((corner[1] == 'l') ? 0 : monitor.width - geometryScale*radius)
                let y = monitor.y + ((corner[0] == 't') ? 0 : monitor.height - geometryScale*radius)

                let cornerDecoration = this.corners[`${monitor.index}-${corner}`] = new St.Bin({
                    style_class: `corner-decoration corner-{${corner}}`,
                    reactive: false,
                    x, y,
                    width: geometryScale*radius,
                    height: geometryScale*radius,
                    can_focus: false,
                    track_hover: false,
                    style: `
                        background-image: url("${cornerDir}/corner-${corner}.svg");
                        background-size: contain;
                    `
                })

                Main.uiGroup.add_child(cornerDecoration)
            }
        }
    }

    destroyCorners() {
        for (let corner of Object.values(this.corners)) {
            corner.destroy()
        }
        this.corners = {}
    }
}

