Feature: Anonymous authentication
  Scenario: Login as anonymous user with ip hash provided
    Given I am not authenticated
    And I set header "User-Agent" with value "Mozilla"
    When I send a POST request to "/api/guest-token" with json:
    """
    {
      "ipHash": "83b0fbe581671884dbab80ce81583d7ab921e3f2f2efca66d731deabc22352e9"
    }
    """
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.*"
    }
    """

  Scenario: Login as anonymous user without ip hash
    Given I am not authenticated
    And I set header "User-Agent" with value "Mozilla"
    When I send a POST request to "/api/guest-token" with json:
    """
    {}
    """
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.*"
    }
    """
