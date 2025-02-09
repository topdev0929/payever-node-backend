@shop-auth
Feature: Shop data protected with auth
  Background:
    Given I remember as "businessId" following value:
      """
      "012c165f-8b88-405f-99e2-82f74339a757"
      """
    Given I remember as "businessSlug" following value:
      """
      "test-business"
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
        "body": "{\"paypal.description_fee\":\"<p>Ofrezca a sus clientes la forma de pago populares PayPal. Usted paga en la mayoría de los casos, sólo el 1,9% + 0,35€ por operación y menos aún si se venden más. Por supuesto, la posibilidad de utilizar su cuenta de PayPal existente.</p>\",\"paypal.description_offer\":\"<p>PayPal - Simply convenient.</p>\",\"paypal.name\":\"PayPal\"}"
      }
    }
    """

  Scenario: List payment options without channel
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options"
    Then the response status code should be 404

  Scenario: List payment options without channel and trailing slash
    When I send a GET request to "/api/shop/{{businessId}}/payment-options/"
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Missing \"channel\" parameter"
    }
    """

  Scenario: List payment options by channel without checkout
    Given I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/channel-set-without-checkout"
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/f0e4f6fb-ed5d-40ca-b953-253213375e30"
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
    """
    {
      "statusCode":400,
      "error":"Bad Request",
      "message":"Channel 'f0e4f6fb-ed5d-40ca-b953-253213375e30' is not linked to checkout"
    }
    """

  Scenario: List payment options by channel without checkout as anonymous should not be allowed
    Given I am not authenticated
    Given I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/channel-set-without-checkout"
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/f0e4f6fb-ed5d-40ca-b953-253213375e30"
    Then the response status code should be 403

  Scenario: List payment options by channel
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/magento"
    Then the response status code should be 200
    Then print last response
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
          "name": "PayPal",
          "fixed_fee": 0.35,
          "variable_fee": 1.9,
          "accept_fee": true,
          "payment_method": "paypal",
          "description_offer": "<p>PayPal - Simply convenient.</p>",
          "description_fee": "<p>Ofrezca a sus clientes la forma de pago populares PayPal. Usted paga en la mayoría de los casos, sólo el 1,9% + 0,35€ por operación y menos aún si se venden más. Por supuesto, la posibilidad de utilizar su cuenta de PayPal existente.</p>",
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
          "min": 0.02,
          "max": 10000
        },
        {
          "name": "santander_installment.name",
          "fixed_fee": 0,
          "variable_fee": 0,
          "accept_fee": false,
          "payment_method": "santander_installment",
          "description_offer": "santander_installment.description_offer",
          "description_fee": "santander_installment.description_fee",
          "status": "active",
          "is_redirect_method": false,
           "merchant_allowed_countries": ["DK", "DE", "FI", "NO", "AT", "PT", "SE", "CH", "ES"],
          "instruction_text": "Simply enter the credentials of your merchant account with Santander, or apply for a new account at Santander Bank.",
          "thumbnail1": "https://payeverproduction.blob.core.windows.net/miscellaneous/2e551b84-c162-4963-97e6-af960f24d3f3-SANTANDER.png",
          "thumbnail2": "https://payeverproduction.blob.core.windows.net/miscellaneous/2e551b84-c162-4963-97e6-af960f24d3f3-SANTANDER.png",
          "options": {
            "currencies": "*",
            "countries": "*"
          },
          "min": 99,
          "max": 100000
        }
      ]
    }
    """

  Scenario: List payment options by channel as anonymous should not be allowed
    Given I am not authenticated
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/magento"
    Then the response status code should be 403

  Scenario: List payment options by business slug
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    When I send a GET request to "/api/shop/oauth/{{businessSlug}}/payment-options/magento"
    Then the response status code should be 200
    Then print last response
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
          "name": "PayPal",
          "fixed_fee": 0.35,
          "variable_fee": 1.9,
          "accept_fee": true,
          "payment_method": "paypal",
          "description_offer": "<p>PayPal - Simply convenient.</p>",
          "description_fee": "<p>Ofrezca a sus clientes la forma de pago populares PayPal. Usted paga en la mayoría de los casos, sólo el 1,9% + 0,35€ por operación y menos aún si se venden más. Por supuesto, la posibilidad de utilizar su cuenta de PayPal existente.</p>",
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
          "min": 0.02,
          "max": 10000
        },
        {
          "name": "santander_installment.name",
          "fixed_fee": 0,
          "variable_fee": 0,
          "accept_fee": false,
          "payment_method": "santander_installment",
          "description_offer": "santander_installment.description_offer",
          "description_fee": "santander_installment.description_fee",
          "status": "active",
          "is_redirect_method": false,
          "merchant_allowed_countries": ["DK", "DE", "FI", "NO", "AT", "PT", "SE", "CH", "ES"],
          "instruction_text": "Simply enter the credentials of your merchant account with Santander, or apply for a new account at Santander Bank.",
          "thumbnail1": "https://payeverproduction.blob.core.windows.net/miscellaneous/2e551b84-c162-4963-97e6-af960f24d3f3-SANTANDER.png",
          "thumbnail2": "https://payeverproduction.blob.core.windows.net/miscellaneous/2e551b84-c162-4963-97e6-af960f24d3f3-SANTANDER.png",
          "options": {
            "currencies": "*",
            "countries": "*"
          },
          "min": 99,
          "max": 100000
        }
      ]
    }
    """

  Scenario: List payment options by business slug as anonymous should not be allowed
    Given I am not authenticated
    When I send a GET request to "/api/shop/oauth/{{businessSlug}}/payment-options/magento"
    Then the response status code should be 403

  Scenario: Get payment options list by not existent channel should return not found error
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/shopify"
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Business ChannelSet with type 'shopify' not found"
    }
    """

  Scenario: List payment options by channel set UUID
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/006388b0-e536-4d71-b1f1-c21a6f1801e6"
    Then the response status code should be 200
    Then print last response
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
          "name": "PayPal",
          "fixed_fee": 0.35,
          "variable_fee": 1.9,
          "accept_fee": true,
          "payment_method": "paypal",
          "description_offer": "<p>PayPal - Simply convenient.</p>",
          "description_fee": "<p>Ofrezca a sus clientes la forma de pago populares PayPal. Usted paga en la mayoría de los casos, sólo el 1,9% + 0,35€ por operación y menos aún si se venden más. Por supuesto, la posibilidad de utilizar su cuenta de PayPal existente.</p>",
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
          "min": 0.02,
          "max": 10000
        },
        {
          "name": "santander_installment.name",
          "fixed_fee": 0,
          "variable_fee": 0,
          "accept_fee": false,
          "payment_method": "santander_installment",
          "description_offer": "santander_installment.description_offer",
          "description_fee": "santander_installment.description_fee",
          "status": "active",
          "is_redirect_method": false,
          "merchant_allowed_countries": ["DK", "DE", "FI", "NO", "AT", "PT", "SE", "CH", "ES"],
          "instruction_text": "Simply enter the credentials of your merchant account with Santander, or apply for a new account at Santander Bank.",
          "thumbnail1": "https://payeverproduction.blob.core.windows.net/miscellaneous/2e551b84-c162-4963-97e6-af960f24d3f3-SANTANDER.png",
          "thumbnail2": "https://payeverproduction.blob.core.windows.net/miscellaneous/2e551b84-c162-4963-97e6-af960f24d3f3-SANTANDER.png",
          "options": {
            "currencies": "*",
            "countries": "*"
          },
          "min": 99,
          "max": 100000
        }
      ]
    }
    """

  Scenario: List payment options by channel set UUID as anonymous should not be allowed
    Given I am not authenticated
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/006388b0-e536-4d71-b1f1-c21a6f1801e6"
    Then the response status code should be 403

  Scenario: Get payment options list by not existent channel set UUID should return not found error
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    When I send a GET request to "/api/shop/oauth/{{businessId}}/payment-options/1234567890"
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Business ChannelSet with type '1234567890' not found"
    }
    """

  Scenario: Get payment options list by not existent business UUID should return not found error
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    When I send a GET request to "/api/shop/oauth/1234567890/payment-options/magento"
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Business with id \"1234567890\" not found!"
    }
    """

  Scenario: List channel sets by business UUID
    Given I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/businesses"
    When I send a GET request to "/api/shop/oauth/{{businessId}}/channel-sets"
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "action": "list_channel_sets",
        "id": "*",
        "created_at": "*",
        "business_id": "{{businessId}}"
      },
      "result": [
        {
          "uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "channel_type": "magento"
        },
        {
          "uuid": "00019b2d-1340-404f-8152-ab126428ae79",
          "channel_type": "shopware"
        }
      ]
    }
    """

  Scenario: List channel sets by business UUID as anonymous should not be allowed
    Given I am not authenticated
    When I send a GET request to "/api/shop/oauth/{{businessId}}/channel-sets"
    Then the response status code should be 403

  Scenario: Get channel sets list by not existent business UUID should return not found error
    Given I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/businesses"
    When I send a GET request to "/api/shop/oauth/1234567890/channel-sets"
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Business with id \"1234567890\" not found!"
    }
    """
