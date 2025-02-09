@business-transactions
Feature: Get list of channels with transactions count

  Background:
    Given I remember as "businessId" following value:
    """
    "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
    """
  Scenario: Should retun list of channels
    Given I authenticate as a user with the following data:
      """
      {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]}
      """
    And I use DB fixture "transactions/transaction-history"
    When I send a GET request to "/api/business/{{businessId}}/channels/transaction-summary"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "transactionCount":2,
          "name":"pos",
          "icon":"#channel-pos",
          "label":"integrations.payments.pos.title"
        }       
      ]
      """

