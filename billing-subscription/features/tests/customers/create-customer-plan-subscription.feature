Feature: Plan customer
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
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

  Scenario: Create new Customer
    Given I use DB fixture "plans/retrieve-plans-for-products"
    Given I remember as "businessJSON" following value:
    """
      {
        "_id": "business-1-_id",
        "currency": "USD",
        "name": "business-1-name"
      }
    """
    When I send a POST request to "/api/business/{{businessId}}/customer-plan-subscription" with json:
      """
        {
          "transactionId": "transaction-id",
          "reference": "reference-id",
          "quantity": 5,
          "trialEnd": "2021-03-08T18:23:37.123Z",
          "subscribersGroups": [
            "subscriber-group-id-1"
          ],
          "customer": "customer-id",
          "plan": "plan-id",
          "plansGroup": [
            "plan-group-1"
          ]
        }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "*",
      "customer": "customer-id",
      "plan": "plan-id",
      "quantity": 5,
      "reference": "reference-id",
      "subscribersGroups": [
        "subscriber-group-id-1"
      ],
      "transactionId": "transaction-id",
      "trialEnd": "2021-03-08T18:23:37.123Z"
    }
    """
