Feature: Subscription Network
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "subscriptionBrandingId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac"
      """
    Given I remember as "subscriptionBrandingId2" following value:
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

  Scenario: Create new subscription network
    Given I use DB fixture "subscription-network"
    When I send a POST request to "/api/business/{{businessId}}/subscription-network" with json:
      """
      {
        "favicon": "favicon",
        "logo": "logo",
        "name": "name"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "favicon": "favicon",
        "logo": "logo",
        "name": "name",
        "_id": "*"
      }
    """
    And store a response as "response"
    And model "SubscriptionNetwork" with id "{{response._id}}" should contain json:
      """
      {
        "favicon": "favicon",
        "logo": "logo",
        "name": "name"
      }
      """

  Scenario: get subscription network by id with access config
    Given I use DB fixture "subscription-network"
    When I send a GET request to "/api/business/{{businessId}}/subscription-network/{{subscriptionBrandingId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "_id": "{{subscriptionBrandingId}}",
        "accessConfig": {
          "isLive": true
        }
      }
    """

  Scenario: get subscription networks
    Given I use DB fixture "subscription-network"
    When I send a GET request to "/api/business/{{businessId}}/subscription-network"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [{
        "business": "{{businessId}}",
        "favicon": "*",
        "logo": "*",
        "name": "*",
        "_id": "*"
      }]
    """

  Scenario: delete subscription networks
    Given I use DB fixture "subscription-network"
    When I send a DELETE request to "/api/business/{{businessId}}/subscription-network/{{subscriptionBrandingId}}"
    Then print last response
    And the response status code should be 200
    And model "SubscriptionNetwork" with id "{{subscriptionBrandingId}}" should not contain json:
      """
      {
        "business": "{{businessId}}"
      }
      """

  Scenario: Update subscription network
    Given I use DB fixture "subscription-network"
    When I send a PATCH request to "/api/business/{{businessId}}/subscription-network/{{subscriptionBrandingId}}" with json:
      """
      {
        "favicon": "favicon",
        "logo": "logo",
        "name": "name"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "favicon": "favicon",
        "logo": "logo",
        "name": "name",
        "_id": "{{subscriptionBrandingId}}"
      }
    """
    And store a response as "response"
    And model "SubscriptionNetwork" with id "{{subscriptionBrandingId}}" should contain json:
      """
      {
        "favicon": "favicon",
        "logo": "logo",
        "name": "name"
      }
      """

  Scenario: Set/get default
    Given I use DB fixture "subscription-network"
    When I send a PATCH request to "/api/business/{{businessId}}/subscription-network/{{subscriptionBrandingId}}/default"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "_id": "{{subscriptionBrandingId}}",
        "isDefault": true
      }
    """

    When I send a GET request to "/api/business/{{businessId}}/subscription-network/default"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{subscriptionBrandingId}}"
      }
      """

  Scenario: Check network name with valid value
    Given I use DB fixture "subscription-network"
    When I send a GET request to "/api/business/{{businessId}}/subscription-network/isValidName?name=test"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "result": true
      }
      """


  Scenario: Check network name with occupied name
    Given I use DB fixture "subscription-network"
    And I remember as "occupiedName" following value:
      """
      "Test Branding"
      """
    When I send a GET request to "/api/business/{{businessId}}/subscription-network/isValidName?name={{occupiedName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "result": false
      }
      """
