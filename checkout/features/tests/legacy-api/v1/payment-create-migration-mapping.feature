Feature: Payment create for migration mapping future
  Background:
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/connections"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/channel-sets"
    And I use DB fixture "legacy-api/migration-mapping"
    And I authenticate as a user with the following data:
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
              "businessId": "012c165f-8b88-405f-99e2-82f74339a757"
            }
          ]
        }
      ]
    }
    """

  Scenario: Create payment for global mapping
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
      "original_mapped_payment_method": "santander_installment",
      "payment_method": "zinia_installment_de"
    }
    """

  Scenario: Create payment for existing business mapping
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_invoice_de",
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
       "payment_method": "santander_invoice_de",
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
      "original_mapped_payment_method": "santander_invoice_de",
      "payment_method": "zinia_bnpl_de"
    }
    """

  Scenario: Create payment for non-existing business mapping
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
              "businessId": "4b4218b8-1b9a-48ea-baf9-e30bc543c276"
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
      "payment_method": "santander_invoice_de",
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
       "payment_method": "santander_invoice_de",
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
      "payment_method": "santander_invoice_de"
    }
    """

  Scenario: Create payment with variant id mapping
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
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]",
      "variant_id": "8275e4de-c4ed-4b87-a0e3-ebe678385c2a"
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
       "variant_id": "8275e4de-c4ed-4b87-a0e3-ebe678385c2a",
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
      "original_mapped_payment_method": "santander_installment",
      "payment_method": "zinia_installment_de",
      "variant_id": "7f1f7519-7e35-4112-8560-002e40550549",
      "original_mapped_variant_id": "8275e4de-c4ed-4b87-a0e3-ebe678385c2a"
    }
    """
