const expect = require("chai").expect;
const Logger = require("./Logger").Logger;

describe("Logger", () => {
    describe("sendLogs", () => {
        it("Sends a single log", () => {
            // Arrange
            let logged;
            const logger = new Logger(
                senderLogged => {
                    logged = senderLogged;
                });

            // Act
            logger.log("foo", "bar");
            logger.sendLogs();

            // Assert
            expect(logged).to.be.deep.equal([
                {
                    message: "foo",
                    info: ["bar"]
                }
            ]);
        });
    });
});
