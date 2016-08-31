/**
 * Logs messages to the internal telemetry database.
 */
class Logger {
    /**
     * @returns The static singleton Logger instance.
     */
    static instance() {
        if (!Logger.singleton) {
            Logger.singleton = new Logger();
        }

        return Logger.singleton;
    }

    /**
     * Initializes a new instance of the Logger class.
     */
    constructor() {
        if (Logger.singleton) {
            throw new Error("Cannot re-create a singleton. Use Logger.instance() instead.");
        }
    }

    /**
     * Enables logging.
     */
    enable() {
        this.disabled = false;
    }

    /**
     * Disables logging.
     */
    disable() {
        this.disabled = true;
    }

    /**
     * Logs a message, if enabled.
     * 
     * @param {string} message   A message to log.
     * @param {...any[]} info   Any additional message information.
     */
    log(message, ...info) {
        if (this.disabled) {
            return;
        }

        // Magically save these to a database or whatnot. Use your imagination.
    }
}

module.exports.Logger = Logger;
