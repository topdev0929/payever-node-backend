@payment-create-sms-v3
Feature: Payment channel type sms
  Background:
    Given I use DB fixture "legacy-api/payment-create/channel-set-and-channel-sms"

  Scenario: Create payment type sms phone not configured
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
    When I send a POST request to "/api/v3/payment" with json:
    """
    {
      "channel": {
        "name": "api",
        "type": "sms"
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
      "x_frame_host": "http://host.url"
    }
    """
    Then print last response
    Then the response status code should be 412
    And the response should contain json:
    """
    {
      "statusCode": 412,
      "message": "Checkout phone is not configured",
      "error": "Precondition Failed"
    }
    """

  Scenario: Create payment type sms
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
              "businessId": "c58d4df4-c5eb-4aab-b106-77caadb60f86"
            }
          ]
        }
      ]
    }
    """
    Given I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "https://communications-third-party.test.devpayever.com/api/business/c58d4df4-c5eb-4aab-b106-77caadb60f86/integration/twilio/action/send-message",
          "body": "{\"from\":\"+23456789\",\"to\":\"+4912345678\",\"message\":\"https://checkout-wrapper-frontend.devpayever.com/en/pay/api-call/*?channelSetId=d5e798ac-65a4-4aca-bbf4-9843d5d5773f\"}"
        },
        "response": {
          "status": 200,
          "body": "{\"test\": \"ok\"}"
        }
      }
      """
    When I send a POST request to "/api/v3/payment" with json:
    """
    {
      "channel": {
        "name": "api",
        "type": "sms"
      },
      "channel": {
        "name": "api",
        "type": "sms"
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
      "x_frame_host": "http://host.url"
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
        "channel": "api",
        "channel_type": "sms",
        "amount": 200,
        "fee": 0,
        "down_payment": 0,
        "cart": [
         {
           "description": "test description",
           "identifier": "12345",
           "name": "Test Item",
           "price_netto": 200,
           "price": 200,
           "quantity": 1,
           "sku": "12345",
           "vat_rate": 0,
           "brand": "Apple",
           "total_amount": 200,
           "total_tax_amount": 0,
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
        "order_id": "as54a5sd45as4d",
        "currency": "EUR",
        "salutation": "mr",
        "first_name": "Grün",
        "last_name": "Ampel",
        "street": "Test 12",
        "street_name": "Test",
        "street_number": "12",
        "zip": "38889",
        "country": "DE",
        "city": "Elbingerode (Harz)",
        "address_line_2": "Test line 2",
        "birthdate": "1990-01-30",
        "phone": "+4912345678",
        "email": "test@test.com",
        "success_url": "https://payever.de/success",
        "pending_url": "https://payever.de/pending",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
        "notice_url": "https://payever.de/notification",
        "customer_redirect_url": "https://payever.de/redirect",
        "x_frame_host": "http://host.url",
        "allow_cart_step": false,
        "use_inventory": true,
        "seller": {
         "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
         "first_name": "sellerFN",
         "last_name": "sellerLN",
         "email": "seller@email.url"
        },
        "reusable": false,
        "skip_handle_payment_fee": true,
        "plugin_version": "1.0.2",
        "reference_extra": "ref_extra",
        "purchase_country": "DE",
        "customer_type": "organization",
        "customer_gender": "male",
        "company": {
         "type": "limited",
         "name": "google",
         "registration_number": "12345",
         "registration_location": "DE",
         "tax_id": "333",
         "homepage": "http://www.google.com",
         "external_id": "999"
        },
        "organization_name": "Test",
        "house_extension": "A",
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
        "allow_separate_shipping_address": true,
        "allow_customer_types": [
         "person"
        ],
        "allow_billing_step": false,
        "allow_shipping_step": false,
        "use_styles": true,
        "salutation_mandatory": true,
        "phone_mandatory": false,
        "birthdate_mandatory": false,
        "test_mode": true,
        "api_version": "v3"
      }
    }
    """
    And the response should not contain json:
    """
    {
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/pay/api-call/*?channelSetId=006388b0-e536-4d71-b1f1-c21a6f1801e6"
    }
    """
