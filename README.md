<div align="center">
  <img src="https://github.com/inttter/discid/assets/73017070/c37fde61-3d46-4b9f-9ce5-b0bbe1f54e0d" width="450">
</div>

# discid

[![Downloads](https://img.shields.io/npm/dw/discid.svg?style=flat&colorA=black&colorB=5865F2)](https://npmjs.org/package/discid)
[![Version](https://img.shields.io/npm/v/discid.svg?style=flat&colorA=black&colorB=5865F2)](https://www.npmjs.com/package/discid)
[![License](https://shields.io/github/license/inttter/discid?labelColor=black&colorB=5865F2)](https://github.com/inttter/discid/blob/master/LICENSE/)
[![Post](https://img.shields.io/badge/read-post-f39f37?labelColor=black&colorB=5865F2)](https://iinter.me/writing/using-discid)

A simple command-line tool to check a user's Discord status using [Lanyard](https://github.com/Phineas/lanyard), and get an output in a readable format.

<div align="center">
  <img src="https://github.com/inttter/discid/assets/73017070/1cb1a0df-e562-4fdc-ae11-e9a0be7e8ef8" width="750" alt="Example of running command">
</div>

# Installation

```bash
npm install -g discid
```

# Usage

> [!IMPORTANT]
> The user must be in the [Lanyard Discord server](https://discord.com/invite/lanyard) in order to retrieve information about the user.

```bash
discid [userID]
```

You will need to replace `[userID]` with the ID of the user you are trying to fetch the status of. If you want an guide with images, visit [this section](https://iinter.me/writing/using-discid#how-do-you-find-a-user-id) of my post, otherwise, you can follow these steps.

1. Enable Developer mode by going to **Settings** ➔ **Advanced** ➔ **Developer Mode**, and check the toggle.

2.  Right click on a user and click the [`Copy User ID`](https://iinter.me/images/using-discid/copy-user-id.png) button.

3. Go back to your command line and run the same command from above, replacing `[userID]` with the ID you copied.

For example, to check the status of the user 'iinter', you can run the following command:

```bash
discid 514106760299151372
```

Depending on what the user is doing, the otuput might return different things. Here is an example of what may be retuned:

```bash
iinter • 🟢 Online
Listening To: Duvet by bôa on Twilight
Platform: Desktop
Avatar URL: https://cdn.discordapp.com/avatars/514106760299151372/d14e90a16144987f53f5a3700aacc934.png
```

These are returned because the status of the user is set to **'Online'** and they are listening to the song **'Duvet'** by **'bôa'** at the time the command was ran.

<div align="center">
  <img src="https://github.com/inttter/discid/assets/73017070/fc9dcd40-b2e0-4da6-97e8-2a518336b988" width="250" alt="Discord profile">
</div>

<br>

To see everything that can be displayed and more detailed information, read [this section](https://iinter.me/writing/using-discid#what-else) of my post.

# Options

| Option  | Description |
| ----------- | ----------- |
| `--json` | Shows a formatted JSON output of information about the user from `https://api.lanyard.rest/v1/users/:user_id`, replacing `:user_id` with the user ID you entered. |
| `--visit`, `--open` | Opens the user's profile on the Discord website (in your browser). |
| `--kv` | Output's the user's Lanyard key-value pairs (see [here](https://github.com/Phineas/lanyard?tab=readme-ov-file#kv) for more information). |

---

# License

©️ **2024** - Licensed under the [MIT License](https://github.com/inttter/discid/blob/master/LICENSE).