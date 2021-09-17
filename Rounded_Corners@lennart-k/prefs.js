const Gtk = imports.gi.Gtk;
let Extension = imports.misc.extensionUtils.getCurrentExtension();
let Settings = Extension.imports.settings;

function init() {
}

function buildPrefsWidget() {
	let config = new Settings.Prefs();
	let frame = new Gtk.Box({
		orientation: Gtk.Orientation.VERTICAL,
		'margin-top': 20,
		'margin-bottom': 20,
		'margin-start': 20,
		'margin-end': 20
	});

	(function() {
		let hbox = new Gtk.Box({
			orientation: Gtk.Orientation.HORIZONTAL,
			spacing: 20
		});

		let label = new Gtk.Label({
			label: "Border radius\n<small>in px</small>",
			use_markup: true,
		});
		let adjustment = new Gtk.Adjustment({
			lower: 0,
			upper: 30,
			step_increment: 1
		});
		let scale = new Gtk.Scale({
			orientation: Gtk.Orientation.HORIZONTAL,
			hexpand: true,
			digits: 0,
			adjustment: adjustment,
            value_pos: Gtk.PositionType.RIGHT,
            round_digits: 0
		});

		hbox.append(label);
		hbox.append(scale);
		frame.append(hbox);

		var pref = config.RADIUS;
		scale.set_value(pref.get());
		scale.connect('value-changed', function(sw) {
			var oldval = pref.get();
			var newval = sw.get_value();
			if (newval != pref.get()) {
				pref.set(newval);
			}
		});
	})();
	frame.show();
	return frame;
}