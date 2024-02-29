<div align="center">
<img src="https://github.com/inttter/inttter/assets/73017070/ca176360-4ceb-4a68-b55a-acf9473efe96" width="450">
</div>

# discid

A simple command-line tool to check a user's Discord status using Lanyard.

<div align="center">
<img src="https://github.com/inttter/discid/assets/73017070/0c33e42a-49e5-4120-89cd-994ff450d09c" width="750">
</div>

# Installation

```bash
npm install -g discid
```

# Usage

> [!IMPORTANT]
> This package uses [Lanyard](https://github.com/Phineas/lanyard) to fetch user status. In order for this to work, you must [join the Lanyard Discord server](https://discord.com/invite/lanyard) to track *your own* status, and if you want to track somebody else's status, *they* must be in the server. If the user you try searching for a user that is not in the server, you will get an error reminding you of this.

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
iinter is Online
Listening To: Duvet by bôa on Twilight
Platform: Desktop
```

as the status of the user is "Online" and listening to the song in question at the time the command was ran:

<div align="center">
<img src="https://github.com/inttter/discid/assets/73017070/fc9dcd40-b2e0-4da6-97e8-2a518336b988" width="250">
</div>

<br>

Other features of user status, such as [what a user is listening to on Spotify](https://github.com/inttter/inttter/assets/73017070/772bdd2a-e95d-4193-947d-8ddd3c709bb8), is supported. It shows the song name, artist, and album. [Game statuses are also supported](https://github.com/inttter/inttter/assets/73017070/3b9e937e-b768-4724-bc03-c665395d3954).

---

With [v1.2.0](https://github.com/inttter/discid/releases/tag/v1.2.0), more specific details about certain games are supported. This reads ```gameActivity.details``` and displays it next to the name of the game.

Here's two examples with Roblox using [Bloxstrap](https://github.com/pizzaboxer/bloxstrap), and the rhythm game [osu!](https://osu.ppy.sh):

| Roblox | osu! |
| ----------- | ----------- |
| <img src="https://github.com/inttter/discid/assets/73017070/4d29b801-8513-4e6a-a759-d5ed74aadbf9"> | <img src="https://github.com/inttter/discid/assets/73017070/5fecdb74-4864-4b95-989d-147e39c192df"> |

and this is how they show up on Discord:

| | |
| ----------- | ----------- |
| <img src="https://github.com/inttter/discid/assets/73017070/d47734ab-0d7e-4d05-8400-31c12d5d5c4a" width="250"> | <img src="https://github.com/inttter/discid/assets/73017070/205844f6-efc4-4259-b3a8-6fd006ac34cc" width="250"> |

> [!NOTE] 
> These only show up if the game in question has a ```gameActivity.details```. If not, only the name of the game will show.
>
> An example of where this would be in the JSON output is shown below:
> ```json
> "details": "kessoku band - Guitar to Kodoku to Aoi Hoshi [Ame's Insane]",
> ```

---

# Options

| Option  | Description |
| ----------- | ----------- |
| ```--json``` | Shows the formatted JSON output of the user from ```https://api.lanyard.rest/v1/users/:user_id```, replacing ```:user_id``` with the user ID you entered. |

---

# License

©️ Licensed under the [MIT License](https://github.com/inttter/discid/blob/main/LICENSE).