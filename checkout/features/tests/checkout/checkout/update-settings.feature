@update-default-checkout-settings
Feature: Checkout API Update styles

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
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

  Scenario: Update default checkout settings
    Given I use DB fixture "checkout/checkout/update/existing"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/default/settings" with json:
    """
    {
      "logo": "https://payeverstaging.blob.core.windows.net/images/6c97a620-1dba-4b3b-85b5-a1e2c3e11f65-EXLxGEL",
      "settings": {
        "styles": {
          "active": true,
          "businessHeaderBorderColor": "#dfdfdf",
          "businessHeaderBackgroundColor": "#fff"
        }
      }
    }
    """
    Then print last response
    Then the response status code should be 200
    Then I look for model "Checkout" by following JSON and remember as "checkout":
      """
      {
        "_id": "{{checkoutId}}"
      }
      """
    And print storage key "checkout"
    And stored value "checkout" should contain json:
      """
      {
        "_id": "{{checkoutId}}",
        "logo": "https://payeverstaging.blob.core.windows.net/images/6c97a620-1dba-4b3b-85b5-a1e2c3e11f65-EXLxGEL",
        "settings": {
          "styles": {
            "active": true,
            "businessHeaderBorderColor": "#dfdfdf",
            "businessHeaderBackgroundColor": "#fff"
          }
        }
      }
      """
