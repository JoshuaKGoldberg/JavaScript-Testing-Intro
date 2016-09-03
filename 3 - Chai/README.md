# Chai

Suppose you want to add a cache to your Fibonacci generator.

```javascript
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
```

Like a good developer you start writing a test for the cache.

```javascript
    describe("cache", () => {
        it("caches numbers", () => {
            // Arrange
            const generator = new Fibonacci();

            // Act
            generator.generate(7);
            const cache = generator.getCache();

            // Assert
            if (cache !== [0, 1, 1, 2, 3, 5, 8, 13]) {
                throw new Error("Fibonacci numbers should have been cached.");
            }
        });
    });
```

...can anybody spot the problem?

```
  1) Fibonacci cache caches numbers:
     Error: Fibonacci numbers should have been cached.
```

> **JavaScript review**
> 
> Checking for equality in JavaScript only works for primitives. 
> `cache` is treated like a pointer to the array.

What you *could* do is loop through the array... but that's a lot of code to do something really simple.

```javascript
            const expected = [0, 1, 1, 2, 3, 5, 8, 13];

            if (cache.length !== expected.length) {
                throw new Error("Not the right amount of numbers were cached.");
            }

            for (let i: number = 0; i < expected.length; i += 1) {
                if (cache[i] !== expected[i]) {
                    throw new Error(`Cached number ${i} should be ${expected[i]} but is ${cache[i]}.`);
                }
            }
```

We can't be expected to write all that code every time we want to check an array.
Fortunately, we don't have to.
People have written great utilities to do that for us.

## Introducing Chai

A common JavaScript favorite is [Chai](http://chaijs.com/).

> Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any JavaScript testing framework.

```cmd
npm install chai
```

Chai provides a bunch of utilities geared to the *assert* phase of AAA.
They make it easier to assert things are as they should be.

I happen to really like the `expect` method, which takes in some value and returns an object that has a bunch of visually pleasing assertion helpers.

```javascript
const expect = require("chai").expect;

expect(2 + 2).to.be.equal(4);
```

So fine.
So smooth.

Extending it to the Fibonacci generator...

```javascript
expect(cache).to.be.deep.equal(
    [0, 1, 1, 2, 3, 5, 8, 13],
    "Fibonacci numbers should have been cached.");
```

The full list of available expressions are [online](http://chaijs.com/guide/styles/#expect).

Chai describes `expect` as a "BDD" style of testing.
What's BDD, you ask?

## Behavior-Driven Development

BDD is something like a superset of TDD.
It's the concept of describing the *behavior* of your components using something that resembles logical sentences.

The `expect` line above somewhat reads like `"expect two plus two to be equal to four"`.

*True* BDD with plain-text English is a bit out of scope, but for now we're more interested in how we can use Chai to prettify our assertions.

We talked earlier about how tests should describe what they're testing cleanly and concisely.
BDD-style assertions are an extension of this methodology.
In addition to more self-explanatory code, Chai gives descriptive error messages that make debugging test failures quite a bit easier.

```javascript
expect(cache).to.be.deep.equal(
    [0, 1, 1, 2, 3, 5, 8, 13, "nope"],
    "Fibonacci numbers should have been cached.");
```

```
  1) Fibonacci cache caches numbers:

      Fibonacci numbers should have been cached.
      + expected - actual

         3
         5
         8
         13
      +  "nope"
       ]
```