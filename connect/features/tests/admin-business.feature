Feature: Admin integration
  Background: constants
    Given I remember as "businessId" following value:
      """
      "d5b25c5c-3684-4ab7-a769-c95f4c0f7546"
      """
    Given I remember as "integrationId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "admin@payever.de",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """

  Scenario: get integration by id
    Given I use DB fixture "integrations/businesses"
    When I send a GET request to "/api/admin/businesses/{{businessId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """

  Scenario: get integration subscriptions list
    Given I use DB fixture "integrations/businesses"
    When I send a GET request to "/api/admin/businesses?limit=2"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "_id": "{{businessId}}"
          }
        ]
      }
      """

  Scenario: add allowed businesses
    Given I use DB fixture "integrations/businesses"
    When I send a PATCH request to "/api/admin/businesses/{{businessId}}/excluded-integrations" with json:
    """
    [
      "A","B","C","A","B","C"
    ]
    """
    And the response status code should be 200
    And the response should contain json:
    """
    [
     "I1","I2","A","B","C"
    ]
    """
    When I send a PATCH request to "/api/admin/businesses/{{businessId}}/excluded-integrations" with json:
    """
    [
      "A","D"
    ]
    """
    And the response status code should be 200
    And the response should contain json:
    """
    [
      "I1","I2","A","B","C","D"
    ]
    """
    And model "Business" with id "{{businessId}}" should contain json:
    """
    {
      "excludedIntegrations": ["I1","I2","A","B","C","D"]
    }
    """

  Scenario: remove allowed businesses
    Given I use DB fixture "integrations/businesses"
    When I send a DELETE request to "/api/admin/businesses/{{businessId}}/excluded-integrations" with json:
    """
    [
      "I1","A","B","C"
    ]
    """
    And the response status code should be 200
    And the response should contain json:
    """
    [
      "I2"
    ]
    """
    And model "Business" with id "{{businessId}}" should contain json:
    """
    {
      "excludedIntegrations": ["I2"]
    }
    """
    And model "Business" with id "{{businessId}}" should not contain json:
    """
    {
      "excludedIntegrations": ["I1"]
    }
    """
