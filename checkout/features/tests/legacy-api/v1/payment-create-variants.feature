Feature: Payment with variants
  Background:
    Given I remember as "variantId" following value:
      """
      "765228ec-afb0-4465-b471-83e8521a4ef3"
      """
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

  Scenario: Create payment
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/connections"
    And I use DB fixture "legacy-api/checkouts"
    And I use DB fixture "legacy-api/channel-sets"
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "magento",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "paypal",
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
      "variant_id": "{{variantId}}"
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
        "payment_method": "paypal",
        "channel": "magento",
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
        "variant_id": "{{variantId}}",
        "skip_handle_payment_fee": true,
        "api_version": "v1"
      },
      "redirect_url": "*"
    }
    """

  Scenario: Create payment with invalid variant id
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/connections"
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "paypal",
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
      "variant_id": "04206b2a-a318-40e7-b031-32bbbd879c74"
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
        "payment_method": "paypal",
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "original_cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\"}]",
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
        "variant_id": "04206b2a-a318-40e7-b031-32bbbd879c74",
        "skip_handle_payment_fee": true,
        "api_version": "v1",
        "message": "The variant with \"04206b2a-a318-40e7-b031-32bbbd879c74\" was not found"
      },
      "error": "An api error occurred",
      "error_description": "The variant with \"04206b2a-a318-40e7-b031-32bbbd879c74\" was not found"
    }
    """

  Scenario: Create payment with invalid payment method
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/connections"
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "stripe",
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
      "variant_id": "{{variantId}}"
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
        "payment_method": "stripe",
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "original_cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\"}]",
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
        "variant_id": "765228ec-afb0-4465-b471-83e8521a4ef3",
        "skip_handle_payment_fee": true,
        "api_version": "v1",
        "message": "The variant with \"{{variantId}}\" was not found"
      },
      "error": "An api error occurred",
      "error_description": "The variant with \"{{variantId}}\" was not found"
    }
    """

  Scenario: Create payment with invalid business
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
              "businessId": "006388b0-e536-4d71-b1f1-c21a6f1801e6"
            }
          ]
        }
      ]
    }
    """
    And I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/business-integration-subs"
    And I use DB fixture "legacy-api/connections"
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "paypal",
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
      "variant_id": "{{variantId}}"
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
        "payment_method": "paypal",
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "original_cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\"}]",
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
        "variant_id": "{{variantId}}",
        "skip_handle_payment_fee": true,
        "api_version": "v1",
        "message": "The variant with \"{{variantId}}\" was not found"
      },
      "error": "An api error occurred",
      "error_description": "The variant with \"{{variantId}}\" was not found"
    }
    """

  Scenario: Create payment without existing business integration
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/connections"
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "paypal",
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
      "variant_id": "{{variantId}}"
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
        "payment_method": "paypal",
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "original_cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\"}]",
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
        "variant_id": "{{variantId}}",
        "skip_handle_payment_fee": true,
        "api_version": "v1",
        "message": "The variant with \"{{variantId}}\" was not found"
      },
      "error": "An api error occurred",
      "error_description": "The variant with \"{{variantId}}\" was not found"
    }
    """

  Scenario: Create payment with not installed business integration
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/payment-create/business-integration-subs-not-installed"
    And I use DB fixture "legacy-api/connections"
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "paypal",
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
      "variant_id": "{{variantId}}"
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
        "payment_method": "paypal",
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "original_cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\"}]",
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
        "variant_id": "{{variantId}}",
        "skip_handle_payment_fee": true,
        "api_version": "v1",
        "message": "The variant with \"{{variantId}}\" was not found"
      },
      "error": "An api error occurred",
      "error_description": "The variant with \"{{variantId}}\" was not found"
    }
    """

  Scenario: Create payment with disabled business integration
    Given I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/payment-create/business-integration-subs-disabled"
    And I use DB fixture "legacy-api/connections"
    When I send a POST request to "/api/payment" with json:
    """
    {
      "channel": "other_shopsystem",
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "paypal",
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
      "variant_id": "{{variantId}}"
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
        "payment_method": "paypal",
        "channel": "other_shopsystem",
        "amount": 1000,
        "fee": 10,
        "original_cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\"}]",
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
        "variant_id": "{{variantId}}",
        "skip_handle_payment_fee": true,
        "api_version": "v1",
        "message": "The variant with \"{{variantId}}\" was not found"
      },
      "error": "An api error occurred",
      "error_description": "The variant with \"{{variantId}}\" was not found"
    }
    """

  Scenario: Create payment with wrong data
    When I send a POST request to "/api/payment" with json:
    """
    {
      "variant_id": "{{variantId}}"
    }
    """
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
