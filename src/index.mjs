#!/usr/bin/env node

import { program } from 'commander';
import { highlight } from 'cli-highlight';
import { getUserPresence, isCustomEmoji, formatDuration } from './utils.mjs';
import chalk from 'chalk';
import ora from 'ora';
import open from 'open';
import consola from 'consola';
import copy from 'clipboardy';

program
  .name('discid')
  .description('A command-line tool to check a user\'s Discord status using Lanyard.')
  .usage('[userId] [--option]')
  .arguments('[userId]')
  .option('--json', 'output the user\'s full lanyard data response in json format')
  .option('--visit, --open', 'visit the user\'s profile on Discord (any user)')
  .option('--kv', 'output the user\'s Lanyard key-value (KV) pairs')
  .action(async(userID, options) => {
    // Show an error if no userID is given
    if (!userID) {
      consola.error(chalk.red(`No user ID was provided. Specify a user's ID as the first argument to retrieve their status.`));
      process.exit(1);
    }

    try {
      // --json
      if (options.json) {
        const spinner = ora({
          text: chalk.blue('Fetching from Lanyard...'),
          spinner: 'arc',
          color: 'magenta'
        }).start();
        const presenceData = await getUserPresence(userID);
        spinner.stop();

        if (presenceData && presenceData.success) {
          const responseData = JSON.stringify(presenceData.data, null, 2);
          console.log(highlight(responseData, { language: 'json', theme: 'dracula' }));
          
          try {
            // Copy response to the clipboard in the background (just in case)
            await copy.write(responseData);
          } catch (error) {
            consola.error(new Error(chalk.red('An error occurred when copying response to clipboard:', error)));
          }
        } else {
          consola.error(new Error('The JSON could not be retrieved for this user.'));
        }
        return;
      }

      // --visit / --open
      if (options.visit || options.open) {
        const profileURL = `https://discord.com/users/${userID}`;
        await open(profileURL);
        console.log(chalk.green(`\n✔️ Opened profile in your default browser!\n`));
        return;
      }

      // --kv
      if (options.kv) {
        const spinner = ora({
          text: chalk.blue('Fetching from Lanyard...'),
          spinner: 'arc',
          color: 'magenta'
        }).start();
        const presenceData = await getUserPresence(userID);
        spinner.stop();

        if (presenceData && presenceData.success) {
          const user = presenceData.data;
          const kvPairs = Object.entries(user.kv || {});

          // Show error if key-value pairs are empty or 0
          if (kvPairs.length === 0 || Object.keys(kvPairs[0][1]).length === 0) {
            consola.error(chalk.red(`No key values found for this user. They most likely do not have any set.`));
          } else {
            console.log(chalk.bold.blue(`\nKV of ${user.discord_user.username}:\n`));
            for (const [key, value] of kvPairs) {
              console.log(`${chalk.cyan(key)}: ${value}`);
            }
          }
        } else {
          consola.error(new Error('An error occurred while retrieving key-value pairs:', error));
        }
        return;
      }

      // Normal fetching without any options
      const spinner = ora({
        text: chalk.blue('Fetching from Lanyard...'),
        spinner: 'arc',
        color: 'magenta'
      }).start();
      const presenceData = await getUserPresence(userID);
      spinner.stop();

      if (presenceData && presenceData.success) {
        const user = presenceData.data;

        // Username
        let presenceInfo = `${user.discord_user.username}`;

        // Discriminator (if user has one that isn't #0)
        if (user.discord_user.discriminator !== '0') {
          presenceInfo += `${chalk.cyan(`#${user.discord_user.discriminator}`)}`;
        }
        
        // Display Name
        if (user.discord_user.global_name) {
          presenceInfo += `${chalk.dim(` (${user.discord_user.global_name})`)}`;
        }

        presenceInfo += ' • ';

        // Switches the text in the `presenceInfo`
        // depending on the what the `user.discord.status` value is
        switch (user.discord_status) {
          case 'online':
            presenceInfo += chalk.hex('#00D26A')('🟢 Online');
            break;
          case 'idle':
            presenceInfo += chalk.hex('#FCD53F')('🟡 Idle');
            break;
          case 'dnd':
            presenceInfo += chalk.hex('#F8312F')('🔴 Do Not Disturb');
            break;
          default:
            presenceInfo += chalk.dim('Offline');
            break;
        }

        // Switches the platform depending on what the `user.active` value is
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

          // Platform (if there is at least one)
          if (platformInfo.length > 0) {
            presenceInfo += ` ${chalk.dim(`(${platformInfo.join(', ')})`)}`;
          }

        // Custom Status
        const customStatus = user.activities.find(activity => activity.type === 4);
        if (customStatus) {
          const customStatusText = customStatus.emoji && !isCustomEmoji(customStatus.emoji) 
            ? `${customStatus.emoji.name} ` 
            : '';
          const stateText = customStatus.state || '';

          // Only add to presenceInfo if there's more than just the emoji
          if (customStatusText || stateText) {
            presenceInfo += `\n${chalk.cyan('Status:')} ${customStatusText}${stateText}`;
          }
        }

        const watchedActivities = new Set();

        user.activities.forEach(activity => {
          let activityInfo = '';
        
          switch (activity.type) {
            case 0: // Playing a game
              activityInfo = `${chalk.cyan('Playing:')} ${activity.name}`;
        
              if (activity.details) activityInfo += ` • ${activity.details}`;
              if (activity.state) activityInfo += ` • ${activity.state}`;
        
              if (activity.timestamps?.start) {
                const startTime = new Date(activity.timestamps.start);
                const endTime = activity.timestamps.end ? new Date(activity.timestamps.end) : new Date();
                const duration = Math.abs(endTime - startTime) / 1000;
                activityInfo += ` • ${`for ${formatDuration(duration)}`}`;
              }
        
              presenceInfo += `\n${activityInfo}`;
              break;
        
            case 1: // Streaming
              presenceInfo += `\n${chalk.cyan('Streaming:')} ${`${activity.name} • ${activity.url}`}`;
              break;
        
            case 2: // Listening to Spotify
              if (user.listening_to_spotify && user.spotify) {
                const spotifyInfo = `${chalk.cyan('Listening To:')} ${user.spotify.song} by ${user.spotify.artist}`
        
                if (user.spotify.timestamps?.start && user.spotify.timestamps?.end) {
                  const endTime = new Date(user.spotify.timestamps.end);
                  const remainingTime = (endTime - Date.now()) / 1000;
                  presenceInfo += `\n${spotifyInfo} • ${`${formatDuration(remainingTime)} left`}`;
                } else {
                  presenceInfo += `\n${spotifyInfo}`;
                }
              }
              break;
        
            case 3: // Watching
              const activityKey = `${activity.type}-${activity.name}-${activity.details}`;

              if (!watchedActivities.has(activityKey)) {
                const details = activity.details ? ` • ${activity.details}` : '';
                const state = activity.state ? ` • ${activity.state}` : '';
                presenceInfo += `\n${chalk.cyan('Watching:')} ${activity.name}${details}${state}`;
                watchedActivities.add(activityKey);
              }
              break;
          }
        });

        presenceInfo += `\n${chalk.cyan('Avatar URL:')} ${
          user.discord_user.avatar 
            ? `https://api.lanyard.rest/${user.discord_user.id}.${user.discord_user.avatar.startsWith('a_') ? 'gif' : 'png'}`
            : chalk.red('Unknown')
        }`;

        console.log(`\n${presenceInfo}\n`);
      } else {
        consola.error(new Error('The presence of the user could not be retrieved.'));
      }
    } catch (error) {
      consola.error(new Error(`An error occurred: ${error.message}`));
    }
  });

program.parse(process.argv);
