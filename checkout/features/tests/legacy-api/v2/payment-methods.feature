@legacy-payment-methods
Feature: Payment submit
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
              "businessId": "{{businessId}}"
            }
          ]
        }
      ]
    }
    """
  Scenario: Get payment methods
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/connections"
    When I send a POST request to "/api/v2/payment/methods" with json:
    """
    {
        "channel": "magento",
        "blocked_payment_methods": [
        ],
        "locale": "de",
        "sorting": {
            "direction": "asc"
        }
    }
    """
    Then the response status code should be 201
    Then print last response
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "action": "list_payment_methods",
        "id": "*",
        "created_at": "*",
        "business_id": "012c165f-8b88-405f-99e2-82f74339a757",
        "channel": "magento"
      },
      "result": [
        {
          "name": "paypal.name",
          "payment_method": "paypal",
          "description": "paypal.description_offer",
          "logo": "https://payeverproduction.blob.core.windows.net/miscellaneous/4a6223a8-cb31-4fcc-b89f-fa93e7512be1-PAYPAL.png",
          "currencies": [
          ],
          "countries": [
          ],
          "max": 22000,
          "min": 5,
          "options": {
            "accept_fee": true,
            "fixed_fee": 0.35,
            "is_redirect_method": true,
            "is_submit_method": false,
            "shipping_address_allowed": true,
            "shipping_address_equality": false,
            "variable_fee": 1.9,
            "rates": false
          },
          "variants": [
            {
              "accept_fee": true,
              "name": "Paypal main",
              "shipping_address_allowed": true,
              "shipping_address_equality": false,
              "variant_id": "765228ec-afb0-4465-b471-83e8521a4ef3"
            },
            {
              "accept_fee": false,
              "name": "Paypal extra",
              "shipping_address_allowed": true,
              "shipping_address_equality": true,
              "variant_id": "aaa794cc-6dbd-4087-aaed-fc37817cb919"
            }
          ]
        },
        {
          "name": "santander_installment.name",
          "payment_method": "santander_installment",
          "description": "santander_installment.description_offer",
          "logo": "https://payeverproduction.blob.core.windows.net/miscellaneous/2e551b84-c162-4963-97e6-af960f24d3f3-SANTANDER.png",
          "currencies": [
            "EUR"
          ],
          "countries": [
            "DE"
          ],
          "max": 100000,
          "min": 99,
          "options": {
            "accept_fee": false,
            "is_redirect_method": false,
            "is_submit_method": false,
            "shipping_address_allowed": true,
            "shipping_address_equality": false,
            "rates": true
          },
          "variants": [
            {
              "accept_fee": true,
              "name": "Santander DE",
              "shipping_address_allowed": true,
              "shipping_address_equality": false,
              "variant_id": "8275e4de-c4ed-4b87-a0e3-ebe678385c2a"
            }
          ]
        },
        {
          "name": "santander_pos_installment.name",
          "payment_method": "santander_pos_installment",
          "description": "santander_pos_installment.description_offer",
          "logo": "https://payeverproduction.blob.core.windows.net/miscellaneous/2e551b84-c162-4963-97e6-af960f24d3f3-SANTANDER.png",
          "currencies": [
            "EUR"
          ],
          "countries": [
            "DE"
          ],
          "max": 100000,
          "min": 99,
          "options": {
            "accept_fee": false,
            "is_redirect_method": false,
            "is_submit_method": false,
            "shipping_address_allowed": false,
            "shipping_address_equality": false,
            "rates": true
          },
          "variants": []
        },
        {
          "name": "santander_pos_invoice_de.name",
          "payment_method": "santander_pos_invoice_de",
          "description": "santander_pos_invoice_de.description_offer",
          "logo": "https://payeverproduction.blob.core.windows.net/miscellaneous/2e551b84-c162-4963-97e6-af960f24d3f3-SANTANDER.png",
          "currencies": [
            "EUR"
          ],
          "countries": [
            "DE"
          ],
          "max": 1500,
          "min": 5,
          "options": {
            "is_redirect_method": false,
            "is_submit_method": false,
            "shipping_address_allowed": false,
            "shipping_address_equality": false,
            "rates": false
          },
          "variants": []
        },
        {
          "name": "zinia_pos_de.name",
          "payment_method": "zinia_pos_de",
          "description": "zinia_pos_de.description_offer",
          "logo": "https://payeverproduction.blob.core.windows.net/miscellaneous/b25580cd-8dd7-488a-8d0f-49046d62c251-OPENBANK.png",
          "currencies": [
            "EUR"
          ],
          "countries": [
            "DE"
          ],
          "max": 750,
          "min": 50,
          "options": {
            "accept_fee": true,
            "fixed_fee": 0,
            "is_redirect_method": true,
            "is_submit_method": false,
            "shipping_address_allowed": true,
            "shipping_address_equality": true,
            "variable_fee": 0,
            "rates": false
          },
          "variants": []
        }
      ]
    }
    """

  Scenario: Get payment methods with blocked
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    When I send a POST request to "/api/v2/payment/methods" with json:
    """
    {
        "channel": "magento",
        "blocked_payment_methods": [
          "paypal"
        ],
        "locale": "de",
        "sorting": {
            "direction": "asc"
        }
    }
    """
    Then the response status code should be 201
    Then print last response
    And the response should not contain json:
    """
    {
      "result": [
        {
          "payment_method": "paypal"
        }
      ]
    }
    """

  Scenario: Get payment methods with custom limits
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/connections"
    When I send a POST request to "/api/v2/payment/methods" with json:
    """
    {
      "channel": "magento",
      "amount": 20000
    }
    """
    Then the response status code should be 201
    Then print last response
    And the response should contain json:
    """
    {
      "result": [
        {
          "payment_method": "paypal"
        }
      ]
    }
    """

  Scenario: Get payment methods without custom limits
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/checkout-integration-subs"
    And I use DB fixture "legacy-api/channel-sets"
    When I send a POST request to "/api/v2/payment/methods" with json:
    """
    {
      "channel": "magento",
      "amount": 20000
    }
    """
    Then the response status code should be 201
    Then print last response
    And the response should not contain json:
    """
    {
      "result": [
        {
          "payment_method": "paypal"
        }
      ]
    }
    """

  Scenario: Get payment method
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    When I send a GET request to "/api/v2/payment/methods/limits?type=santander_installment"
    Then the response status code should be 200
    Then print last response
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "action": "payment_method_limits",
        "id": "*",
        "created_at": "*",
        "business_id": "012c165f-8b88-405f-99e2-82f74339a757"
      },
      "result": {
        "options": {
          "currencies": [
            "EUR"
          ],
          "countries": [
            "DE"
          ]
        },
        "shipping_address_equality": false,
        "shipping_address_allowed": true,
        "max": 100000,
        "min": 99
      }
    }
    """

