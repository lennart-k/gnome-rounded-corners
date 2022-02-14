const St = imports.gi.St
const Main = imports.ui.main
const Gio = imports.gi.Gio
const Lang = imports.lang
let Extension = imports.misc.extensionUtils.getCurrentExtension()
let { Prefs } = Extension.imports.settings

let cornerDir = Extension.dir.get_child('corners').get_path();

class Ext {
    enabled = false
    _unbind = null
    _monitorListener = null

    constructor() {
        this.corners = {}
        this.prefs = new Prefs
    }

    enable() {
        this.enabled = true
        this._unbind = this.prefs.watch('corner-radius', this.update.bind(this))
        this._monitorListener = Gio.DBus.session.signal_subscribe(
            'org.gnome.Mutter.DisplayConfig',
            'org.gnome.Mutter.DisplayConfig',
            'MonitorsChanged',
            '/org/gnome/Mutter/DisplayConfig',
            null,
            Gio.DBusSignalFlags.NONE,
            () => this.update()
        )
        this.initCorners()
    }

    disable() {
        this.destroyCorners()
        if (this._monitorListener) Gio.DBus.session.signal_unsubscribe(this._monitorListener)
        if (this._unbind) this._unbind()
    }

    update() {
        if (this.enabled) this.initCorners()
    }

    initCorners() {
        log('initCorners')
        let radius = this.prefs.radius
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

function init() {
    return new Ext()
}
