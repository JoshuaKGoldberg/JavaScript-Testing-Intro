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
Feature: Generating numbers

    Scenario: Generating a new number
        Given I have a new Fibonacci generator
        When I generate the number 7
        Then a log should say it was not yet cached

    Scenario: Generating a number twice
        Given I have a new Fibonacci generator
        When I generate the number 7
        And I generate the number 7
        Then a log should say it was not yet cached
        And a log should say it was already cached
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

Cucumber test scenarios are typically split into three components:

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
    this.generator = new Fibonacci(
        logged => {
            this.logs.push(logged);
        });
});
```

### Support

Any extra utilities you need for your runtime.
I typically use the support section to define some class that will run the tests.

## Cucumber CLI

All right, finally.
Let's do something.

*(couldn't get it to work in time, making a branch...)*