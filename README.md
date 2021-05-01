## Obsidian Sample Plugin

This is a small plugin for Obsidian -> Beeminder word count integration.
- Obsidian https://obsidian.md
- Beeminder https://www.beeminder.com

1. Once installed, it will register command "Send word count to Beeminder".
2. When command is selected, it'll count the words in current editing file.
3. It then sends the value to the Beeminder endpoint.

## Setup

Installing the plugin will appear "Setting" section.
There, please enter user name, goal name, and auth_token specified by http://api.beeminder.com/#personal-authentication-token.
This will work with personal auth_token.

### Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments.
- Publish the release.

### Adding your plugin to the community plugin list

- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

### API Documentation

See https://github.com/obsidianmd/obsidian-api
