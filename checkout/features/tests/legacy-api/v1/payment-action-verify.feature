Feature: Payment action verify
  Background:
    Given I remember as "businessId" following value:
      """
      "2382ffce-5620-4f13-885d-3c069f9dd9b4"
      """
    Given I remember as "paymentId" following value:
      """
      "3dc8e758-87e9-4175-b371-3310c041aa07"
      """

  Scenario: Execute payment verify by code action
    Given I use DB fixture "legacy-api/payment-action-verify/payment-verify-by-code"
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
        "url": "*/api/business/{{businessId}}/{{paymentId}}/legacy-api-action/verify",
        "body": "{\"fields\":{\"code\":123456}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "{{paymentId}}",
          "original_id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
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
          "status": "STATUS_PAID",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    {
      "code": 123456
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
        "payment_id": "{{paymentId}}",
        "business_id": "{{businessId}}",
        "type": "verify"
      },
      "result": {
        "id": "{{paymentId}}",
        "status": "STATUS_PAID",
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

  Scenario: Execute payment verify by code action with wrong pin code
    Given I use DB fixture "legacy-api/payment-action-verify/payment-verify-by-code"
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
        "url": "*/api/business/{{businessId}}/{{paymentId}}/legacy-api-action/verify",
        "body": "{\"fields\":{\"code\":123456}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "{{paymentId}}",
          "original_id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
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
          "status": "STATUS_PAID",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    {
      "code": 111111
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
     "call": {
       "status": "failed",
       "id": "*",
       "created_at": "*",
       "payment_id": "{{paymentId}}",
       "business_id": "{{businessId}}",
       "type": "verify",
       "code": 111111,
       "message": "Wrong code"
     },
     "error": "An api error occurred",
     "error_description": "Wrong code"
    }
    """

  Scenario: Execute payment verify by id action
    Given I use DB fixture "legacy-api/payment-action-verify/payment-verify-by-id"
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
        "url": "*/api/business/{{businessId}}/{{paymentId}}/legacy-api-action/verify",
        "body": "{\"fields\":{\"verified\":true}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "{{paymentId}}",
          "original_id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
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
          "status": "STATUS_PAID",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    {
      "verified": true
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
        "payment_id": "{{paymentId}}",
        "business_id": "{{businessId}}",
        "type": "verify"
      },
      "result": {
        "id": "{{paymentId}}",
        "status": "STATUS_PAID",
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

  Scenario: Execute payment verify by id action with wrong payload
    Given I use DB fixture "legacy-api/payment-action-verify/payment-verify-by-id"
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
        "url": "*/api/business/{{businessId}}/{{paymentId}}/legacy-api-action/verify",
        "body": "{\"fields\":{\"verified\":true}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "{{paymentId}}",
          "original_id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
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
          "status": "STATUS_PAID",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    { }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
     "call": {
       "status": "failed",
       "id": "*",
       "created_at": "*",
       "payment_id": "{{paymentId}}",
       "business_id": "{{businessId}}",
       "type": "verify",
       "message": "\"verified\" param is missing"
     },
     "error": "An api error occurred",
     "error_description": "\"verified\" param is missing"
    }
    """

  Scenario: Execute payment verify custom
    Given I use DB fixture "legacy-api/payment-action-verify/payment-verify-custom"
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
        "url": "*/api/business/{{businessId}}/{{paymentId}}/legacy-api-action/verify",
        "body": "{\"fields\":{\"seller\":{\"id\":\"seller_internal_id\",\"first_name\":\"seller_first\",\"last_name\":\"seller_last\",\"email\":\"seller@merchant.com\"},\"identification\":[{\"idNumber\":\"12345\",\"applicant\":1}]}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "{{paymentId}}",
          "original_id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
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
          "status": "STATUS_PAID",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    {
      "custom": {
        "identification": [
          {
            "idNumber": "12345",
            "applicant": 1
          }
        ]
      },
      "seller": {
        "id": "seller_internal_id",
        "first_name": "seller_first",
        "last_name": "seller_last",
        "email": "seller@merchant.com"
      }
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
        "payment_id": "{{paymentId}}",
        "business_id": "{{businessId}}",
        "type": "verify"
      },
      "result": {
        "id": "{{paymentId}}",
        "status": "STATUS_PAID",
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

  Scenario: Execute payment verify custom without custom field should proxy payload
    Given I use DB fixture "legacy-api/payment-action-verify/payment-verify-custom"
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
        "url": "*/api/business/{{businessId}}/{{paymentId}}/legacy-api-action/verify",
        "body": "{\"fields\":{\"seller\":{\"id\":\"seller_internal_id\",\"first_name\":\"seller_first\",\"last_name\":\"seller_last\",\"email\":\"seller@merchant.com\"},\"identification\":[{\"idNumber\":\"12345\",\"applicant\":1}]}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "{{paymentId}}",
          "original_id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
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
          "status": "STATUS_PAID",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    {
      "identification": [
        {
          "idNumber": "12345",
          "applicant": 1
        }
      ],
      "seller": {
        "id": "seller_internal_id",
        "first_name": "seller_first",
        "last_name": "seller_last",
        "email": "seller@merchant.com"
      }
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
        "payment_id": "{{paymentId}}",
        "business_id": "{{businessId}}",
        "type": "verify"
      },
      "result": {
        "id": "{{paymentId}}",
        "status": "STATUS_PAID",
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

  Scenario: Execute payment verify by code with 2fa = email
    Given I use DB fixture "legacy-api/payment-action-verify/payment-verify-by-code-2fa-email"
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
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    {
      "code": 123456
    }
    """
    Then I look for model "Payment2faPin" by following JSON and remember as "twoFactor":
    """
    {
      "paymentId": "{{paymentId}}",
      "verified": false
    }
    """
    Then print storage key "twoFactor"
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.user.email",
        "payload": {
          "templateName": "payment.verify.pin",
          "to": "m.kunze@wasserbadmail.de",
          "variables": {
            "pin": "{{twoFactor.pin}}"
          }
        }
      }
    ]
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
        "payment_id": "{{paymentId}}",
        "business_id": "{{businessId}}",
        "type": "verify"
      },
      "result": {
        "id": "{{paymentId}}",
        "status": "STATUS_IN_PROCESS",
        "specific_status": "NEW_TRANSACTION",
        "merchant_name": "AutomationBusiness",
        "customer_name": "m.kunze@wasserbadmail.de",
        "payment_type": "santander_pos_factoring_de",
        "customer_email": "m.kunze@wasserbadmail.de",
        "created_at": "*",
        "updated_at": "*",
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
        "address": "*",
        "shipping_address": "*"
      }
    }
    """
    Then I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/{{paymentId}}/legacy-api-action/verify",
        "body": "{\"fields\":{\"code\":123456, \"pin\":\"{{twoFactor.pin}}\"}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "{{paymentId}}",
          "original_id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
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
          "status": "STATUS_PAID",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    {
      "code": 123456,
      "pin": {{twoFactor.pin}}
    }
    """
    Then print last response
    Then model "Payment2faPin" with id "{{twoFactor._id}}" should contain json:
    """
    {
      "paymentId": "{{paymentId}}",
      "pin": "{{twoFactor.pin}}",
      "verified": true
    }
    """
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "{{paymentId}}",
        "business_id": "{{businessId}}",
        "type": "verify"
      },
      "result": {
        "id": "{{paymentId}}",
        "status": "STATUS_PAID",
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

  Scenario: Execute payment verify by code with 2fa = email, wrong pin code
    Given I use DB fixture "legacy-api/payment-action-verify/payment-verify-by-code-2fa-email"
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
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    {
      "code": 123456
    }
    """
    And the response status code should be 201
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    {
      "code": 123456,
      "pin": 111111
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
     "call": {
       "status": "failed",
       "id": "*",
       "created_at": "*",
       "payment_id": "{{paymentId}}",
       "business_id": "{{businessId}}",
       "type": "verify",
       "code": 123456,
       "pin": 111111,
       "message": "Wrong 2fa pin"
     },
     "error": "An api error occurred",
     "error_description": "Wrong 2fa pin"
    }
    """

  Scenario: Execute payment verify by code with 2fa = sms
    Given I use DB fixture "legacy-api/payment-action-verify/payment-verify-by-code-2fa-sms"
    Given I use DB fixture "legacy-api/payment-action-verify/channel-set-and-channel-sms"
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
    Then I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://communications-third-party.test.devpayever.com/api/business/{{businessId}}/integration/twilio/action/send-message",
        "body": "{\"from\":\"+23456789\",\"to\":\"+4212345678\",\"message\":\"payever: Your payment verification code: *. This code cannot be shared.\"}"
      },
      "response": {
        "status": 200,
        "body": {}
      }
    }
    """
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    {
      "code": 123456
    }
    """
    Then I look for model "Payment2faPin" by following JSON and remember as "twoFactor":
    """
    {
      "paymentId": "{{paymentId}}",
      "verified": false
    }
    """
    Then print storage key "twoFactor"
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "{{paymentId}}",
        "business_id": "{{businessId}}",
        "type": "verify"
      },
      "result": {
        "id": "{{paymentId}}",
        "status": "STATUS_IN_PROCESS",
        "specific_status": "NEW_TRANSACTION",
        "merchant_name": "AutomationBusiness",
        "customer_name": "m.kunze@wasserbadmail.de",
        "payment_type": "santander_pos_factoring_de",
        "customer_email": "m.kunze@wasserbadmail.de",
        "created_at": "*",
        "updated_at": "*",
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
        "address": "*",
        "shipping_address": "*"
      }
    }
    """
    Then I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/{{paymentId}}/legacy-api-action/verify",
        "body": "{\"fields\":{\"code\":123456, \"pin\":\"{{twoFactor.pin}}\"}}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "{{paymentId}}",
          "original_id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
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
          "status": "STATUS_PAID",
          "total": 650,
          "type": "paypal",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/verify/{{paymentId}}" with json:
    """
    {
      "code": 123456,
      "pin": {{twoFactor.pin}}
    }
    """
    Then print last response
    Then model "Payment2faPin" with id "{{twoFactor._id}}" should contain json:
    """
    {
      "paymentId": "{{paymentId}}",
      "pin": "{{twoFactor.pin}}",
      "verified": true
    }
    """
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*",
        "payment_id": "{{paymentId}}",
        "business_id": "{{businessId}}",
        "type": "verify"
      },
      "result": {
        "id": "{{paymentId}}",
        "status": "STATUS_PAID",
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
