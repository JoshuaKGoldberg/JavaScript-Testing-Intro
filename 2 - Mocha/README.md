# Mocha

Before we can write our tests, we need something to run the tests for us.
Every platform has a bunch of these tools; within JavaScript, one of the popular ones is [Mocha](https://mochajs.org).

> Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases. Hosted on [GitHub](https://github.com/mochajs/mocha).

## Installation

```
npm install --global mocha
```

You can now run the `mocha` command on a JavaScript file to run tests within it.
Mocha adds the `describe` and `it` methods globally when running the file.
Both `describe` and `it` take in a string description and a callback method.

* **`describe`** - Creates a group of tests. You can create sub-groups and/or tests within that group.
* **`it`** - Creates a test.

A `TestFibonacci.js` file is in this folder.
Try running `mocha` on it!

```cmd
mocha "2 - Mocha/TestFibonacci.js"
```

```
  Fibonacci
    generate
      √ generates 0
      √ generates 1
      √ generates a large number


  3 passing (..ms)
```


## Usage

We'll learn through example.
Let's start with a simple `Fibonacci` class and get more complicated later.

```javascript
/**
 * Generates numbers in the Fibonacci sequence.
 */
class Fibonacci {
    /**
     * @param {number} n
     * @returns The 'n'th number in the Fibonacci sequence.
     */
    generate(n) {
        if (n < 2) {
            return n;
        }

        return this.generate(n - 1) + this.generate(n - 2);
    }
}
```

Now let's write a couple simple tests to make sure we get the right values.

Mocha loves the idea of grouping tests.
We create groups using `describe` and within them create tests using `it`.

```javascript
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
```

## Test arrangement

It's not a coincidence that `"it"` + each test name reads like plain English.
Good tests should *clearly* and *concisely* describe exactly *what* they're testing.

### AAA

I love the AAA testing pattern:

* **Arrange** - set up your testing environment
* **Act** - perform some action
* **Assert** - validate that it went well

Obeying some pattern like AAA helps keep tests logical and organized.
AAA is particularly good at enforcing the great idea that *a unit test should only test one thing*.
If you start to test multiple things in a unit test then it's no longer a unit test.
It's at best a group of unit tests merged together or at worst a misplaced component test.

I'll adhere to AAA for all later tests.