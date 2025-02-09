Feature: Domain API
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "DomainId" following value:
      """
        "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    Given I remember as "appointmentNetworkId" following value:
      """
        "ssssssss-ssss-ssss-ssss-ssssssssssss"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Create domain
    Given I use DB fixture "domain"
    When I send a POST request to "/api/business/{{businessId}}/domain/{{appointmentNetworkId}}" with json:
      """
      {
        "name": "test.com"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "isConnected": false,
        "name": "test.com",
        "appointmentNetwork": "ssssssss-ssss-ssss-ssss-ssssssssssss",
        "_id": "*"
      }
      """

  Scenario: update domain
    Given I use DB fixture "domain"
    When I send a PATCH request to "/api/business/{{businessId}}/domain/{{appointmentNetworkId}}/{{DomainId}}" with json:
      """
      {
        "name": "testing.com"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "isConnected": false,
        "appointmentNetwork": "ssssssss-ssss-ssss-ssss-ssssssssssss",
        "name": "testing.com",
        "_id": "dddddddd-dddd-dddd-dddd-dddddddddddd"
      }
      """

  Scenario: isValidName domain
    Given I use DB fixture "domain"
    When I send a GET request to "/api/business/{{businessId}}/domain/{{appointmentNetworkId}}/isValidName?name=test"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "result": true
      }
      """

  Scenario: isValidName domain
    Given I use DB fixture "domain"
    When I send a POST request to "/api/business/{{businessId}}/domain/{{appointmentNetworkId}}/dddddddd-dddd-dddd-dddd-dddddddddddd/check"
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "cnames": [],
        "currentCname": "",
        "currentIp": "*",
        "isConnected": false
      }
      """

  Scenario: get domain
    Given I use DB fixture "domain"
    When I send a GET request to "/api/business/{{businessId}}/domain/{{appointmentNetworkId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [{
        "isConnected": false,
        "appointmentNetwork": "ssssssss-ssss-ssss-ssss-ssssssssssss",
        "name": "google.com",
        "_id": "dddddddd-dddd-dddd-dddd-dddddddddddd"
      }]
      """

  Scenario: delete domain
    Given I use DB fixture "domain"
    When I send a DELETE request to "/api/business/{{businessId}}/domain/{{appointmentNetworkId}}/{{DomainId}}"
    Then print last response
    And the response status code should be 200
    And model "Domain" found by following JSON should not exist:
      """
      {
        "name": "google.com"
      }
      """

  Scenario: Update domain
    Given I use DB fixture "domain"
    When I send a PATCH request to "/api/business/{{businessId}}/domain/{{appointmentNetworkId}}/{{DomainId}}" with json:
      """
      {
        "name": "new.domain"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "new.domain"
      }
      """
