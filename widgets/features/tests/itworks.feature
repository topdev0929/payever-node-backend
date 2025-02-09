Feature: It works
  Scenario: Does it?
  When I send a GET request to "/"
  Then print last response
  Then the response status code should be 404
