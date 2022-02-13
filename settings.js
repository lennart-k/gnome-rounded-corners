const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();

const SCHEMA_PATH = 'org.gnome.shell.extensions.lennart-k.rounded_corners'

function getLocalSettings() {
	const GioSSS = Gio.SettingsSchemaSource;

	const schemaDir = Extension.dir.get_child('schemas');

	let schemaSource = GioSSS.get_default();
	if (schemaDir.query_exists(null)) {
		schemaSource = GioSSS.new_from_directory(
			schemaDir.get_path(),
			schemaSource,
			false);
	}

	const schemaObj = schemaSource.lookup(SCHEMA_PATH, true);
	if (!schemaObj) {
		throw new Error(
			`Schema ${SCHEMA_PATH} could not be found for extension ${Extension.metadata.uuid}`
		);
	}
	return new Gio.Settings({ settings_schema: schemaObj });
};

var Prefs = class {
	constructor() {
		this.settings = getLocalSettings(SCHEMA_PATH)
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
