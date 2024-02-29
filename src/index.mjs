#!/usr/bin/env node

import axios from 'axios';
import { program } from 'commander';
import chalk from 'chalk';

async function getUserPresence(userID) {
    try {
        const response = await axios.get(`https://api.lanyard.rest/v1/users/${userID}`);
        return response.data;
    } catch (error) {
        console.log();
        console.log(chalk.red(`An error occurred fetching data from the Lanyard API.`));
        console.log();
        console.log(`It is possible that this user ID is not in the Lanyard Discord server.`);
        console.log(`You need a user ID that is in: https://discord.gg/lanyard`);
        console.log();
        throw new Error(chalk.red(`${error.message}`));
    }
}

function isCustomEmoji(emoji) {
    // if the emoji is a normal one such as 📂🌏💤, then it will show
    // both the emoji and the text in the status.
    //
    // if it's a custom guild / nitro emoji, it will just show the text in the status, 
    // to prevent the raw name of the custom emoji from showing alongside the user's status.
    if (!emoji || typeof emoji !== 'object') return false;
    return emoji.id && typeof emoji.id === 'string' && emoji.id.startsWith('<a:') === false;
}

async function main() {
    program
        .name('discid')
        .description('Check a user\'s Discord status from the command line.')
        .usage('<userId> [--json]')
        .arguments('<userId>')
        .option('--json', 'Output the user\'s JSON Lanyard data')
        .action(async (userID, options) => {
            try {
                const presenceData = await getUserPresence(userID);

                if (presenceData.success) {
                    const user = presenceData.data;

                    if (options.json) {
                        console.log(JSON.stringify(user, null, 2));
                    } else {
                        let presenceInfo = `${user.discord_user.username}`;

                        // mainly for bots / people who have not switched to the new username system (why?)
                        if (user.discord_user.discriminator && user.discord_user.discriminator !== '0') {
                            presenceInfo += `${chalk.cyan(`#${user.discord_user.discriminator}`)}`;
                        }
                        
                        presenceInfo += ` is `;

                        switch (user.discord_status) {
                            case 'online':
                                presenceInfo += chalk.green('Online');
                                break;
                            case 'idle':
                                presenceInfo += chalk.yellow('Idle');
                                break;
                            case 'dnd':
                                presenceInfo += (`on ${chalk.red('Do Not Disturb')}`);
                                break;
                            default:
                                presenceInfo += chalk.dim('Offline');
                                break;
                        }

                        const customStatus = user.activities.find(activity => activity.type === 4);
                        if (customStatus) {
                            let customStatusText = '';
                            if (customStatus.emoji && !isCustomEmoji(customStatus.emoji)) {
                                customStatusText = `${customStatus.emoji.name} `;
                            }
                            presenceInfo += `\n${chalk.magenta('Status:')} ${chalk.cyan(customStatusText)}${chalk.cyan(customStatus.state)}`;
                        }

                        const gameActivity = user.activities.find(activity => activity.type === 0);
                        if (gameActivity) {
                            presenceInfo += `\n${chalk.magenta('Playing:')} ${chalk.cyan(`${gameActivity.name}`)}`;
                            // Check if additional details are available for the game
                            if (gameActivity.details) {
                                presenceInfo += ` - ${chalk.yellow(gameActivity.details)}`;
                            }
                        }

                        if (user.listening_to_spotify && user.spotify) {
                            presenceInfo += `\n${chalk.magenta('Listening To:')} ${chalk.cyan(`${user.spotify.song}`)} by ${chalk.cyan(`${user.spotify.artist}`)} on ${chalk.cyan(`${user.spotify.album}`)}`;
                        }

                        const platformInfo = [];
                        if (user.active_on_discord_web) {
                            platformInfo.push('Web');
                        }
                        if (user.active_on_discord_desktop) {
                            platformInfo.push('Desktop');
                        }
                        if (user.active_on_discord_mobile) {
                            platformInfo.push('Mobile');
                        }
                        if (platformInfo.length > 0) {
                            presenceInfo += `\n${chalk.magenta('Platform:')} ${chalk.cyan(platformInfo.join(', '))}`;
                        }

                        console.log();
                        console.log(presenceInfo);
                        console.log();
                    }
                } else {
                    console.log('The presence of the user could not be found, or the API request failed.');
                }
            } catch (error) {
                console.error(error.message);
            }
        });

    program.parse(process.argv);

    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }
}

main();