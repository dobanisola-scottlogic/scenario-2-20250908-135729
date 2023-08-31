@login @unit
Feature: Unit testing focussed on login page in isolation

Scenario: Can login as an admin
    Given I login using the username "admin" and the password "secret"
    Then I should be redirected to the "admin" screen