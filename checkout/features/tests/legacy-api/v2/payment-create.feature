@payment-create-v2
Feature: Payment create v2
  Background:
    Given I use DB fixture "legacy-api/payment-create/exists-channel-set-id-and-channel"

  Scenario: Create payment
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
      "email": "sdsd@sdds.eu",
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
      ],
      "seller": {
        "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
        "first_name": "sellerFN",
        "last_name": "sellerLN",
        "email": "sellerEmail"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "checkout.event.api-call.created",
          "payload": {
            "id": "*",
            "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
            "paymentMethod": "santander_installment",
            "channel": "api",
            "amount": 1000,
            "orderId": "sa45s454as399912343211",
            "currency": "EUR",
            "fee": 10,
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
            "salutation": "",
            "firstName": "weew",
            "lastName": "weew",
            "street": "sdfd",
            "city": "Vøyenenga",
            "zip": "13132",
            "country": "DE",
            "phone": "90212048",
            "email": "sdsd@sdds.eu",
            "successUrl": "https://payever.de/success",
            "failureUrl": "https://payever.de/failure",
            "cancelUrl": "https://payever.de/cancel",
            "customerRedirectUrl": "https://payever.de/customer-redirect",
            "createdAt": "*",
            "updatedAt": "*",
            "seller": {
              "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
              "firstName": "sellerFN",
              "lastName": "sellerLN",
              "email": "sellerEmail"
            }
          }
        }
      ]
      """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "new",
        "type": "create",
        "id": "*",
        "created_at": "*",
        "payment_method": "santander_installment",
        "channel": "api",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": 1000,
            "price_netto": 1000,
            "vat_rate": 0,
            "quantity": 1,
            "identifier": "12345",
            "description": "",
            "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
            "url": "https://eplehuset.no/apple-airpods"
          }
        ],
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
        "first_name": "weew",
        "last_name": "weew",
        "street": "sdfd",
        "zip": "13132",
        "country": "DE",
        "city": "Vøyenenga",
        "phone": "90212048",
        "email": "sdsd@sdds.eu",
        "success_url": "https://payever.de/success",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
        "customer_redirect_url": "https://payever.de/customer-redirect",
        "seller": {
          "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
          "first_name": "sellerFN",
          "last_name": "sellerLN",
          "email": "sellerEmail"
        },
        "skip_handle_payment_fee": true,
        "api_version": "v2"
      },
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=006388b0-e536-4d71-b1f1-c21a6f1801e6"
    }
    """
    Then I get "call.id" from response and remember as "createdApiCallId"
    Then I look for model "ApiCall" with id "createdApiCallId" and remember as "storedApiCall"
    And print storage key "storedApiCall"
    And model "ApiCall" with id "{{createdApiCallId}}" should contain json:
    """
    {
      "_id": "{{createdApiCallId}}",
      "execution_time": "*",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "payment_method": "santander_installment",
      "channel": "api",
      "amount": 1000,
      "fee": 10,
      "cart": [
        {
          "name": "Apple AirPods",
          "sku": "888462858519",
          "price": 1000,
          "price_netto": 1000.00,
          "vat_rate": 0.00,
          "quantity": 1,
          "identifier": "12345",
          "description": "",
          "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
          "url": "https://eplehuset.no/apple-airpods"
        }
      ],
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "salutation": "",
      "first_name": "weew",
      "last_name": "weew",
      "street": "sdfd",
      "city": "Vøyenenga",
      "zip": "13132",
      "country": "DE",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "success_url": "https://payever.de/success",
      "failure_url": "https://payever.de/failure",
      "cancel_url": "https://payever.de/cancel",
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "allow_cart_step": false,
      "use_inventory": false,
      "seller": {
        "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
        "first_name": "sellerFN",
        "last_name": "sellerLN",
        "email": "sellerEmail"
      }
    }
    """

  Scenario: Create payment with empty payment_method is allowed
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
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "",
      "billing_address": {
        "country": "DE",
        "city": "Vøyenenga",
        "zip": "13132",
        "street": "sdfd",
        "first_name": "weew",
        "last_name": "weew"
      },
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
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
      ],
      "seller": {
        "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
        "first_name": "sellerFN",
        "last_name": "sellerLN",
        "email": "sellerEmail"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "new",
        "type": "create",
        "id": "*",
        "created_at": "*",
        "payment_method": "",
        "channel": "api",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": 1000,
            "price_netto": 1000,
            "vat_rate": 0,
            "quantity": 1,
            "identifier": "12345",
            "description": "",
            "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
            "url": "https://eplehuset.no/apple-airpods"
          }
        ],
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
        "first_name": "weew",
        "last_name": "weew",
        "street": "sdfd",
        "zip": "13132",
        "country": "DE",
        "city": "Vøyenenga",
        "phone": "90212048",
        "email": "sdsd@sdds.eu",
        "success_url": "https://payever.de/success",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
        "customer_redirect_url": "https://payever.de/customer-redirect",
        "seller": {
          "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
          "first_name": "sellerFN",
          "last_name": "sellerLN",
          "email": "sellerEmail"
        },
        "skip_handle_payment_fee": true,
        "api_version": "v2"
      },
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=006388b0-e536-4d71-b1f1-c21a6f1801e6"
    }
    """

  Scenario: Create payment with channel sub type and source
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
        "name": "api",
        "type": "in_store",
        "source": "v1.0.2"
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
      "email": "sdsd@sdds.eu",
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
        "status": "new",
        "type": "create",
        "id": "*",
        "created_at": "*",
        "payment_method": "santander_installment",
        "channel": "api",
        "channel_type": "in_store",
        "channel_source": "v1.0.2",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": 1000,
            "price_netto": 1000,
            "vat_rate": 0,
            "quantity": 1,
            "identifier": "12345",
            "description": "",
            "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
            "url": "https://eplehuset.no/apple-airpods"
          }
        ],
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
        "first_name": "weew",
        "last_name": "weew",
        "street": "sdfd",
        "zip": "13132",
        "country": "DE",
        "city": "Vøyenenga",
        "phone": "90212048",
        "email": "sdsd@sdds.eu",
        "success_url": "https://payever.de/success",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
        "customer_redirect_url": "https://payever.de/customer-redirect",
        "skip_handle_payment_fee": true,
        "api_version": "v2"
      },
        "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=49b1fe4f-350d-49ff-905a-e36d2dbdd886"
      }
    """
    Then I get "call.id" from response and remember as "createdApiCallId"
    And model "ApiCall" with id "{{createdApiCallId}}" should contain json:
    """
    {
      "_id": "{{createdApiCallId}}",
      "execution_time": "*",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "payment_method": "santander_installment",
      "channel": "api",
      "channel_type": "in_store",
      "channel_source": "v1.0.2",
      "amount": 1000,
      "fee": 10,
      "cart": [
        {
          "name": "Apple AirPods",
          "sku": "888462858519",
          "price": 1000,
          "price_netto": 1000.00,
          "vat_rate": 0.00,
          "quantity": 1,
          "identifier": "12345",
          "description": "",
          "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
          "url": "https://eplehuset.no/apple-airpods"
        }
      ],
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "salutation": "",
      "first_name": "weew",
      "last_name": "weew",
      "street": "sdfd",
      "city": "Vøyenenga",
      "zip": "13132",
      "country": "DE",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "success_url": "https://payever.de/success",
      "failure_url": "https://payever.de/failure",
      "cancel_url": "https://payever.de/cancel",
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "allow_cart_step": false,
      "use_inventory": false
    }
    """

  Scenario: Create payment with pos channel and verify type = code
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
        "name": "pos"
      },
      "verify": {
        "type": "code"
      },
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_pos_installment",
      "billing_address": {
        "country": "DE",
        "city": "Vøyenenga",
        "zip": "13132",
        "street": "sdfd",
        "first_name": "weew",
        "last_name": "weew"
      },
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
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
        "status": "new",
        "type": "create",
        "id": "*",
        "created_at": "*",
        "payment_method": "santander_pos_installment",
        "channel": "pos",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": 1000,
            "price_netto": 1000,
            "vat_rate": 0,
            "quantity": 1,
            "identifier": "12345",
            "description": "",
            "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
            "url": "https://eplehuset.no/apple-airpods"
          }
        ],
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
        "first_name": "weew",
        "last_name": "weew",
        "street": "sdfd",
        "zip": "13132",
        "country": "DE",
        "city": "Vøyenenga",
        "phone": "90212048",
        "email": "sdsd@sdds.eu",
        "success_url": "https://payever.de/success",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
        "customer_redirect_url": "https://payever.de/customer-redirect",
        "verify_type": "code",
        "skip_handle_payment_fee": true,
        "api_version": "v2"
      },
      "redirect_url": "*"
    }
    """
    Then I get "call.id" from response and remember as "createdApiCallId"
    And model "ApiCall" with id "{{createdApiCallId}}" should contain json:
    """
    {
      "_id": "{{createdApiCallId}}",
      "execution_time": "*",
      "verify_type": "code"
    }
    """
    And model "PaymentCode" found by following JSON should exist:
    """
    {
      "apiCallId": "{{createdApiCallId}}",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
    }
    """

  Scenario: Create payment with shipping address
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
      "email": "sdsd@sdds.eu",
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
      ],
      "shipping_address": {
        "address_line_2": "POST-98765",
        "city":"Hamburg",
        "country":"DE",
        "street":"test",
        "street_number": "2b",
        "first_name":"First1",
        "last_name":"Last2",
        "zip":"12345"
      },
      "locale": "de"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
     "call": {
        "status": "new",
        "type": "create",
        "id": "*",
        "created_at": "*",
        "payment_method": "santander_installment",
        "channel": "api",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": 1000,
            "price_netto": 1000,
            "vat_rate": 0,
            "quantity": 1,
            "identifier": "12345",
            "description": "",
            "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
            "url": "https://eplehuset.no/apple-airpods"
          }
        ],
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
        "first_name": "weew",
        "last_name": "weew",
        "street": "sdfd",
        "zip": "13132",
        "country": "DE",
        "city": "Vøyenenga",
        "phone": "90212048",
        "email": "sdsd@sdds.eu",
        "success_url": "https://payever.de/success",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
        "customer_redirect_url": "https://payever.de/customer-redirect",
        "shipping_address": {
          "address_line_2": "POST-98765",
          "city": "Hamburg",
          "country": "DE",
          "street": "test",
          "street_number": "2b",
          "first_name": "First1",
          "last_name": "Last2",
          "zip": "12345"
        },
        "locale": "de",
        "skip_handle_payment_fee": true,
        "api_version": "v2"
     },
     "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=006388b0-e536-4d71-b1f1-c21a6f1801e6"
   }
    """
    Then I get "call.id" from response and remember as "createdApiCallId"
    And model "ApiCall" with id "{{createdApiCallId}}" should contain json:
    """
    {
      "_id": "{{createdApiCallId}}",
      "execution_time": "*",
      "shipping_address": {"city":"Hamburg","country":"DE","street":"test","street_number": "2b","first_name":"First1","last_name":"Last2","zip":"12345"}
    }
    """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
     {
       "name": "checkout.event.api-call.created",
       "payload": {
         "id": "*",
         "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
         "paymentMethod": "santander_installment",
         "channel": "api",
         "amount": 1000,
         "orderId": "sa45s454as399912343211",
         "currency": "EUR",
         "fee": 10,
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
         "salutation": "",
         "firstName": "weew",
         "lastName": "weew",
         "street": "sdfd",
         "city": "Vøyenenga",
         "zip": "13132",
         "country": "DE",
         "phone": "90212048",
         "email": "sdsd@sdds.eu",
         "shippingAddress": {
           "firstName": "First1",
           "lastName": "Last2",
           "street": "test",
           "streetNumber": "2b",
           "city": "Hamburg",
           "zip": "12345",
           "country": "DE"
         },
         "successUrl": "https://payever.de/success",
         "failureUrl": "https://payever.de/failure",
         "cancelUrl": "https://payever.de/cancel",
         "customerRedirectUrl": "https://payever.de/customer-redirect",
         "createdAt": "*",
         "updatedAt": "*",
         "locale": "de"
       }
     },
     {
       "name": "checkout.event.api-call.updated",
       "payload": {
         "id": "*",
         "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
         "paymentMethod": "santander_installment",
         "channel": "api",
         "amount": 1000,
         "orderId": "sa45s454as399912343211",
         "currency": "EUR",
         "fee": 10,
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
         "salutation": "",
         "firstName": "weew",
         "lastName": "weew",
         "street": "sdfd",
         "city": "Vøyenenga",
         "zip": "13132",
         "country": "DE",
         "phone": "90212048",
         "email": "sdsd@sdds.eu",
         "shippingAddress": {
           "firstName": "First1",
           "lastName": "Last2",
           "street": "test",
           "streetNumber": "2b",
           "city": "Hamburg",
           "zip": "12345",
           "country": "DE"
         },
         "successUrl": "https://payever.de/success",
         "failureUrl": "https://payever.de/failure",
         "cancelUrl": "https://payever.de/cancel",
         "customerRedirectUrl": "https://payever.de/customer-redirect",
         "executionTime": "*",
         "createdAt": "*",
         "updatedAt": "*",
         "locale": "de"
       }
     }
   ]
    """

  Scenario: Create payment with empty email, should pass
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
      "email": "",
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
        "status": "new",
        "type": "create",
        "id": "*",
        "created_at": "*",
        "payment_method": "santander_installment",
        "channel": "api",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": 1000,
            "price_netto": 1000,
            "vat_rate": 0,
            "quantity": 1,
            "identifier": "12345",
            "description": "",
            "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
            "url": "https://eplehuset.no/apple-airpods"
          }
        ],
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
        "first_name": "weew",
        "last_name": "weew",
        "street": "sdfd",
        "zip": "13132",
        "country": "DE",
        "city": "Vøyenenga",
        "phone": "90212048",
        "email": "",
        "success_url": "https://payever.de/success",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
        "customer_redirect_url": "https://payever.de/customer-redirect",
        "skip_handle_payment_fee": true,
        "api_version": "v2"
      },
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=006388b0-e536-4d71-b1f1-c21a6f1801e6"
    }
    """

  Scenario: Create payment with wrong email, validation error returned
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
      "email": "sdfgh",
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
        "message": "email must be an email"
      },
      "error": "An api error occurred",
      "error_description": "email must be an email"
    }
    """

  Scenario: Create payment with wrong country, validation error returned
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
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "billing_address": {
        "country": "DEqwerty",
        "city": "Vøyenenga",
        "zip": "13132",
        "street": "sdfd",
        "first_name": "weew",
        "last_name": "weew"
      },
      "phone": "90212048",
      "email": "",
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
        "message": "country must be shorter than or equal to 2 characters"
      },
      "error": "An api error occurred",
      "error_description": "country must be shorter than or equal to 2 characters"
    }
    """

  Scenario: Create payment with long street number
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
        "street_number": "12345678910",
        "first_name": "weew",
        "last_name": "weew"
      },
      "phone": "90212048",
      "email": "",
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
        "message": "street_number must be shorter than or equal to 10 characters"
      },
      "error": "An api error occurred",
      "error_description": "street_number must be shorter than or equal to 10 characters"
    }
    """

  Scenario: Create payment with negative fee, validation error returned
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
      "amount": 1000,
      "fee": -10,
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
      "email": "",
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
        "message": "fee must not be less than 0"
      },
      "error": "An api error occurred",
      "error_description": "fee must not be less than 0"
    }
    """

  Scenario: Create payment with wrong data
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
    {}
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
        "message": "cart should not be empty\nchannel should not be empty\norder_id should not be empty\namount should not be empty\ncurrency should not be empty"
      },
      "error": "An api error occurred",
      "error_description": "cart should not be empty\nchannel should not be empty\norder_id should not be empty\namount should not be empty\ncurrency should not be empty"
    }
    """

  Scenario: Create payment with wrong types, amount as string, order as number, should pass
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
      "amount": "1000",
      "fee": "10",
      "order_id": 1245,
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
      "email": "",
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
        "status": "new",
        "type": "create",
        "id": "*",
        "created_at": "*",
        "payment_method": "santander_installment",
        "channel": "api",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": 1000,
            "price_netto": 1000,
            "vat_rate": 0,
            "quantity": 1,
            "identifier": "12345",
            "description": "",
            "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
            "url": "https://eplehuset.no/apple-airpods"
          }
        ],
        "order_id": "1245",
        "currency": "EUR",
        "first_name": "weew",
        "last_name": "weew",
        "street": "sdfd",
        "zip": "13132",
        "country": "DE",
        "city": "Vøyenenga",
        "phone": "90212048",
        "email": "",
        "success_url": "https://payever.de/success",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
        "customer_redirect_url": "https://payever.de/customer-redirect",
        "skip_handle_payment_fee": true,
        "api_version": "v2"
     },
     "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=006388b0-e536-4d71-b1f1-c21a6f1801e6"
    }
    """

  Scenario: Create payment with wrong payment method, validation error returned
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
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "blablabla",
      "billing_address": {
        "country": "DE",
        "city": "Vøyenenga",
        "zip": "13132",
        "street": "sdfd",
        "first_name": "weew",
        "last_name": "weew"
      },
      "phone": "90212048",
      "email": "email@gmail.com",
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
        "message": "payment_method must be a valid enum value"
      },
      "error": "An api error occurred",
      "error_description": "payment_method must be a valid enum value"
    }
    """

  Scenario: Create payment with default local from checkout
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
      "email": "sdsd@sdds.eu",
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
      ],
      "seller": {
        "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
        "first_name": "sellerFN",
        "last_name": "sellerLN",
        "email": "sellerEmail"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "checkout.event.api-call.created",
          "payload": {
            "id": "*",
            "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
            "paymentMethod": "santander_installment",
            "channel": "api",
            "amount": 1000,
            "orderId": "sa45s454as399912343211",
            "currency": "EUR",
            "fee": 10,
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
            "salutation": "",
            "firstName": "weew",
            "lastName": "weew",
            "street": "sdfd",
            "city": "Vøyenenga",
            "zip": "13132",
            "country": "DE",
            "phone": "90212048",
            "email": "sdsd@sdds.eu",
            "successUrl": "https://payever.de/success",
            "failureUrl": "https://payever.de/failure",
            "cancelUrl": "https://payever.de/cancel",
            "customerRedirectUrl": "https://payever.de/customer-redirect",
            "createdAt": "*",
            "updatedAt": "*",
            "locale": "de",
            "seller": {
              "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
              "firstName": "sellerFN",
              "lastName": "sellerLN",
              "email": "sellerEmail"
            }
          }
        }
      ]
      """
