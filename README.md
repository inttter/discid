<div align="center">
  <img src="https://github.com/inttter/discid/assets/73017070/c37fde61-3d46-4b9f-9ce5-b0bbe1f54e0d" width="450">

[![Downloads](https://img.shields.io/npm/dw/discid.svg?style=flat&colorA=black&colorB=5865F2)](https://npmjs.org/package/discid)
[![Version](https://img.shields.io/npm/v/discid.svg?style=flat&colorA=black&colorB=5865F2)](https://www.npmjs.com/package/discid)
[![License](https://shields.io/github/license/inttter/discid?labelColor=black&colorB=5865F2)](https://github.com/inttter/discid/blob/master/LICENSE/)
[![Post](https://img.shields.io/badge/read-post-f39f37?labelColor=black&colorB=5865F2)](https://iinter.me/writing/using-discid)

A simple command-line tool to check a user's Discord status using [Lanyard](https://github.com/Phineas/lanyard) and get an output in a readable format.

<div align="center">
  <img src="https://github.com/user-attachments/assets/cb8196a5-2ffe-4c3d-83e2-5b110cb96d0b" width="750" alt="Example of running command">
</div>

</div>

# Installation

To run `discid` on your machine, install it using npm:

```bash
npm install -g discid
```

# Usage

> [!IMPORTANT]
> The user must be in the [Lanyard Discord server](https://discord.com/invite/lanyard) in order to retrieve information about them.

```bash
discid [userID]
```

You will need to replace `[userID]` with the ID of the user you are trying to fetch the status of. To find the ID of a user, you can follow a [guide with images](https://iinter.me/writing/using-discid#how-do-you-find-a-user-id), or you can follow the steps below:

1. Enable Developer Mode by going to **Settings** ➔ **Advanced** ➔ **Developer Mode**, and check the toggle to be on.

2.  Right click on a user and click the [`Copy User ID`](https://iinter.me/images/using-discid/copy-user-id.png) button.

3. Go back to your command line and run the same command from above, replacing `[userID]` with the ID you copied.

For example, to check the status of the user `iinter`, you can run the following command:

```bash
discid 514106760299151372
```

Depending on what the user is doing, you may get different outputs. Here is an example of what might be returned:

```bash
lunar (iinter) • 🟢 Online (Desktop)
Listening To: Never More by Shihoko Hirata • 3min 42sec left
Avatar URL: https://api.lanyard.rest/514106760299151372.png
```

To see everything that can be displayed and for slightly more information, see [this page](https://iinter.me/writing/using-discid#what-else).

# Options

| Option  | Description |
| ----------- | ----------- |
| `--json` | Shows a formatted, syntax-highlighted JSON response of information about the user from `https://api.lanyard.rest/v1/users/:user_id`, replacing `:user_id` with the user ID you entered. |
| `--visit`, `--open` | Opens the user's profile on the Discord website (in your browser). **This works with any user on Discord.** |
| `--kv` | Displays the user's Lanyard key-value (KV) pairs (see [here](https://github.com/Phineas/lanyard?tab=readme-ov-file#kv) for more information). |

---

# License

© **2025** - Licensed under the [MIT License](https://github.com/inttter/discid/blob/master/LICENSE).
