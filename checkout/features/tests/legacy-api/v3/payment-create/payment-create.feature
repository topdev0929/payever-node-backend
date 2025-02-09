@payment-create-v3
Feature: Payment create v3
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
    When I send a POST request to "/api/v3/payment" with json:
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
          "notification": "https://payever.de/notification",
          "footer": {
            "disclaimer": "https://payever.de/disclaimer",
            "logo": "https://payever.de/logo",
            "privacy": "https://payever.de/privacy",
            "support": "https://payever.de/support"
          }
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
          "hide_logo": true,
          "hide_imprint": true,
          "disable_validation": true
      },
      "plugin_version": "1.0.2",
      "x_frame_host": "http://host.url"
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
           "paymentMethod": "santander_invoice_de",
           "channel": "api",
           "amount": 200,
           "downPayment": 0,
           "orderId": "as54a5sd45as4d",
           "currency": "EUR",
           "fee": 0,
           "cart": [
             {
               "description": "test description",
               "identifier": "12345",
               "name": "Test Item",
               "price": 200,
               "priceNetto": 200,
               "quantity": 1,
               "sku": "12345",
               "vatRate": 0,
               "brand": "Apple",
               "totalAmount": 200,
               "totalTaxAmount": 0,
               "imageUrl": "http://img.url",
               "productUrl": "http://product.url",
               "category": "Electronics"
             }
           ],
           "salutation": "SALUTATION_MR",
           "firstName": "Grün",
           "lastName": "Ampel",
           "street": "Test 12",
           "streetNumber": "12",
           "city": "Elbingerode (Harz)",
           "zip": "38889",
           "country": "DE",
           "addressLine2": "Test line 2",
           "birthdate": "1990-01-30T00:00:00.000Z",
           "phone": "+4912345678",
           "email": "test@test.com",
           "successUrl": "https://payever.de/success",
           "pendingUrl": "https://payever.de/pending",
           "failureUrl": "https://payever.de/failure",
           "cancelUrl": "https://payever.de/cancel",
           "noticeUrl": "https://payever.de/notification",
           "customerRedirectUrl": "https://payever.de/redirect",
           "xFrameHost": "http://host.url",
           "pluginVersion": "1.0.2",
           "createdAt": "*",
           "updatedAt": "*",
           "seller": {
             "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
             "firstName": "sellerFN",
             "lastName": "sellerLN",
             "email": "seller@email.url"
           }
         }
        },
        {
         "name": "checkout.event.api-call.updated",
         "payload": {
           "id": "*",
           "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
           "paymentMethod": "santander_invoice_de",
           "channel": "api",
           "amount": 200,
           "downPayment": 0,
           "orderId": "as54a5sd45as4d",
           "currency": "EUR",
           "fee": 0,
           "cart": [
             {
               "description": "test description",
               "identifier": "12345",
               "name": "Test Item",
               "price": 200,
               "priceNetto": 200,
               "quantity": 1,
               "sku": "12345",
               "vatRate": 0,
               "brand": "Apple",
               "totalAmount": 200,
               "totalTaxAmount": 0,
               "imageUrl": "http://img.url",
               "productUrl": "http://product.url",
               "category": "Electronics"
             }
           ],
           "salutation": "SALUTATION_MR",
           "firstName": "Grün",
           "lastName": "Ampel",
           "street": "Test 12",
           "streetNumber": "12",
           "city": "Elbingerode (Harz)",
           "zip": "38889",
           "country": "DE",
           "addressLine2": "Test line 2",
           "birthdate": "1990-01-30T00:00:00.000Z",
           "phone": "+4912345678",
           "email": "test@test.com",
           "successUrl": "https://payever.de/success",
           "pendingUrl": "https://payever.de/pending",
           "failureUrl": "https://payever.de/failure",
           "cancelUrl": "https://payever.de/cancel",
           "noticeUrl": "https://payever.de/notification",
           "customerRedirectUrl": "https://payever.de/redirect",
           "xFrameHost": "http://host.url",
           "pluginVersion": "1.0.2",
           "executionTime": "*",
           "createdAt": "*",
           "updatedAt": "*",
           "seller": {
             "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
             "firstName": "sellerFN",
             "lastName": "sellerLN",
             "email": "seller@email.url"
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
       "payment_method": "santander_invoice_de",
       "channel": "api",
       "channel_type": "in_store",
       "channel_source": "v1.0.2",
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
       "api_version": "v3",
       "footer_urls": {
         "disclaimer": "https://payever.de/disclaimer",
         "logo": "https://payever.de/logo",
         "privacy": "https://payever.de/privacy",
         "support": "https://payever.de/support"
       },
       "hide_logo": true,
       "hide_imprint": true,
       "disable_validation": true
      },
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=49b1fe4f-350d-49ff-905a-e36d2dbdd886"
    }
    """
    Then I get "call.id" from response and remember as "createdApiCallId"
    Then I look for model "ApiCall" with id "{{createdApiCallId}}" and remember as "storedApiCall"
    And print storage key "storedApiCall"
    And model "ApiCall" with id "{{createdApiCallId}}" should contain json:
    """
    {
      "_id": "{{createdApiCallId}}",
      "allow_cart_step": false,
      "fee": 0,
      "down_payment": 0,
      "use_inventory": true,
      "two_factor_triggered": false,
      "allow_customer_types": [
       "person"
      ],
      "allow_payment_methods": [],
      "payment_method": "santander_invoice_de",
      "channel": "api",
      "channel_type": "in_store",
      "channel_source": "v1.0.2",
      "amount": 200,
      "original_cart": [
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
      "salutation": "SALUTATION_MR",
      "first_name": "Grün",
      "last_name": "Ampel",
      "street": "Test 12",
      "street_name": "Test",
      "street_number": "12",
      "zip": "38889",
      "country": "DE",
      "city": "Elbingerode (Harz)",
      "address_line_2": "Test line 2",
      "birthdate": "1990-01-30T00:00:00.000Z",
      "phone": "+4912345678",
      "email": "test@test.com",
      "success_url": "https://payever.de/success",
      "pending_url": "https://payever.de/pending",
      "failure_url": "https://payever.de/failure",
      "cancel_url": "https://payever.de/cancel",
      "notice_url": "https://payever.de/notification",
      "customer_redirect_url": "https://payever.de/redirect",
      "x_frame_host": "http://host.url",
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
         "timeslot": "2023-03-02T00:00:00.000Z",
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
      "allow_billing_step": false,
      "allow_shipping_step": false,
      "use_styles": true,
      "salutation_mandatory": true,
      "phone_mandatory": false,
      "birthdate_mandatory": false,
      "test_mode": true,
      "api_version": "v3",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "createdAt": "*",
      "updatedAt": "*",
      "execution_time": "*",
      "footer_urls": {
         "disclaimer": "https://payever.de/disclaimer",
         "logo": "https://payever.de/logo",
         "privacy": "https://payever.de/privacy",
         "support": "https://payever.de/support"
       },
       "hide_logo": true,
       "hide_imprint": true,
       "disable_validation": true
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
    When I send a POST request to "/api/v3/payment" with json:
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
          "notification": "https://payever.de/notification",
          "footer": {
            "disclaimer": "https://payever.de/disclaimer",
            "logo": "https://payever.de/logo",
            "privacy": "https://payever.de/privacy",
            "support": "https://payever.de/support"
          }
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
          "hide_logo": true,
          "hide_imprint": true
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
       "payment_method": "",
       "channel": "api",
       "channel_type": "in_store",
       "channel_source": "v1.0.2",
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
      },
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=49b1fe4f-350d-49ff-905a-e36d2dbdd886"
    }
    """

  Scenario: Create payment with organization type requires company data
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
    Then the response status code should be 400
    And the response should contain json:
    """
    {
      "errorCode": "310",
      "message": [
      {
        "property": "company",
        "children": [],
        "constraints": {
          "isNotEmpty": "company should not be empty"
        }
      }
      ],
      "statusCode": 400
    }
    """

  Scenario: Create payment with type person works without company data
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
          "type": "person",
          "gender": "male",
          "birthdate": "1990-01-30",
          "phone": "+4912345678",
          "email": "test@test.com",
          "social_security_number": "12345678"
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
       "channel_type": "in_store",
       "channel_source": "v1.0.2",
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
       "customer_type": "person",
       "customer_gender": "male",
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
      },
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=49b1fe4f-350d-49ff-905a-e36d2dbdd886"
      }
    """

  Scenario: Create payment with missing data
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
    {}
    """
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
    """
    {
      "errorCode": "000",
      "message": [
       {
         "property": "channel",
         "children": [],
         "constraints": {
           "isNotEmpty": "channel should not be empty"
         }
       },
       {
         "property": "reference",
         "children": [],
         "constraints": {
           "isNotEmpty": "reference should not be empty",
           "isString": "reference must be a string"
         }
       },
       {
         "property": "purchase",
         "children": [],
         "constraints": {
           "isNotEmpty": "purchase should not be empty"
         }
       },
       {
         "property": "customer",
         "children": [],
         "constraints": {
           "isNotEmpty": "customer should not be empty"
         }
       },
       {
         "property": "cart",
         "children": [],
         "constraints": {
           "isNotEmpty": "cart should not be empty"
         }
       }
      ],
      "statusCode": 400
    }
    """

  Scenario: Create payment with missing data and log_level = debug returns array or error codes
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
      "log_level": "debug"
    }
    """
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
    """
    {
      "errorCode": [
        "150",
        "292",
        "300",
        "380",
        "110"
      ],
      "message": [
       {
         "property": "channel",
         "children": [],
         "constraints": {
           "isNotEmpty": "channel should not be empty"
         }
       },
       {
         "property": "reference",
         "children": [],
         "constraints": {
           "isNotEmpty": "reference should not be empty",
           "isString": "reference must be a string"
         }
       },
       {
         "property": "purchase",
         "children": [],
         "constraints": {
           "isNotEmpty": "purchase should not be empty"
         }
       },
       {
         "property": "customer",
         "children": [],
         "constraints": {
           "isNotEmpty": "customer should not be empty"
         }
       },
       {
         "property": "cart",
         "children": [],
         "constraints": {
           "isNotEmpty": "cart should not be empty"
         }
       }
      ],
      "statusCode": 400
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
    When I send a POST request to "/api/v3/payment" with json:
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
        "street_number": "12345678910",
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
    Then the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "value": {
             "first_name": "Grün",
             "last_name": "Ampel",
             "street": "Test 12",
             "street_number": "12345678910",
             "salutation": "mr",
             "zip": "38889",
             "country": "DE",
             "city": "Elbingerode (Harz)",
             "organization_name": "Test",
             "street_line_2": "Test line 2",
             "street_name": "Test",
             "house_extension": "A"
           },
           "property": "billing_address",
           "children": [
             {
               "value": "12345678910",
               "property": "street_number",
               "children": [],
               "constraints": {
                 "isLength": "street_number must be shorter than or equal to 10 characters"
               }
             }
           ]
         }
       ],
       "statusCode": 400
     }
    """

  Scenario: Create payment with issuer
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
    When I send a POST request to "/api/v3/payment" with json:
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
          "name": "prodict",
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
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "checkout.event.api-call.created",
          "payload": {
            "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
            "paymentIssuer": "aci",
            "paymentMethod": "nets",
            "channel": "api",
            "amount": 99.99,
            "downPayment": 0,
            "orderId": "reference",
            "currency": "EUR",
            "fee": 0,
            "cart": [
              {
                "description": "description",
                "identifier": "KYCC6000",
                "name": "prodict",
                "price": 99.99,
                "priceNetto": 99.99,
                "quantity": 1,
                "sku": "KYCC6000",
                "vatRate": 0,
                "totalAmount": 99.99
              }
            ],
            "salutation": "SALUTATION_MR",
            "firstName": "Test",
            "lastName": "Person",
            "street": "Feldstrasse 21 ",
            "city": "Hamburg",
            "zip": "25622",
            "country": "DE",
            "phone": "+494763546672",
            "email": "testing2@test.de",
            "successUrl": "http://success.url",
            "pendingUrl": "http://pending.url",
            "cancelUrl": "http://cancel.url"
          }
        },
        {
          "name": "checkout.event.api-call.updated",
          "payload": {
            "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
            "paymentIssuer": "aci",
            "paymentMethod": "nets",
            "channel": "api",
            "amount": 99.99,
            "downPayment": 0,
            "orderId": "reference",
            "currency": "EUR",
            "fee": 0,
            "cart": [
              {
                "description": "description",
                "identifier": "KYCC6000",
                "name": "prodict",
                "price": 99.99,
                "priceNetto": 99.99,
                "quantity": 1,
                "sku": "KYCC6000",
                "vatRate": 0,
                "totalAmount": 99.99
              }
            ],
            "salutation": "SALUTATION_MR",
            "firstName": "Test",
            "lastName": "Person",
            "street": "Feldstrasse 21 ",
            "city": "Hamburg",
            "zip": "25622",
            "country": "DE",
            "phone": "+494763546672",
            "email": "testing2@test.de",
            "successUrl": "http://success.url",
            "pendingUrl": "http://pending.url",
            "cancelUrl": "http://cancel.url"
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
        "payment_method": "nets",
        "payment_issuer": "aci",
        "channel": "api",
        "amount": 99.99,
        "fee": 0,
        "down_payment": 0,
        "cart": [
          {
            "description": "description",
            "identifier": "KYCC6000",
            "name": "prodict",
            "price_netto": 99.99,
            "price": 99.99,
            "quantity": 1,
            "sku": "KYCC6000",
            "vat_rate": 0,
            "total_amount": 99.99
          }
        ],
        "order_id": "reference",
        "currency": "EUR",
        "salutation": "mr",
        "first_name": "Test",
        "last_name": "Person",
        "street": "Feldstrasse 21 ",
        "zip": "25622",
        "country": "DE",
        "city": "Hamburg",
        "phone": "+494763546672",
        "email": "testing2@test.de",
        "success_url": "http://success.url",
        "pending_url": "http://pending.url",
        "cancel_url": "http://cancel.url",
        "payment_data": {},
        "skip_handle_payment_fee": true,
        "customer_type": "person",
        "test_mode": false,
        "api_version": "v3"
      },
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*"
    }
    """
    Then I get "call.id" from response and remember as "createdApiCallId"
    Then I look for model "ApiCall" with id "{{createdApiCallId}}" and remember as "storedApiCall"
    And print storage key "storedApiCall"
    And model "ApiCall" with id "{{createdApiCallId}}" should contain json:
    """
    {
      "allow_cart_step": false,
      "fee": 0,
      "down_payment": 0,
      "use_inventory": false,
      "two_factor_triggered": false,
      "allow_customer_types": [],
      "allow_payment_methods": [],
      "payment_method": "nets",
      "payment_issuer": "aci",
      "channel": "api",
      "amount": 99.99,
      "original_cart": [
        {
          "identifier": "KYCC6000",
          "name": "prodict",
          "quantity": 1,
          "unit_price": 99.99,
          "total_amount": 99.99,
          "description": "description",
          "thumbnail": "https://image.url",
          "sku": "KYCC6000"
        }
      ],
      "cart": [
        {
          "description": "description",
          "identifier": "KYCC6000",
          "name": "prodict",
          "price_netto": 99.99,
          "price": 99.99,
          "quantity": 1,
          "sku": "KYCC6000",
          "vat_rate": 0,
          "total_amount": 99.99
        }
      ],
      "order_id": "reference",
      "currency": "EUR",
      "salutation": "SALUTATION_MR",
      "first_name": "Test",
      "last_name": "Person",
      "street": "Feldstrasse 21 ",
      "zip": "25622",
      "country": "DE",
      "city": "Hamburg",
      "phone": "+494763546672",
      "email": "testing2@test.de",
      "success_url": "http://success.url",
      "pending_url": "http://pending.url",
      "cancel_url": "http://cancel.url",
      "skip_handle_payment_fee": true,
      "customer_type": "person",
      "splits": [],
      "test_mode": false,
      "api_version": "v3",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
    }
    """

  Scenario: Create payment with unsupported language
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
      "locale": "some-unsupported-language",
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
          "notification": "https://payever.de/notification",
          "footer": {
            "disclaimer": "https://payever.de/disclaimer",
            "logo": "https://payever.de/logo",
            "privacy": "https://payever.de/privacy",
            "support": "https://payever.de/support"
          }
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
          "hide_logo": true,
          "hide_imprint": true
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
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/en/pay/api-call/*?channelSetId=49b1fe4f-350d-49ff-905a-e36d2dbdd886"
    }
    """

  Scenario: Create payment with discount per item
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
          "total_discount_amount": 10,
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
          "notification": "https://payever.de/notification",
          "footer": {
            "disclaimer": "https://payever.de/disclaimer",
            "logo": "https://payever.de/logo",
            "privacy": "https://payever.de/privacy",
            "support": "https://payever.de/support"
          }
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
          "hide_logo": true,
          "hide_imprint": true
      },
      "plugin_version": "1.0.2",
      "x_frame_host": "http://host.url"
    }
    """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
         "name": "checkout.event.api-call.created",
         "payload": {
           "id": "*",
           "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
           "paymentMethod": "santander_invoice_de",
           "channel": "api",
           "amount": 200,
           "downPayment": 0,
           "orderId": "as54a5sd45as4d",
           "currency": "EUR",
           "fee": 0,
           "cart": [
             {
               "description": "test description",
               "identifier": "12345",
               "name": "Test Item",
               "price": 210,
               "priceNetto": 210,
               "quantity": 1,
               "sku": "12345",
               "vatRate": 0,
               "brand": "Apple",
               "totalAmount": 210,
               "totalTaxAmount": 0,
               "imageUrl": "http://img.url",
               "productUrl": "http://product.url",
               "category": "Electronics",
               "totalDiscountAmount": 10,
               "type": "physical"
             }
           ],
           "salutation": "SALUTATION_MR",
           "firstName": "Grün",
           "lastName": "Ampel",
           "street": "Test 12",
           "streetNumber": "12",
           "city": "Elbingerode (Harz)",
           "zip": "38889",
           "country": "DE",
           "addressLine2": "Test line 2",
           "birthdate": "1990-01-30T00:00:00.000Z",
           "phone": "+4912345678",
           "email": "test@test.com",
           "successUrl": "https://payever.de/success",
           "pendingUrl": "https://payever.de/pending",
           "failureUrl": "https://payever.de/failure",
           "cancelUrl": "https://payever.de/cancel",
           "noticeUrl": "https://payever.de/notification",
           "customerRedirectUrl": "https://payever.de/redirect",
           "xFrameHost": "http://host.url",
           "pluginVersion": "1.0.2",
           "createdAt": "*",
           "updatedAt": "*",
           "seller": {
             "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
             "firstName": "sellerFN",
             "lastName": "sellerLN",
             "email": "seller@email.url"
           }
         }
        },
        {
         "name": "checkout.event.api-call.updated",
         "payload": {
           "id": "*",
           "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
           "paymentMethod": "santander_invoice_de",
           "channel": "api",
           "amount": 200,
           "downPayment": 0,
           "orderId": "as54a5sd45as4d",
           "currency": "EUR",
           "fee": 0,
           "cart": [
             {
               "description": "test description",
               "identifier": "12345",
               "name": "Test Item",
               "price": 210,
               "priceNetto": 210,
               "quantity": 1,
               "sku": "12345",
               "vatRate": 0,
               "brand": "Apple",
               "totalAmount": 210,
               "totalTaxAmount": 0,
               "imageUrl": "http://img.url",
               "productUrl": "http://product.url",
               "category": "Electronics",
               "totalDiscountAmount": 10,
               "type": "physical"
             }
           ],
           "salutation": "SALUTATION_MR",
           "firstName": "Grün",
           "lastName": "Ampel",
           "street": "Test 12",
           "streetNumber": "12",
           "city": "Elbingerode (Harz)",
           "zip": "38889",
           "country": "DE",
           "addressLine2": "Test line 2",
           "birthdate": "1990-01-30T00:00:00.000Z",
           "phone": "+4912345678",
           "email": "test@test.com",
           "successUrl": "https://payever.de/success",
           "pendingUrl": "https://payever.de/pending",
           "failureUrl": "https://payever.de/failure",
           "cancelUrl": "https://payever.de/cancel",
           "noticeUrl": "https://payever.de/notification",
           "customerRedirectUrl": "https://payever.de/redirect",
           "xFrameHost": "http://host.url",
           "pluginVersion": "1.0.2",
           "executionTime": "*",
           "createdAt": "*",
           "updatedAt": "*",
           "seller": {
             "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
             "firstName": "sellerFN",
             "lastName": "sellerLN",
             "email": "seller@email.url"
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
       "payment_method": "santander_invoice_de",
       "channel": "api",
       "channel_type": "in_store",
       "channel_source": "v1.0.2",
       "amount": 200,
       "fee": 0,
       "down_payment": 0,
       "cart": [
         {
           "description": "test description",
           "identifier": "12345",
           "name": "Test Item",
           "price_netto": 210,
           "price": 210,
           "quantity": 1,
           "sku": "12345",
           "vat_rate": 0,
           "brand": "Apple",
           "total_amount": 210,
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
           },
           "total_discount_amount": 10,
           "type": "physical"
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
      },
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=49b1fe4f-350d-49ff-905a-e36d2dbdd886"
    }
    """
    Then I get "call.id" from response and remember as "createdApiCallId"
    Then I look for model "ApiCall" with id "{{createdApiCallId}}" and remember as "storedApiCall"
    And print storage key "storedApiCall"
    And model "ApiCall" with id "{{createdApiCallId}}" should contain json:
    """
    {
      "_id": "{{createdApiCallId}}",
      "allow_cart_step": false,
      "fee": 0,
      "down_payment": 0,
      "use_inventory": true,
      "two_factor_triggered": false,
      "allow_customer_types": [
       "person"
      ],
      "allow_payment_methods": [],
      "payment_method": "santander_invoice_de",
      "channel": "api",
      "channel_type": "in_store",
      "channel_source": "v1.0.2",
      "amount": 200,
      "original_cart": [
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
         "total_discount_amount": 10,
         "type": "physical"
       }
      ],
      "cart": [
       {
         "description": "test description",
         "identifier": "12345",
         "name": "Test Item",
         "price_netto": 210,
         "price": 210,
         "quantity": 1,
         "sku": "12345",
         "vat_rate": 0,
         "brand": "Apple",
         "total_amount": 210,
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
         },
         "total_discount_amount": 10,
         "type": "physical"
       }
      ],
      "order_id": "as54a5sd45as4d",
      "currency": "EUR",
      "salutation": "SALUTATION_MR",
      "first_name": "Grün",
      "last_name": "Ampel",
      "street": "Test 12",
      "street_name": "Test",
      "street_number": "12",
      "zip": "38889",
      "country": "DE",
      "city": "Elbingerode (Harz)",
      "address_line_2": "Test line 2",
      "birthdate": "1990-01-30T00:00:00.000Z",
      "phone": "+4912345678",
      "email": "test@test.com",
      "success_url": "https://payever.de/success",
      "pending_url": "https://payever.de/pending",
      "failure_url": "https://payever.de/failure",
      "cancel_url": "https://payever.de/cancel",
      "notice_url": "https://payever.de/notification",
      "customer_redirect_url": "https://payever.de/redirect",
      "x_frame_host": "http://host.url",
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
         "timeslot": "2023-03-02T00:00:00.000Z",
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
      "allow_billing_step": false,
      "allow_shipping_step": false,
      "use_styles": true,
      "salutation_mandatory": true,
      "phone_mandatory": false,
      "birthdate_mandatory": false,
      "test_mode": true,
      "api_version": "v3",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "createdAt": "*",
      "updatedAt": "*",
      "execution_time": "*",
      "footer_urls": {
         "disclaimer": "https://payever.de/disclaimer",
         "logo": "https://payever.de/logo",
         "privacy": "https://payever.de/privacy",
         "support": "https://payever.de/support"
       },
       "hide_logo": true,
       "hide_imprint": true
    }
    """

  Scenario: Create payment with discount per cart
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
        },
        {
          "name": "Discount Black Friday",
          "identifier": "blk111",
          "quantity": 1,
          "unit_price": 10,
          "tax_rate": 0,
          "total_amount": 10,
          "total_tax_amount": 0,
          "type": "discount"
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
          "notification": "https://payever.de/notification",
          "footer": {
            "disclaimer": "https://payever.de/disclaimer",
            "logo": "https://payever.de/logo",
            "privacy": "https://payever.de/privacy",
            "support": "https://payever.de/support"
          }
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
          "hide_logo": true,
          "hide_imprint": true
      },
      "plugin_version": "1.0.2",
      "x_frame_host": "http://host.url"
    }
    """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
         "name": "checkout.event.api-call.created",
         "payload": {
           "id": "*",
           "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
           "paymentMethod": "santander_invoice_de",
           "channel": "api",
           "amount": 200,
           "downPayment": 0,
           "orderId": "as54a5sd45as4d",
           "currency": "EUR",
           "fee": 0,
           "cart": [
             {
               "description": "test description",
               "identifier": "12345",
               "name": "Test Item",
               "price": 210,
               "priceNetto": 210,
               "quantity": 1,
               "sku": "12345",
               "vatRate": 0,
               "brand": "Apple",
               "totalAmount": 210,
               "totalTaxAmount": 0,
               "imageUrl": "http://img.url",
               "productUrl": "http://product.url",
               "category": "Electronics",
               "type": "physical"
             },
             {
              "name": "Discount Black Friday",
              "identifier": "blk111",
              "quantity": 1,
              "price": 10,
              "priceNetto": 10,
              "totalAmount": 10,
              "totalTaxAmount": 0,
              "type": "discount"
             }
           ],
           "salutation": "SALUTATION_MR",
           "firstName": "Grün",
           "lastName": "Ampel",
           "street": "Test 12",
           "streetNumber": "12",
           "city": "Elbingerode (Harz)",
           "zip": "38889",
           "country": "DE",
           "addressLine2": "Test line 2",
           "birthdate": "1990-01-30T00:00:00.000Z",
           "phone": "+4912345678",
           "email": "test@test.com",
           "successUrl": "https://payever.de/success",
           "pendingUrl": "https://payever.de/pending",
           "failureUrl": "https://payever.de/failure",
           "cancelUrl": "https://payever.de/cancel",
           "noticeUrl": "https://payever.de/notification",
           "customerRedirectUrl": "https://payever.de/redirect",
           "xFrameHost": "http://host.url",
           "pluginVersion": "1.0.2",
           "createdAt": "*",
           "updatedAt": "*",
           "seller": {
             "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
             "firstName": "sellerFN",
             "lastName": "sellerLN",
             "email": "seller@email.url"
           }
         }
        },
        {
         "name": "checkout.event.api-call.updated",
         "payload": {
           "id": "*",
           "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
           "paymentMethod": "santander_invoice_de",
           "channel": "api",
           "amount": 200,
           "downPayment": 0,
           "orderId": "as54a5sd45as4d",
           "currency": "EUR",
           "fee": 0,
           "cart": [
             {
               "description": "test description",
               "identifier": "12345",
               "name": "Test Item",
               "price": 210,
               "priceNetto": 210,
               "quantity": 1,
               "sku": "12345",
               "vatRate": 0,
               "brand": "Apple",
               "totalAmount": 210,
               "totalTaxAmount": 0,
               "imageUrl": "http://img.url",
               "productUrl": "http://product.url",
               "category": "Electronics",
               "type": "physical"
             },
             {
              "name": "Discount Black Friday",
              "identifier": "blk111",
              "quantity": 1,
              "price": 10,
              "priceNetto": 10,
              "totalAmount": 10,
              "totalTaxAmount": 0,
              "type": "discount"
             }
           ],
           "salutation": "SALUTATION_MR",
           "firstName": "Grün",
           "lastName": "Ampel",
           "street": "Test 12",
           "streetNumber": "12",
           "city": "Elbingerode (Harz)",
           "zip": "38889",
           "country": "DE",
           "addressLine2": "Test line 2",
           "birthdate": "1990-01-30T00:00:00.000Z",
           "phone": "+4912345678",
           "email": "test@test.com",
           "successUrl": "https://payever.de/success",
           "pendingUrl": "https://payever.de/pending",
           "failureUrl": "https://payever.de/failure",
           "cancelUrl": "https://payever.de/cancel",
           "noticeUrl": "https://payever.de/notification",
           "customerRedirectUrl": "https://payever.de/redirect",
           "xFrameHost": "http://host.url",
           "pluginVersion": "1.0.2",
           "executionTime": "*",
           "createdAt": "*",
           "updatedAt": "*",
           "seller": {
             "id": "41110213-d463-4258-8dd3-2fe51fb2ab34",
             "firstName": "sellerFN",
             "lastName": "sellerLN",
             "email": "seller@email.url"
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
       "payment_method": "santander_invoice_de",
       "channel": "api",
       "channel_type": "in_store",
       "channel_source": "v1.0.2",
       "amount": 200,
       "fee": 0,
       "down_payment": 0,
       "cart": [
         {
           "description": "test description",
           "identifier": "12345",
           "name": "Test Item",
           "price_netto": 210,
           "price": 210,
           "quantity": 1,
           "sku": "12345",
           "vat_rate": 0,
           "brand": "Apple",
           "total_amount": 210,
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
           },
           "type": "physical"
         },
         {
           "identifier": "blk111",
           "name": "Discount Black Friday",
           "price_netto": 10,
           "price": 10,
           "quantity": 1,
           "vat_rate": 0,
           "total_amount": 10,
           "total_tax_amount": 0,
           "type": "discount"
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
      },
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=49b1fe4f-350d-49ff-905a-e36d2dbdd886"
    }
    """
    Then I get "call.id" from response and remember as "createdApiCallId"
    Then I look for model "ApiCall" with id "{{createdApiCallId}}" and remember as "storedApiCall"
    And print storage key "storedApiCall"
    And model "ApiCall" with id "{{createdApiCallId}}" should contain json:
    """
    {
      "_id": "{{createdApiCallId}}",
      "allow_cart_step": false,
      "fee": 0,
      "down_payment": 0,
      "use_inventory": true,
      "two_factor_triggered": false,
      "allow_customer_types": [
       "person"
      ],
      "allow_payment_methods": [],
      "payment_method": "santander_invoice_de",
      "channel": "api",
      "channel_type": "in_store",
      "channel_source": "v1.0.2",
      "amount": 200,
      "original_cart": [
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
       },
       {
         "name": "Discount Black Friday",
         "identifier": "blk111",
         "quantity": 1,
         "unit_price": 10,
         "tax_rate": 0,
         "total_amount": 10,
         "total_tax_amount": 0,
         "type": "discount"
       }
      ],
      "cart": [
       {
         "description": "test description",
         "identifier": "12345",
         "name": "Test Item",
         "price_netto": 210,
         "price": 210,
         "quantity": 1,
         "sku": "12345",
         "vat_rate": 0,
         "brand": "Apple",
         "total_amount": 210,
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
         },
         "type": "physical"
       },
       {
         "identifier": "blk111",
         "name": "Discount Black Friday",
         "price_netto": 10,
         "price": 10,
         "quantity": 1,
         "vat_rate": 0,
         "total_amount": 10,
         "total_tax_amount": 0,
         "type": "discount"
       }
      ],
      "order_id": "as54a5sd45as4d",
      "currency": "EUR",
      "salutation": "SALUTATION_MR",
      "first_name": "Grün",
      "last_name": "Ampel",
      "street": "Test 12",
      "street_name": "Test",
      "street_number": "12",
      "zip": "38889",
      "country": "DE",
      "city": "Elbingerode (Harz)",
      "address_line_2": "Test line 2",
      "birthdate": "1990-01-30T00:00:00.000Z",
      "phone": "+4912345678",
      "email": "test@test.com",
      "success_url": "https://payever.de/success",
      "pending_url": "https://payever.de/pending",
      "failure_url": "https://payever.de/failure",
      "cancel_url": "https://payever.de/cancel",
      "notice_url": "https://payever.de/notification",
      "customer_redirect_url": "https://payever.de/redirect",
      "x_frame_host": "http://host.url",
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
         "timeslot": "2023-03-02T00:00:00.000Z",
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
      "allow_billing_step": false,
      "allow_shipping_step": false,
      "use_styles": true,
      "salutation_mandatory": true,
      "phone_mandatory": false,
      "birthdate_mandatory": false,
      "test_mode": true,
      "api_version": "v3",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "createdAt": "*",
      "updatedAt": "*",
      "execution_time": "*",
      "footer_urls": {
         "disclaimer": "https://payever.de/disclaimer",
         "logo": "https://payever.de/logo",
         "privacy": "https://payever.de/privacy",
         "support": "https://payever.de/support"
       },
       "hide_logo": true,
       "hide_imprint": true
    }
    """
