import { MarkdownView, App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import getWordCount from "./getWordCount";

interface BeeminderWordCountSettings {
	userName: string,
	goalName: string,
	authToken: string,
	currentWordCnt: number,
	editingFileTitle: string,
    includePageTitle: boolean,
}

const DEFAULT_SETTINGS: BeeminderWordCountSettings = {
	userName: "",
	goalName: "",
	authToken: "",
	currentWordCnt: 0,
	editingFileTitle: "",
    includePageTitle: true,
}

export default class BeeminderWordCountPlugin extends Plugin {
	settings: BeeminderWordCountSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		this.addCommand({
			id: 'create-word-count-datapoint',
			name: 'Send word count to Beeminder',
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new BeeminderResponseModal(this.app, this.settings).open();
					}
					return true;
				}
				return false;
			}
		});

		this.registerInterval(
			window.setInterval(async () => {
				let activeLeaf = this.app.workspace.activeLeaf;
				let markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);

				if (!markdownView) {
					return;
				}

				let editor = markdownView.editor;
				if (editor.somethingSelected()) {
					let content: string = editor.getSelection();
					this.settings.editingFileTitle = activeLeaf.getDisplayText();
					this.settings.currentWordCnt = getWordCount(content);
				}
			}, 500)
		);

		this.addSettingTab(new BeeminderWordCountSettingTab(this.app, this));
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

class BeeminderResponseModal extends Modal {
	setting: BeeminderWordCountSettings;

	constructor(app: App, setting: BeeminderWordCountSettings) {
		super(app);
		this.setting = setting;
	}

	async onOpen() {
		let {contentEl} = this;
		const result = await this.createDataPoint();
		if (result.success) {
			contentEl.setText(`${this.setting.currentWordCnt} word count sent to Beeminder. Good work!`);
		} else {
			contentEl.setText(`Failed to create datapoint. ${result.body}`);
		}
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}

	// Thanks to https://github.com/jamiebrynes7/obsidian-todoist-plugin/blob/master/src/api/api.ts
	async createDataPoint() {
		const url = `https://www.beeminder.com/api/v1/users/${this.setting.userName}/goals/${this.setting.goalName}/datapoints.json`;

		let now = new Date();
		let formData = new FormData();
		formData.append('auth_token', this.setting.authToken);
		formData.append('value', `${this.setting.currentWordCnt}`);

        if (this.setting.includePageTitle) {
            formData.append('comment', `${now.toISOString()} - ${this.setting.editingFileTitle}`);
        } else {
            formData.append('comment', `${now.toISOString()}`);
        }

		const response = await fetch(url, {
			method: "POST",
			body: formData,
		});
		const text = await response.text();

		return {
			success: response.ok,
			body: text,
		}
	}
}

class BeeminderWordCountSettingTab extends PluginSettingTab {
	plugin: BeeminderWordCountPlugin;

	constructor(app: App, plugin: BeeminderWordCountPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for the Beeminder word count plugin'});

		this.createTextSetting('Beeminder auth_token', this.plugin.settings.authToken, (val: string) => this.plugin.settings.authToken = val, true);
		this.createTextSetting('Beeminder user name', this.plugin.settings.userName, (val: string) => this.plugin.settings.userName = val, false);
		this.createTextSetting('Beeminder goal name', this.plugin.settings.goalName, (val: string) => this.plugin.settings.goalName = val, false);
        
        this.createCheckboxSetting('Include page title as comment', this.plugin.settings.includePageTitle, (val: boolean) => this.plugin.settings.includePageTitle = val)
	}

	createTextSetting(name: string, initial : string, pluginFieldSetter: Function, secret: Boolean) {
		const callback = async (val: string) => {
			pluginFieldSetter(val);
			await this.plugin.saveSettings();
		}

        if (secret) {
    		return new Setting(this.containerEl)
    			.setName(name)
    			.addText(text => text
    				.setPlaceholder("auth_token")
    				.onChange(callback)
    			);
        } else {
            return new Setting(this.containerEl)
    			.setName(name)
    			.addText(text => text
    				.setValue(initial)
    				.onChange(callback)
    			);
        }
	}

    createCheckboxSetting(name: string, initial: boolean, pluginFieldSetter: Function) {
        const callback = async (val: boolean) => {
            pluginFieldSetter(val)
            await this.plugin.saveSettings()
        }
        new Setting(this.containerEl)
            .setName(name)
            .addToggle(val => val
                .setValue(initial)
                .onChange(callback)
            )
    }
}
