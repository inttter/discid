<div align="center">
<img src="https://github.com/inttter/inttter/assets/73017070/ca176360-4ceb-4a68-b55a-acf9473efe96" width="450">
</div>

# discid

A simple command-line tool to check a user's Discord status from the command line using Lanyard.

# Installation

```bash
npm install -g discid
```

# Usage

> [!IMPORTANT]
> This package uses [Lanyard](https://github.com/Phineas/lanyard) to fetch user status. In order for this to work, you must [join the Lanyard Discord server](https://discord.com/invite/lanyard) to track *your own* status, as well as anybody else's status. If the user you try searching for is not in the server, you will get an error reminding you of this.

```bash
discid <userId>
```

In order to find the ```<userId>``` of a user:

* Enable Developer mode by going to: **Settings** ➔ **Advanced** ➔ **Developer Mode**, and check the toggle.
* Right click on a user and click [```Copy User ID```](https://github.com/inttter/inttter/assets/73017070/0ffacc8d-06c9-4521-97eb-62295aa67b73)
* Go back to your command line and run ```discid <userId>``` replacing ```<userId>``` with the ID you copied.

For example:

```bash
discid 819287687121993768
```

Will return:

```bash
Lanyard is Online
```

as the status of the user is "Online" at the time of running the command:

<div align="center">
<img src="https://github.com/inttter/inttter/assets/73017070/417ca1c2-5265-4213-b857-1ba5470ba7cf" width="350">
</div>

<br>

Other features of user status, such as [what a user is listening to on Spotify](https://github.com/inttter/inttter/assets/73017070/772bdd2a-e95d-4193-947d-8ddd3c709bb8), is supported. It shows the song name and artist. [Game statuses are also supported](https://github.com/inttter/inttter/assets/73017070/3b9e937e-b768-4724-bc03-c665395d3954), although specific, game-specific things such as map or time in game, are not shown.

> [!NOTE]
> If you are listening to Spotify and also playing a game at the same time, it will prioritise the game and show that the user is playing the game first.

---
# License

©️ Licensed under the MIT License.