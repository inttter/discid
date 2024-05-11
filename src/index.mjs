#!/usr/bin/env node

import axios from 'axios'
import { program } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import open from 'open'
import consola from 'consola'

async function getUserPresence(userID) {
    try {
        const response = await axios.get(`https://api.lanyard.rest/v1/users/${userID}`)
        return response.data
    } catch (error) {        
        console.log()
        consola.error(new Error(chalk.red(`An error occurred fetching data from the Lanyard API: ${error.message}`)))
        process.exit(1) // to prevent from infinitely running
    }
}

function isCustomEmoji(emoji) {
    if (!emoji || typeof emoji !== 'object') return false
    return emoji.id && typeof emoji.id === 'string' && !emoji.id.startsWith('<a:')
}

function formatDuration(duration) {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = Math.floor(duration % 60)
    if (hours > 0) {
        return `${hours}hr ${minutes}min ${seconds}sec`
    } else if (minutes > 0) {
        return `${minutes}min ${seconds}sec`
    } else {
        return `${seconds} seconds`
    }
}

async function main() {
    program
        .name('discid')
        .description('Check a user\'s Discord status from the command line.')
        .usage('<userId> [--option]')
        .arguments('<userId>')
        .option('--json', 'output the user\'s full lanyard data in json format')
        .option('--visit, --open', 'visit the user\'s profile on Discord')
        .option('--kv', 'output the user\'s Lanyard key-value pairs')
        .action(async(userID, options) => {
            try {
                if (options.json) {
                    const spinner = ora({
                        text: chalk.blue('Fetching from Lanyard...'),
                        spinner: 'earth'
                    }).start()
                    const presenceData = await getUserPresence(userID)
                    spinner.stop()

                    if (presenceData && presenceData.success) {
                        console.log(JSON.stringify(presenceData.data, null, 2))
                    } else {
                        consola.error(new Error('The presence of the user could not be found, or the API request failed.'))
                    }
                    return
                }

                if (options.visit || options.open) {
                    const profileURL = `https://discord.com/users/${userID}`
                    await open(profileURL)
                    console.log(chalk.green(`\n✅ Opened this user's profile in your browser!\n`))
                    return // Exit early
                }

                if (options.kv) {
                  const spinner = ora({
                      text: chalk.blue('Fetching from Lanyard...'),
                      spinner: 'earth'
                  }).start();
                  const presenceData = await getUserPresence(userID);
                  spinner.stop();
                
                  if (presenceData && presenceData.success) {
                      const user = presenceData.data;
                      const kvPairs = Object.entries(user.kv || {});
                
                      if (kvPairs.length === 0 || Object.keys(kvPairs[0][1]).length === 0) {
                          consola.error(new Error(chalk.red(`Could not find any key-value pairs from this user. They most likely do not have any set.`)));
                      } else {
                          console.log(chalk.bold.blue(`\nKV of ${user.discord_user.username}:\n`));
                          for (const [key, value] of kvPairs) {
                              console.log(`${chalk.cyan(key)}: ${chalk.yellow(value)}`);
                          }
                      }
                  } else {
                      consola.error(new Error('The presence of the user could not be retrieved.'));
                  }
                  return;
              }

                const spinner = ora({
                    text: chalk.blue('Fetching from Lanyard...'),
                    spinner: 'earth'
                }).start()
                const presenceData = await getUserPresence(userID)
                spinner.stop()

                if (presenceData && presenceData.success) {
                    const user = presenceData.data

                    let presenceInfo = `${user.discord_user.username}`

                    if (user.discord_user.discriminator !== '0') {
                        presenceInfo += `${chalk.cyan(`#${user.discord_user.discriminator}`)}`
                    }

                    presenceInfo += ' • '

                    // Switches the text in the presenceInfo depending on the what the user.discord.status is
                    switch (user.discord_status) {
                        case 'online':
                            presenceInfo += chalk.hex('#00D26A')('🟢 Online')
                            break
                        case 'idle':
                            presenceInfo += chalk.hex('#FCD53F')('🟡 Idle')
                            break
                        case 'dnd':
                            presenceInfo += (`${chalk.hex('#F8312F')('🔴 Do Not Disturb')}`)
                            break
                        default:
                            presenceInfo += chalk.dim('Offline')
                            break
                    }

                    // Case 4: Custom Status
                    const customStatus = user.activities.find(activity => activity.type === 4)
                    if (customStatus) {
                        let customStatusText = ''
                        if (customStatus.emoji && !isCustomEmoji(customStatus.emoji)) {
                            customStatusText = `${customStatus.emoji.name} `
                        }
                        const stateText = customStatus.state ? chalk.yellow(customStatus.state) : ''
                        presenceInfo += `\n${chalk.cyan('Status:')} ${stateText ? `${chalk.yellow(customStatusText)}${stateText}` : customStatusText}`
                    }

                    const watchedActivities = new Set()

                    // All the user activities are here:
                    // ----------------------------------
                    // Case 0: Playing a game
                    // Case 1: Streaming on a platform (ie. Twitch)
                    // Case 2: Listening to a song on Spotify
                    // Case 3: Watching something (ie. an anime on Crunchyroll)
                    // Case 4 is a custom status, see above these comments.
                    user.activities.forEach(activity => {
                        let gameInfo
                        switch (activity.type) {
                            case 0: // Playing a game
                                gameInfo = `${chalk.cyan('Playing:')} ${chalk.yellow(activity.name)}`
                                if (activity.details) {
                                    gameInfo += ` • ${chalk.yellow(activity.details)}`
                                }
                                if (activity.state) {
                                    gameInfo += ` • ${chalk.yellow(activity.state)}`
                                }
                                if (activity.timestamps && activity.timestamps.start) {
                                    const startTime = new Date(activity.timestamps.start)
                                    const endTime = activity.timestamps.end ? new Date(activity.timestamps.end) : new Date()
                                    const duration = Math.abs(endTime - startTime) / 1000
                                    gameInfo += ` • ${chalk.yellow(`for ${formatDuration(duration)}`)}`;
                                }
                                presenceInfo += `\n${gameInfo}`
                                break
                            case 1: // Streaming
                                presenceInfo += `\n${chalk.cyan('Streaming:')} ${chalk.yellow(activity.name)} ${chalk.yellow('@')} ${chalk.yellow(activity.url)}`
                                break
                            case 2: // Listening to Spotify
                                if (user.listening_to_spotify && user.spotify) {
                                    let spotifyInfo = `${chalk.cyan('Listening To:')} ${chalk.yellow(`${user.spotify.song}`)} ${chalk.yellow('by')} ${chalk.yellow(`${user.spotify.artist}`)} ${chalk.yellow('on')} ${chalk.yellow(`${user.spotify.album}`)}`
                                    if (user.spotify.timestamps && user.spotify.timestamps.start && user.spotify.timestamps.end) {
                                        const endTime = new Date(user.spotify.timestamps.end)
                                        const remainingTime = (endTime - Date.now()) / 1000
                                        spotifyInfo += ` • ${chalk.yellow(formatDuration(remainingTime))} ${chalk.yellow('left')}`
                                    }
                                    presenceInfo += `\n${spotifyInfo}`
                                }
                                break
                            case 3: // Watching
                                const activityKey = `${activity.type}-${activity.name}-${activity.details}`
                                if (!watchedActivities.has(activityKey)) {
                                    let details = activity.details ? ` • ${chalk.yellow(activity.details)}` : ''; // check if details exist first
                                    presenceInfo += `\n${chalk.cyan('Watching:')} ${chalk.yellow(activity.name)}${details}`; // Include details if available
                                    watchedActivities.add(activityKey)
                                }
                                break
                        }
                    })

                    // Switches the platform depending on which user.active_... is active
                    const platformInfo = []
                    if (user.active_on_discord_web) {
                        platformInfo.push('Web')
                    }
                    if (user.active_on_discord_desktop) {
                        platformInfo.push('Desktop')
                    }
                    if (user.active_on_discord_mobile) {
                        platformInfo.push('Mobile')
                    }
                    if (platformInfo.length > 0) {
                        presenceInfo += `\n${chalk.cyan('Platform:')} ${chalk.yellow(platformInfo.join(', '))}`
                    }

                    presenceInfo += `\n${chalk.cyan('Avatar URL:')} ${user.discord_user.avatar ? chalk.yellow(`https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}.png`) : 'Not Available'}`;

                    console.log(`\n${presenceInfo}\n`)
                } else {
                    consola.error(new Error('The presence of the user could not be retrieved.'));
                }
            } catch (error) {
                consola.error(new Error(`An error occurred: ${error.message}`));
            }
        })

    program.parse(process.argv)

    if (!process.argv.slice(2).length) {
        program.outputHelp()
    }
}

main()