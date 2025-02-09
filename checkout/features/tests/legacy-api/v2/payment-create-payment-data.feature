@create-payment-data
Feature: Payment create with payment data
  Background:
    Given I use DB fixture "connection/checkout-connection/submit/santander-invoice-de"

  Scenario: Create payment with payment data force_redirect is true
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
        "body": "{\"payment\":{\"amount\":200,\"address\":{\"addressLine2\":\"POST-1234\",\"city\":\"Vøyenenga\",\"country\":\"DE\",\"firstName\":\"weew\",\"lastName\":\"weew\",\"street\":\"sdfd\",\"streetName\":\"sdfd\",\"salutation\":\"\",\"zipCode\":\"13132\",\"email\":\"sdsd@sdds.eu\",\"phone\":\"90212048\"},\"apiCallId\":\"*\",\"businessName\":\"*\",\"businessId\":\"a803d4c3-c447-4aab-a8c7-c7f184a8e77f\",\"channel\":\"api\",\"channelSetId\":\"a888336c-fe1f-439c-b13c-f351db6bbc2e\",\"currency\":\"EUR\",\"customerEmail\":\"sdsd@sdds.eu\",\"customerName\":\"weew weew\",\"reference\":\"sa45s454as399912343211\",\"deliveryFee\":0,\"total\":200,\"flowId\":\"N/A\",\"shippingAddress\":{\"addressLine2\":\"POST-98765\",\"city\":\"Hamburg\",\"country\":\"DE\",\"firstName\":\"First1\",\"lastName\":\"Last2\",\"street\":\"test\",\"streetName\":\"test\",\"salutation\":\"\",\"zipCode\":\"12345\"}},\"paymentDetails\":{\"iban\":\"DE89370400440532013000\",\"forceRedirect\":true,\"frontendFinishUrl\":\"https://payever.de/success\",\"frontendSuccessUrl\":\"https://payever.de/success\",\"frontendCancelUrl\":\"https://payever.de/cancel\",\"frontendFailureUrl\":\"https://payever.de/failure\"},\"paymentItems\":[{\"description\":\"\",\"identifier\":\"12345\",\"name\":\"Apple AirPods\",\"price\":200,\"priceNet\":200,\"quantity\":1,\"sku\":\"888462858519\",\"thumbnail\":\"https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg\",\"url\":\"https://eplehuset.no/apple-airpods\",\"vatRate\":0}],\"forceRedirect\":true}"
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
           "redirectUrl": "http://redirect.url/1234567890"
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
    When I send a POST request to "/api/v2/payment" with json:
    """
    {
      "payment_data": {
        "iban": "DE89370400440532013000",
        "force_redirect": true
      },
      "channel": {
        "name": "api"
      },
      "amount": 200,
      "fee": 0,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_invoice_de",
      "billing_address": {
        "country": "DE",
        "city": "Vøyenenga",
        "zip": "13132",
        "street": "sdfd",
        "address_line_2": "POST-1234",
        "first_name": "weew",
        "last_name": "weew"
      },
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": [
        {
          "name": "Apple AirPods",
          "sku": "888462858519",
          "price": 200,
          "priceNetto": 200.00,
          "vatRate": 0.00,
          "quantity": 1,
          "identifier": "12345",
          "description": "",
          "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
          "url": "https://eplehuset.no/apple-airpods"
        }
      ],
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
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "checkout.event.api-call.created",
        "payload": {
          "id": "*",
          "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "paymentMethod": "santander_invoice_de",
          "channel": "api",
          "amount": 200,
          "orderId": "sa45s454as399912343211",
          "currency": "EUR",
          "fee": 0,
          "cart": [
            {
              "name": "Apple AirPods",
              "sku": "888462858519",
              "price": 200,
              "priceNetto": 200,
              "vatRate": 0,
              "quantity": 1,
              "identifier": "12345",
              "description": "",
              "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
              "url": "https://eplehuset.no/apple-airpods"
            }
          ],
          "salutation": "",
          "firstName": "weew",
          "lastName": "weew",
          "street": "sdfd",
          "city": "Vøyenenga",
          "zip": "13132",
          "country": "DE",
          "addressLine2": "POST-1234",
          "phone": "90212048",
          "email": "sdsd@sdds.eu",
          "shippingAddress": {
            "firstName": "First1",
            "lastName": "Last2",
            "street": "test",
            "city": "Hamburg",
            "zip": "12345",
            "country": "DE"
          },
          "successUrl": "https://payever.de/success",
          "failureUrl": "https://payever.de/failure",
          "cancelUrl": "https://payever.de/cancel"
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
        "status": "STATUS_ACCEPTED",
        "id": "wew48e6f56sd35bg4sd",
        "payment_details": {
          "birthday": "1980-01-01T09:34:08.700Z",
          "conditionsAccepted": true,
          "reservationUniqueId": "31HA07BC818A3AB1C8576D954D4C16C8",
          "usageText": "test_usage_text",
          "redirectUrl": "http://redirect.url/1234567890"
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
        "currency": "EUR",
        "customer_email": "test@test.com",
        "customer_name": "Test",
        "delivery_fee": 0,
        "down_payment": 0,
        "merchant_name": "business-1",
        "payment_fee": 0,
        "payment_type": "santander_invoice_de",
        "reference": "qwerty",
        "specific_status": "ACCEPTED",
        "total": 200,
        "shipping_address": {
          "address_line_2": "POST-98765",
          "city": "Hamburg",
          "street": "test",
          "country": "DE",
          "first_name": "First1",
          "last_name": "Last2",
          "zip_code": "12345"
        }
      },
      "redirect_url": "http://redirect.url/1234567890"
    }
    """
