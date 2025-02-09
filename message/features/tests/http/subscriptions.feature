Feature: Subscriptions controller
  Background: constants
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I remember as "subscriptionId" following value:
      """
      "_id-of-subscription"
      """
    Given I remember as "whatsappIntegrationId" following value:
      """
      "f9fd2225-eb67-4981-8674-c4f46bc18fcc"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_CONTACT_2}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"

  Scenario: Get subscriptions
    When I send a GET request to "/api/business/{{businessId}}/subscriptions"
    Then the response code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{subscriptionId}}",
        "business": "{{businessId}}",
        "enabled": true,
        "installed": true,
        "integration": {
          "_id": "{{whatsappIntegrationId}}",
          "name": "whatsapp",
          "category": "messaging"
        }
      }]
      """

  Scenario: Disable subscription
    When I send a PATCH request to "/api/business/{{businessId}}/subscriptions/whatsapp/uninstall"
    Then the response code should be 200
    And model "Subscription" with id "{{subscriptionId}}" should contain json:
      """
      {
        "enabled": false
      }
      """
    Then I send a PATCH request to "/api/business/{{businessId}}/subscriptions/whatsapp/install"
    And the response code should be 200
    And model "Subscription" with id "{{subscriptionId}}" should contain json:
      """
      {
        "enabled": true
      }
      """