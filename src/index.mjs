#!/usr/bin/env node

import axios from 'axios'
import { program } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import open from 'open'

async function getUserPresence (userID) {
  try {
    const response = await axios.get(`https://api.lanyard.rest/v1/users/${userID}`)
    return response.data
  } catch (error) {
    console.log()
    console.log(chalk.red('An error occurred fetching data from the Lanyard API.'))
    console.log()
    console.log('It is possible that this user ID is not in the Lanyard Discord server.')
    console.log('You need a user ID that is in: https://discord.gg/lanyard')
    console.log()
    throw new Error(chalk.red(`${error.message}`))
  }
}

function isCustomEmoji (emoji) {
  if (!emoji || typeof emoji !== 'object') return false
  return emoji.id && typeof emoji.id === 'string' && emoji.id.startsWith('<a:') === false
}

function formatDuration (duration) {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = Math.floor(duration % 60)
  if (hours > 0) {
    return `${hours}hr ${minutes}min ${seconds}sec`
  } else if (minutes > 0) {
    return `${minutes}min ${seconds}sec`
  } else {
    return `${seconds}sec`
  }
}

async function main () {
  program
    .name('discid')
    .description('Check a user\'s Discord status from the command line.')
    .usage('<userId> [--json]')
    .arguments('<userId>')
    .option('--json', 'Output the user\'s JSON Lanyard data')
    .option('--visit, --open', 'Visit the user\'s profile on Discord')
    .action(async (userID, options) => {
      try {
        const spinner = ora({
          text: chalk.blue('Fetching from Lanyard...'),
          spinner: 'earth'
        }).start()
        const presenceData = await getUserPresence(userID)
        spinner.stop()

        if (presenceData.success) {
          const user = presenceData.data

          if (options.json) { // --json option
            console.log(JSON.stringify(user, null, 2))
          } else if (options.visit || options.open) { // --visit or --open options
            await open(`https://discord.com/users/${userID}`)
            console.log(chalk.green(`Opened ${user.discord_user.username}'s profile in your browser!`))
          } else {
            let presenceInfo = `${user.discord_user.username}`

            if (user.discord_user.discriminator && user.discord_user.discriminator !== '0') {
              presenceInfo += `${chalk.cyan(`#${user.discord_user.discriminator}`)}`
            }

            presenceInfo += ' • '

            // Switches the text in the precenseInfo depending on the what the user.discord.status is
            switch (user.discord_status) {
              case 'online':
                presenceInfo += chalk.green('🟢 Online')
                break
              case 'idle':
                presenceInfo += chalk.yellow('🟡 Idle')
                break
              case 'dnd':
                presenceInfo += (`${chalk.red('🔴 Do Not Disturb')}`)
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
                case 0:
                  gameInfo = `${chalk.cyan('Playing:')} ${chalk.yellow(activity.name)}`
                  if (activity.details) {
                    gameInfo += ` • ${chalk.yellow(activity.details)}`
                  }
                  if (activity.timestamps && activity.timestamps.start) {
                    const startTime = new Date(activity.timestamps.start)
                    const endTime = activity.timestamps.end ? new Date(activity.timestamps.end) : new Date()
                    const duration = Math.abs(endTime - startTime) / 1000
                    gameInfo += ` • ${chalk.yellow(formatDuration(duration))}`
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
                    presenceInfo += `\n${chalk.cyan('Watching:')} ${chalk.yellow(activity.name)} ${chalk.yellow('•')} ${chalk.yellow(activity.details)}`
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

            console.log()
            console.log(presenceInfo)
            console.log()
          }
        } else {
          console.log('The presence of the user could not be found, or the API request failed.')
        }
      } catch (error) {
        console.error(error.message)
      }
    })

  program.parse(process.argv)

  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }
}

main()
