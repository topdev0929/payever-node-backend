@payment-submit-v3
Feature: Payment submit v3
  Scenario: Create payment and submit via TPPM
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
        "body": "{\"payment\":{\"amount\":200,\"address\":{\"addressLine2\":\"Test line 2\",\"city\":\"Elbingerode (Harz)\",\"country\":\"DE\",\"firstName\":\"Grün\",\"lastName\":\"Ampel\",\"street\":\"Test 12 12\",\"streetName\":\"Test 12\",\"streetNumber\":\"12\",\"salutation\":\"SALUTATION_MR\",\"zipCode\":\"38889\",\"email\":\"test@test.com\",\"phone\":\"+4912345678\"},\"apiCallId\":\"*\",\"businessName\":\"Business *\",\"businessId\":\"a803d4c3-c447-4aab-a8c7-c7f184a8e77f\",\"channel\":\"api\",\"channelType\":\"in_store\",\"channelSource\":\"v1.0.2\",\"pluginVersion\":\"1.0.2\",\"channelSetId\":\"2c926572-b2ba-41fb-943d-2f941c356ad8\",\"currency\":\"EUR\",\"customerEmail\":\"test@test.com\",\"customerName\":\"Grün Ampel\",\"customerType\":\"organization\",\"reference\":\"as54a5sd45as4d\",\"deliveryFee\":0,\"total\":200,\"flowId\":\"N/A\"},\"paymentDetails\":{\"iban\":\"DE89370400440532013000\",\"frontendCancelUrl\":\"https://payever.de/cancel\",\"frontendFailureUrl\":\"https://payever.de/failure\",\"frontendFinishUrl\":\"https://payever.de/success\",\"frontendSuccessUrl\":\"https://payever.de/success\",\"birthDate\":\"1990-01-30T00:00:00.000Z\"},\"paymentItems\":[{\"description\":\"test description\",\"identifier\":\"12345\",\"name\":\"Test Item\",\"price\":200,\"priceNet\":200,\"quantity\":1,\"sku\":\"12345\",\"vatRate\":0,\"brand\":\"Apple\",\"totalAmount\":200,\"totalTaxAmount\":0,\"imageUrl\":\"http://img.url\",\"productUrl\":\"http://product.url\"}],\"forceRedirect\":false,\"skipHandlePaymentFee\":true,\"autoCaptureEnabled\":true,\"autoCaptureDate\":\"2024-02-13T15:45:00.000+00:00\"}"
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
    When I send a POST request to "/api/v3/payment/submit" with json:
    """
    {
      "channel": {
        "name": "api",
        "type": "in_store",
        "source": "v1.0.2"
      },
      "purchase": {
        "amount": 200,
        "currency": "EUR",
        "country": "DE",
        "delivery_fee": 0,
        "down_payment": 0
      },
      "customer": {
          "type": "organization",
          "gender": "male",
          "birthdate": "1990-01-30",
          "phone": "+4912345678",
          "email": "test@test.com",
          "social_security_number": "12345678"
      },
      "company": {
          "type": "limited",
          "name": "google",
          "registration_number": "12345",
          "registration_location": "DE",
          "tax_id": "333",
          "homepage": "http://www.google.com",
          "external_id": "999"
      },
      "shipping_option": {
          "name": "Free",
          "carrier": "DHL",
          "category": "pickup",
          "price": 0,
          "tax_rate": 0,
          "tax_amount": 0,
          "details": {
            "timeslot": "2023-02-30",
            "pickup_location": {
              "id": "12345",
              "name": "of3",
              "address": {
                "first_name": "Grün",
                "last_name": "Ampel",
                "street": "Test 12",
                "street_number": "12",
                "salutation": "mr",
                "zip": "38889",
                "country": "DE",
                "city": "Elbingerode (Harz)",
                "organization_name": "Test",
                "street_line_2": "Test line 2",
                "street_name": "Test",
                "house_extension": "A"
              }
            }
          }
      },
      "billing_address": {
        "first_name": "Grün",
        "last_name": "Ampel",
        "street": "Test 12",
        "street_number": "12",
        "salutation": "mr",
        "zip": "38889",
        "country": "DE",
        "city": "Elbingerode (Harz)",
        "organization_name": "Test",
        "street_line_2": "Test line 2",
        "street_name": "Test",
        "house_extension": "A"
      },
      "reference": "as54a5sd45as4d",
      "reference_extra": "ref_extra",
      "payment_method": "santander_invoice_de",
      "cart": [
        {
          "brand": "Apple",
          "name": "Test Item",
          "identifier": "12345",
          "sku": "12345",
          "quantity": 1,
          "unit_price": 200,
          "tax_rate": 0,
          "total_amount": 200,
          "total_tax_amount": 0,
          "description": "test description",
          "image_url": "http://img.url",
          "product_url": "http://product.url",
          "category": "Electronics",
          "attributes": {
            "weight": 10,
            "dimensions": {
              "height": 5,
              "width": 15,
              "length": 10
            }
          }
        }
      ],
      "splits": [
        {
          "type": "marketplace",
          "identifier": "12345",
          "amount": {
            "value": 10,
            "currency": "EUR"
          },
          "reference": "split_ref",
          "description": "split_description"
        }
      ],
      "urls": {
          "redirect": "https://payever.de/redirect",
          "success": "https://payever.de/success",
          "pending": "https://payever.de/pending",
          "cancel": "https://payever.de/cancel",
          "failed": "https://payever.de/failure",
          "notification": "https://payever.de/notification"
      },
      "seller": {
        "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
        "first_name": "sellerFN",
        "last_name": "sellerLN",
        "email": "seller@email.url"
      },
      "options": {
          "allow_separate_shipping_address": true,
          "allow_customer_types": ["person"],
          "allow_cart_step": false,
          "allow_billing_step": false,
          "allow_shipping_step": false,
          "use_inventory": true,
          "use_styles": true,
          "salutation_mandatory": true,
          "phone_mandatory": false,
          "birthdate_mandatory": false,
          "test_mode": true,
          "reusable": false,
          "auto_capture_enabled": true,
          "auto_capture_date": "2024-02-13T15:45:00.000+00:00"
      },
      "plugin_version": "1.0.2",
      "x_frame_host": "http://host.url",
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
    When I send a POST request to "/api/v3/payment/submit" with json:
    """
    {
      "channel": {
        "name": "api",
        "type": "in_store",
        "source": "v1.0.2"
      },
      "purchase": {
        "amount": 200,
        "currency": "EUR",
        "country": "DE",
        "delivery_fee": 0,
        "down_payment": 0
      },
      "customer": {
          "type": "organization",
          "gender": "male",
          "birthdate": "1990-01-30",
          "phone": "+4912345678",
          "email": "test@test.com",
          "social_security_number": "12345678"
      },
      "company": {
          "type": "limited",
          "name": "google",
          "registration_number": "12345",
          "registration_location": "DE",
          "tax_id": "333",
          "homepage": "http://www.google.com",
          "external_id": "999"
      },
      "shipping_option": {
          "name": "Free",
          "carrier": "DHL",
          "category": "pickup",
          "price": 0,
          "tax_rate": 0,
          "tax_amount": 0,
          "details": {
            "timeslot": "2023-02-30",
            "pickup_location": {
              "id": "12345",
              "name": "of3",
              "address": {
                "first_name": "Grün",
                "last_name": "Ampel",
                "street": "Test 12",
                "street_number": "12",
                "salutation": "mr",
                "zip": "38889",
                "country": "DE",
                "city": "Elbingerode (Harz)",
                "organization_name": "Test",
                "street_line_2": "Test line 2",
                "street_name": "Test",
                "house_extension": "A"
              }
            }
          }
      },
      "billing_address": {
        "first_name": "Grün",
        "last_name": "Ampel",
        "street": "Test 12",
        "street_number": "12",
        "salutation": "mr",
        "zip": "38889",
        "country": "DE",
        "city": "Elbingerode (Harz)",
        "organization_name": "Test",
        "street_line_2": "Test line 2",
        "street_name": "Test",
        "house_extension": "A"
      },
      "reference": "as54a5sd45as4d",
      "reference_extra": "ref_extra",
      "payment_method": "",
      "cart": [
        {
          "brand": "Apple",
          "name": "Test Item",
          "identifier": "12345",
          "sku": "12345",
          "quantity": 1,
          "unit_price": 200,
          "tax_rate": 0,
          "total_amount": 200,
          "total_tax_amount": 0,
          "description": "test description",
          "image_url": "http://img.url",
          "product_url": "http://product.url",
          "category": "Electronics",
          "attributes": {
            "weight": 10,
            "dimensions": {
              "height": 5,
              "width": 15,
              "length": 10
            }
          }
        }
      ],
      "splits": [
        {
          "type": "marketplace",
          "identifier": "12345",
          "amount": {
            "value": 10,
            "currency": "EUR"
          },
          "reference": "split_ref",
          "description": "split_description"
        }
      ],
      "urls": {
          "redirect": "https://payever.de/redirect",
          "success": "https://payever.de/success",
          "pending": "https://payever.de/pending",
          "cancel": "https://payever.de/cancel",
          "failed": "https://payever.de/failure",
          "notification": "https://payever.de/notification"
      },
      "seller": {
        "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
        "first_name": "sellerFN",
        "last_name": "sellerLN",
        "email": "seller@email.url"
      },
      "options": {
          "allow_separate_shipping_address": true,
          "allow_customer_types": ["person"],
          "allow_cart_step": false,
          "allow_billing_step": false,
          "allow_shipping_step": false,
          "use_inventory": true,
          "use_styles": true,
          "salutation_mandatory": true,
          "phone_mandatory": false,
          "birthdate_mandatory": false,
          "test_mode": true,
          "reusable": false,
          "auto_capture_enabled": true,
          "auto_capture_date": "2024-02-13T15:45:00.000+00:00"
      },
      "plugin_version": "1.0.2",
      "x_frame_host": "http://host.url",
      "payment_data": {
        "iban": "DE89370400440532013000"
      }
    }
    """
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "value": "",
           "property": "payment_method",
           "children": [],
           "constraints": {
             "isEnum": "payment_method must be a valid enum value",
             "isNotEmpty": "payment_method should not be empty"
           }
         }
       ],
       "statusCode": 400
     }
    """

  Scenario: Client IP is required when risk_session_id is sent
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
    When I send a POST request to "/api/v3/payment/submit" with json:
    """
    {
      "channel": {
        "name": "api",
        "type": "in_store",
        "source": "v1.0.2"
      },
      "purchase": {
        "amount": 200,
        "currency": "EUR",
        "country": "DE",
        "delivery_fee": 0,
        "down_payment": 0
      },
      "customer": {
          "type": "organization",
          "gender": "male",
          "birthdate": "1990-01-30",
          "phone": "+4912345678",
          "email": "test@test.com",
          "social_security_number": "12345678"
      },
      "company": {
          "type": "limited",
          "name": "google",
          "registration_number": "12345",
          "registration_location": "DE",
          "tax_id": "333",
          "homepage": "http://www.google.com",
          "external_id": "999"
      },
      "shipping_option": {
          "name": "Free",
          "carrier": "DHL",
          "category": "pickup",
          "price": 0,
          "tax_rate": 0,
          "tax_amount": 0,
          "details": {
            "timeslot": "2023-02-30",
            "pickup_location": {
              "id": "12345",
              "name": "of3",
              "address": {
                "first_name": "Grün",
                "last_name": "Ampel",
                "street": "Test 12",
                "street_number": "12",
                "salutation": "mr",
                "zip": "38889",
                "country": "DE",
                "city": "Elbingerode (Harz)",
                "organization_name": "Test",
                "street_line_2": "Test line 2",
                "street_name": "Test",
                "house_extension": "A"
              }
            }
          }
      },
      "billing_address": {
        "first_name": "Grün",
        "last_name": "Ampel",
        "street": "Test 12",
        "street_number": "12",
        "salutation": "mr",
        "zip": "38889",
        "country": "DE",
        "city": "Elbingerode (Harz)",
        "organization_name": "Test",
        "street_line_2": "Test line 2",
        "street_name": "Test",
        "house_extension": "A"
      },
      "reference": "as54a5sd45as4d",
      "reference_extra": "ref_extra",
      "payment_method": "santander_invoice_de",
      "cart": [
        {
          "brand": "Apple",
          "name": "Test Item",
          "identifier": "12345",
          "sku": "12345",
          "quantity": 1,
          "unit_price": 200,
          "tax_rate": 0,
          "total_amount": 200,
          "total_tax_amount": 0,
          "description": "test description",
          "image_url": "http://img.url",
          "product_url": "http://product.url",
          "category": "Electronics",
          "attributes": {
            "weight": 10,
            "dimensions": {
              "height": 5,
              "width": 15,
              "length": 10
            }
          }
        }
      ],
      "splits": [
        {
          "type": "marketplace",
          "identifier": "12345",
          "amount": {
            "value": 10,
            "currency": "EUR"
          },
          "reference": "split_ref",
          "description": "split_description"
        }
      ],
      "urls": {
          "redirect": "https://payever.de/redirect",
          "success": "https://payever.de/success",
          "pending": "https://payever.de/pending",
          "cancel": "https://payever.de/cancel",
          "failed": "https://payever.de/failure",
          "notification": "https://payever.de/notification"
      },
      "seller": {
        "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
        "first_name": "sellerFN",
        "last_name": "sellerLN",
        "email": "seller@email.url"
      },
      "options": {
          "allow_separate_shipping_address": true,
          "allow_customer_types": ["person"],
          "allow_cart_step": false,
          "allow_billing_step": false,
          "allow_shipping_step": false,
          "use_inventory": true,
          "use_styles": true,
          "salutation_mandatory": true,
          "phone_mandatory": false,
          "birthdate_mandatory": false,
          "test_mode": true,
          "reusable": false
      },
      "plugin_version": "1.0.2",
      "x_frame_host": "http://host.url",
      "payment_data": {
        "iban": "DE89370400440532013000",
        "risk_session_id": "test_risk"
      }
    }
    """
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
    """
    {
     "errorCode": "291",
     "message": [
       {
         "property": "client_ip",
         "children": [],
         "constraints": {
           "isNotEmpty": "client_ip should not be empty",
           "isString": "client_ip must be a string"
         }
       }
     ],
     "statusCode": 400
    }
    """

  Scenario: Create payment and submit via TPPM with issuer
    Given I am not authenticated
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
        "body": "*"
      },
      "response": {
        "status": 201,
        "body": {
          "id": "834fcd48-96b9-4e4a-9f29-25a57dd6f9c3",
          "createdAt": "2023-09-25T12:42:31.313Z",
          "payment": {
            "deliveryFee": 0,
            "paymentFee": 0,
            "amount": 99.99,
            "address": {
              "city": "Hamburg",
              "country": "DE",
              "email": "testing2@test.de",
              "firstName": "Test",
              "lastName": "Person",
              "phone": "+494763546672",
              "salutation": "SALUTATION_MR",
              "street": "Feldstrasse 21 ",
              "streetName": "Feldstrasse 21 ",
              "zipCode": "25622"
            },
            "apiCallId": "e2bb5ad0-6fa1-4816-a861-01158eb1cb34",
            "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
            "businessName": "ACI",
            "channel": "api",
            "channelSetId": "a898c854-d136-4dc1-aa69-3f353310e937",
            "channelType": "ecommerce",
            "currency": "EUR",
            "customerEmail": "testing2@test.de",
            "customerName": "Test Person",
            "downPayment": 0,
            "flowId": "N/A",
            "paymentIssuer": "aci",
            "paymentType": "nets",
            "reference": "reference",
            "specificStatus": "pending",
            "status": "STATUS_IN_PROCESS",
            "total": 99.99,
            "userId": "intercom-module",
            "locale": "de"
          },
          "paymentDetails": {
            "frontendFinishUrl": "http://success.url",
            "frontendCancelUrl": "http://cancel.url",
            "frontendSuccessUrl": "http://success.url",
            "checkoutId": "9028FCE8E443E9882CB6EAF7AF8EF964.uat01-vm-tx04",
            "dataBrands": [
              "VISA",
              "MASTER",
              "MAESTRO",
              "DISCOVER",
              "DINERS",
              "VPAY",
              "JCB"
            ],
            "dataBrandsString": "VISA MASTER MAESTRO DISCOVER DINERS VPAY JCB"
          },
          "paymentItems": [
            {
              "description": "description",
              "identifier": "KYCC6000",
              "name": "product",
              "price": 99.99,
              "priceNet": 99.99,
              "quantity": 1,
              "sku": "KYCC6000",
              "vatRate": 0
            }
          ],
          "options": {
            "merchantCoversFee": false,
            "shopRedirectEnabled": false,
            "isAutoCaptureEnabled": false,
            "captureType": "CAPTURE_ON_FULFILLMENT",
            "ratesLimits": [],
            "countryLimits": []
          }
        }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/submit/nets"
    When I send a POST request to "/api/v3/payment/submit" with json:
    """
    {
      "payment_data": {},
      "reference": "reference",
      "channel": {
        "name": "api"
      },
      "payment_issuer": "aci",
      "payment_method": "nets",
      "purchase": {
        "amount": 99.99,
        "currency": "EUR"
      },
      "customer": {
        "type": "person",
        "phone": "+494763546672",
        "email": "testing2@test.de"
      },
      "cart": [
        {
          "identifier": "KYCC6000",
          "name": "product",
          "quantity": 1,
          "unit_price": 99.99,
          "total_amount": 99.99,
          "description": "description",
          "thumbnail": "https://image.url",
          "sku": "KYCC6000"
        }
      ],
      "billing_address": {
        "salutation": "mr",
        "first_name": "Test",
        "last_name": "Person",
        "street": "Feldstrasse 21 ",
        "zip": "25622",
        "city": "Hamburg",
        "country": "DE"
      },
      "urls": {
        "success": "http://success.url",
        "failure": "http://failure.url",
        "cancel": "http://cancel.url",
        "notice": "http://notice.url",
        "pending": "http://pending.url"
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
          "frontendFinishUrl": "http://success.url",
          "frontendCancelUrl": "http://cancel.url",
          "frontendSuccessUrl": "http://success.url",
          "checkoutId": "9028FCE8E443E9882CB6EAF7AF8EF964.uat01-vm-tx04",
          "dataBrands": [
            "VISA",
            "MASTER",
            "MAESTRO",
            "DISCOVER",
            "DINERS",
            "VPAY",
            "JCB"
          ],
          "dataBrandsString": "VISA MASTER MAESTRO DISCOVER DINERS VPAY JCB"
        },
        "address": {
          "email": "testing2@test.de",
          "salutation": "SALUTATION_MR",
          "city": "Hamburg",
          "street": "Feldstrasse 21 ",
          "country": "DE",
          "phone": "+494763546672",
          "first_name": "Test",
          "last_name": "Person",
          "zip_code": "25622"
        },
        "amount": 99.99,
        "channel": "api",
        "channel_type": "ecommerce",
        "created_at": "2023-09-25T12:42:31.313Z",
        "currency": "EUR",
        "customer_email": "testing2@test.de",
        "customer_name": "Test Person",
        "delivery_fee": 0,
        "down_payment": 0,
        "id": "*",
        "merchant_name": "ACI",
        "payment_fee": 0,
        "payment_issuer": "aci",
        "payment_type": "nets",
        "reference": "reference",
        "specific_status": "pending",
        "status": "STATUS_IN_PROCESS",
        "total": 99.99
      }
    }
    """

  Scenario: Create payment and submit via TPPM with discount item
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
        "body": "{\"payment\":{\"amount\":200,\"address\":{\"addressLine2\":\"Test line 2\",\"city\":\"Elbingerode (Harz)\",\"country\":\"DE\",\"firstName\":\"Grün\",\"lastName\":\"Ampel\",\"street\":\"Test 12 12\",\"streetName\":\"Test 12\",\"streetNumber\":\"12\",\"salutation\":\"SALUTATION_MR\",\"zipCode\":\"38889\",\"email\":\"test@test.com\",\"phone\":\"+4912345678\"},\"apiCallId\":\"*\",\"businessName\":\"Business *\",\"businessId\":\"a803d4c3-c447-4aab-a8c7-c7f184a8e77f\",\"channel\":\"api\",\"channelType\":\"in_store\",\"channelSource\":\"v1.0.2\",\"pluginVersion\":\"1.0.2\",\"channelSetId\":\"2c926572-b2ba-41fb-943d-2f941c356ad8\",\"currency\":\"EUR\",\"customerEmail\":\"test@test.com\",\"customerName\":\"Grün Ampel\",\"reference\":\"as54a5sd45as4d\",\"deliveryFee\":0,\"total\":200,\"flowId\":\"N/A\"},\"paymentDetails\":{\"iban\":\"DE89370400440532013000\",\"frontendCancelUrl\":\"https://payever.de/cancel\",\"frontendFailureUrl\":\"https://payever.de/failure\",\"frontendFinishUrl\":\"https://payever.de/success\",\"frontendSuccessUrl\":\"https://payever.de/success\",\"birthDate\":\"1990-01-30T00:00:00.000Z\"},\"paymentItems\":[{\"description\":\"test description\",\"identifier\":\"12345\",\"name\":\"Test Item\",\"price\":210,\"priceNet\":210,\"quantity\":1,\"sku\":\"12345\",\"vatRate\":0,\"brand\":\"Apple\",\"totalAmount\":210,\"totalTaxAmount\":0,\"totalDiscountAmount\":10,\"imageUrl\":\"http://img.url\",\"productUrl\":\"http://product.url\",\"type\":\"physical\"}],\"forceRedirect\":false,\"skipHandlePaymentFee\":true,\"autoCaptureEnabled\":true,\"autoCaptureDate\":\"2024-02-13T15:45:00.000+00:00\"}"
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
    When I send a POST request to "/api/v3/payment/submit" with json:
    """
    {
      "channel": {
        "name": "api",
        "type": "in_store",
        "source": "v1.0.2"
      },
      "purchase": {
        "amount": 200,
        "currency": "EUR",
        "country": "DE",
        "delivery_fee": 0,
        "down_payment": 0
      },
      "customer": {
          "type": "organization",
          "gender": "male",
          "birthdate": "1990-01-30",
          "phone": "+4912345678",
          "email": "test@test.com",
          "social_security_number": "12345678"
      },
      "company": {
          "type": "limited",
          "name": "google",
          "registration_number": "12345",
          "registration_location": "DE",
          "tax_id": "333",
          "homepage": "http://www.google.com",
          "external_id": "999"
      },
      "shipping_option": {
          "name": "Free",
          "carrier": "DHL",
          "category": "pickup",
          "price": 0,
          "tax_rate": 0,
          "tax_amount": 0,
          "details": {
            "timeslot": "2023-02-30",
            "pickup_location": {
              "id": "12345",
              "name": "of3",
              "address": {
                "first_name": "Grün",
                "last_name": "Ampel",
                "street": "Test 12",
                "street_number": "12",
                "salutation": "mr",
                "zip": "38889",
                "country": "DE",
                "city": "Elbingerode (Harz)",
                "organization_name": "Test",
                "street_line_2": "Test line 2",
                "street_name": "Test",
                "house_extension": "A"
              }
            }
          }
      },
      "billing_address": {
        "first_name": "Grün",
        "last_name": "Ampel",
        "street": "Test 12",
        "street_number": "12",
        "salutation": "mr",
        "zip": "38889",
        "country": "DE",
        "city": "Elbingerode (Harz)",
        "organization_name": "Test",
        "street_line_2": "Test line 2",
        "street_name": "Test",
        "house_extension": "A"
      },
      "reference": "as54a5sd45as4d",
      "reference_extra": "ref_extra",
      "payment_method": "santander_invoice_de",
      "cart": [
        {
          "brand": "Apple",
          "name": "Test Item",
          "identifier": "12345",
          "sku": "12345",
          "quantity": 1,
          "unit_price": 210,
          "tax_rate": 0,
          "total_amount": 210,
          "total_tax_amount": 0,
          "total_discount_amount": 10,
          "description": "test description",
          "image_url": "http://img.url",
          "product_url": "http://product.url",
          "category": "Electronics",
          "attributes": {
            "weight": 10,
            "dimensions": {
              "height": 5,
              "width": 15,
              "length": 10
            }
          },
          "type": "physical"
        }
      ],
      "splits": [
        {
          "type": "marketplace",
          "identifier": "12345",
          "amount": {
            "value": 10,
            "currency": "EUR"
          },
          "reference": "split_ref",
          "description": "split_description"
        }
      ],
      "urls": {
          "redirect": "https://payever.de/redirect",
          "success": "https://payever.de/success",
          "pending": "https://payever.de/pending",
          "cancel": "https://payever.de/cancel",
          "failed": "https://payever.de/failure",
          "notification": "https://payever.de/notification"
      },
      "seller": {
        "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
        "first_name": "sellerFN",
        "last_name": "sellerLN",
        "email": "seller@email.url"
      },
      "options": {
          "allow_separate_shipping_address": true,
          "allow_customer_types": ["person"],
          "allow_cart_step": false,
          "allow_billing_step": false,
          "allow_shipping_step": false,
          "use_inventory": true,
          "use_styles": true,
          "salutation_mandatory": true,
          "phone_mandatory": false,
          "birthdate_mandatory": false,
          "test_mode": true,
          "reusable": false,
          "auto_capture_enabled": true,
          "auto_capture_date": "2024-02-13T15:45:00.000+00:00"
      },
      "plugin_version": "1.0.2",
      "x_frame_host": "http://host.url",
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
