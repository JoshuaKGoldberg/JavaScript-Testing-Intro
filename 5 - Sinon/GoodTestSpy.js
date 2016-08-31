const expect = require("chai").expect;
const sinon = require("sinon");
const Logger = require("./Logger").Logger;

describe("Logger", () => {
    describe("sendLogs", () => {
        it("Sends a single log", () => {
            // Arrange
            const spy = sinon.spy();
            const logger = new Logger(spy);

            // Act
            logger.log("foo", "bar");
            logger.sendLogs();

            // Assert
            expect(spy.args[0][0]).to.be.deep.equal([
                {
                    message: "foo",
                    info: ["bar"]
                }
            ]);
        });
    });
});
