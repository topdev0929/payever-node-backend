Feature: Payment create v2, 2fa validation
  Background:
    Given I use DB fixture "legacy-api/payment-create/exists-channel-set-id-and-channel"

  Scenario: Create payment with 2fa = email, missing email
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
    When I send a POST request to "/api/v2/payment" with json:
    """
    {
      "channel": {
        "name": "api"
      },
      "verify": {
        "type": "code",
        "two_factor": "email"
      },
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "billing_address": {
        "country": "DE",
        "city": "Vøyenenga",
        "zip": "13132",
        "street": "sdfd",
        "first_name": "weew",
        "last_name": "weew"
      },
      "phone": "90212048",
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": [
        {
          "name": "Apple AirPods",
          "sku": "888462858519",
          "price": 1000,
          "priceNetto": 1000.00,
          "vatRate": 0.00,
          "quantity": 1,
          "identifier": "12345",
          "description": "",
          "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
          "url": "https://eplehuset.no/apple-airpods"
        }
      ]
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
     "call": {
        "status": "failed",
        "type": "create",
        "id": "*",
        "created_at": "*",
        "channel": {
          "name": "api"
        },
        "verify": {
          "type": "code",
          "two_factor": "email"
        },
        "amount": 1000,
        "fee": 10,
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
        "payment_method": "santander_installment",
        "billing_address": {
          "country": "DE",
          "city": "Vøyenenga",
          "zip": "13132",
          "street": "sdfd",
          "first_name": "weew",
          "last_name": "weew"
        },
        "phone": "90212048",
        "customer_redirect_url": "https://payever.de/customer-redirect",
        "success_url": "https://payever.de/success",
        "cancel_url": "https://payever.de/cancel",
        "failure_url": "https://payever.de/failure",
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": 1000,
            "priceNetto": 1000,
            "vatRate": 0,
            "quantity": 1,
            "identifier": "12345",
            "description": "",
            "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
            "url": "https://eplehuset.no/apple-airpods"
          }
        ],
        "message": "email must be an email"
     },
     "error": "An api error occurred",
     "error_description": "email must be an email"
    }
    """

  Scenario: Create payment with 2fa = sms, missing phone
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
    When I send a POST request to "/api/v2/payment" with json:
    """
    {
      "channel": {
        "name": "api"
      },
      "verify": {
        "type": "code",
        "two_factor": "sms"
      },
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "billing_address": {
        "country": "DE",
        "city": "Vøyenenga",
        "zip": "13132",
        "street": "sdfd",
        "first_name": "weew",
        "last_name": "weew"
      },
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": [
        {
          "name": "Apple AirPods",
          "sku": "888462858519",
          "price": 1000,
          "priceNetto": 1000.00,
          "vatRate": 0.00,
          "quantity": 1,
          "identifier": "12345",
          "description": "",
          "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
          "url": "https://eplehuset.no/apple-airpods"
        }
      ]
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "failed",
        "type": "create",
        "id": "*",
        "created_at": "*",
        "channel": {
          "name": "api"
        },
        "verify": {
          "type": "code",
          "two_factor": "sms"
        },
        "amount": 1000,
        "fee": 10,
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
        "payment_method": "santander_installment",
        "billing_address": {
          "country": "DE",
          "city": "Vøyenenga",
          "zip": "13132",
          "street": "sdfd",
          "first_name": "weew",
          "last_name": "weew"
        },
        "customer_redirect_url": "https://payever.de/customer-redirect",
        "success_url": "https://payever.de/success",
        "cancel_url": "https://payever.de/cancel",
        "failure_url": "https://payever.de/failure",
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": 1000,
            "priceNetto": 1000,
            "vatRate": 0,
            "quantity": 1,
            "identifier": "12345",
            "description": "",
            "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
            "url": "https://eplehuset.no/apple-airpods"
          }
        ],
        "message": "phone should not be empty"
      },
      "error": "An api error occurred",
      "error_description": "phone should not be empty"
    }
    """
