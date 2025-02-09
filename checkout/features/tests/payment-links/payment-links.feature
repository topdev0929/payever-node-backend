@management-payment-links
Feature: management payment links
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
          "name": "merchant",
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
    Given I remember as "businessId" following value:
    """
    "2382ffce-5620-4f13-885d-3c069f9dd9b4"
    """

  Scenario: Create payment empty data
    When I send a POST request to "/api/business/{{businessId}}/payment-link" with json:
    """
    {  }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "*",
      "redirectUrl": "https://checkout-backend.devpayever.com/api/payment/link/*",
      "businessId": "{{businessId}}",
      "createdAt": "*",
      "creator": "*",
      "isDeleted": false
    }
    """

  Scenario: Create payment with amount and currency
    When I send a POST request to "/api/business/{{businessId}}/payment-link" with json:
    """
    {
      "amount": 200,
      "currency": "EUR"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "*",
      "redirectUrl": "https://checkout-backend.devpayever.com/api/payment/link/*",
      "amount": 200,
      "businessId": "{{businessId}}",
      "createdAt": "*",
      "currency": "EUR",
      "creator": "*",
      "isDeleted": false
    }
    """

  Scenario: Create payment reusable link
    When I send a POST request to "/api/business/{{businessId}}/payment-link" with json:
    """
    {
      "amount": 200,
      "currency": "EUR",
      "reusable": true
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "*",
      "redirectUrl": "https://checkout-backend.devpayever.com/api/payment/link/*",
      "amount": 200,
      "businessId": "{{businessId}}",
      "createdAt": "*",
      "currency": "EUR",
      "isDeleted": false,
      "creator": "*",
      "reusable": true
    }
    """

  Scenario: Create payment send email
    When I send a POST request to "/api/business/{{businessId}}/payment-link" with json:
    """
    {
      "orderId": "234567890-987654323",
      "channel": "api",
      "channelType": "email",
      "amount": 10,
      "currency": "EUR",
      "paymentMethod": "stripe",
      "reusable": true,
      "email": "sendemailto@gmail.com",
      "linkMessage":{
        "content": "email content",
        "subject": "email subject"
      },
      "phone": "+3833334567"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "*",
      "redirectUrl": "https://checkout-backend.devpayever.com/api/payment/link/*",
      "amount": 10,
      "businessId": "{{businessId}}",
      "channel": "api",
      "channelType": "email",
      "createdAt": "*",
      "currency": "EUR",
      "email": "sendemailto@gmail.com",
      "isDeleted": false,
      "creator": "*",
      "linkMessage": {
        "content": "email content",
        "subject": "email subject"
      },
      "orderId": "234567890-987654323",
      "paymentMethod": "stripe",
      "phone": "+3833334567",
      "reusable": true
    }
    """

  Scenario: Create payment send sms
    When I send a POST request to "/api/business/{{businessId}}/payment-link" with json:
    """
    {
      "orderId": "234567890-987654323",
      "channel": "api",
      "channelType": "sms",
      "amount": 10,
      "downPayment": 5,
      "currency": "EUR",
      "paymentMethod": "stripe",
      "reusable": true,
      "email": "sendemailto@gmail.com",
      "linkMessage":{
        "content": "sms content"
      },
      "phone": "+3833334567"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "*",
      "redirectUrl": "https://checkout-backend.devpayever.com/api/payment/link/*",
      "amount": 10,
      "businessId": "{{businessId}}",
      "channel": "api",
      "channelType": "sms",
      "createdAt": "*",
      "currency": "EUR",
      "downPayment": 5,
      "email": "sendemailto@gmail.com",
      "isDeleted": false,
      "isActive": true,
      "creator": "*",
      "linkMessage": {
        "content": "sms content"
      },
      "orderId": "234567890-987654323",
      "paymentMethod": "stripe",
      "phone": "+3833334567",
      "reusable": true
    }
    """

  Scenario: Create payment link with privacy
    When I send a POST request to "/api/business/{{businessId}}/payment-link" with json:
    """
    {
      "amount": 200,
      "currency": "EUR",
      "firstName": "Stub",
      "lastName": "Otp",
      "street": "Hamburg",
      "streetMumber": "12",
      "salutation": "mr",
      "zip": "38889",
      "country": "DE",
      "city": "Elbingerode (Harz)",
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
      "id": "*",
      "redirectUrl": "https://checkout-backend.devpayever.com/api/payment/link/*?billing_address_city=Elbingerode%20(Harz)&billing_address_country=DE&billing_address_first_name=Stub&billing_address_last_name=Otp&billing_address_salutation=mr&billing_address_street=Hamburg&billing_address_zip=38889&email=test%40gmail.com&phone=%2B31657215724",
      "amount": 200,
      "businessId": "{{businessId}}",
      "city": "Elbingerode (Harz)",
      "country": "DE",
      "createdAt": "*",
      "currency": "EUR",
      "email": "test@gmail.com",
      "firstName": "Stub",
      "isDeleted": false,
      "lastName": "Otp",
      "phone": "+31657215724",
      "privacy": true,
      "salutation": "mr",
      "street": "Hamburg",
      "zip": "38889"
    }
    """

  Scenario: Clone payment link
    When I send a POST request to "/api/business/{{businessId}}/payment-link/{{paymentLinkId}}/clone" with json:
    """
    { }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "*",
      "redirectUrl": "https://checkout-backend.devpayever.com/api/payment/link/*",
      "amount": 1000,
      "businessId": "{{businessId}}",
      "createdAt": "*",
      "currency": "EUR",
      "fee": 0,
      "isDeleted": false,
      "isActive": true,
      "creator": "*",
      "orderId": "test_order_id",
      "paymentMethod": "ideal"
    }
    """

  Scenario: Update payment link
    When I send a PATCH request to "/api/business/{{businessId}}/payment-link/{{paymentLinkId}}" with json:
    """
    {
      "amount": 999,
      "reference": "reference_1234",
      "orderId": "updated_order_id",
      "expiresAt": "2024-02-14T10:32:26.477Z",
      "reusable": false,
      "birthdate": "1978-08-21"
    }
    """
    Then print last response
    And the response status code should be 202
    And the response should contain json:
    """
    {
      "id": "{{paymentLinkId}}",
      "redirectUrl": "https://checkout-backend.devpayever.com/api/payment/link/{{paymentLinkId}}",
      "amount": 999,
      "reference": "reference_1234",
      "birthdate": "1978-08-21*",
      "businessId": "{{businessId}}",
      "createdAt": "2023-02-17*",
      "currency": "EUR",
      "expiresAt": "2024-02-14T10:32:26.477Z",
      "fee": 0,
      "isDeleted": false,
      "isActive": true,
      "creator": "*",
      "orderId": "updated_order_id",
      "paymentMethod": "ideal",
      "reusable": false
    }
    """
  Scenario: Update single use payment link and set isActive as true when paymentId exists
    Given I remember as "paymentLinkIdWithPaymentId" following value:
    """
    "81dfgd86-7d1d-4178-b0c8-1d4e1230b2qw"
    """
    When I send a PATCH request to "/api/business/{{businessId}}/payment-link/{{paymentLinkIdWithPaymentId}}" with json:
    """
    {
      "isActive": true
    }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
      "statusCode": 400,
      "message": "Payment already sumbited",
      "error": "Bad Request"
    }
    """

  Scenario: Delete payment link
    When I send a DELETE request to "/api/business/{{businessId}}/payment-link/{{paymentLinkId}}"
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
      "business_id": "{{businessId}}",
      "created_at": "2023-02-17*",
      "currency": "EUR",
      "order_id": "test_order_id",
      "fee": 0,
      "payment_method": "ideal",
      "is_deleted": true
    }
    """

  Scenario: Get payment link
    When I send a GET request to "/api/business/{{businessId}}/payment-link/{{paymentLinkId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "id": "{{paymentLinkId}}",
      "redirectUrl": "https://checkout-backend.devpayever.com/api/payment/link/{{paymentLinkId}}",
      "amount": 1000,
      "businessId": "{{businessId}}",
      "createdAt": "2023-02-17*",
      "currency": "EUR",
      "fee": 0,
      "isDeleted": false,
      "isActive": true,
      "creator": "*",
      "orderId": "test_order_id",
      "paymentMethod": "ideal"
    }
    """

  Scenario: Get list of payment links
    When I send a GET request to "/api/business/{{businessId}}/payment-link"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "pageSize": 10,
      "paymentLinks": [
        {
          "is_deleted": false,
          "is_active": false,
          "transactions_count": 0,
          "views_count": 0,
          "creator": "*",
          "_id": "*",
          "amount": 370,
          "business_id": "{{businessId}}",
          "currency": "EUR",
          "order_id": "test_order_id_5",
          "payment_method": "ideal"
        },
        {
          "is_deleted": false,
          "is_active": true,
          "transactions_count": 0,
          "views_count": 0,
          "creator": "*",
          "_id": "*",
          "amount": 370,
          "business_id": "{{businessId}}",
          "currency": "EUR",
          "order_id": "test_order_id_4",
          "payment_method": "ideal"
        },
        {
          "is_deleted": false,
          "is_active": true,
          "transactions_count": 0,
          "views_count": 0,
          "creator": "*",
          "_id": "*",
          "amount": 350,
          "business_id": "{{businessId}}",
          "currency": "EUR",
          "order_id": "test_order_id_3",
          "payment_method": "ideal"
        },
        {
          "is_deleted": false,
          "is_active": true,
          "transactions_count": 0,
          "views_count": 0,
          "creator": "*",
          "_id": "*",
          "amount": 500,
          "business_id": "{{businessId}}",
          "currency": "EUR",
          "order_id": "test_order_id_2",
          "payment_method": "ideal",
          "fee": 0,
          "success_url": "http://payment.link/success_url",
          "pending_url": "http://payment.link/pending_url",
          "failure_url": "http://payment.link/failure_url",
          "cancel_url": "http://payment.link/cancel_url",
          "notice_url": "http://payment.link/notice_url",
          "customer_redirect_url": "http://payment.link/customer_redirect_url"
        },
        {
          "is_deleted": false,
          "is_active": true,
          "creator": "*",
          "_id": "*",
          "amount": 1000,
          "business_id": "{{businessId}}",
          "currency": "EUR",
          "order_id": "test_order_id",
          "transactions_count": 3,
          "views_count": 4,
          "payment_method": "ideal",
          "fee": 0
        }
      ],
      "total": 5,
      "totalPages": 1
    }
    """

  Scenario: Get list of payment links filtered by date
    When I send a GET request to "/api/business/{{businessId}}/payment-link?from=2023-02-17"
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
          "business_id": "{{businessId}}",
          "created_at": "2023-02-17*",
          "order_id": "test_order_id",
          "amount": 1000,
          "fee": 0,
          "currency": "EUR",
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

  Scenario: Update payment link and clear values with null
    When I send a PATCH request to "/api/business/{{businessId}}/payment-link/{{paymentLinkId}}" with json:
    """
    {
      "expiresAt": null,
      "amount": null,
      "paymentMethod": null,
      "currency": null,

      "createdAt": "*",
      "fee": 0,
      "isDeleted": false,
      "isActive": true,
      "creator": "*",
      "orderId": "test_order_id",
      "shippingAddress": {
        "firstName": "first_name",
        "lastName": "last_name",
        "street": null
      }
    }
    """
    Then print last response
    And the response status code should be 202
    And the response should contain json:
    """
    {
      "id": "71d15d86-7d1d-4178-b0c8-1d4e1230b2c0",
      "redirectUrl": "https://checkout-backend.devpayever.com/api/payment/link/71d15d86-7d1d-4178-b0c8-1d4e1230b2c0",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "createdAt": "*",
      "fee": 0,
      "isDeleted": false,
      "isActive": true,
      "creator": "*",
      "orderId": "test_order_id",
      "shippingAddress": {
        "firstName": "first_name",
        "lastName": "last_name"
      }
    }
    """
    And the response should not contain json:
    """
    {
      "expiresAt": "2025-12-31T22:59:59.000Z",
      "amount": 1000,
      "paymentMethod": "ideal",
      "currency": "EUR",
      "shippingAddress": {
        "street": "street"
      }
    }
    """
  Scenario: Send to device with empty data
    When I send a POST request to "/api/business/{{businessId}}/payment-link/{{paymentLinkId}}/send-to-device" with json:
    """
    {  }
    """
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
    """
    {
      "statusCode": 400,
      "message": [
        "subject must be a string",
        "subject should not be empty",
        "message must be a string",
        "message should not be empty"
      ],
      "error": "Bad Request"
    }
    """

  Scenario: Send message to device
    When I send a POST request to "/api/business/{{businessId}}/payment-link/{{paymentLinkId}}/send-to-device" with json:
    """
    {
      "message": "message",
      "subject": "subject",
      "email": "test@test.com"
    }
    """
    Then print last response
    Then the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "payever.event.mailer.send",
          "payload": {
            "to": "test@test.com",
            "subject": "subject",
            "html": "message"
          }
        }
      ]
      """
