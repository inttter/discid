#!/usr/bin/env node

import axios from 'axios';
import { program } from 'commander';
import chalk from 'chalk';

async function getUserPresence(userID) {
    try {
        const response = await axios.get(`https://api.lanyard.rest/v1/users/${userID}`); // fetches from lanyard here
        return response.data;
    } catch (error) {
        console.error(`An error occurred fetching data from the Lanyard API.`);
        console.log();
        console.log(`Most likely, the user you tried to find the status of is not in the ${chalk.cyanBright('Lanyard Discord server')}.`);
        console.log(`You must enter a ${chalk.blue('Discord ID')} of a user which is in the server.`)
        console.log();
        throw error;
    }
}

async function main() {
    program
        .name('discid')
        .description('Check a user\'s Discord status from the command line.')
        .usage('<userId>')
        .arguments('<userId>')
        .action(async (userID) => {
            try {
                const presenceData = await getUserPresence(userID);

                if (presenceData.success) {
                    const user = presenceData.data;
                    let presenceInfo = '';

                    switch (user.discord_status) {
                        case 'online':
                            presenceInfo = chalk.green('Online');
                            break;
                        case 'idle':
                            presenceInfo = chalk.yellow('Idle');
                            break;
                        case 'dnd':
                            presenceInfo = (`on ${chalk.red('Do Not Disturb')}`);
                            break;
                        default:
                            presenceInfo = chalk.dim('Offline');
                            break;
                    }

                    if (user.listening_to_spotify && user.spotify) {
                        presenceInfo += `, listening to ${chalk.cyan(`${user.spotify.song}`)} by ${chalk.cyan(`${user.spotify.artist}`)}`;
                    }

                    const gameActivity = user.activities.find(activity => activity.type === 0);
                    if (gameActivity) {
                        presenceInfo += `, playing ${chalk.cyan(`${gameActivity.name}`)}`;
                    }

                    console.log(`${user.discord_user.username} is ${presenceInfo}`);
                } else {
                    console.log('The presence of the user could not be found, or the API request failed.');
                }
            } catch (error) {
                console.error(error.message);
            }
        })
        .parse(process.argv);

    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }
}

main();