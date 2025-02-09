@payment-retrieve
Feature: Payment
  Scenario: Retrieve payment
    Given I use DB fixture "legacy-api/payments"
    Given I remember as "businessId" following value:
    """
    "2382ffce-5620-4f13-885d-3c069f9dd9b4"
    """

    Given I remember as "paymentId" following value:
    """
    "9489614e29c6e9aa052a342b726eb0f2"
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
              "businessId": "{{businessId}}"
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
        "method": "get",
        "url": "*/api/business/{{businessId}}/transaction/{{paymentId}}/history"
      },
      "response": {
        "status": 200,
        "body": [
          {
            "action": "shipping_goods",
            "amount": 6,
            "createdAt": "2022-01-01T01:00:07.000Z",
            "items": [],
            "status": "failed"
          },
          {
            "action": "shipping_goods",
            "amount": 5,
            "createdAt": "2021-01-01T01:00:05.000Z",
            "items": [],
            "status": "success"
          },
          {
            "action": "shipping_goods",
            "amount": 4,
            "createdAt": "2021-01-01T01:00:04.000Z",
            "items": [],
            "status": "failed"
          },
          {
            "action": "cancel",
            "amount": 3,
            "createdAt": "2021-01-01T01:00:03.000Z",
            "items": []
          },
          {
            "action": "refund",
            "amount": 2,
            "createdAt": "2021-01-01T01:00:02.000Z",
            "items": []
          },
          {
            "action": "statuschanged",
            "amount": 1,
            "createdAt": "2021-01-01T01:00:01.000Z",
            "items": []
          }
        ]
      }
    }
    """
    When I send a GET request to "/api/payment/{{paymentId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*"
      },
      "result": {
        "id": "{{paymentId}}",
        "status": "STATUS_IN_PROCESS",
        "specific_status": "WAITING_BANK",
        "merchant_name": "AutomationBusiness",
        "customer_name": "m.kunze@wasserbadmail.de",
        "payment_type": "santander_factoring_de",
        "customer_email": "m.kunze@wasserbadmail.de",
        "created_at": "2018-08-09T06:26:13.000Z",
        "updated_at": "2018-10-24T14:37:28.000Z",
        "channel": "api",
        "reference": "order-6eb3399",
        "amount": 20,
        "total": 20,
        "currency": "EUR",
        "delivery_fee": 0,
        "payment_fee": 0,
        "down_payment": 0,
        "payment_details": {
          "initialize_unique_id": "31HA07BC813F42ECAC68344F93F463E6",
          "conditions_accepted": true
        },
        "history": [
          {
            "action": "shipping_goods",
            "amount": 6,
            "createdAt": "2022-01-01T01:00:07.000Z",
            "items": [],
            "status": "failed"
          },
          {
            "action": "shipping_goods",
            "amount": 5,
            "createdAt": "2021-01-01T01:00:05.000Z",
            "items": [],
            "status": "success"
          },
          {
            "action": "shipping_goods",
            "amount": 4,
            "createdAt": "2021-01-01T01:00:04.000Z",
            "items": [],
            "status": "failed"
          },
          {
            "action": "cancel",
            "amount": 3,
            "createdAt": "2021-01-01T01:00:03.000Z",
            "items": []
          },
          {
            "action": "refund",
            "amount": 2,
            "createdAt": "2021-01-01T01:00:02.000Z",
            "items": []
          },
          {
            "action": "statuschanged",
            "amount": 1,
            "createdAt": "2021-01-01T01:00:01.000Z",
            "items": []
          }
        ],
        "payment_details_array": {
          "initialize_unique_id": "31HA07BC813F42ECAC68344F93F463E6",
          "conditions_accepted": true
        },
        "address": {
          "uuid": "6d455425-fa13-46f6-aa3e-cb053e942344",
          "city": "Berlin",
          "country": "DE",
          "country_name": "Germany",
          "email": "m.kunze@wasserbadmail.de",
          "first_name": "Stub",
          "last_name": "Waiting_bank",
          "phone": "4212345678",
          "salutation": "SALUTATION_MRS",
          "street": "Sonnentalweg 18",
          "zip_code": "73888"
        },
        "items": [
          {
            "description": "item_description1",
            "identifier": "item1",
            "name": "Langenscheidt Wörterbuch Englisch",
            "price": 105,
            "quantity": 1,
            "thumbnail": "https://openbank-wc.demo.payever.org/wp-content/uploads/2019/01/album-1.jpg"
          }
        ],
        "shipping_option": {
          "name": "dhl",
          "price": 10
        }
      }
    }
    """

  Scenario: Retrieve payment as anonymous should not be allowed
    Given I use DB fixture "legacy-api/payments"
    And I am not authenticated
    When I send a GET request to "/api/payment/{{paymentId}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "error": "Forbidden",
      "message": "app.employee-permission.insufficient.error"
    }
    """

  Scenario: Retrieve payment from another business should be forbidden
    Given I use DB fixture "legacy-api/payments"
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
              "businessId": "0064bd92-c270-49f4-9910-cfab877c1255"
            }
          ]
        }
      ]
    }
    """
    When I send a GET request to "/api/payment/9489614e29c6e9aa052a342b726eb0f2"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "error": "Forbidden",
      "message": "You're not allowed to get payment with id 9489614e29c6e9aa052a342b726eb0f2"
    }
    """

  Scenario: Retrieve not existent payment should return not found error
    Given I use DB fixture "legacy-api/payments"
    When I send a GET request to "/api/payment/74b55493f9cdb71e3d56c021672658b5"
    Then print last response
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Payment by {\"original_id\":\"74b55493f9cdb71e3d56c021672658b5\"} not found!"
    }
    """
