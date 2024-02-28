#!/usr/bin/env node

import axios from 'axios';
import { program } from 'commander';
import chalk from 'chalk';

async function getUserPresence(userID) {
    try {
        const response = await axios.get(`https://api.lanyard.rest/v1/users/${userID}`);
        return response.data;
    } catch (error) {
        throw new Error(`An error occurred fetching data from the Lanyard API: ${error.message}`);
    }
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
                        console.log(JSON.stringify(user, null, 2)); // Output JSON data
                    } else {
                        let presenceInfo = `${user.discord_user.username} is `;

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

                        const gameActivity = user.activities.find(activity => activity.type === 0);
                        if (gameActivity) {
                            presenceInfo += `\n${chalk.magenta('Playing:')} ${chalk.cyan(`${gameActivity.name}`)}`;
                        }

                        if (user.listening_to_spotify && user.spotify) {
                            presenceInfo += `\n${chalk.magenta('Listening To:')} ${chalk.cyan(`${user.spotify.song}`)} by ${chalk.cyan(`${user.spotify.artist}`)} on ${chalk.cyan(`${user.spotify.album}`)}`;
                        }

                        if (user.active_on_discord_web) {
                            presenceInfo += `\n${chalk.magenta('Platform:')} ${chalk.cyan('Web')}`;
                        }
                        if (user.active_on_discord_desktop) {
                            presenceInfo += `\n${chalk.magenta('Platform:')} ${chalk.cyan('Desktop')}`;
                        }
                        if (user.active_on_discord_mobile) {
                            presenceInfo += `\n${chalk.magenta('Platform:')} ${chalk.cyan('Mobile')}`;
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