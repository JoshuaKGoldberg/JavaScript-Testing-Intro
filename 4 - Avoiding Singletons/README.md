# Avoiding Singletons

I *strongly dislike* singletons.

It used to be a mild dislike of the pattern, but after moving to a large codebase and dealing with their negative side effects I came to understand why they can easily become the antithesis of testable design.
Thus, this section is platform-agnostic and dedicated to convincing you of their evils.

## What's a singleton?

Suppose you want to add logs to your application that get saved to a database (a.k.a. telemetry).
Logging is a pretty universal thing that basically all your code needs and you know you're going to have to make a `Logger` class because OOP is life... but you don't want to have to make new instances of it everywhere.

First you try creating a static class but that's ugly as heck.
You like the idea that you might use inheritence or `this` later on.
Instead you make a single statically available `Logger` instance via the `Logger` class that gets created the first time it's requested.

```javascript
/**
 * Logs messages to the internal telemetry database.
 */
class Logger {
    /**
     * @returns The static singleton Logger instance.
     */
    static instance() {
        if (!Logger.singleton) {
            Logger.singleton = new Logger();
        }

        return Logger.singleton;
    }

    /**
     * Initializes a new instance of the Logger class.
     */
    constructor() {
        if (Logger.singleton) {
            throw new Error("Cannot re-create a singleton. Use Logger.instance() instead.");
        }
    }

    /**
     * Enables logging.
     */
    enable() {
        this.disabled = false;
    }

    /**
     * Disables logging.
     */
    disable() {
        this.disabled = true;
    }

    /**
     * Logs a message, if enabled.
     * 
     * @param {string} message   A message to log.
     * @param {...any[]} info   Any additional message information.
     */
    log(message, ...info) {
        if (this.disabled) {
            return;
        }

        // Magically save these to a database or whatnot. Use your imagination.
    }
}
```

*Those `enable` and `disable` methods are in there because code might not want to save logs to a database... such as in tests.*

Such is the **singleton** pattern: creating a single shared instance that can be passed around.
Note that this is specifically the *static* singleton pattern in that it's meant to be retrieved using the static `instance` method.

Anyway you can now easily use the `Logger` class by retrieving the singleton instance.
Yay!

Let's add it to our `Fibonacci` class.

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
```

Then three weeks later you get an angry HR call because Adam from the performance team went home in tears after seven thousand logs from a user with the name "Adam from the performance team smells lololol 1234 asdfqwerty test" started popping up and he was already stressed from these weird outliers in performance metrics showing really simple operations randomly taking up to five minutes to complete for the past three weeks which is weird because those operations don't even happen except in rare situations such as those you've been spending long debugging sessions examining for the past three weeks- oh crap ***you forgot to disable logging in your tests***.

```javascript
    // (Mocha hook to run before tests)
    before(() => {
        Logger.instance().disable();
    });

    // (Mocha hook to run after tests)
    after(() => {
        Logger.instance().enable();
    });
```

Sorry Adam.

## What went wrong?

It's easy to say "this wouldn't have been a problem if we understood Logger better!" but that doesn't get to the root issue.
The problem with allowing this kind of singleton is that it *binds your classes together* in a basically permanent and difficult-to-detect way.
Anything that wants to interact with `Fibonacci` now has to deal with the `Logger` class.
If any other class wants to use `Fibonacci` its tests will now need to remember to disable and enable logging.

*(and let's not even approach the troubles that happen when you try to parallelize singletons)*

What we *really* wanted to do was bind the `Fibonacci` class to the logging *behavior*.

> The 'D' in 'SOLID' stands for the Dependency Inversion Principle.
> DIP states that one should depend upon *abstractions*, not *implementations*. 


## A better way

After digesting the contents of this talk, look up the concept of **dependency injection**.
The idea is that every component of your application should have its dependencies handed to it (commonly via the constructor).
Nothing should have some spooky undeclared dependency that it obtains without your knowledge.
Such weirdness makes it too easy to mess up your dependencies and end up with unpredictable state.

> If you want to get even deeper into the world of architectural design, also look at **inversion of control** containers. Super neat stuff.

You can rewrite the `Fibonacci` class using this idea to take in a `Logger`.

```javascript
/**
 * Generates numbers in the Fibonacci sequence.
 */
class Fibonacci {
    /**
     * Initializes a new instance of the Fibonacci class.
     * 
     * @param {Logger} logger   Logs messages to the internal telemetry database.
     */
    constructor(logger) {
        this.logger = logger;
        this.cache = [0, 1];
    }

    /**
     * @param {number} n
     * @returns The 'n'th number in the Fibonacci sequence.
     */
    generate(n) {
        this.logger.log("Fibonacci::generate", n);

        if (this.cache[n] !== undefined) {
            this.logger.log("Fibonacci::generate", `${n} was already cached.`);
            return this.cache[n];
        }

        this.logger.log("Fibonacci::generate", `${n} was not yet cached.`);
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

Since you don't want to use the functional `Logger` class in tests you create a "mock" equivalent to use in test code instead of the regular one.

```javascript
/**
 * Mock implementation of the Logger class.
 */
class MockLogger {
    log() { /* naw */ }
}
```

```javascript
/**
 * Logs messages to the internal telemetry database.
 */
class Logger {
    /**
     * Logs a message to the internal telemetry database.
     * 
     * @param {string} message   A message to log.
     * @param {...any[]} info   Any additional message information.
     */
    log(message, ...info) {
        // Magically save these to a database or whatnot. Use your imagination.
    }
}
```

Now you're *forced* to pass `Fibonacci` a correct logger in tests. 

```javascript
describe("Fibonacci", () => {
    describe("generate", () => {
        it("generates 0", () => {
            // Arrange
            const generator = new Fibonacci(new MockLogger());

            // Act
            const generated = generator.generate(0);

            // Assert
            expect(generated).to.be.equal(0, "The 0th number should be 0.");
        });

        it("generates 1", () => {
            // Arrange
            const generator = new Fibonacci(new MockLogger());

            // Act
            const generated = generator.generate(1);

            // Assert
            expect(generated).to.be.equal(1, "The 1st number should be 1.");
        });

        it("generates a large number", () => {
            // Arrange
            const generator = new Fibonacci(new MockLogger());

            // Act
            const generated = generator.generate(7);

            // Assert
            expect(generated).to.be.equal(13, "the 7th number should be 13.");
        });
    });

    describe("cache", () => {
        it("caches numbers", () => {
            // Arrange
            const generator = new Fibonacci(new MockLogger());

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
```

You may think this small sample contrived (it is a little) but the idea holds true and the benefits are realistic.
Static singletons represent a global state and so by nature have to include any and all functionality all parts of your code base, including tests, could ever need.

* *Downside*: it's a little harder to create new things.

* *Upside*: Your components' dependencies are well-understood and you don't get fired for insulting Adam (he's a sensitive soul, though he seems thick skinned).


## Caveats

We will not engage in a heated discussion over the pros and cons of singletons.
There are completely valid use cases for their many types and patterns.
It's perfectly possible that you can *need* a singleton and still pass that instance around using dependency injection.

Rather than as a complete rebuttal of the singleton pattern, let this section instead serve as a notice that you should pay attention to this type of concern when designing your code.
