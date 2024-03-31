<div align="center">
<img src="https://github.com/inttter/inttter/assets/73017070/ca176360-4ceb-4a68-b55a-acf9473efe96" width="450">
</div>

# discid

A simple command-line tool to check a user's Discord status using Lanyard.

<div align="center">
<img src="https://github.com/inttter/discid/assets/73017070/0ba576f5-b0b3-48fb-91a2-c90525ccf0ee" width="550">
</div>

# Installation

```bash
npm install -g discid
```

# Usage

> [!IMPORTANT]
> The user must be [in the Lanyard Discord server](https://discord.com/invite/lanyard). If the user you try searching for a user that is not in the server, you will get an error reminding you of this.

```bash
discid <userId>
```

In order to find the ```<userId>``` of a user:

* Enable Developer mode by going to: **Settings** ➔ **Advanced** ➔ **Developer Mode**, and check the toggle.
* Right click on a user and click [```Copy User ID```](https://github.com/inttter/inttter/assets/73017070/0ffacc8d-06c9-4521-97eb-62295aa67b73)
* Go back to your command line and run ```discid <userId>``` replacing ```<userId>``` with the ID you copied.

For example:

```bash
discid 514106760299151372
```

might return something like:

```bash
iinter • 🟢 Online
Listening To: Duvet by bôa on Twilight
Platform: Desktop
Avatar URL: https://cdn.discordapp.com/avatars/514106760299151372/d14e90a16144987f53f5a3700aacc934.png
```

as the status of the user is "Online" and listening to the song in question at the time the command was ran:

<div align="center">
<img src="https://github.com/inttter/discid/assets/73017070/fc9dcd40-b2e0-4da6-97e8-2a518336b988" width="250">
</div>

<br>

For more in-depth information about what can be displayed, check out [this section](https://iinter.me/blog/using-discid#what-else) of the blog post I made.

# Options

| Option  | Description |
| ----------- | ----------- |
| ```--json``` | Shows the formatted JSON output of the user from ```https://api.lanyard.rest/v1/users/:user_id```, replacing ```:user_id``` with the user ID you entered. |
| ```--visit```, ```--open``` | Opens the user's profile on the Discord website. |
| ```--kv``` | Output's the user's Lanyard key-value pairs (see [here](https://github.com/Phineas/lanyard?tab=readme-ov-file#kv)). |

---

# License

©️ Licensed under the [MIT License](https://github.com/inttter/discid/blob/master/LICENSE).