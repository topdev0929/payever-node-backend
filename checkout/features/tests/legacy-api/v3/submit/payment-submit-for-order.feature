@payment-submit-for-order-v3
Feature: Payment submit v3
  Background:
    Given I remember as "orderId" following value:
      """
      "5bececc2-dd47-4a3e-8b85-d1e10d019332"
      """

  Scenario: Create payment and submit via TPPM for non-existing order
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
        "country": "DE"
      },
      "customer": {
          "type": "organization",
          "gender": "male",
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
              "address": "DE, Hamburg, 12"
            }
          }
      },
      "reference": "as54a5sd45as4d",
      "reference_extra": "ref_extra",
      "payment_method": "santander_invoice_de",
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
      "order_id": "wrong_order_id",
      "payment_data": {
        "iban": "DE89370400440532013000"
      }
    }
    """
    Then print last response
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "message": "The order by \"wrong_order_id\" was not found"
    }
    """

  Scenario: Create payment and submit via TPPM for other business order
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
              "businessId": "f88996cd-4033-47f2-bcbf-a064d5da233f"
            }
          ]
        }
      ]
    }
    """
    And I use DB fixture "connection/checkout-connection/submit/santander-invoice-de"
    And I use DB fixture "legacy-api/payment-submit/exists-order"
    When I send a POST request to "/api/v3/payment/submit" with json:
    """
    {
      "channel": {
        "name": "api",
        "type": "in_store",
        "source": "v1.0.2"
      },
      "purchase": {
        "country": "DE"
      },
      "customer": {
          "type": "organization",
          "gender": "male",
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
              "address": "DE, Hamburg, 12"
            }
          }
      },
      "reference": "as54a5sd45as4d",
      "reference_extra": "ref_extra",
      "payment_method": "santander_invoice_de",
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
      "order_id": "{{orderId}}",
      "payment_data": {
        "iban": "DE89370400440532013000"
      }
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

  Scenario: Create payment and submit via TPPM for existing order
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
        "body": "{\"payment\":{\"amount\":200,\"address\":{\"city\":\"Elbingerode (Harz)\",\"country\":\"DE\",\"firstName\":\"Grün\",\"lastName\":\"Ampel\",\"street\":\"Test 12 12\",\"streetName\":\"Test 12\",\"streetNumber\":\"12\",\"salutation\":\"SALUTATION_MR\",\"zipCode\":\"38889\",\"email\":\"test@test.com\",\"phone\":\"+4912345678\"},\"apiCallId\":\"*\",\"businessName\":\"Business*\",\"businessId\":\"a803d4c3-c447-4aab-a8c7-c7f184a8e77f\",\"channel\":\"api\",\"channelType\":\"in_store\",\"channelSource\":\"v1.0.2\",\"pluginVersion\":\"1.0.2\",\"channelSetId\":\"2c926572-b2ba-41fb-943d-2f941c356ad8\",\"currency\":\"EUR\",\"customerEmail\":\"test@test.com\",\"customerName\":\"Grün Ampel\",\"reference\":\"as54a5sd45as4d\",\"deliveryFee\":0,\"orderId\":\"5bececc2-dd47-4a3e-8b85-d1e10d019332\",\"total\":200,\"flowId\":\"N/A\",\"shippingAddress\":{\"city\":\"Elbingerode (Harz)\",\"country\":\"DE\",\"firstName\":\"Grün\",\"lastName\":\"Ampel\",\"street\":\"Test 12 12\",\"streetName\":\"Test 12\",\"streetNumber\":\"12\",\"salutation\":\"\",\"zipCode\":\"38889\"},\"company\":{\"externalId\":\"999\",\"homepage\":\"http://www.google.com\",\"name\":\"google\",\"registrationLocation\":\"DE\",\"registrationNumber\":\"12345\",\"taxId\":\"333\",\"type\":\"limited\"},\"shippingOption\":{\"name\":\"Free\",\"carrier\":\"DHL\",\"category\":\"pickup\",\"price\":0,\"taxRate\":0,\"taxAmount\":0,\"details\":{\"timeslot\":\"2023-02-30\",\"pickupLocation\":{\"id\":\"12345\",\"name\":\"of3\"}}}},\"paymentDetails\":{\"iban\":\"DE89370400440532013000\",\"frontendCancelUrl\":\"https://payever.de/cancel\",\"frontendFailureUrl\":\"https://payever.de/failure\",\"frontendFinishUrl\":\"https://payever.de/success\",\"frontendSuccessUrl\":\"https://payever.de/success\",\"birthDate\":\"1990-01-30*\"},\"paymentItems\":[{\"description\":\"test description\",\"identifier\":\"12345\",\"name\":\"Test Item\",\"price\":200,\"priceNet\":200,\"quantity\":1,\"sku\":\"12345\",\"vatRate\":0,\"brand\":\"Apple\",\"totalAmount\":200,\"totalTaxAmount\":0,\"imageUrl\":\"http://img.url\",\"productUrl\":\"http://product.url\"}],\"forceRedirect\":false,\"skipHandlePaymentFee\":true}"
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
    And I use DB fixture "legacy-api/payment-submit/exists-order"
    When I send a POST request to "/api/v3/payment/submit" with json:
    """
    {
      "channel": {
        "name": "api",
        "type": "in_store",
        "source": "v1.0.2"
      },
      "purchase": {
        "country": "DE"
      },
      "customer": {
          "type": "organization",
          "gender": "male",
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
              "name": "of3"
            }
          }
      },
      "reference": "as54a5sd45as4d",
      "reference_extra": "ref_extra",
      "payment_method": "santander_invoice_de",
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
      "order_id": "{{orderId}}",
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
