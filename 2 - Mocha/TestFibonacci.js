const Fibonacci = require("./Fibonacci").Fibonacci;

describe("Fibonacci", () => {
    describe("generate", () => {
        it("generates 0", () => {
            // Arrange
            const generator = new Fibonacci();

            // Act
            const generated = generator.generate(0);

            // Assert
            if (generated !== 0) {
                throw new Error("The 0th number should be 0.");
            }
        });

        it("generates 1", () => {
            // Arrange
            const generator = new Fibonacci();

            // Act
            const generated = generator.generate(1);

            // Assert
            if (generated !== 1) {
                throw new Error("The 1st number should be 1.");
            }
        });

        it("generates a large number", () => {
            // Arrange
            const generator = new Fibonacci();

            // Act
            const generated = generator.generate(7);

            // Assert
            if (generated !== 13) {
                throw new Error("The 7th number should be 13.");
            }
        });
    });
});
