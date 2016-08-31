const Fibonacci = require("./Fibonacci").Fibonacci;

module.exports = function () {
    this.Given("I have a new Fibonacci generator", function () {
        this.generator = new Fibonacci();
    });

    this.When(/^I generate the number (\d+)$/, function (value) {
        this.generated = this.generator.generate(value);
    });

    this.Then(/^A log should say (.+)$/, function (message) {
        this.assertLogMessageExists(message);
    });
};
