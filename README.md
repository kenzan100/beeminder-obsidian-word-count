## Obsidian Sample Plugin

This is a small plugin for Obsidian -> Beeminder word count integration.
- Obsidian https://obsidian.md
- Beeminder https://www.beeminder.com

## What it does
1. Once installed, it will register command called "Send word count to Beeminder".
2. When command is selected, it'll count the words in current editing file. **It will only count the actively selected area.***
3. It then sends the value to the Beeminder endpoint.

*For my use-case, I do not want to over report the word counts when I edit the same file over multiple days.

## Setup

- Installing the plugin will register new setting in Plugin Options tab.
- Go to that tab, enter following 3 values:
  - user name for your Beeminder account
  - goal name to which word count will be posted to, and 
  - auth_token specified by http://api.beeminder.com/#personal-authentication-token.


### Releasing new releases

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
