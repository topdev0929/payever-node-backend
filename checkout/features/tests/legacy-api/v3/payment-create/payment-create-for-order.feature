@payment-create-for-order-v3
Feature: Payment create for existing order v3
  Background:
    Given I remember as "orderId" following value:
      """
      "5bececc2-dd47-4a3e-8b85-d1e10d019332"
      """

  Scenario: Create payment for non existent order
    Given I use DB fixture "legacy-api/payment-create/exists-channel-set-id-and-channel"
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
      "order_id": "test_order_id",
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
      "x_frame_host": "http://host.url"
    }
    """
    Then print last response
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "message": "The order by \"test_order_id\" was not found"
    }
    """

  Scenario: Create payment for existent order of different business
    Given I use DB fixture "legacy-api/payment-create/exists-channel-set-id-and-channel"
    Given I use DB fixture "legacy-api/payment-create/exists-order"
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
              "businessId": "5e24d55d-91f6-441d-a8b1-bbf86181cec9"
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
      "order_id": "{{orderId}}",
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
      "x_frame_host": "http://host.url"
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

  Scenario: Create payment with existing order
    Given I use DB fixture "legacy-api/payment-create/exists-channel-set-id-and-channel"
    Given I use DB fixture "legacy-api/payment-create/exists-order"
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
      "order_id": "{{orderId}}"
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
       "allow_cart_step": false,
       "use_inventory": true,
       "shipping_address": {
         "first_name": "Grün",
         "last_name": "Ampel",
         "street": "Test 12",
         "street_number": "12",
         "salutation": "SALUTATION_MR",
         "zip": "38889",
         "country": "DE",
         "city": "Elbingerode (Harz)",
         "organization_name": "Test",
         "street_name": "Test",
         "house_extension": "A"
       },
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
             "name": "of3"
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
      "shipping_address": {
        "first_name": "Grün",
        "last_name": "Ampel",
        "street": "Test 12",
        "street_number": "12",
        "salutation": "SALUTATION_MR",
        "zip": "38889",
        "country": "DE",
        "city": "Elbingerode (Harz)",
        "organization_name": "Test",
        "street_name": "Test",
        "house_extension": "A"
      },
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
           "name": "of3"
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
      "execution_time": "*"
    }
    """
