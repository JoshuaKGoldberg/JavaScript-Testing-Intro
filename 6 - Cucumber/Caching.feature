Feature: Caching numbers

    Scenario: Cache creation for a new number
        Given I have a new Fibonacci generator
        When I generate the number 7
        Then a log should say "7 was not yet cached."

    Scenario: Repeated cache access for a duplicate number
        Given I have a new Fibonacci generator
        When I generate the number 7
        And I generate the number 7
        Then a log should say "7 was not yet cached."
        And a log should say "7 was already cached."
