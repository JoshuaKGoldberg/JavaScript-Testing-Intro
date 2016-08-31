const Logger = require("./BadLogger").Logger;

/**
 * Generates numbers in the Fibonacci sequence.
 */
class Fibonacci {
    /**
     * Initializes a new instance of the Fibonacci class.
     */
    constructor() {
        this.cache = [0, 1];
    }

    /**
     * @param {number} n
     * @returns The 'n'th number in the Fibonacci sequence.
     */
    generate(n) {
        Logger.instance().log("Fibonacci::generate", n);

        if (this.cache[n] !== undefined) {
            Logger.instance().log("Fibonacci::generate", `${n} was already cached.`);
            return this.cache[n];
        }

        Logger.instance().log("Fibonacci::generate", `${n} was not yet cached.`);
        return this.cache[n] = this.generate(n - 1) + this.generate(n - 2);
    }

    /**
     * @returns Previously cached numbers in the Fibonacci sequence.
     */
    getCache() {
        return this.cache;
    }
}

module.exports.Fibonacci = Fibonacci;
