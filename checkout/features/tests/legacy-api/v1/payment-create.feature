@payment-create
Feature: Payment
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "plugin_version": "2.33.0",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": "1000",
            "price_netto": "1000.00",
            "vat_rate": "0.00",
            "quantity": 1,
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
        "plugin_version": "2.33.0",
        "api_version": "v1"
      },
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*"
    }
    """
    Then I get "call.id" from response and remember as "createdApiCallId"
    And model "ApiCall" with id "{{createdApiCallId}}" should contain json:
    """
    {
      "_id": "{{createdApiCallId}}",
      "execution_time": "*",
      "customer_redirect_url": "https://payever.de/customer-redirect"
    }
    """

  Scenario: Create payment with empty payment_method should be allowed
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "plugin_version": "2.33.0",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": "1000",
            "price_netto": "1000.00",
            "vat_rate": "0.00",
            "quantity": 1,
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
        "plugin_version": "2.33.0",
        "api_version": "v1"
      },
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*"
    }
    """
    Then I get "call.id" from response and remember as "createdApiCallId"
    And model "ApiCall" with id "{{createdApiCallId}}" should contain json:
    """
    {
      "_id": "{{createdApiCallId}}",
      "execution_time": "*",
      "customer_redirect_url": "https://payever.de/customer-redirect"
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "api",
      "channel_type": "in_store",
      "channel_source": "v1.0.2",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
           "price": "1000",
           "price_netto": "1000.00",
           "vat_rate": "0.00",
           "quantity": 1,
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
        "api_version": "v1"
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
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "channel": "api",
      "channel_type": "in_store",
      "channel_source": "v1.0.2"
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "pos",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_pos_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]",
      "verify_type": "code"
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
            "price": "1000",
            "price_netto": "1000.00",
            "vat_rate": "0.00",
            "quantity": 1,
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
        "api_version": "v1",
        "verify_type": "code"
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

  Scenario: Create payment with missing business id in permissions
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
          "permissions": []
        }
      ]
    }
    """
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
    }
    """
    Then print last response
    Then the response status code should be 401
    And the response should contain json:
    """
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    """

  Scenario: Create payment with big amount
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 500e10,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
        "payment_method": "santander_installment",
        "channel": "other_shopsystem",
        "amount": 5000000000000,
        "fee": 10,
        "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\"}]",
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
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
        "message": "amount must not be greater than 99999999.99"
      },
      "error": "An api error occurred",
      "error_description": "amount must not be greater than 99999999.99"
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 500,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "street_number": "12345678910",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
        "payment_method": "santander_installment",
        "channel": "other_shopsystem",
        "amount": 500,
        "fee": 10,
        "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\"}]",
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
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
        "message": "street_number must be shorter than or equal to 10 characters"
      },
      "error": "An api error occurred",
      "error_description": "street_number must be shorter than or equal to 10 characters"
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "address_line_2": "POST-12345",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]",
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
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": "1000",
            "price_netto": "1000.00",
            "vat_rate": "0.00",
            "quantity": 1,
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
        "address_line_2": "POST-12345",
        "phone": "90212048",
        "email": "sdsd@sdds.eu",
        "success_url": "https://payever.de/success",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
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
        "api_version": "v1"
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
         "channel": "other_shopsystem",
         "amount": 1000,
         "orderId": "sa45s454as399912343211",
         "currency": "EUR",
         "fee": 10,
         "cart": [
           {
             "name": "Apple AirPods",
             "sku": "888462858519",
             "price": "1000",
             "priceNetto": "1000.00",
             "vatRate": "0.00",
             "quantity": 1,
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
         "channel": "other_shopsystem",
         "amount": 1000,
         "orderId": "sa45s454as399912343211",
         "currency": "EUR",
         "fee": 10,
         "cart": [
           {
             "name": "Apple AirPods",
             "sku": "888462858519",
             "price": "1000",
             "priceNetto": "1000.00",
             "vatRate": "0.00",
             "quantity": 1,
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
         "executionTime": "*",
         "createdAt": "*",
         "updatedAt": "*"
       }
      }
    ]
    """

  Scenario: Create payment with shipping address as string
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]",
      "shipping_address": "{\"city\":\"Hamburg\",\"country\":\"DE\",\"street\":\"test\",\"street_number\": \"2b\",\"first_name\":\"First1\",\"last_name\":\"Last2\",\"zip\":\"12345\"}"
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
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": "1000",
            "price_netto": "1000.00",
            "vat_rate": "0.00",
            "quantity": 1,
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
        "shipping_address": {
          "city": "Hamburg",
          "country": "DE",
          "street": "test",
          "street_number": "2b",
          "first_name": "First1",
          "last_name": "Last2",
          "zip": "12345"
        },
        "skip_handle_payment_fee": true,
        "api_version": "v1"
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
         "channel": "other_shopsystem",
         "amount": 1000,
         "orderId": "sa45s454as399912343211",
         "currency": "EUR",
         "fee": 10,
         "cart": [
           {
             "name": "Apple AirPods",
             "sku": "888462858519",
             "price": "1000",
             "priceNetto": "1000.00",
             "vatRate": "0.00",
             "quantity": 1,
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
         "createdAt": "*",
         "updatedAt": "*"
       }
      },
      {
       "name": "checkout.event.api-call.updated",
       "payload": {
         "id": "*",
         "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
         "paymentMethod": "santander_installment",
         "channel": "other_shopsystem",
         "amount": 1000,
         "orderId": "sa45s454as399912343211",
         "currency": "EUR",
         "fee": 10,
         "cart": [
           {
             "name": "Apple AirPods",
             "sku": "888462858519",
             "price": "1000",
             "priceNetto": "1000.00",
             "vatRate": "0.00",
             "quantity": 1,
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
         "executionTime": "*",
         "createdAt": "*",
         "updatedAt": "*"
       }
      }
    ]
    """

  Scenario: Create payment with json cart
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": [
        {
          "name":"Apple AirPods",
          "sku":"888462858519",
          "price":"1000",
          "priceNetto":"1000.00",
          "vatRate":"0.00",
          "quantity":1,
          "description":"",
          "thumbnail":"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
          "url":"https://eplehuset.no/apple-airpods"
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
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": "1000",
            "price_netto": "1000.00",
            "vat_rate": "0.00",
            "quantity": 1,
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
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
    }
    """

  Scenario: Create payment with street number
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "street_number": "12",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": "1000",
            "price_netto": "1000.00",
            "vat_rate": "0.00",
            "quantity": 1,
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
        "street_number": "12",
        "zip": "13132",
        "country": "DE",
        "city": "Vøyenenga",
        "phone": "90212048",
        "email": "sdsd@sdds.eu",
        "success_url": "https://payever.de/success",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
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
         "channel": "other_shopsystem",
         "amount": 1000,
         "orderId": "sa45s454as399912343211",
         "currency": "EUR",
         "fee": 10,
         "cart": [
           {
             "name": "Apple AirPods",
             "sku": "888462858519",
             "price": "1000",
             "priceNetto": "1000.00",
             "vatRate": "0.00",
             "quantity": 1,
             "description": "",
             "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
             "url": "https://eplehuset.no/apple-airpods"
           }
         ],
         "salutation": "",
         "firstName": "weew",
         "lastName": "weew",
         "street": "sdfd",
         "streetNumber": "12",
         "city": "Vøyenenga",
         "zip": "13132",
         "country": "DE",
         "phone": "90212048",
         "email": "sdsd@sdds.eu",
         "successUrl": "https://payever.de/success",
         "failureUrl": "https://payever.de/failure",
         "cancelUrl": "https://payever.de/cancel",
         "createdAt": "*",
         "updatedAt": "*"
       }
      },
      {
       "name": "checkout.event.api-call.updated",
       "payload": {
         "id": "*",
         "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
         "paymentMethod": "santander_installment",
         "channel": "other_shopsystem",
         "amount": 1000,
         "orderId": "sa45s454as399912343211",
         "currency": "EUR",
         "fee": 10,
         "cart": [
           {
             "name": "Apple AirPods",
             "sku": "888462858519",
             "price": "1000",
             "priceNetto": "1000.00",
             "vatRate": "0.00",
             "quantity": 1,
             "description": "",
             "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
             "url": "https://eplehuset.no/apple-airpods"
           }
         ],
         "salutation": "",
         "firstName": "weew",
         "lastName": "weew",
         "street": "sdfd",
         "streetNumber": "12",
         "city": "Vøyenenga",
         "zip": "13132",
         "country": "DE",
         "phone": "90212048",
         "email": "sdsd@sdds.eu",
         "successUrl": "https://payever.de/success",
         "failureUrl": "https://payever.de/failure",
         "cancelUrl": "https://payever.de/cancel",
         "executionTime": "*",
         "createdAt": "*",
         "updatedAt": "*"
       }
      }
    ]
    """

  Scenario: Create payment with wrong salutation, should pass with empty salutation as result
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "salutation": "nosalutation",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": "1000",
            "price_netto": "1000.00",
            "vat_rate": "0.00",
            "quantity": 1,
            "description": "",
            "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
            "url": "https://eplehuset.no/apple-airpods"
          }
        ],
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
        "salutation": "nosalutation",
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
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
    }
    """
    Then I get "call.id" from response and remember as "createdApiCallId"
    And model "ApiCall" with id "{{createdApiCallId}}" should contain json:
    """
    {
      "_id": "{{createdApiCallId}}",
      "salutation": ""
    }
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": "1000",
            "price_netto": "1000.00",
            "vat_rate": "0.00",
            "quantity": 1,
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
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdfsdf",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DEqwerty",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "test@test.com",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
    When I send a POST request to "/api/payment" with json:
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
        "message": "amount should not be empty\norder_id should not be empty\ncurrency should not be empty"
      },
      "error": "An api error occurred",
      "error_description": "amount should not be empty\norder_id should not be empty\ncurrency should not be empty"
    }
    """

  Scenario: Create payment by multipart request
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
    When I send a POST request to "/api/payment" with form data:
      |channel       |other_shopsystem          |
      |amount        |1000                      |
      |fee           |10                        |
      |order_id      |sa45s454as399912343211    |
      |currency      |EUR                       |
      |payment_method|santander_installment     |
      |country       |DE                        |
      |city          |Vøyenenga                 |
      |zip           |13132                     |
      |street        |sdfd                      |
      |phone         |90212048                  |
      |email         |sdsd@sdds.eu              |
      |first_name    |weew                      |
      |last_name     |weew                      |
      |success_url   |https://payever.de/success|
      |cancel_url    |https://payever.de/cancel |
      |failure_url   |https://payever.de/failure|
      |cart          |[{"name":"Apple AirPods"}]|
      |extra         |{"dynamic_descriptor":"test123"}|
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
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods"
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
        "extra": {
          "dynamic_descriptor": "test123"
        },
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
    }
    """

  Scenario: Create payment as anonymous should not be allowed
    Given I am not authenticated
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
    }
    """
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "error": "Forbidden",
      "message": "app.employee-permission.insufficient.error"
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": "1000",
      "fee": "10",
      "order_id": 1245,
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": "1000",
            "price_netto": "1000.00",
            "vat_rate": "0.00",
            "quantity": 1,
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
        "email": "sdsd@sdds.eu",
        "success_url": "https://payever.de/success",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
    }
    """

  Scenario: Create payment with allow cart step and inventory flags
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]",
      "allow_cart_step": true,
      "use_inventory": true,
      "expires_at": "2030-05-01"
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
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": "1000",
            "price_netto": "1000.00",
            "vat_rate": "0.00",
            "quantity": 1,
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
        "allow_cart_step": true,
        "use_inventory": true,
        "expires_at": "2030-05-01",
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
    }
    """

  Scenario: Create payment with payment method
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
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "blablabla",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "phone": "90212048",
      "email": "email@gmail.com",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
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
