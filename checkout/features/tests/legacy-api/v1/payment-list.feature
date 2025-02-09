Feature: Payment
  Scenario: Get payment list
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
              "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
            }
          ]
        }
      ]
    }
    """
    When I send a GET request to "/api/payment"
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
      "result": [
        {
          "id": "9489614e29c6e9aa052a342b726eb0f2",
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
          }
        },
        {
          "id": "d0f60343b7ada9b1c893a938d05f5be4",
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
          "amount": 150,
          "total": 150,
          "currency": "EUR",
          "delivery_fee": 0,
          "payment_fee": 0,
          "down_payment": 0,
          "payment_details": {
            "initialize_unique_id": "31HA07BC813F42ECAC68344F93F463E6",
            "conditions_accepted": true
          },
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
          }
        }
      ]
    }
    """

  Scenario: Get payment list as anonymous should not be allowed
    Given I use DB fixture "legacy-api/payments"
    And I am not authenticated
    When I send a GET request to "/api/payment"
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

  Scenario: Get payment list from from user with undefined business is forbidden
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
              "acls": []
            }
          ]
        }
      ]
    }
    """
    When I send a GET request to "/api/payment"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "error": "Forbidden",
      "message": "You're not allowed to get payment list"
    }
    """
