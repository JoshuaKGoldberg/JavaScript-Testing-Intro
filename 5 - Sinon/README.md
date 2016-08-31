# Sinon

Now that we've written our `Logger` class we should unit test it too.
But, `Logger` internally sends AJAX calls using `XMLHttpRequest`.
We can't have that!

Here we have an improved `Logger` that sends logs in batches when requested.

```javascript
/**
 * Logs messages to the internal telemetry database.
 */
class Logger {
    /**
     * Initializes a new instance of the Logger class.
     */
    constructor() {
        this.logs = [];
    }

    /**
     * Queues a message to be logged.
     * 
     * @param {string} message   A message to log.
     * @param {...any[]} info   Any additional message information.
     */
    log(message, ...info) {
        this.logs.push({ message, info });
    }

    /**
     * Sends logs to the internal telemetry database.
     */
    sendLogs() {
        const request = new XMLHttpRequest();

        request.open("POST", "telemetry");
        request.send(this.logs);

        this.logs = [];
    }
}
```

For this situation I present two ways to deal with logging nicely.


## Option A: Pass in `XMLHttpRequest` usage

Remember our collective opinion on hardwiring dependencies?
Let's apply that logic and abstract the `XMLHttpRequest` away from `Logger`.

```javascript 
/**
 * Logs messages to the internal telemetry database.
 */
class Logger {
    /**
     * Initializes a new instance of the Logger class.
     * 
     * @param {Function} sender   Sends logs to the internal telemetry database.
     */
    constructor(sender) {
        this.sender = sender;
        this.logs = [];
    }

    /**
     * Queues a message to be logged.
     * 
     * @param {string} message   A message to log.
     * @param {...any[]} info   Any additional message information.
     */
    log(message, ...info) {
        this.logs.push({ message, info });
    }

    /**
     * Sends logs to the internal telemetry database.
     */
    sendLogs() {
         this.sender(this.logs);
         this.logs = [];
    }
}
```

Elsewhere we instantiate a new `Logger` with a method that does the `XMLHttpRequest` logic for us.

```javascript
const logger = new Logger((logs) => {
    const request = new XMLHttpRequest();

    request.open("POST", "telemetry");
    request.send(logs);
});
```

> This is a great example of where the Factory pattern would come in handy.
> We can make a new class whose entire purpose is to create Loggers, so we don't have to.

...and now, we can test `Logger` behavior by checking what gets sent to the sender method.

```javascript
const expect = require("chai").expect;
const Fibonacci = require("./Fibonacci").Fibonacci;

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
```

That's pretty ugly.
It would be nice if we could have some kind of helper to create a function that automatically keeps track of what it's called with...


## Introducing Sinon

> Standalone test spies, stubs and mocks for JavaScript.
> No dependencies, works with any unit testing framework.

The magical auto-tracking function we're thinking of is called a **spy**.
A spy will record everything that happens to it so you can test later.

```cmd
npm install sinon
```

```javascript
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
```

Perfect.

Sinon's spies are super powerful and have a rich set of APIs to play with.
http://sinonjs.org/docs/#spies

## Option B: Mock `XMLHttpRequest`

Sinon also provides a built-in mock for the global `XMLHttpRequest` object you can use when the above pattern is for some reason undoable.

Here's an example from their docs:

```javascript
{
    setUp: function () {
        this.xhr = sinon.useFakeXMLHttpRequest();
        this.requests = [];

        this.xhr.onCreate = request => {
            requests.push(request);
        };
    },

    tearDown: function () {
        this.xhr.restore();
    },

    "test should fetch comments from server": function () {
        const spy = sinon.spy();
        myLib.getCommentsFor("/some/article", spy);
        assertEquals(1, this.requests.length);

        this.requests[0].respond(
            200,
            { "Content-Type": "application/json" },
            '[{ "id": 12, "comment": "Hey there" }]');

        assert(spy.calledWith([{ id: 12, comment: "Hey there" }]));
    }
}
```

*(they're not using Mocha)*

I included this option B because it's a cool stepping-stone into how you can use this to test large internet-heavy applications without setting up test networks.
I also deliberately do not provide an implementation of `Logger` tests using it as that would be a little too code-heavy (though it's a great user exercise for later!).
