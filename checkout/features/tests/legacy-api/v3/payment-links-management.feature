@payment-links-management-v3
Feature: Payment create link v3
  Background:
    Given I use DB fixture "legacy-api/payment-create/exists-channel-set-id-and-channel"
    Given I use DB fixture "legacy-api/payment-links/payment-links"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "clientId": "de9d1a9f-0c4e-4ebc-ae98-bc2bace0605c",
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
    Given I remember as "paymentLinkId" following value:
    """
    "71d15d86-7d1d-4178-b0c8-1d4e1230b2c0"
    """

  Scenario: Create payment empty data
    When I send a POST request to "/api/v3/payment/link" with json:
    """
    {  }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {},
      "redirect_url": "https://checkout-backend.devpayever.com/api/payment/link/*",
      "result": {
        "_id": "*",
        "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
        "created_at": "*"
      }
    }
    """

  Scenario: Create payment with amount and currency
    When I send a POST request to "/api/v3/payment/link" with json:
    """
    {
      "purchase": {
        "amount": 200,
        "currency": "EUR"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "purchase": {
          "amount": 200,
          "currency": "EUR"
        }
      },
      "redirect_url": "https://checkout-backend.devpayever.com/api/payment/link/*",
      "result": {
        "_id": "*",
        "purchase": {
          "amount": 200,
          "currency": "EUR"
        },
        "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
        "created_at": "*"
      }
    }
    """

  Scenario: Create payment reusable link
    When I send a POST request to "/api/v3/payment/link" with json:
    """
    {
      "purchase": {
        "amount": 200,
        "currency": "EUR"
      },
      "options": {
        "reusable": true
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "purchase": {
          "amount": 200,
          "currency": "EUR"
        },
        "options": {
          "reusable": true
        }
      },
      "redirect_url": "https://checkout-backend.devpayever.com/api/payment/link/*",
      "result": {
        "_id": "*",
        "purchase": {
          "amount": 200,
          "currency": "EUR"
        },
        "options": {
          "reusable": true
        },
        "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
        "created_at": "*"
      }
    }
    """

  Scenario: Create payment send email
    When I send a POST request to "/api/v3/payment/link" with json:
    """
    {
      "reference": "234567890-987654323",
      "channel": {
        "name": "api",
        "type": "email"
      },
      "purchase": {
        "amount": 10,
        "currency": "EUR"
      },
      "payment_method": "stripe",
      "options": {
        "reusable": true
      },
      "customer": {
        "email": "sendemailto@gmail.com",
        "phone": "+3833334567"
      },
      "link_message":{
        "content": "email content",
        "subject": "email subject"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "reference": "234567890-987654323",
        "channel": {
          "name": "api",
          "type": "email"
        },
        "purchase": {
          "amount": 10,
          "currency": "EUR"
        },
        "payment_method": "stripe",
        "options": {
          "reusable": true
        },
        "customer": {
          "email": "sendemailto@gmail.com",
          "phone": "+3833334567"
        },
        "link_message": {
          "content": "email content",
          "subject": "email subject"
        }
      },
      "redirect_url": "https://checkout-backend.devpayever.com/api/payment/link/*",
      "result": {
        "_id": "*",
        "purchase": {
          "amount": 10,
          "currency": "EUR"
        },
        "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
        "channel": {
          "name": "api",
          "type": "email"
        },
        "order_id": "234567890-987654323",
        "payment_method": "stripe",
        "customer": {
          "email": "sendemailto@gmail.com",
          "phone": "+3833334567"
        },
        "options": {
          "reusable": true
        },
        "link_message": {
          "content": "email content",
          "subject": "email subject"
        }
      }
    }
    """

  Scenario: Create payment send sms
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/2382ffce-5620-4f13-885d-3c069f9dd9b4/integration/twilio/action/send-message",
        "body": "{\"from\":\"+23452345678\",\"to\":\"+3833334567\",\"message\":\"sms content: https://checkout-wrapper-frontend.devpayever.com/de/pay/api-call/*?channelSetId=6d051222-547b-4d31-8f85-2e88e1d58916\"}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
          "authorization": "*"
        }
      },
      "response": {
        "status": 200
      }
    }
    """
    When I send a POST request to "/api/v3/payment/link" with json:
    """
    {
      "reference": "234567890-987654323",
      "channel": {
        "name": "api",
        "type": "sms"
      },
      "purchase": {
        "amount": 10,
        "currency": "EUR",
        "down_payment": 5
      },
      "payment_method": "stripe",
      "options": {
        "reusable": true
      },
      "customer": {
        "phone": "+3833334567",
        "email": "sendemailto@gmail.com"
      },
      "link_message":{
        "content": "sms content"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "reference": "234567890-987654323",
        "channel": {
          "name": "api",
          "type": "sms"
        },
        "purchase": {
          "amount": 10,
          "currency": "EUR",
          "down_payment": 5
        },
        "payment_method": "stripe",
        "options": {
          "reusable": true
        },
        "customer": {
          "phone": "+3833334567",
          "email": "sendemailto@gmail.com"
        },
        "link_message": {
          "content": "sms content"
        }
      },
      "redirect_url": "https://checkout-backend.devpayever.com/api/payment/link/*",
      "result": {
        "_id": "*",
        "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
        "channel": {
          "name": "api",
          "type": "sms"
        },
        "purchase": {
          "amount": 10,
          "currency": "EUR",
          "down_payment": 5
        },
        "customer": {
          "phone": "+3833334567",
          "email": "sendemailto@gmail.com"
        },
        "order_id": "234567890-987654323",
        "payment_method": "stripe",
        "options": {
          "reusable": true
        },
        "link_message": {
          "content": "sms content"
        }
      }
    }
    """

  Scenario: Create payment link with privacy
    When I send a POST request to "/api/v3/payment/link" with json:
    """
    {
      "purchase": {
        "amount": 200,
        "currency": "EUR"
      },
      "billing_address": {
          "first_name": "Stub",
          "last_name": "Otp",
          "street": "Hamburg",
          "street_number": "12",
          "salutation": "mr",
          "zip": "38889",
          "country": "DE",
          "city": "Elbingerode (Harz)"
      },
      "email": "test@gmail.com",
      "phone": "+31657215724",
      "privacy": true
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
      "purchase": {
        "amount": 200,
        "currency": "EUR"
      },
      "billing_address": {
          "first_name": "Stub",
          "last_name": "Otp",
          "street": "Hamburg",
          "street_number": "12",
          "salutation": "mr",
          "zip": "38889",
          "country": "DE",
          "city": "Elbingerode (Harz)"
        },
        "email": "test@gmail.com",
        "phone": "+31657215724",
        "privacy": true
      },
      "redirect_url": "https://checkout-backend.devpayever.com/api/payment/link/*?billing_address_city=Elbingerode%20(Harz)&billing_address_country=DE&billing_address_first_name=Stub&billing_address_last_name=Otp&billing_address_salutation=mr&billing_address_street=Hamburg&billing_address_street_number=12&billing_address_zip=38889",
      "result": {
        "_id": "*",
        "business_id": "*",
        "created_at": "*",
        "purchase": {
          "amount": 200,
          "currency": "EUR"
        }
      }
    }
    """

  Scenario: Update payment link
    When I send a PATCH request to "/api/v3/payment/link/{{paymentLinkId}}" with json:
    """
    {
      "purchase": {
        "amount": 999
      },
      "reference": "updated_order_id"
    }
    """
    Then print last response
    And the response status code should be 202
    And the response should contain json:
    """
    {
      "_id": "{{paymentLinkId}}",
      "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "created_at": "2023-02-17*",
      "purchase": {
        "amount": 999,
        "delivery_fee": 0,
        "currency": "EUR"
      },
      "order_id": "updated_order_id",
      "payment_method": "ideal"
    }
    """

  Scenario: Delete payment link
    When I send a DELETE request to "/api/v3/payment/link/{{paymentLinkId}}"
    Then print last response
    And the response status code should be 202
    Then I look for model "PaymentLink" by following JSON and remember as "deletedPaymentLink":
      """
      {
        "_id": "{{paymentLinkId}}"
      }
      """
    And print storage key "deletedPaymentLink"
    And stored value "deletedPaymentLink" should contain json:
    """
    {
      "_id": "{{paymentLinkId}}",
      "amount": 1000,
      "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "created_at": "2023-02-17*",
      "currency": "EUR",
      "order_id": "test_order_id",
      "fee": 0,
      "payment_method": "ideal",
      "is_deleted": true
    }
    """

  Scenario: Get payment link
    When I send a GET request to "/api/v3/payment/link/{{paymentLinkId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "{{paymentLinkId}}",
      "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "created_at": "2023-02-17*",
      "purchase": {
        "amount": 1000,
        "delivery_fee": 0,
        "currency": "EUR"
      },
      "order_id": "test_order_id",
      "payment_method": "ideal"
    }
    """

  Scenario: Get list of payment links
    When I send a GET request to "/api/v3/payment/link"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "pageSize": 10,
      "paymentLinks": [
        {
          "_id": "*",
          "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
          "created_at": "2023-02-13*",
          "purchase": {
            "amount": 370,
            "currency": "EUR"
          },
          "order_id": "test_order_id_5",
          "payment_method": "ideal"
        },
        {
          "_id": "*",
          "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
          "created_at": "2023-02-14*",
          "purchase": {
             "amount": 370,
             "currency": "EUR"
          },
          "order_id": "test_order_id_4",
          "payment_method": "ideal"
        },
        {
          "_id": "*",
          "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
          "created_at": "2023-02-15*",
          "purchase": {
            "amount": 350,
            "currency": "EUR"
          },
          "order_id": "test_order_id_3",
          "payment_method": "ideal"
        },
        {
          "_id": "*",
          "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
          "created_at": "2023-02-16*",
          "purchase": {
            "amount": 500,
            "delivery_fee": 0,
            "currency": "EUR"
          },
          "order_id": "test_order_id_2",
          "payment_method": "ideal"
        },
        {
          "_id": "*",
          "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
          "created_at": "2023-02-17*",
          "purchase": {
            "amount": 1000,
            "delivery_fee": 0,
            "currency": "EUR"
          },
          "order_id": "test_order_id",
          "payment_method": "ideal"
        }
      ],
      "total": 5,
      "totalPages": 1
    }
    """

  Scenario: Get list of payment links filtered by date
    When I send a GET request to "/api/v3/payment/link?from=2023-02-17"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "pageSize": 10,
      "paymentLinks": [
        {
          "_id": "71d15d86-7d1d-4178-b0c8-1d4e1230b2c0",
          "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
          "created_at": "2023-02-17*",
          "order_id": "test_order_id",
          "purchase": {
            "amount": 1000,
            "delivery_fee": 0,
            "currency": "EUR"
          },
          "payment_method": "ideal"
        }
      ],
      "total": 1,
      "totalPages": 1
    }
    """
    And the response should not contain json:
    """
    [
      {
        "created_at": "2023-02-13*"
      },
      {
        "created_at": "2023-02-14*"
      },
      {
        "created_at": "2023-02-15*"
      },
      {
        "created_at": "2023-02-16*"
      }
    ]
    """
