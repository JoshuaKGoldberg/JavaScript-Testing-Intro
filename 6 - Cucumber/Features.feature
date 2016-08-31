Feature: Generating numbers

    Scenario: Generating a new number
        Given that I have a new Fibonacci generator
        When I generate an example number
        Then a log should say it was not yet cached

    Scenario: Generating a number twice
        Given that I have a new Fibonacci generator
        When I generate an example number
        And I generate an example number again
        Then a log should say it was not yet cached
        And a log should say it was already cached
