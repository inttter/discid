import axios from 'axios';
import chalk from 'chalk';
import consola from 'consola';

export async function getUserPresence(userID) {
  try {
    const response = await axios.get(`https://api.lanyard.rest/v1/users/${userID}`);
    return response.data;
  } catch (error) {
    consola.error(new Error(chalk.red(`An error occurred fetching data from the Lanyard API: ${error.message}`)));
    process.exit(1);
  }
}

export function isCustomEmoji(emoji) {
  if (!emoji || typeof emoji !== 'object') return false;
  return emoji.id && typeof emoji.id === 'string' && !emoji.id.startsWith('<a:');
}

export function formatDuration(duration) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  if (hours > 0) {
    return `${hours}hr ${minutes}min ${seconds}sec`;
  } else if (minutes > 0) {
    return `${minutes}min ${seconds}sec`;
  } else {
    return `${seconds} seconds`;
  }
}
