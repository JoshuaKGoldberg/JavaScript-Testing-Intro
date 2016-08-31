/**
 * Logs messages to the internal telemetry database.
 */
class Logger {
    /**
     * Logs a message to the internal telemetry database.
     * 
     * @param {string} message   A message to log.
     * @param {...any[]} info   Any additional message information.
     */
    log(message, ...info) {
        // Magically save these to a database or whatnot. Use your imagination.
    }
}

module.exports.Logger = Logger;
