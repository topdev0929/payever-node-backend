Feature: Payment action
  Background:
    Given I remember as "businessId" following value:
      """
      "012c165f-8b88-405f-99e2-82f74339a757"
      """

  Scenario: Execute payment refund action
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
        "method": "post",
        "url": "*/api/business/{{businessId}}/3b864596-ca5b-429b-bfc1-4f9d5d87c375/legacy-api-action/refund",
        "body": "{\"fields\":{\"amount\":100}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "5c3de305d665630012908367",
          "original_id": "9a8521e181fa3de1127141aa3653b622",
          "uuid": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "action_running": false,
          "available_refund_items": [],
          "amount": 650,
          "amount_refunded": 235,
          "amount_rest": 415,
          "billing_address": {
            "_id": "5d08cff769767a2294eda730",
            "country": "DE",
            "city": "Hamburg",
            "zip_code": "20457",
            "street": "Am Strandkai",
            "salutation": "SALUTATION_MR",
            "first_name": "Stub",
            "last_name": "Accepted",
            "id": "5d08cff769767a2294eda730"
          },
          "business_option_id": 24940,
          "business_uuid": "{{businessId}}",
          "channel": "magento",
          "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "created_at": "2019-01-15T13:41:25.000Z",
          "currency": "EUR",
          "customer_email": "we9fhwiuhiu@gmail.com",
          "customer_name": "Stub Accepted",
          "delivery_fee": 0,
          "down_payment": 0,
          "items": [],
          "merchant_email": "sergiokurba11@gmail.com",
          "merchant_name": "TEST TRANSACTIONS",
          "payment_details": {
            "unique_id": "STUB_UNIQUE_ID",
            "usage_text": "STUB_USAGE_TEXT",
            "basket_id": "STUB_BASKET_ID",
            "advertising_accepted": true,
            "conditions_accepted": true,
            "birthday": "22.04.1978"
          },
          "payment_fee": 0,
          "payment_flow_id": "ec29696a0048b3da8f556b151652f29d",
          "place": "refunded",
          "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "santander_applications": [],
          "specific_status": "ACCEPTED",
          "status": "STATUS_REFUNDED",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/refund/9a8521e181fa3de1127141aa3653b622" with json:
    """
    {
      "amount": 100
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "9a8521e181fa3de1127141aa3653b622",
        "business_id": "{{businessId}}",
        "type": "refund",
        "amount": 100
      },
      "result": {
        "id": "9a8521e181fa3de1127141aa3653b622",
        "status": "STATUS_REFUNDED",
        "specific_status": "ACCEPTED",
        "merchant_name": "TEST TRANSACTIONS",
        "customer_name": "Stub Accepted",
        "payment_type": "paypal",
        "customer_email": "we9fhwiuhiu@gmail.com",
        "created_at": "2019-01-15T13:41:25.000Z",
        "updated_at": "2019-01-15T13:41:26.000Z",
        "channel": "magento",
        "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
        "amount": 650,
        "total": 650,
        "currency": "EUR",
        "delivery_fee": 0,
        "payment_fee": 0,
        "down_payment": 0,
        "payment_details": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "payment_details_array": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "address": {
         "city": "Hamburg",
         "country": "DE",
         "first_name": "Stub",
         "last_name": "Accepted",
         "salutation": "SALUTATION_MR",
         "street": "Am Strandkai",
         "zip_code": "20457"
        },
        "shipping_address": "*"
      }
    }
    """
    Then I look for model "ActionApiCall" by following JSON and remember as "actionApiCall":
    """
    {
      "action": "refund",
      "businessId": "{{businessId}}",
      "paymentId": "9a8521e181fa3de1127141aa3653b622"
    }
    """
    And model "ActionApiCall" with id "{{actionApiCall._id}}" should contain json:
    """
    {
      "action": "refund",
      "businessId": "{{businessId}}",
      "paymentId": "9a8521e181fa3de1127141aa3653b622",
      "requestData": {
        "amount": 100
      },
      "executionTime": "*",
      "status": "success"
    }
    """

  Scenario: Execute payment refund action with idempotency and force retry headers
    Given I use DB fixture "legacy-api/payments"
    And I set header "idempotency-key" with value "12345"
    And I set header "x-payever-force-retry" with value "54321"
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
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
          "authorization": "Bearer *",
          "idempotency-key": "12345",
          "x-payever-force-retry": "54321"
        },
        "method": "post",
        "url": "*/api/business/{{businessId}}/3b864596-ca5b-429b-bfc1-4f9d5d87c375/legacy-api-action/refund",
        "body": "{\"fields\":{\"amount\":100}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "5c3de305d665630012908367",
          "original_id": "9a8521e181fa3de1127141aa3653b622",
          "uuid": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "action_running": false,
          "available_refund_items": [],
          "amount": 650,
          "amount_refunded": 235,
          "amount_rest": 415,
          "billing_address": {
            "_id": "5d08cff769767a2294eda730",
            "country": "DE",
            "city": "Hamburg",
            "zip_code": "20457",
            "street": "Am Strandkai",
            "salutation": "SALUTATION_MR",
            "first_name": "Stub",
            "last_name": "Accepted",
            "id": "5d08cff769767a2294eda730"
          },
          "business_option_id": 24940,
          "business_uuid": "{{businessId}}",
          "channel": "magento",
          "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "created_at": "2019-01-15T13:41:25.000Z",
          "currency": "EUR",
          "customer_email": "we9fhwiuhiu@gmail.com",
          "customer_name": "Stub Accepted",
          "delivery_fee": 0,
          "down_payment": 0,
          "items": [],
          "merchant_email": "sergiokurba11@gmail.com",
          "merchant_name": "TEST TRANSACTIONS",
          "payment_details": {
            "unique_id": "STUB_UNIQUE_ID",
            "usage_text": "STUB_USAGE_TEXT",
            "basket_id": "STUB_BASKET_ID",
            "advertising_accepted": true,
            "conditions_accepted": true,
            "birthday": "22.04.1978"
          },
          "payment_fee": 0,
          "payment_flow_id": "ec29696a0048b3da8f556b151652f29d",
          "place": "refunded",
          "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "santander_applications": [],
          "specific_status": "ACCEPTED",
          "status": "STATUS_REFUNDED",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/refund/9a8521e181fa3de1127141aa3653b622" with json:
    """
    {
      "amount": 100
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "9a8521e181fa3de1127141aa3653b622",
        "business_id": "{{businessId}}",
        "type": "refund",
        "amount": 100
      },
      "result": {
        "id": "9a8521e181fa3de1127141aa3653b622",
        "status": "STATUS_REFUNDED",
        "specific_status": "ACCEPTED",
        "merchant_name": "TEST TRANSACTIONS",
        "customer_name": "Stub Accepted",
        "payment_type": "paypal",
        "customer_email": "we9fhwiuhiu@gmail.com",
        "created_at": "2019-01-15T13:41:25.000Z",
        "updated_at": "2019-01-15T13:41:26.000Z",
        "channel": "magento",
        "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
        "amount": 650,
        "total": 650,
        "currency": "EUR",
        "delivery_fee": 0,
        "payment_fee": 0,
        "down_payment": 0,
        "payment_details": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "payment_details_array": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "address": {
         "city": "Hamburg",
         "country": "DE",
         "first_name": "Stub",
         "last_name": "Accepted",
         "salutation": "SALUTATION_MR",
         "street": "Am Strandkai",
         "zip_code": "20457"
        },
        "shipping_address": "*"
      }
    }
    """

  Scenario: Execute payment refund action with payment items field
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
        "method": "post",
        "url": "*/api/business/{{businessId}}/3b864596-ca5b-429b-bfc1-4f9d5d87c375/legacy-api-action/refund",
        "body": "{\"fields\":{\"amount\":100,\"payment_items\":[{\"identifier\":\"4edbd710-9ba7-40c0-bb05-4da3a574ac82\",\"name\":\"Item name\",\"price\":100,\"quantity\":1}]}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "5c3de305d665630012908367",
          "original_id": "9a8521e181fa3de1127141aa3653b622",
          "uuid": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "action_running": false,
          "available_refund_items": [],
          "amount": 650,
          "amount_refunded": 235,
          "amount_rest": 415,
          "billing_address": {
            "_id": "5d08cff769767a2294eda730",
            "country": "DE",
            "city": "Hamburg",
            "zip_code": "20457",
            "street": "Am Strandkai",
            "salutation": "SALUTATION_MR",
            "first_name": "Stub",
            "last_name": "Accepted",
            "id": "5d08cff769767a2294eda730"
          },
          "business_option_id": 24940,
          "business_uuid": "{{businessId}}",
          "channel": "magento",
          "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "created_at": "2019-01-15T13:41:25.000Z",
          "currency": "EUR",
          "customer_email": "we9fhwiuhiu@gmail.com",
          "customer_name": "Stub Accepted",
          "delivery_fee": 0,
          "down_payment": 0,
          "items": [],
          "merchant_email": "sergiokurba11@gmail.com",
          "merchant_name": "TEST TRANSACTIONS",
          "payment_details": {
            "unique_id": "STUB_UNIQUE_ID",
            "usage_text": "STUB_USAGE_TEXT",
            "basket_id": "STUB_BASKET_ID",
            "advertising_accepted": true,
            "conditions_accepted": true,
            "birthday": "22.04.1978"
          },
          "payment_fee": 0,
          "payment_flow_id": "ec29696a0048b3da8f556b151652f29d",
          "place": "refunded",
          "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "santander_applications": [],
          "specific_status": "ACCEPTED",
          "status": "STATUS_REFUNDED",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/refund/9a8521e181fa3de1127141aa3653b622" with json:
    """
    {
      "amount": 100,
      "payment_items": [
        {
          "identifier": "4edbd710-9ba7-40c0-bb05-4da3a574ac82",
          "name": "Item name",
          "price": 100,
          "quantity": 1
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "9a8521e181fa3de1127141aa3653b622",
        "business_id": "{{businessId}}",
        "type": "refund",
        "amount": 100
      },
      "result": {
        "id": "9a8521e181fa3de1127141aa3653b622",
        "status": "STATUS_REFUNDED",
        "specific_status": "ACCEPTED",
        "merchant_name": "TEST TRANSACTIONS",
        "customer_name": "Stub Accepted",
        "payment_type": "paypal",
        "customer_email": "we9fhwiuhiu@gmail.com",
        "created_at": "2019-01-15T13:41:25.000Z",
        "updated_at": "2019-01-15T13:41:26.000Z",
        "channel": "magento",
        "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
        "amount": 650,
        "total": 650,
        "currency": "EUR",
        "delivery_fee": 0,
        "payment_fee": 0,
        "down_payment": 0,
        "payment_details": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "payment_details_array": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "address": {
         "city": "Hamburg",
         "country": "DE",
         "first_name": "Stub",
         "last_name": "Accepted",
         "salutation": "SALUTATION_MR",
         "street": "Am Strandkai",
         "zip_code": "20457"
        },
        "shipping_address": "*"
      }
    }
    """

  Scenario: Execute payment refund action with extra custom field
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
        "method": "post",
        "url": "*/api/business/{{businessId}}/3b864596-ca5b-429b-bfc1-4f9d5d87c375/legacy-api-action/refund",
        "body": "{\"fields\":{\"amount\":100,\"kid\":\"custom_kid_12345\"}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "5c3de305d665630012908367",
          "original_id": "9a8521e181fa3de1127141aa3653b622",
          "uuid": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "action_running": false,
          "available_refund_items": [],
          "amount": 650,
          "amount_refunded": 235,
          "amount_rest": 415,
          "billing_address": {
            "_id": "5d08cff769767a2294eda730",
            "country": "DE",
            "city": "Hamburg",
            "zip_code": "20457",
            "street": "Am Strandkai",
            "salutation": "SALUTATION_MR",
            "first_name": "Stub",
            "last_name": "Accepted",
            "id": "5d08cff769767a2294eda730"
          },
          "business_option_id": 24940,
          "business_uuid": "{{businessId}}",
          "channel": "magento",
          "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "created_at": "2019-01-15T13:41:25.000Z",
          "currency": "EUR",
          "customer_email": "we9fhwiuhiu@gmail.com",
          "customer_name": "Stub Accepted",
          "delivery_fee": 0,
          "down_payment": 0,
          "items": [],
          "merchant_email": "sergiokurba11@gmail.com",
          "merchant_name": "TEST TRANSACTIONS",
          "payment_details": {
            "unique_id": "STUB_UNIQUE_ID",
            "usage_text": "STUB_USAGE_TEXT",
            "basket_id": "STUB_BASKET_ID",
            "advertising_accepted": true,
            "conditions_accepted": true,
            "birthday": "22.04.1978"
          },
          "payment_fee": 0,
          "payment_flow_id": "ec29696a0048b3da8f556b151652f29d",
          "place": "refunded",
          "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "santander_applications": [],
          "specific_status": "ACCEPTED",
          "status": "STATUS_REFUNDED",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/refund/9a8521e181fa3de1127141aa3653b622" with json:
    """
    {
      "amount": 100,
      "kid": "custom_kid_12345"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "9a8521e181fa3de1127141aa3653b622",
        "business_id": "{{businessId}}",
        "type": "refund",
        "amount": 100
      },
      "result": {
        "id": "9a8521e181fa3de1127141aa3653b622",
        "status": "STATUS_REFUNDED",
        "specific_status": "ACCEPTED",
        "merchant_name": "TEST TRANSACTIONS",
        "customer_name": "Stub Accepted",
        "payment_type": "paypal",
        "customer_email": "we9fhwiuhiu@gmail.com",
        "created_at": "2019-01-15T13:41:25.000Z",
        "updated_at": "2019-01-15T13:41:26.000Z",
        "channel": "magento",
        "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
        "amount": 650,
        "total": 650,
        "currency": "EUR",
        "delivery_fee": 0,
        "payment_fee": 0,
        "down_payment": 0,
        "payment_details": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "payment_details_array": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "address": {
         "city": "Hamburg",
         "country": "DE",
         "first_name": "Stub",
         "last_name": "Accepted",
         "salutation": "SALUTATION_MR",
         "street": "Am Strandkai",
         "zip_code": "20457"
        },
        "shipping_address": "*"
      }
    }
    """

  Scenario: Execute payment cancel action
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
        "method": "post",
        "url": "*/api/business/{{businessId}}/3b864596-ca5b-429b-bfc1-4f9d5d87c375/legacy-api-action/cancel"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "5c3de305d665630012908367",
          "original_id": "9a8521e181fa3de1127141aa3653b622",
          "uuid": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "action_running": false,
          "available_refund_items": [],
          "amount": 650,
          "amount_refunded": 0,
          "amount_rest": 0,
          "billing_address": {
            "_id": "5d08cff769767a2294eda730",
            "country": "DE",
            "city": "Hamburg",
            "zip_code": "20457",
            "street": "Am Strandkai",
            "salutation": "SALUTATION_MR",
            "first_name": "Stub",
            "last_name": "Accepted",
            "id": "5d08cff769767a2294eda730"
          },
          "business_option_id": 24940,
          "business_uuid": "{{businessId}}",
          "channel": "magento",
          "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "created_at": "2019-01-15T13:41:25.000Z",
          "currency": "EUR",
          "customer_email": "we9fhwiuhiu@gmail.com",
          "customer_name": "Stub Accepted",
          "delivery_fee": 0,
          "down_payment": 0,
          "items": [],
          "merchant_email": "sergiokurba11@gmail.com",
          "merchant_name": "TEST TRANSACTIONS",
          "payment_details": {
            "unique_id": "STUB_UNIQUE_ID",
            "usage_text": "STUB_USAGE_TEXT",
            "basket_id": "STUB_BASKET_ID",
            "advertising_accepted": true,
            "conditions_accepted": true,
            "birthday": "22.04.1978"
          },
          "payment_fee": 0,
          "payment_flow_id": "ec29696a0048b3da8f556b151652f29d",
          "place": "refunded",
          "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "santander_applications": [],
          "specific_status": "CANCELLED",
          "status": "STATUS_CANCELLED",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/cancel/9a8521e181fa3de1127141aa3653b622"
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "9a8521e181fa3de1127141aa3653b622",
        "business_id": "{{businessId}}",
        "type": "cancel"
      },
      "result": {
        "id": "9a8521e181fa3de1127141aa3653b622",
        "status": "STATUS_CANCELLED",
        "specific_status": "CANCELLED",
        "merchant_name": "TEST TRANSACTIONS",
        "customer_name": "Stub Accepted",
        "payment_type": "paypal",
        "customer_email": "we9fhwiuhiu@gmail.com",
        "created_at": "2019-01-15T13:41:25.000Z",
        "updated_at": "2019-01-15T13:41:26.000Z",
        "channel": "magento",
        "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
        "amount": 650,
        "total": 650,
        "currency": "EUR",
        "delivery_fee": 0,
        "payment_fee": 0,
        "down_payment": 0,
        "payment_details": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "payment_details_array": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "address": {
         "city": "Hamburg",
         "country": "DE",
         "first_name": "Stub",
         "last_name": "Accepted",
         "salutation": "SALUTATION_MR",
         "street": "Am Strandkai",
         "zip_code": "20457"
        },
        "shipping_address": "*"
      }
    }
    """

  Scenario: Execute payment edit action
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
        "method": "post",
        "url": "*/api/business/{{businessId}}/3b864596-ca5b-429b-bfc1-4f9d5d87c375/legacy-api-action/edit",
        "body": "{\"fields\":{\"amount\":400,\"delivery_fee\":10}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "5c3de305d665630012908367",
          "original_id": "9a8521e181fa3de1127141aa3653b622",
          "uuid": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "action_running": false,
          "available_refund_items": [],
          "amount": 400,
          "amount_refunded": 0,
          "amount_rest": 0,
          "billing_address": {
            "_id": "5d08cff769767a2294eda730",
            "country": "DE",
            "city": "Hamburg",
            "zip_code": "20457",
            "street": "Am Strandkai",
            "salutation": "SALUTATION_MR",
            "first_name": "Stub",
            "last_name": "Accepted",
            "id": "5d08cff769767a2294eda730"
          },
          "business_option_id": 24940,
          "business_uuid": "{{businessId}}",
          "channel": "magento",
          "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "created_at": "2019-01-15T13:41:25.000Z",
          "currency": "EUR",
          "customer_email": "we9fhwiuhiu@gmail.com",
          "customer_name": "Stub Accepted",
          "delivery_fee": 10,
          "down_payment": 0,
          "items": [],
          "merchant_email": "sergiokurba11@gmail.com",
          "merchant_name": "TEST TRANSACTIONS",
          "payment_details": {
            "unique_id": "STUB_UNIQUE_ID",
            "usage_text": "STUB_USAGE_TEXT",
            "basket_id": "STUB_BASKET_ID",
            "advertising_accepted": true,
            "conditions_accepted": true,
            "birthday": "22.04.1978"
          },
          "payment_fee": 0,
          "payment_flow_id": "ec29696a0048b3da8f556b151652f29d",
          "place": "refunded",
          "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "santander_applications": [],
          "specific_status": "APPROVED",
          "status": "STATUS_IN_PROCESS",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/edit/9a8521e181fa3de1127141aa3653b622" with json:
    """
    {
      "amount": 400,
      "delivery_fee": 10
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "9a8521e181fa3de1127141aa3653b622",
        "business_id": "{{businessId}}",
        "type": "edit",
        "amount": 400,
        "delivery_fee": 10
      },
      "result": {
        "id": "9a8521e181fa3de1127141aa3653b622",
        "status": "STATUS_IN_PROCESS",
        "specific_status": "APPROVED",
        "merchant_name": "TEST TRANSACTIONS",
        "customer_name": "Stub Accepted",
        "payment_type": "paypal",
        "customer_email": "we9fhwiuhiu@gmail.com",
        "created_at": "2019-01-15T13:41:25.000Z",
        "updated_at": "2019-01-15T13:41:26.000Z",
        "channel": "magento",
        "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
        "amount": 400,
        "total": 650,
        "currency": "EUR",
        "delivery_fee": 10,
        "payment_fee": 0,
        "down_payment": 0,
        "payment_details": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "payment_details_array": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "address": {
         "city": "Hamburg",
         "country": "DE",
         "first_name": "Stub",
         "last_name": "Accepted",
         "salutation": "SALUTATION_MR",
         "street": "Am Strandkai",
         "zip_code": "20457"
        },
        "shipping_address": "*"
      }
    }
    """

  Scenario: Execute payment shipping goods action
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
        "method": "post",
        "url": "*/api/business/{{businessId}}/3b864596-ca5b-429b-bfc1-4f9d5d87c375/legacy-api-action/shipping_goods"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "5c3de305d665630012908367",
          "original_id": "9a8521e181fa3de1127141aa3653b622",
          "uuid": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "action_running": false,
          "available_refund_items": [],
          "amount": 650,
          "amount_refunded": 0,
          "amount_rest": 0,
          "billing_address": {
            "_id": "5d08cff769767a2294eda730",
            "country": "DE",
            "city": "Hamburg",
            "zip_code": "20457",
            "street": "Am Strandkai",
            "salutation": "SALUTATION_MR",
            "first_name": "Stub",
            "last_name": "Accepted",
            "id": "5d08cff769767a2294eda730"
          },
          "business_option_id": 24940,
          "business_uuid": "{{businessId}}",
          "channel": "magento",
          "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "created_at": "2019-01-15T13:41:25.000Z",
          "currency": "EUR",
          "customer_email": "we9fhwiuhiu@gmail.com",
          "customer_name": "Stub Accepted",
          "delivery_fee": 0,
          "down_payment": 0,
          "items": [],
          "merchant_email": "sergiokurba11@gmail.com",
          "merchant_name": "TEST TRANSACTIONS",
          "payment_details": {
            "unique_id": "STUB_UNIQUE_ID",
            "usage_text": "STUB_USAGE_TEXT",
            "basket_id": "STUB_BASKET_ID",
            "advertising_accepted": true,
            "conditions_accepted": true,
            "birthday": "22.04.1978"
          },
          "payment_fee": 0,
          "payment_flow_id": "ec29696a0048b3da8f556b151652f29d",
          "place": "refunded",
          "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "santander_applications": [],
          "specific_status": "SHIPPED",
          "status": "STATUS_PAID",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/shipping-goods/9a8521e181fa3de1127141aa3653b622"
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "9a8521e181fa3de1127141aa3653b622",
        "business_id": "{{businessId}}",
        "type": "shipping_goods"
      },
      "result": {
        "id": "9a8521e181fa3de1127141aa3653b622",
        "status": "STATUS_PAID",
        "specific_status": "SHIPPED",
        "merchant_name": "TEST TRANSACTIONS",
        "customer_name": "Stub Accepted",
        "payment_type": "paypal",
        "customer_email": "we9fhwiuhiu@gmail.com",
        "created_at": "2019-01-15T13:41:25.000Z",
        "updated_at": "2019-01-15T13:41:26.000Z",
        "channel": "magento",
        "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
        "amount": 650,
        "total": 650,
        "currency": "EUR",
        "delivery_fee": 0,
        "payment_fee": 0,
        "down_payment": 0,
        "payment_details": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "payment_details_array": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "address": {
         "city": "Hamburg",
         "country": "DE",
         "first_name": "Stub",
         "last_name": "Accepted",
         "salutation": "SALUTATION_MR",
         "street": "Am Strandkai",
         "zip_code": "20457"
        },
        "shipping_address": "*"
      }
    }
    """
    Then I look for model "ActionApiCall" by following JSON and remember as "actionApiCall":
    """
    {
      "action": "shipping_goods",
      "businessId": "{{businessId}}",
      "paymentId": "9a8521e181fa3de1127141aa3653b622"
    }
    """
    And model "ActionApiCall" with id "{{actionApiCall._id}}" should contain json:
    """
    {
      "action": "shipping_goods",
      "businessId": "{{businessId}}",
      "paymentId": "9a8521e181fa3de1127141aa3653b622",
      "executionTime": "*",
      "status": "success"
    }
    """

  Scenario: Execute payment shipped action to skip validation
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
        "method": "post",
        "url": "*/api/business/{{businessId}}/3b864596-ca5b-429b-bfc1-4f9d5d87c375/legacy-api-action/shipped"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "5c3de305d665630012908367",
          "original_id": "9a8521e181fa3de1127141aa3653b622",
          "uuid": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "action_running": false,
          "available_refund_items": [],
          "amount": 650,
          "amount_refunded": 0,
          "amount_rest": 0,
          "billing_address": {
            "_id": "5d08cff769767a2294eda730",
            "country": "DE",
            "city": "Hamburg",
            "zip_code": "20457",
            "street": "Am Strandkai",
            "salutation": "SALUTATION_MR",
            "first_name": "Stub",
            "last_name": "Accepted",
            "id": "5d08cff769767a2294eda730"
          },
          "business_option_id": 24940,
          "business_uuid": "{{businessId}}",
          "channel": "magento",
          "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "created_at": "2019-01-15T13:41:25.000Z",
          "currency": "EUR",
          "customer_email": "we9fhwiuhiu@gmail.com",
          "customer_name": "Stub Accepted",
          "delivery_fee": 0,
          "down_payment": 0,
          "items": [],
          "merchant_email": "sergiokurba11@gmail.com",
          "merchant_name": "TEST TRANSACTIONS",
          "payment_details": {
            "unique_id": "STUB_UNIQUE_ID",
            "usage_text": "STUB_USAGE_TEXT",
            "basket_id": "STUB_BASKET_ID",
            "advertising_accepted": true,
            "conditions_accepted": true,
            "birthday": "22.04.1978"
          },
          "payment_fee": 0,
          "payment_flow_id": "ec29696a0048b3da8f556b151652f29d",
          "place": "refunded",
          "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "santander_applications": [],
          "specific_status": "SHIPPED",
          "status": "STATUS_PAID",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/shipped/9a8521e181fa3de1127141aa3653b622"
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "9a8521e181fa3de1127141aa3653b622",
        "business_id": "{{businessId}}",
        "type": "shipped"
      },
      "result": {
        "id": "9a8521e181fa3de1127141aa3653b622",
        "status": "STATUS_PAID",
        "specific_status": "SHIPPED",
        "merchant_name": "TEST TRANSACTIONS",
        "customer_name": "Stub Accepted",
        "payment_type": "paypal",
        "customer_email": "we9fhwiuhiu@gmail.com",
        "created_at": "2019-01-15T13:41:25.000Z",
        "updated_at": "2019-01-15T13:41:26.000Z",
        "channel": "magento",
        "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
        "amount": 650,
        "total": 650,
        "currency": "EUR",
        "delivery_fee": 0,
        "payment_fee": 0,
        "down_payment": 0,
        "payment_details": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "payment_details_array": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "address": {
         "city": "Hamburg",
         "country": "DE",
         "first_name": "Stub",
         "last_name": "Accepted",
         "salutation": "SALUTATION_MR",
         "street": "Am Strandkai",
         "zip_code": "20457"
        },
        "shipping_address": "*"
      }
    }
    """
    Then I look for model "ActionApiCall" by following JSON and remember as "actionApiCall":
    """
    {
      "action": "shipped",
      "businessId": "{{businessId}}",
      "paymentId": "9a8521e181fa3de1127141aa3653b622"
    }
    """
    And model "ActionApiCall" with id "{{actionApiCall._id}}" should contain json:
    """
    {
      "action": "shipped",
      "businessId": "{{businessId}}",
      "paymentId": "9a8521e181fa3de1127141aa3653b622",
      "executionTime": "*",
      "status": "success"
    }
    """

  Scenario: Execute payment shipping goods action with payment items
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
        "method": "post",
        "url": "*/api/business/{{businessId}}/3b864596-ca5b-429b-bfc1-4f9d5d87c375/legacy-api-action/shipping_goods",
        "body": "{\"fields\":{\"amount\":300,\"payment_items\":[{\"identifier\":\"4edbd710-9ba7-40c0-bb05-4da3a574ac82\",\"name\":\"Item name\",\"price\":300,\"quantity\":1}]}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "5c3de305d665630012908367",
          "original_id": "9a8521e181fa3de1127141aa3653b622",
          "uuid": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "action_running": false,
          "available_refund_items": [],
          "amount": 650,
          "amount_refunded": 0,
          "amount_rest": 0,
          "billing_address": {
            "_id": "5d08cff769767a2294eda730",
            "country": "DE",
            "city": "Hamburg",
            "zip_code": "20457",
            "street": "Am Strandkai",
            "salutation": "SALUTATION_MR",
            "first_name": "Stub",
            "last_name": "Accepted",
            "id": "5d08cff769767a2294eda730"
          },
          "business_option_id": 24940,
          "business_uuid": "{{businessId}}",
          "channel": "magento",
          "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "created_at": "2019-01-15T13:41:25.000Z",
          "currency": "EUR",
          "customer_email": "we9fhwiuhiu@gmail.com",
          "customer_name": "Stub Accepted",
          "delivery_fee": 0,
          "down_payment": 0,
          "items": [],
          "merchant_email": "sergiokurba11@gmail.com",
          "merchant_name": "TEST TRANSACTIONS",
          "payment_details": {
            "unique_id": "STUB_UNIQUE_ID",
            "usage_text": "STUB_USAGE_TEXT",
            "basket_id": "STUB_BASKET_ID",
            "advertising_accepted": true,
            "conditions_accepted": true,
            "birthday": "22.04.1978"
          },
          "payment_fee": 0,
          "payment_flow_id": "ec29696a0048b3da8f556b151652f29d",
          "place": "refunded",
          "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "santander_applications": [],
          "specific_status": "SHIPPED",
          "status": "STATUS_PAID",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/shipping-goods/9a8521e181fa3de1127141aa3653b622" with json:
    """
    {
      "amount": 300,
      "payment_items": [
        {
          "identifier": "4edbd710-9ba7-40c0-bb05-4da3a574ac82",
          "name": "Item name",
          "price": 300,
          "quantity": 1
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "9a8521e181fa3de1127141aa3653b622",
        "business_id": "{{businessId}}",
        "type": "shipping_goods"
      },
      "result": {
        "id": "9a8521e181fa3de1127141aa3653b622",
        "status": "STATUS_PAID",
        "specific_status": "SHIPPED",
        "merchant_name": "TEST TRANSACTIONS",
        "customer_name": "Stub Accepted",
        "payment_type": "paypal",
        "customer_email": "we9fhwiuhiu@gmail.com",
        "created_at": "2019-01-15T13:41:25.000Z",
        "updated_at": "2019-01-15T13:41:26.000Z",
        "channel": "magento",
        "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
        "amount": 650,
        "total": 650,
        "currency": "EUR",
        "delivery_fee": 0,
        "payment_fee": 0,
        "down_payment": 0,
        "payment_details": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "payment_details_array": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "address": {
         "city": "Hamburg",
         "country": "DE",
         "first_name": "Stub",
         "last_name": "Accepted",
         "salutation": "SALUTATION_MR",
         "street": "Am Strandkai",
         "zip_code": "20457"
        },
        "shipping_address": "*"
      }
    }
    """

  Scenario: Execute payment authorize action
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
        "method": "post",
        "url": "*/api/business/{{businessId}}/3b864596-ca5b-429b-bfc1-4f9d5d87c375/legacy-api-action/authorize"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "5c3de305d665630012908367",
          "original_id": "9a8521e181fa3de1127141aa3653b622",
          "uuid": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "action_running": false,
          "available_refund_items": [],
          "amount": 650,
          "amount_refunded": 0,
          "amount_rest": 0,
          "billing_address": {
            "_id": "5d08cff769767a2294eda730",
            "country": "DE",
            "city": "Hamburg",
            "zip_code": "20457",
            "street": "Am Strandkai",
            "salutation": "SALUTATION_MR",
            "first_name": "Stub",
            "last_name": "Accepted",
            "id": "5d08cff769767a2294eda730"
          },
          "business_option_id": 24940,
          "business_uuid": "{{businessId}}",
          "channel": "magento",
          "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "created_at": "2019-01-15T13:41:25.000Z",
          "currency": "EUR",
          "customer_email": "we9fhwiuhiu@gmail.com",
          "customer_name": "Stub Accepted",
          "delivery_fee": 0,
          "down_payment": 0,
          "items": [],
          "merchant_email": "sergiokurba11@gmail.com",
          "merchant_name": "TEST TRANSACTIONS",
          "payment_details": {
            "unique_id": "STUB_UNIQUE_ID",
            "usage_text": "STUB_USAGE_TEXT",
            "basket_id": "STUB_BASKET_ID",
            "advertising_accepted": true,
            "conditions_accepted": true,
            "birthday": "22.04.1978"
          },
          "payment_fee": 0,
          "payment_flow_id": "ec29696a0048b3da8f556b151652f29d",
          "place": "refunded",
          "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "santander_applications": [],
          "specific_status": "CAPTURE",
          "status": "STATUS_ACCEPTED",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/authorize/9a8521e181fa3de1127141aa3653b622"
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "9a8521e181fa3de1127141aa3653b622",
        "business_id": "{{businessId}}",
        "type": "authorize"
      },
      "result": {
        "id": "9a8521e181fa3de1127141aa3653b622",
        "status": "STATUS_ACCEPTED",
        "specific_status": "CAPTURE",
        "merchant_name": "TEST TRANSACTIONS",
        "customer_name": "Stub Accepted",
        "payment_type": "paypal",
        "customer_email": "we9fhwiuhiu@gmail.com",
        "created_at": "2019-01-15T13:41:25.000Z",
        "updated_at": "2019-01-15T13:41:26.000Z",
        "channel": "magento",
        "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
        "amount": 650,
        "total": 650,
        "currency": "EUR",
        "delivery_fee": 0,
        "payment_fee": 0,
        "down_payment": 0,
        "payment_details": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "payment_details_array": {
         "unique_id": "STUB_UNIQUE_ID",
         "usage_text": "STUB_USAGE_TEXT",
         "basket_id": "STUB_BASKET_ID",
         "advertising_accepted": true,
         "conditions_accepted": true,
         "birthday": "22.04.1978"
        },
        "address": {
         "city": "Hamburg",
         "country": "DE",
         "first_name": "Stub",
         "last_name": "Accepted",
         "salutation": "SALUTATION_MR",
         "street": "Am Strandkai",
         "zip_code": "20457"
        },
        "shipping_address": "*"
      }
    }
    """

  Scenario: Get payment action calls
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
          "url": "*/api/business/{{businessId}}/transaction/3b864596-ca5b-429b-bfc1-4f9d5d87c375/history/shipping_goods?limit=2"
        },
        "response": {
          "status": 200,
          "body": [
            {
              "_id": "api-call-id-5",
              "paymentId": "9a8521e181fa3de1127141aa3653b622",
              "action": "shipping_goods",
              "requestData": {
                "any": "value"
              },
              "status": "success"
            },
            {
              "_id": "api-call-id-4",
              "paymentId": "9a8521e181fa3de1127141aa3653b622",
              "action": "shipping_goods",
              "requestData": {
                "any": "value"
              },
              "status": "success"
            }
          ]
        }
      }
      """
    When I send a GET request to "/api/payment/shipping-goods/9a8521e181fa3de1127141aa3653b622?limit=2"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "api-call-id-5",
          "paymentId": "9a8521e181fa3de1127141aa3653b622",
          "action": "shipping_goods",
          "requestData": {
            "any": "value"
          },
          "status": "success"
        },
        {
          "_id": "api-call-id-4",
          "paymentId": "9a8521e181fa3de1127141aa3653b622",
          "action": "shipping_goods",
          "requestData": {
            "any": "value"
          },
          "status": "success"
        }
      ]
      """

  Scenario Outline: Get recent payment actions for business
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
          "url": "*/api/business/{{businessId}}/history/<payment-action>?limit=2"
        },
        "response": {
          "status": 200,
          "body": [
            {
              "transactionId": "9a8521e181fa3de1127141aa3653b622",
              "action": "<payment-action>",
              "amount": 100
            },
            {
              "transactionId": "9a8521e181fa3de1127141aa3653b623",
              "action": "<payment-action>",
              "amount": 200
            }
          ]
        }
      }
      """
    When I send a GET request to "/api/payment/<action>?limit=2"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "transactionId": "9a8521e181fa3de1127141aa3653b622",
          "action": "<payment-action>",
          "amount": 100
        },
        {
          "transactionId": "9a8521e181fa3de1127141aa3653b623",
          "action": "<payment-action>",
          "amount": 200
        }
      ]
      """
    Examples:
      | action         | payment-action     |
      | shipping-goods | shipping_goods |
      | refund         | refund         |
      | cancel         | cancel         |

