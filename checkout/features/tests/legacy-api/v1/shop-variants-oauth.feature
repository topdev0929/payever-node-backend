Feature: Shop variants data protected with auth
  Background:
    Given I remember as "businessId" following value:
      """
      "012c165f-8b88-405f-99e2-82f74339a757"
      """
    Given I remember as "businessSlug" following value:
      """
      "test-business"
      """
    Given I remember as "channelSetId" following value:
      """
      "006388b0-e536-4d71-b1f1-c21a6f1801e6"
      """
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
            }
          ]
        }
      ]
    }
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

  Scenario: List payment options with variants by channel
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/connections"
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/variants/magento"
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "action": "list_payment_options",
        "id": "*",
        "created_at": "*",
        "business_id": "{{businessId}}",
        "channel": "magento"
      },
      "result": [
        {
          "name": "paypal.name",
          "fixed_fee": 0.35,
          "variable_fee": 1.9,
          "accept_fee": true,
          "payment_method": "paypal",
          "description_offer": "paypal.description_offer",
          "description_fee": "paypal.description_fee",
          "status": "active",
          "is_redirect_method": true,
          "merchant_allowed_countries": [],
          "instruction_text": "Simply connect your PayPal and payever accounts, or  create a new PayPal account.",
          "thumbnail1": "https://payeverproduction.blob.core.windows.net/miscellaneous/4a6223a8-cb31-4fcc-b89f-fa93e7512be1-PAYPAL.png",
          "thumbnail2": "https://payeverproduction.blob.core.windows.net/miscellaneous/4a6223a8-cb31-4fcc-b89f-fa93e7512be1-PAYPAL.png",
          "options": {
            "currencies": "*",
            "countries": "*"
          },
          "max": 22000,
          "min": 5,
          "variants": [
            {
              "accept_fee": true,
              "name": "Paypal main",
              "variant_id": "765228ec-afb0-4465-b471-83e8521a4ef3"
            },
            {
              "accept_fee": false,
              "name": "Paypal extra",
              "variant_id": "aaa794cc-6dbd-4087-aaed-fc37817cb919"
            }
          ]
        }
      ]
    }
    """

  Scenario: List payment options with variants by channel as anonymous should not be allowed
    Given I am not authenticated
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/variants/magento"
    Then the response status code should be 403

  Scenario: List payment options with variants by channel set id
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/connections"
    When I send a GET request to "/api/shop/{{businessId}}/payment-options/variants/{{channelSetId}}"
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "action": "list_payment_options",
        "id": "*",
        "created_at": "*",
        "business_id": "{{businessId}}",
        "channel": "magento"
      },
      "result": [
        {
          "name": "paypal.name",
          "fixed_fee": 0.35,
          "variable_fee": 1.9,
          "accept_fee": true,
          "payment_method": "paypal",
          "description_offer": "paypal.description_offer",
          "description_fee": "paypal.description_fee",
          "status": "active",
          "is_redirect_method": true,
          "merchant_allowed_countries": [],
          "instruction_text": "Simply connect your PayPal and payever accounts, or  create a new PayPal account.",
          "thumbnail1": "https://payeverproduction.blob.core.windows.net/miscellaneous/4a6223a8-cb31-4fcc-b89f-fa93e7512be1-PAYPAL.png",
          "thumbnail2": "https://payeverproduction.blob.core.windows.net/miscellaneous/4a6223a8-cb31-4fcc-b89f-fa93e7512be1-PAYPAL.png",
          "options": {
            "currencies": "*",
            "countries": "*"
          },
          "max": 22000,
          "min": 5,
          "variants": [
            {
              "accept_fee": true,
              "name": "Paypal main",
              "variant_id": "765228ec-afb0-4465-b471-83e8521a4ef3"
            },
            {
              "accept_fee": false,
              "name": "Paypal extra",
              "variant_id": "aaa794cc-6dbd-4087-aaed-fc37817cb919"
            }
          ]
        }
      ]
    }
    """

  Scenario: List payment options with variants by channel set id and business slug
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/connections"
    When I send a GET request to "/api/shop/oauth/{{businessSlug}}/payment-options/variants/{{channelSetId}}"
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "action": "list_payment_options",
        "id": "*",
        "created_at": "*",
        "business_id": "{{businessId}}",
        "channel": "magento"
      },
      "result": [
        {
          "name": "paypal.name",
          "fixed_fee": 0.35,
          "variable_fee": 1.9,
          "accept_fee": true,
          "payment_method": "paypal",
          "description_offer": "paypal.description_offer",
          "description_fee": "paypal.description_fee",
          "status": "active",
          "is_redirect_method": true,
          "merchant_allowed_countries": [],
          "instruction_text": "Simply connect your PayPal and payever accounts, or  create a new PayPal account.",
          "thumbnail1": "https://payeverproduction.blob.core.windows.net/miscellaneous/4a6223a8-cb31-4fcc-b89f-fa93e7512be1-PAYPAL.png",
          "thumbnail2": "https://payeverproduction.blob.core.windows.net/miscellaneous/4a6223a8-cb31-4fcc-b89f-fa93e7512be1-PAYPAL.png",
          "options": {
            "currencies": "*",
            "countries": "*"
          },
          "max": 22000,
          "min": 5,
          "variants": [
            {
              "accept_fee": true,
              "name": "Paypal main",
              "variant_id": "765228ec-afb0-4465-b471-83e8521a4ef3"
            },
            {
              "accept_fee": false,
              "name": "Paypal extra",
              "variant_id": "aaa794cc-6dbd-4087-aaed-fc37817cb919"
            }
          ]
        }
      ]
    }
    """

  Scenario: List payment options with variants by channel set id and business slug as anonymous should not be allowed
    Given I am not authenticated
    And I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/connections"
    When I send a GET request to "/api/shop/oauth/{{businessSlug}}/payment-options/variants/{{channelSetId}}"
    Then the response status code should be 403

  Scenario: List payment options with variants by invalid channel set id
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/connections"
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/variants/1234567890"
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Business ChannelSet with type '1234567890' not found"
    }
    """

  Scenario: List payment options with variants by invalid channel
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/connections"
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/variants/shopify"
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Business ChannelSet with type 'shopify' not found"
    }
    """

  Scenario: List payment options with variants by invalid business id
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/connections"
    When I send a GET request to "/api/shop/oauth/1234567890/payment-options/variants/shopify"
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Business with id \"1234567890\" not found!"
    }
    """
