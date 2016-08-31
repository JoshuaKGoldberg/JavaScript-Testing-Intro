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
        if (this.cache[n] !== undefined) {
            return this.cache[n];
        }

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
