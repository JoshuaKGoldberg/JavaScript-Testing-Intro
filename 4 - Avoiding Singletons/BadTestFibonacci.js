const expect = require("chai").expect;
const Fibonacci = require("./BadFibonacci").Fibonacci;

describe("Fibonacci", () => {
    describe("generate", () => {
        it("generates 0", () => {
            // Arrange
            const generator = new Fibonacci();

            // Act
            const generated = generator.generate(0);

            // Assert
            expect(generated).to.be.equal(0, "The 0th number should be 0.");
        });

        it("generates 1", () => {
            // Arrange
            const generator = new Fibonacci();

            // Act
            const generated = generator.generate(1);

            // Assert
            expect(generated).to.be.equal(1, "The 1st number should be 1.");
        });

        it("generates a large number", () => {
            // Arrange
            const generator = new Fibonacci();

            // Act
            const generated = generator.generate(7);

            // Assert
            expect(generated).to.be.equal(13, "the 7th number should be 13.");
        });
    });

    describe("cache", () => {
        it("caches numbers", () => {
            // Arrange
            const generator = new Fibonacci();

            // Act
            generator.generate(7);
            const cache = generator.getCache();

            // Assert
            expect(cache).to.be.deep.equal(
                [0, 1, 1, 2, 3, 5, 8, 13],
                "Fibonacci numbers should have been cached.");
        });
    });
});
