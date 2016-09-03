# JavaScript Testing Intro

This is the source code for a talk given by [Josh Goldberg](jogol@microsoft.com), Software Development Engineer at Microsoft in Office Sway, for the BellevueJS meetup on 8/30/2016 at BitTitan.
That's me.

I'll cover common basic testing practices and protips for JavaScript:

1. Basic Terms
2. Mocha
3. Chai
4. Avoiding Singletons
5. Sinon
6. Further Reading

All the source code here is on [my Github](https://github.com/JoshuaKGoldberg/JavaScript-Testing-Intro).

## Preliminary notes

### Code samples

Markdown code samples are approximate subsets of `.js` files in the same section.
You'll want to play along by running the test files using `mocha path/to/test.js`.

First install the prerequisite libraries.

```cmd
npm install -g mocha cucumber
npm install chai sinon
```

### Teaching approach

Many other lessons follow a standard formula:

1. Define *(this is the definition of X, and it does Y)*
2. Showcase *(here is how and why X is used to Y)*

I don't like that because you spend the first step wondering how or why something is used, then the next step trying to link usage back to the definition.
Thus most of the samples here are in the reverse order.
We'll showcase *why* situations call for certain things, *then* define how to use those things.
