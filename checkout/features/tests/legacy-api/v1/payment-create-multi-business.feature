@payment-create-multi-business
Feature: Payment create with multi businesses in token
  Background:
    Given I use DB fixture "legacy-api/payment-create/exists-channel-set-id-and-channel"
  Scenario: Create payment with first business from token (default behaviour)
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
            },
            {
              "acls": [],
              "businessId": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
            },
            {
              "acls": [],
              "businessId": "0a9af1fe-301c-43d0-b49b-4bf1721fa2a3"
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
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
    }
    """

  Scenario: Create payment with given business in "extra" param
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
            },
            {
              "acls": [],
              "businessId": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
            },
            {
              "acls": [],
              "businessId": "0a9af1fe-301c-43d0-b49b-4bf1721fa2a3"
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
      "extra": {
        "business_id": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
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
        "extra": {
         "business_id": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
        },
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
    }
    """

  Scenario: Create payment with wrong business in "extra" param
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
            },
            {
              "acls": [],
              "businessId": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
            },
            {
              "acls": [],
              "businessId": "0a9af1fe-301c-43d0-b49b-4bf1721fa2a3"
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
      "extra": {
        "business_id": "41af0fc3-4fd3-43ac-aaa7-1e85984bd00f"
      }
    }
    """
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "message": "Forbidden"
    }
    """

  Scenario: Create payment by multipart request with first business from token (default behaviour)
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
            },
            {
              "acls": [],
              "businessId": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
            },
            {
              "acls": [],
              "businessId": "0a9af1fe-301c-43d0-b49b-4bf1721fa2a3"
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
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
    }
    """

  Scenario: Create payment by multipart request with business in "extra" param
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
            },
            {
              "acls": [],
              "businessId": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
            },
            {
              "acls": [],
              "businessId": "0a9af1fe-301c-43d0-b49b-4bf1721fa2a3"
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
      |extra         |{"business_id":"c58d4df4-c5eb-4aab-b106-77caadb60f86"}|
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
         "business_id": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
        },
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
    }
    """

  Scenario: Create payment by multipart request with wrong business in "extra" param
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
            },
            {
              "acls": [],
              "businessId": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
            },
            {
              "acls": [],
              "businessId": "0a9af1fe-301c-43d0-b49b-4bf1721fa2a3"
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
      |extra         |{"business_id":"41af0fc3-4fd3-43ac-aaa7-1e85984bd00f"}|
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "message": "Forbidden"
    }
    """

  Scenario: Create payment with given business in header
    Given I set header "x-payever-business" with value "c58d4df4-c5eb-4aab-b106-77caadb60f86"
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
            },
            {
              "acls": [],
              "businessId": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
            },
            {
              "acls": [],
              "businessId": "0a9af1fe-301c-43d0-b49b-4bf1721fa2a3"
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
      "businessId": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
    }
    """

  Scenario: Create payment with wrong business in header
    Given I set header "x-payever-business" with value "wrong_id"
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
            },
            {
              "acls": [],
              "businessId": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
            },
            {
              "acls": [],
              "businessId": "0a9af1fe-301c-43d0-b49b-4bf1721fa2a3"
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
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]"
    }
    """
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "message": "Forbidden"
    }
    """
