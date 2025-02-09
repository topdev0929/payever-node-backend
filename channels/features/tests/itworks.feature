Feature: It works
  Scenario: Does it?
    When I send a GET request to "/"
    Then the response status code should be 404
