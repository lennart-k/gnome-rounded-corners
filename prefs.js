import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    let settings = window._settings = this.getSettings();

    const page = new Adw.PreferencesPage();

    const group = new Adw.PreferencesGroup({ title: "General settings" });

    let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 20 })
    let label = new Gtk.Label({ label: '', use_markup: true })
    function updateLabel(val) { label.set_markup(`Border radius:\n<small>${val}px</small>`) }
    let scale = new Gtk.Scale({
      orientation: Gtk.Orientation.HORIZONTAL,
      hexpand: true,
      digits: 0,
      adjustment: new Gtk.Adjustment({ lower: 4, upper: 32, step_increment: 1 }),
      value_pos: Gtk.PositionType.RIGHT,
      round_digits: 0
    })
    scale.connect('value-changed', (sw) => {
      let newVal = sw.get_value()
      if (newVal == settings.get_int('corner-radius')) return
      settings.set_int('corner-radius', newVal)
      updateLabel(newVal);
    })

    let val = settings.get_int('corner-radius')
    updateLabel(val)
    scale.set_value(val)
    hbox.append(label)
    hbox.append(scale)
    group.add(hbox)
    page.add(group)
    window.add(page)
  }
}

