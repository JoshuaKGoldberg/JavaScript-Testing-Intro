/**
 * Logs messages to the internal telemetry database.
 */
class Logger {
    /**
     * Initializes a new instance of the Logger class.
     * 
     * @param {Function} sender   Sends logs to the internal telemetry database.
     */
    constructor(sender) {
        this.sender = sender;
        this.logs = [];
    }
    /**
     * Queues a message to be logged.
     * 
     * @param {string} message   A message to log.
     * @param {...any[]} info   Any additional message information.
     */
    log(message, ...info) {
        this.logs.push({ message, info });
    }

    /**
     * Sends logs to the internal telemetry database.
     */
    sendLogs() {
         this.sender(this.logs);
         this.logs = [];
    }
}

module.exports.Logger = Logger;
