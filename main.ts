import { App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MyPluginSettings {
	userName: string,
	goalName: string,
	authToken: string,
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	userName: "Alice",
	goalName: "weight",
	authToken: "",
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		this.addCommand({
			id: 'create-word-count-datapoint',
			name: 'Send word count to Beeminder',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new SampleModal(this.app, this.settings).open();
					}
					return true;
				}
				return false;
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		});
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	setting: MyPluginSettings;

	constructor(app: App, setting: MyPluginSettings) {
		super(app);
		this.setting = setting;
	}

	async onOpen() {
		let {contentEl} = this;
		await this.createDataPoint();
		contentEl.setText('Data point sent to Beeminder. Good work!');
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}

	async createDataPoint() {
		const url = `https://www.beeminder.com/api/v1/users/${this.setting.userName}/goals/${this.setting.goalName}/datapoints.json`;

		let formData = new FormData();
		formData.append('auth_token', this.setting.authToken);
		formData.append('value', '10');
		formData.append('comment', new Date().toISOString());

		const result = await fetch(url, {
			method: "POST",
			body: formData,
		});

		if (!result.ok) {
			new Notice("Failed to create datapoint")
		}
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		this.createSetting('Beeminder auth_token', (val: string) => this.plugin.settings.authToken = val, true);
		this.createSetting('Beeminder user name', (val: string) => this.plugin.settings.userName = val, false);
		this.createSetting('Beeminder goal name', (val: string) => this.plugin.settings.goalName = val, false);
	}

	createSetting(name: string, pluginFieldSetter: Function, secret: Boolean) {
		const callback = async (val: string) => {
			pluginFieldSetter(val);
			await this.plugin.saveSettings();
		}
		new Setting(this.containerEl)
			.setName(name)
			.addText(text => text
				.setValue('').onChange(callback)
			);
	}
}
