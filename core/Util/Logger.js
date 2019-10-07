/* eslint-disable no-console */
const chalk = require('chalk');
const moment = require('moment');
const Util = require('./Util');

class Logger {
  constructor() {
    throw new Error(`${this.constructor.name} class cannot be instantiated`);
  }

  static time() {
    return moment().format('HH:mm:ss');
  }

  static log(style, name, message, stacktrace) {
    if (typeof style !== 'function') {
      Logger.log(chalk.white, 'Logger', 'Missing Style Type');
      style = chalk.white;
    }

    // Log Multiple
    if (Array.isArray(message)) {
      for (const item of message) console.log(style.bold(`[${Logger.time()} ${Util.toUpper(name)}]`), style(item));
      return false;
    }

    // Log Stacktrace
    if (stacktrace) {
      console.log(style.bold(`[${Logger.time()} ${Util.toUpper(name)}]`), style(message));
      return console.trace(message);
    }

    // Log Normally
    message = typeof message === 'string' ? message.replace(/\r?\n|\r/g, ' ') : message;
    return console.log(style.bold(`[${Logger.time()} ${Util.toUpper(name)}]`), style(message));
  }

  static success(name = 'Success', message) {
    return Logger.log(chalk.green, name, message);
  }

  static info(name = 'Info', message) {
    return Logger.log(chalk.blue, name, message);
  }

  static warn(name = 'Warning', message) {
    return Logger.log(chalk.yellow, name, message);
  }

  static error(name = 'Error', message, stacktrace) {
    return Logger.log(chalk.red, name, message, stacktrace);
  }

  static fatal(name = 'Fatal', message, stacktrace) {
    throw Logger.log(chalk.bgRed.white, name, message, stacktrace);
  }

  static debug(name = 'Debug', message) {
    return Logger.log(chalk.magenta, name, message);
  }
}

module.exports = Logger;
