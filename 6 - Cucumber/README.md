# Cucumber

*(finally, a food pun that isn't caffeinated)*

We've gotten really far with our test tools...

* We've used **Mocha** to run tests and display errors
* We've learned why singletons are dangerous
* We've used **Chai** to smoothly validate assertions
* We've used **Sinon** to mock out parts of our application

...so now, let's string it all together with true BDD.

## What's BDD, really?

Most importantly, BDD and TDD are *states of mind* (we decided this in the first section right?).

Behavior-Driven Development is something of a larger-scale, abstract TDD approach (or at least that's how I see and use it).
Instead of focusing on the nitty gritty implementation details of tests you define the *behavior* that will then be validated by tests.

Let's describe some end-to-end behavior description for our `Fibonacci`+`Logger` code.

```cucumber
Feature: Caching generated numbers

    Scenario: Generating a new number
        Given I have a new Fibonacci generator
        When I generate the number 7
        Then a log should say "7 was not yet cached."

    Scenario: Generating a number twice
        Given I have a new Fibonacci generator
        When I generate the number 7
        And I generate the number 7
        Then a log should say "7 was not yet cached."
        And a log should say "7 was already cached."
```

## Introducing Cucumber

Those two descriptions were pretty clear, right?
Basically English and not code at all?

Joke's on you!
That's a syntax called **Gherkin**.
This syntax is made to describe features *("I want to to have this capability")* containing scenarios *("I want this behavior for using the feature")*.

Each line in a `.feature` scenario gets auto-mapped to some line of code.
The lines are parsed with regular expressions to lines of code in your test that are run.
You can still use utilities like Chai and Sinon -- this is often used as a runner for large-scale tests that would take a lot of Mocha-based code to describe.

### Components of Cucumber tests

Cucumber test scenarios are typically split into two or three components:

### Features

The file governing your program structure.
This is the above code snippet.

### Steps

Your steps will define how the feature descriptions map to actual lines of code.

There are three types of steps (roughly equivalent to AAA):

* **Given** *(approximately Arrange)*
* **When** *(approximately Act)*
* **Then** *(approximately Assert)*

Defining a step takes in a string or regular expression with a callback to run.

```javascript
// Arrange: Create a new Fibonacci in the calling scope (more on that later)
this.Given("I have a new Fibonacci generator", function () {
    this.logger = new Logger();
    this.generator = new Fibonacci(this.logger);
});
```

### Support

Any extra utilities you need for your runtime.
I typically use the support section to define some class that will run the tests.

*(For the sake of simplicity, the samples here don't use support files.)*

## Cucumber CLI

All right, finally.
Let's do something.

```cmd
npm install cucumber
cucumber-js "6 - Cucumber/Caching.feature"
```

*(Linux/Mac users may use `cucumber.js` instead of `cucumber-js`.)*

You should see a version of the above `.feature` text in your terminal, mostly colored green.

What happened was approximately the following:

* You told the Cucumber CLI to run the tests in this directory's `Caching.feature`.
* Cucumber read that file in along with the `steps.js` locally (it always reads `steps.js`).
* Cucumber read the Given, When, and Then commands from the steps and registered callbacks under them.
* For each line in the feature scenarios, Cucumber found and ran the equivalent step.

Larger projects will end up defining helper utilities and larger "worlds" (the `this` scope in tests) to play in.
For now, we can see this very basic scenario working to link together common pieces of larger-scale logic.

## Cucumber vs Mocha?

Now you might be thinking *"why have we seen two completely different test runners?"* and that's a *very* valid question.

* Mocha is primarily targeted at *smaller* tests, like unit (testing a single unit of logic) and integration (testing that components work well together).
  * You can run end-to-end tests with Mocha but it takes up more code.
* Cucumber is primarily targeted at *larger* tests, like end-to-end tests (testing that a component works as a whole).

Determining which of your tests should be written in which type of environment is up to you.

