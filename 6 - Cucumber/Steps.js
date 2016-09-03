const expect = require("chai").expect;
const Fibonacci = require("./Fibonacci").Fibonacci;
const Logger = require("./Logger").Logger;

module.exports = function () {
    this.Given("I have a new Fibonacci generator", function () {
        this.logger = new Logger();
        this.generator = new Fibonacci(this.logger);
    });

    this.When(/^I generate the number (\d+)$/, function (value) {
        this.generated = this.generator.generate(value);
    });

    this.Then(/^a log should say "(.+)"$/, function (message) {
        const messages = this.logger.getLogs()
            .map(log => log.info[0]);

        expect(messages).to.contain(
            message,
            `The message '${message}' was not found in the logs.`);
    });
};
