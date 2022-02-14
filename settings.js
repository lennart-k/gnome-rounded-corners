const Gio = imports.gi.Gio;
const { getSettings } = imports.misc.extensionUtils;

const SCHEMA_PATH = 'org.gnome.shell.extensions.lennart-k.rounded_corners'

var Prefs = class {
	constructor() {
		this.settings = getSettings(SCHEMA_PATH)
	}

	get radius() {
		return this.settings.get_int('corner-radius')
	}

	set radius(val) {
		this.settings.set_int('corner-radius', val)
	}

	watch(key, cb) {
		let binding = this.settings.connect(`changed::${key}`, cb)
		return () => this.settings.disconnect(binding)
	}
}
