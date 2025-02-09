@legacy-payment-submit
Feature: Payment submit
  Scenario: Create payment and submit
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
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/pay",
        "body": "{\"payment\":{\"amount\":200,\"address\":{\"addressLine2\":\"POST-1234\",\"city\":\"Vøyenenga\",\"country\":\"DE\",\"firstName\":\"weew\",\"lastName\":\"weew\",\"street\":\"sdfd\",\"streetName\":\"sdfd\",\"salutation\":\"\",\"zipCode\":\"13132\",\"email\":\"sdsd@sdds.eu\",\"phone\":\"90212048\"},\"apiCallId\":\"*\",\"businessName\":\"*\",\"businessId\":\"a803d4c3-c447-4aab-a8c7-c7f184a8e77f\",\"channel\":\"api\",\"channelSetId\":\"a888336c-fe1f-439c-b13c-f351db6bbc2e\",\"currency\":\"EUR\",\"customerEmail\":\"sdsd@sdds.eu\",\"customerName\":\"weew weew\",\"reference\":\"sa45s454as399912343211\",\"deliveryFee\":0,\"total\":200,\"flowId\":\"N/A\",\"shippingAddress\":{\"addressLine2\":\"POST-98765\",\"city\":\"Hamburg\",\"country\":\"DE\",\"firstName\":\"First1\",\"lastName\":\"Last2\",\"street\":\"test\",\"streetName\":\"test\",\"salutation\":\"\",\"zipCode\":\"12345\"}},\"paymentDetails\":{\"iban\":\"DE89370400440532013000\",\"paramAsSnakeCase\":\"test_data1\",\"paramAsCamelCase\":\"test_data2\",\"birthDate\":\"1990-05-06T00:00:00.000Z\"},\"paymentItems\":[{\"description\":\"\",\"name\":\"Apple AirPods\",\"price\":\"1000\",\"priceNet\":\"1000.00\",\"quantity\":1,\"sku\":\"888462858519\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\",\"vatRate\":\"0.00\"}],\"clientIp\":\"24.25.26.27\"}"
      },
      "response": {
        "status": 201,
        "body": {
          "id": "wew48e6f56sd35bg4sd",
          "createdAt": "2018-08-09T06:26:13.000Z",
          "payment": {
           "deliveryFee": 0,
           "paymentFee": 0,
           "amount": 200,
           "address": {
             "addressLine2": "POST-1234",
             "city": "Berlin",
             "country": "DE",
             "email": "test@test.com",
             "firstName": "First name",
             "lastName": "Last name",
             "phone": "+4798765432",
             "salutation": "MR",
             "street": "street 2",
             "zipCode": "1234"
           },
           "businessId": "456",
           "businessName": "business-1",
           "channel": "api",
           "channelSetId": "123",
           "currency": "EUR",
           "customerEmail": "test@test.com",
           "customerName": "Test",
           "downPayment": 0,
           "flowId": "flow123",
           "paymentType": "santander_invoice_de",
           "reference": "qwerty",
           "shippingAddress": {
              "addressLine2": "POST-98765",
              "city":"Hamburg",
              "country":"DE",
              "street":"test",
              "firstName":"First1",
              "lastName":"Last2",
              "zipCode":"12345"
           },
           "specificStatus": "ACCEPTED",
           "status": "STATUS_ACCEPTED",
           "total": 200
          },
          "paymentDetails": {
           "birthday": "1980-01-01T09:34:08.700Z",
           "conditionsAccepted": true,
           "reservationUniqueId": "31HA07BC818A3AB1C8576D954D4C16C8",
           "usageText": "test_usage_text",
           "posVerifyType": true,
           "posMerchantMode": 0
          },
          "paymentItems": [],
          "options": {
           "merchantCoversFee": false,
           "shopRedirectEnabled": false
          }
        }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/submit/santander-invoice-de"
    When I send a POST request to "/api/payment/submit" with json:
    """
    {
      "channel": "api",
      "amount": 200,
      "fee": 0,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_invoice_de",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "address_line_2": "POST-1234",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "birthdate": "1990-05-06",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]",
      "payment_data": {
        "iban": "DE89370400440532013000",
        "param_as_snake_case": "test_data1",
        "paramAsCamelCase": "test_data2",
        "risk_session_id": "test_risk"
      },
      "shipping_address": {
        "address_line_2": "POST-98765",
        "city":"Hamburg",
        "country":"DE",
        "street":"test",
        "first_name":"First1",
        "last_name":"Last2",
        "zip":"12345"
      },
      "client_ip": "24.25.26.27",
      "verify_type": "code",
      "verify_two_factor": "sms"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*"
      },
      "result": {
        "payment_details": {
          "birthday": "1980-01-01T09:34:08.700Z",
          "conditionsAccepted": true,
          "reservationUniqueId": "31HA07BC818A3AB1C8576D954D4C16C8",
          "usageText": "test_usage_text",
          "posVerifyType": true,
          "posMerchantMode": 0
        },
        "address": {
          "address_line_2": "POST-1234",
          "email": "test@test.com",
          "salutation": "MR",
          "city": "Berlin",
          "street": "street 2",
          "country": "DE",
          "phone": "+4798765432",
          "first_name": "First name",
          "last_name": "Last name",
          "zip_code": "1234"
        },
        "amount": 200,
        "channel": "api",
        "created_at": "2018-08-09T06:26:13.000Z",
        "currency": "EUR",
        "customer_email": "test@test.com",
        "customer_name": "Test",
        "delivery_fee": 0,
        "down_payment": 0,
        "id": "wew48e6f56sd35bg4sd",
        "merchant_name": "business-1",
        "payment_fee": 0,
        "payment_type": "santander_invoice_de",
        "reference": "qwerty",
        "shipping_address": {
          "address_line_2": "POST-98765",
          "city":"Hamburg",
          "country":"DE",
          "street":"test",
          "first_name":"First1",
          "last_name":"Last2",
          "zip_code":"12345"
        },
        "specific_status": "ACCEPTED",
        "status": "STATUS_ACCEPTED",
        "total": 200
      }
    }
    """

  Scenario: Create payment and submit with empty payment_method is not allowed
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
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I use DB fixture "connection/checkout-connection/submit/santander-invoice-de"
    When I send a POST request to "/api/payment/submit" with json:
    """
    {
      "channel": "api",
      "amount": 200,
      "fee": 0,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "address_line_2": "POST-1234",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "birthdate": "1990-05-06",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]",
      "payment_data": {
        "iban": "DE89370400440532013000",
        "param_as_snake_case": "test_data1",
        "paramAsCamelCase": "test_data2",
        "risk_session_id": "test_risk"
      },
      "shipping_address": {
        "address_line_2": "POST-98765",
        "city":"Hamburg",
        "country":"DE",
        "street":"test",
        "first_name":"First1",
        "last_name":"Last2",
        "zip":"12345"
      },
      "client_ip": "24.25.26.27",
      "verify_type": "code",
      "verify_two_factor": "sms"
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
         "channel": "api",
         "amount": 200,
         "fee": 0,
         "order_id": "sa45s454as399912343211",
         "currency": "EUR",
         "payment_method": "",
         "country": "DE",
         "city": "Vøyenenga",
         "zip": "13132",
         "street": "sdfd",
         "address_line_2": "POST-1234",
         "phone": "90212048",
         "email": "sdsd@sdds.eu",
         "birthdate": "1990-05-06",
         "first_name": "weew",
         "last_name": "weew",
         "success_url": "https://payever.de/success",
         "cancel_url": "https://payever.de/cancel",
         "failure_url": "https://payever.de/failure",
         "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\"}]",
         "payment_data": {
           "iban": "DE89370400440532013000",
           "param_as_snake_case": "test_data1",
           "paramAsCamelCase": "test_data2",
           "risk_session_id": "test_risk"
         },
         "shipping_address": {
           "address_line_2": "POST-98765",
           "city": "Hamburg",
           "country": "DE",
           "street": "test",
           "first_name": "First1",
           "last_name": "Last2",
           "zip": "12345"
         },
         "client_ip": "*",
         "verify_type": "code",
         "verify_two_factor": "sms",
         "message": "payment_method must be a valid enum value"
       },
       "error": "An api error occurred",
       "error_description": "payment_method must be a valid enum value"
     }
    """

  Scenario: Create payment and submit with channel subtype
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
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/pay",
        "body": "{\"payment\":{\"amount\":200,\"address\":{\"addressLine2\":\"POST-1234\",\"city\":\"Vøyenenga\",\"country\":\"DE\",\"firstName\":\"weew\",\"lastName\":\"weew\",\"street\":\"sdfd\",\"streetName\":\"sdfd\",\"salutation\":\"\",\"zipCode\":\"13132\",\"email\":\"sdsd@sdds.eu\",\"phone\":\"90212048\"},\"apiCallId\":\"*\",\"businessName\":\"*\",\"businessId\":\"a803d4c3-c447-4aab-a8c7-c7f184a8e77f\",\"channel\":\"api\",\"channelType\":\"in_store\",\"channelSource\":\"v1.0.2\",\"channelSetId\":\"2c926572-b2ba-41fb-943d-2f941c356ad8\",\"currency\":\"EUR\",\"customerEmail\":\"sdsd@sdds.eu\",\"customerName\":\"weew weew\",\"reference\":\"sa45s454as399912343211\",\"deliveryFee\":0,\"total\":200,\"flowId\":\"N/A\",\"shippingAddress\":{\"addressLine2\":\"POST-98765\",\"city\":\"Hamburg\",\"country\":\"DE\",\"firstName\":\"First1\",\"lastName\":\"Last2\",\"street\":\"test\",\"streetName\":\"test\",\"salutation\":\"\",\"zipCode\":\"12345\"}},\"paymentDetails\":{\"iban\":\"DE89370400440532013000\"},\"paymentItems\":[{\"description\":\"\",\"name\":\"Apple AirPods\",\"price\":\"1000\",\"priceNet\":\"1000.00\",\"quantity\":1,\"sku\":\"888462858519\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\",\"vatRate\":\"0.00\"}]}"
      },
      "response": {
        "status": 201,
        "body": {
          "id": "wew48e6f56sd35bg4sd",
          "createdAt": "2018-08-09T06:26:13.000Z",
          "payment": {
           "deliveryFee": 0,
           "paymentFee": 0,
           "amount": 200,
           "address": {
             "addressLine2": "POST-1234",
             "city": "Berlin",
             "country": "DE",
             "email": "test@test.com",
             "firstName": "First name",
             "lastName": "Last name",
             "phone": "+4798765432",
             "salutation": "MR",
             "street": "street 2",
             "zipCode": "1234"
           },
           "businessId": "456",
           "businessName": "business-1",
           "channel": "api",
           "channelType": "in_store",
           "channelSource": "v1.0.2",
           "channelSetId": "123",
           "currency": "EUR",
           "customerEmail": "test@test.com",
           "customerName": "Test",
           "downPayment": 0,
           "flowId": "flow123",
           "paymentType": "santander_invoice_de",
           "reference": "qwerty",
           "shippingAddress": {
              "addressLine2": "POST-98765",
              "city":"Hamburg",
              "country":"DE",
              "street":"test",
              "firstName":"First1",
              "lastName":"Last2",
              "zipCode":"12345"
           },
           "specificStatus": "ACCEPTED",
           "status": "STATUS_ACCEPTED",
           "total": 200
          },
          "paymentDetails": {
           "birthday": "1980-01-01T09:34:08.700Z",
           "conditionsAccepted": true,
           "reservationUniqueId": "31HA07BC818A3AB1C8576D954D4C16C8",
           "usageText": "test_usage_text"
          },
          "paymentItems": [],
          "options": {
           "merchantCoversFee": false,
           "shopRedirectEnabled": false
          }
        }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/submit/santander-invoice-de"
    When I send a POST request to "/api/payment/submit" with json:
    """
    {
      "channel": "api",
      "channel_type": "in_store",
      "channel_source": "v1.0.2",
      "amount": 200,
      "fee": 0,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_invoice_de",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "address_line_2": "POST-1234",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]",
      "payment_data": {
        "iban": "DE89370400440532013000"
      },
      "shipping_address": {
        "address_line_2": "POST-98765",
        "city":"Hamburg",
        "country":"DE",
        "street":"test",
        "first_name":"First1",
        "last_name":"Last2",
        "zip":"12345"
      },
      "client_ip": "24.25.26.27"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*"
      },
      "result": {
        "payment_details": {
          "birthday": "1980-01-01T09:34:08.700Z",
          "conditionsAccepted": true,
          "reservationUniqueId": "31HA07BC818A3AB1C8576D954D4C16C8",
          "usageText": "test_usage_text"
        },
        "address": {
          "address_line_2": "POST-1234",
          "email": "test@test.com",
          "salutation": "MR",
          "city": "Berlin",
          "street": "street 2",
          "country": "DE",
          "phone": "+4798765432",
          "first_name": "First name",
          "last_name": "Last name",
          "zip_code": "1234"
        },
        "amount": 200,
        "channel": "api",
        "channel_type": "in_store",
        "channel_source": "v1.0.2",
        "created_at": "2018-08-09T06:26:13.000Z",
        "currency": "EUR",
        "customer_email": "test@test.com",
        "customer_name": "Test",
        "delivery_fee": 0,
        "down_payment": 0,
        "id": "wew48e6f56sd35bg4sd",
        "merchant_name": "business-1",
        "payment_fee": 0,
        "payment_type": "santander_invoice_de",
        "reference": "qwerty",
        "shipping_address": {
          "address_line_2": "POST-98765",
          "city":"Hamburg",
          "country":"DE",
          "street":"test",
          "first_name":"First1",
          "last_name":"Last2",
          "zip_code":"12345"
        },
        "specific_status": "ACCEPTED",
        "status": "STATUS_ACCEPTED",
        "total": 200
      }
    }
    """

  Scenario: Create payment and submit with street number
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
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/pay",
        "body": "{\"payment\":{\"amount\":200,\"address\":{\"city\":\"Vøyenenga\",\"country\":\"DE\",\"firstName\":\"weew\",\"lastName\":\"weew\",\"street\":\"sdfd 2b\",\"streetName\":\"sdfd\",\"streetNumber\":\"2b\",\"salutation\":\"\",\"zipCode\":\"13132\",\"email\":\"sdsd@sdds.eu\",\"phone\":\"90212048\"},\"apiCallId\":\"*\",\"businessName\":\"*\",\"businessId\":\"a803d4c3-c447-4aab-a8c7-c7f184a8e77f\",\"channel\":\"api\",\"channelSetId\":\"a888336c-fe1f-439c-b13c-f351db6bbc2e\",\"currency\":\"EUR\",\"customerEmail\":\"sdsd@sdds.eu\",\"customerName\":\"weew weew\",\"reference\":\"sa45s454as399912343211\",\"deliveryFee\":0,\"total\":200,\"flowId\":\"N/A\"},\"paymentDetails\":{\"iban\":\"DE89370400440532013000\"},\"paymentItems\":[{\"description\":\"\",\"name\":\"Apple AirPods\",\"price\":\"1000\",\"priceNet\":\"1000.00\",\"quantity\":1,\"sku\":\"888462858519\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\",\"vatRate\":\"0.00\"}]}"
      },
      "response": {
        "status": 201,
        "body": {
          "id": "wew48e6f56sd35bg4sd",
          "createdAt": "2018-08-09T06:26:13.000Z",
          "payment": {
           "deliveryFee": 0,
           "paymentFee": 0,
           "amount": 200,
           "address": {
             "city": "Berlin",
             "country": "DE",
             "email": "test@test.com",
             "firstName": "First name",
             "lastName": "Last name",
             "phone": "+4798765432",
             "salutation": "MR",
             "street": "sdfd 2b",
             "streetNumber": "2b",
             "zipCode": "1234"
           },
           "businessId": "456",
           "businessName": "business-1",
           "channel": "api",
           "channelSetId": "123",
           "currency": "EUR",
           "customerEmail": "test@test.com",
           "customerName": "Test",
           "downPayment": 0,
           "flowId": "flow123",
           "paymentType": "santander_invoice_de",
           "reference": "qwerty",
           "specificStatus": "ACCEPTED",
           "status": "STATUS_ACCEPTED",
           "total": 200
          },
          "paymentDetails": {
           "birthday": "1980-01-01T09:34:08.700Z",
           "conditionsAccepted": true,
           "reservationUniqueId": "31HA07BC818A3AB1C8576D954D4C16C8",
           "usageText": "test_usage_text"
          },
          "paymentItems": [],
          "options": {
           "merchantCoversFee": false,
           "shopRedirectEnabled": false
          }
        }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/submit/santander-invoice-de"
    When I send a POST request to "/api/payment/submit" with json:
    """
    {
      "channel": "api",
      "amount": 200,
      "fee": 0,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_invoice_de",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "street_number": "2b",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]",
      "payment_data": {
        "iban": "DE89370400440532013000"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*"
      },
      "result": {
        "payment_details": {
          "birthday": "1980-01-01T09:34:08.700Z",
          "conditionsAccepted": true,
          "reservationUniqueId": "31HA07BC818A3AB1C8576D954D4C16C8",
          "usageText": "test_usage_text"
        },
        "address": {
          "email": "test@test.com",
          "salutation": "MR",
          "city": "Berlin",
          "street": "sdfd 2b",
          "street_number": "2b",
          "country": "DE",
          "phone": "+4798765432",
          "first_name": "First name",
          "last_name": "Last name",
          "zip_code": "1234"
        },
        "amount": 200,
        "channel": "api",
        "created_at": "2018-08-09T06:26:13.000Z",
        "currency": "EUR",
        "customer_email": "test@test.com",
        "customer_name": "Test",
        "delivery_fee": 0,
        "down_payment": 0,
        "id": "wew48e6f56sd35bg4sd",
        "merchant_name": "business-1",
        "payment_fee": 0,
        "payment_type": "santander_invoice_de",
        "reference": "qwerty",
        "specific_status": "ACCEPTED",
        "status": "STATUS_ACCEPTED",
        "total": 200
      }
    }
    """

  Scenario: Client IP is required when sending risk session id
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
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I use DB fixture "connection/checkout-connection/submit/santander-invoice-de"
    When I send a POST request to "/api/payment/submit" with json:
    """
    {
      "channel": "api",
      "amount": 200,
      "fee": 0,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_invoice_de",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "address_line_2": "POST-1234",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "birthdate": "1990-05-06",
      "first_name": "weew",
      "last_name": "weew",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\/\/eplehuset.no\/static\/version1524729916\/webapi_rest\/_view\/nb_NO\/Magento_Catalog\/images\/product\/placeholder\/.jpg\",\"url\":\"https:\/\/eplehuset.no\/apple-airpods\"}]",
      "payment_data": {
        "iban": "DE89370400440532013000",
        "param_as_snake_case": "test_data1",
        "paramAsCamelCase": "test_data2",
        "risk_session_id": "test_risk"
      },
      "shipping_address": {
        "address_line_2": "POST-98765",
        "city":"Hamburg",
        "country":"DE",
        "street":"test",
        "first_name":"First1",
        "last_name":"Last2",
        "zip":"12345"
      }
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
       "message": "client_ip should not be empty"
     },
     "error": "An api error occurred",
     "error_description": "client_ip should not be empty"
    }
    """
  Scenario: Create payment and submit with expired_at value
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
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/*/action/pay",
        "body": "*"
      },
      "response": {
        "status": 201,
        "body": {
          "id": "wew48e6f56sd35bg4sd",
          "createdAt": "2018-08-09T06:26:13.000Z",
          "payment": {
           "deliveryFee": 0,
           "paymentFee": 0,
           "amount": 200,
           "address": {
             "addressLine2": "POST-1234",
             "city": "Berlin",
             "country": "DE",
             "email": "test@test.com",
             "firstName": "First name",
             "lastName": "Last name",
             "phone": "+4798765432",
             "salutation": "MR",
             "street": "street 2",
             "zipCode": "1234"
           },
           "businessId": "456",
           "businessName": "business-1",
           "channel": "api",
           "channelType": "in_store",
           "channelSource": "v1.0.2",
           "channelSetId": "123",
           "currency": "EUR",
           "customerEmail": "test@test.com",
           "customerName": "Test",
           "downPayment": 0,
           "flowId": "flow123",
           "paymentType": "santander_invoice_de",
           "reference": "qwerty",
           "shippingAddress": {
              "addressLine2": "POST-98765",
              "city":"Hamburg",
              "country":"DE",
              "street":"test",
              "firstName":"First1",
              "lastName":"Last2",
              "zipCode":"12345"
           },
           "specificStatus": "ACCEPTED",
           "status": "STATUS_ACCEPTED",
           "total": 200
          },
          "paymentDetails": {
            "frontendFinishUrl": "http://staging.com",
            "frontendCancelUrl": "http://staging.com"
          },
          "paymentItems": [],
          "options": {
           "merchantCoversFee": false,
           "shopRedirectEnabled": false
          }
        }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/submit/santander-invoice-de"
    When I send a POST request to "/api/payment/submit" with json:
    """
    {
      "channel": "api",
      "amount": 200,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_invoice_de",
      "country": "DE",
      "city": "Vøyenenga",
      "zip": "13132",
      "street": "sdfd",
      "address_line_2": "POST-1234",
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "first_name": "weew",
      "last_name": "weew",
      "cart": [],
      "payment_data": {
        "frontendFinishUrl": "http://staging.com",
        "frontendCancelUrl": "http://staging.com"
      },
      "client_ip": "24.25.26.27",
      "expires_at": "2022-12-06T16:43:47.648Z"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*"
      },
      "result": {
        "payment_details": {
          "frontendFinishUrl": "http://staging.com",
          "frontendCancelUrl": "http://staging.com"
        },
        "address": {
          "address_line_2": "POST-1234",
          "email": "test@test.com",
          "salutation": "MR",
          "city": "Berlin",
          "street": "street 2",
          "country": "DE",
          "phone": "+4798765432",
          "first_name": "First name",
          "last_name": "Last name",
          "zip_code": "1234"
        },
        "amount": 200,
        "channel": "api",
        "created_at": "2018-08-09T06:26:13.000Z",
        "currency": "EUR",
        "customer_email": "test@test.com",
        "customer_name": "Test",
        "delivery_fee": 0,
        "down_payment": 0,
        "id": "wew48e6f56sd35bg4sd",
        "merchant_name": "business-1",
        "payment_fee": 0,
        "payment_type": "santander_invoice_de",
        "reference": "qwerty",
        "specific_status": "ACCEPTED",
        "status": "STATUS_ACCEPTED",
        "total": 200
      }
    }
    """
