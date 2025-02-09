Feature: Shop settings
  Background:
    Given I remember as "businessId" following value:
      """
      "012c165f-8b88-405f-99e2-82f74339a757"
      """
    Given I remember as "businessSlug" following value:
      """
      "test-business"
      """
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://payevertesting.azureedge.net/translations/*",
        "headers": {
          "Accept": "application/json, text/plain, */*"
        }
      },
      "response": {
        "status": 200,
        "body": "{}"
      }
    }
    """

  Scenario: Settings by channel
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    When I send a GET request to "/api/shop/{{businessId}}/settings/magento"
    Then the response status code should be 200
    Then print last response
    And the response should contain json:
    """
    {
      "name": "Test business",
      "type": "mixed",
      "b2b_search": false,
      "languages": [],
      "testing_mode": false,
      "company_address": {}
    }
    """
