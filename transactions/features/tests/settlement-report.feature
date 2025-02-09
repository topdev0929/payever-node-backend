Feature: Settlement report
  Background:
    Given I remember as "businessId" following value:
    """
    "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
    """
    Given I authenticate as a user with the following data:
    """
    {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]}
    """
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/integration/psa_b2b_bnpl/action/settlement-report",
        "body": "{\"startDate\":\"2023-09-01\",\"endDate\":\"2023-09-30\",\"currency\":\"EUR\",\"paymentMethod\":\"psa_b2b_bnpl\",\"operationType\":\"paid\",\"businessId\":\"{{businessId}}\"}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
          "authorization": "*"
        }
      },
      "response": {
        "status": 201,
        "body": [
         {
            "paymentId":"3163971a-47a4-4440-a7f4-46a4632e4588",
            "merchantOrderId":"456zxc",
            "pspReferenceId":"",
            "bankReferenceId":"",
            "initiationDate":"2023-07-25T12:28:14.495Z",
            "businessName":"Pay",
            "businessId":"c193b0d1-c229-4e4d-9587-1c37233d2ee7",
            "customerEmail":"approve@forter.com",
            "customerName":"Grün Ampel",
            "transactionCreditDebit":"",
            "operationType":"paid",
            "executionDate":"2023-09-27T00:00:00.000Z",
            "grossAmount":200,
            "netAmount":212,
            "paymentFeeCreditDebit":"",
            "paymentFee":12,
            "transactionFee":0,
            "currency":"EUR",
            "billingCountry":"DE",
            "billingCity":"Marburg",
            "billingStreet":"Emil-von-Behring-Str. 76",
            "shippingCountry":"DE",
            "shippingCity":"Marburg",
            "shippingStreet":"Emil-von-Behring-Str. 76"
         },
         {
            "paymentId":"17a02c6a-c5b9-462a-8702-d4344fc7212a",
            "merchantOrderId":"as54a5sd45as4d2132139111",
            "pspReferenceId":"",
            "bankReferenceId":"",
            "initiationDate":"2023-07-14T15:30:06.413Z",
            "businessName":"Pay",
            "businessId":"c193b0d1-c229-4e4d-9587-1c37233d2ee7",
            "customerEmail":"approve@forter.com",
            "customerName":"Grün Ampel",
            "transactionCreditDebit":"",
            "operationType":"paid",
            "executionDate":"2023-09-27T00:00:00.000Z",
            "grossAmount":1200,
            "netAmount":1220,
            "paymentFeeCreditDebit":"",
            "paymentFee":20,
            "transactionFee":0,
            "currency":"EUR",
            "billingCountry":"DE",
            "billingCity":"Marburg",
            "billingStreet":"Emil-von-Behring-Str. 76",
            "shippingCountry":"DE",
            "shippingCity":"Marburg",
            "shippingStreet":"Emil-von-Behring-Str. 76"
         }
      ]
      }
    }
    """

  Scenario: Generate external settlement report (json)
    When I send a POST request to "/api/settlement/report" with json:
    """
    {
      "filter": {
        "start_date": "2023-09-01",
        "end_date": "2023-09-30",
        "currency": "EUR",
        "payment_method": "psa_b2b_bnpl",
        "operation_type": "paid"
      },
      "format": "json",
      "fields": [
      ]
    }
    """
    Then print last response
    And the response status code should be 200
    And response should contain json:
    """
    [
     {
       "transaction_id": "3163971a-47a4-4440-a7f4-46a4632e4588",
       "order_id": "456zxc",
       "psp_reference_id": "",
       "bank_reference_id": "",
       "initiation_date": "2023-07-25T12:28:14.495Z",
       "business_name": "Pay",
       "business_id": "c193b0d1-c229-4e4d-9587-1c37233d2ee7",
       "customer_email": "approve@forter.com",
       "customer_name": "Grün Ampel",
       "transaction_credit_debit": "",
       "operation_type": "paid",
       "execution_date": "2023-09-27T00:00:00.000Z",
       "gross_amount": 200,
       "net_amount": 212,
       "payment_fee_credit_debit": "",
       "payment_fee": 12,
       "transaction_fee": 0,
       "currency": "EUR",
       "billing_country": "DE",
       "billing_city": "Marburg",
       "billing_street": "Emil-von-Behring-Str. 76",
       "shipping_country": "DE",
       "shipping_city": "Marburg",
       "shipping_street": "Emil-von-Behring-Str. 76"
     },
     {
       "transaction_id": "17a02c6a-c5b9-462a-8702-d4344fc7212a",
       "order_id": "as54a5sd45as4d2132139111",
       "psp_reference_id": "",
       "bank_reference_id": "",
       "initiation_date": "2023-07-14T15:30:06.413Z",
       "business_name": "Pay",
       "business_id": "c193b0d1-c229-4e4d-9587-1c37233d2ee7",
       "customer_email": "approve@forter.com",
       "customer_name": "Grün Ampel",
       "transaction_credit_debit": "",
       "operation_type": "paid",
       "execution_date": "2023-09-27T00:00:00.000Z",
       "gross_amount": 1200,
       "net_amount": 1220,
       "payment_fee_credit_debit": "",
       "payment_fee": 20,
       "transaction_fee": 0,
       "currency": "EUR",
       "billing_country": "DE",
       "billing_city": "Marburg",
       "billing_street": "Emil-von-Behring-Str. 76",
       "shipping_country": "DE",
       "shipping_city": "Marburg",
       "shipping_street": "Emil-von-Behring-Str. 76"
     }
    ]
    """

  Scenario: Generate external settlement report (csv)
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/storage/file?expiry=86400",
        "body": "*",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "multipart/form-data; boundary=*",
          "authorization": "*"
        }
      },
      "response": {
        "status": 201,
        "body": {
          "url": "https://blob.url"
        }
      }
    }
    """
    When I send a POST request to "/api/settlement/report" with json:
    """
    {
      "filter": {
        "start_date": "2023-09-01",
        "end_date": "2023-09-30",
        "currency": "EUR",
        "payment_method": "psa_b2b_bnpl",
        "operation_type": "paid"
      },
      "format": "csv",
      "fields": [
      ]
    }
    """
    Then print last response
    And the response status code should be 200
    And response should contain json:
    """
    {
      "id": "*"
    }
    """
    Then I get "id" from response and remember as "fileId"
    Then I look for model "SettlementReportFile" with id "{{fileId}}" and remember as "file"
    Then print storage key "file"
    Then stored value "file" should contain json:
    """
      {
        "_id": "{{fileId}}",
        "format": "csv",
        "url": "https://blob.url"
      }
    """

  Scenario: Generate external settlement report (xlsx)
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/storage/file?expiry=86400",
        "body": "*",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "multipart/form-data; boundary=*",
          "authorization": "*"
        }
      },
      "response": {
        "status": 201,
        "body": {
          "url": "https://blob.url"
        }
      }
    }
    """
    When I send a POST request to "/api/settlement/report" with json:
    """
    {
      "filter": {
        "start_date": "2023-09-01",
        "end_date": "2023-09-30",
        "currency": "EUR",
        "payment_method": "psa_b2b_bnpl",
        "operation_type": "paid"
      },
      "format": "xlsx",
      "fields": [
      ]
    }
    """
    Then print last response
    And the response status code should be 200
    And response should contain json:
    """
    {
      "id": "*"
    }
    """
    Then I get "id" from response and remember as "fileId"
    Then I look for model "SettlementReportFile" with id "{{fileId}}" and remember as "file"
    Then print storage key "file"
    Then stored value "file" should contain json:
    """
      {
        "_id": "{{fileId}}",
        "format": "xlsx",
        "url": "https://blob.url"
      }
    """

  Scenario: Generate external settlement report (pdf)
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/storage/file?expiry=86400",
        "body": "*",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "multipart/form-data; boundary=*",
          "authorization": "*"
        }
      },
      "response": {
        "status": 201,
        "body": {
          "url": "https://blob.url"
        }
      }
    }
    """
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://blob.url",
        "headers": {
          "Accept": "application/json, text/plain, */*"
        }
      },
      "response": {
        "status": 200,
        "body": "content"
      }
    }
    """
    When I send a POST request to "/api/settlement/report" with json:
    """
    {
      "filter": {
        "start_date": "2023-09-01",
        "end_date": "2023-09-30",
        "currency": "EUR",
        "payment_method": "psa_b2b_bnpl",
        "operation_type": "paid"
      },
      "format": "pdf",
      "fields": [
      ]
    }
    """
    Then print last response
    And the response status code should be 200
    And response should contain json:
    """
    {
      "id": "*"
    }
    """
    Then I get "id" from response and remember as "fileId"
    Then I look for model "SettlementReportFile" with id "{{fileId}}" and remember as "file"
    Then print storage key "file"
    Then stored value "file" should contain json:
    """
      {
        "_id": "{{fileId}}",
        "format": "pdf",
        "url": "https://blob.url"
      }
    """
    Then I send a GET request to "/api/settlement/report/{{fileId}}"
    And the response status code should be 200
    Then print last response
    And response should contain json:
    """
    {
       "type": "Buffer",
       "data": [
         99,
         111,
         110,
         116,
         101,
         110,
         116
       ]
     }
    """
    And the response header "Content-Type" should have value "application/pdf"

  Scenario: Generate external settlement report (json) with business id in header
    Given I set header "x-payever-business" with value "{{businessId}}"
    When I send a POST request to "/api/settlement/report" with json:
    """
    {
      "filter": {
        "start_date": "2023-09-01",
        "end_date": "2023-09-30",
        "currency": "EUR",
        "payment_method": "psa_b2b_bnpl",
        "operation_type": "paid"
      },
      "format": "json",
      "fields": [
      ]
    }
    """
    Then print last response
    And the response status code should be 200
    And response should contain json:
    """
    [
     {
       "transaction_id": "3163971a-47a4-4440-a7f4-46a4632e4588",
       "order_id": "456zxc",
       "psp_reference_id": "",
       "bank_reference_id": "",
       "initiation_date": "2023-07-25T12:28:14.495Z",
       "business_name": "Pay",
       "business_id": "c193b0d1-c229-4e4d-9587-1c37233d2ee7",
       "customer_email": "approve@forter.com",
       "customer_name": "Grün Ampel",
       "transaction_credit_debit": "",
       "operation_type": "paid",
       "execution_date": "2023-09-27T00:00:00.000Z",
       "gross_amount": 200,
       "net_amount": 212,
       "payment_fee_credit_debit": "",
       "payment_fee": 12,
       "transaction_fee": 0,
       "currency": "EUR",
       "billing_country": "DE",
       "billing_city": "Marburg",
       "billing_street": "Emil-von-Behring-Str. 76",
       "shipping_country": "DE",
       "shipping_city": "Marburg",
       "shipping_street": "Emil-von-Behring-Str. 76"
     },
     {
       "transaction_id": "17a02c6a-c5b9-462a-8702-d4344fc7212a",
       "order_id": "as54a5sd45as4d2132139111",
       "psp_reference_id": "",
       "bank_reference_id": "",
       "initiation_date": "2023-07-14T15:30:06.413Z",
       "business_name": "Pay",
       "business_id": "c193b0d1-c229-4e4d-9587-1c37233d2ee7",
       "customer_email": "approve@forter.com",
       "customer_name": "Grün Ampel",
       "transaction_credit_debit": "",
       "operation_type": "paid",
       "execution_date": "2023-09-27T00:00:00.000Z",
       "gross_amount": 1200,
       "net_amount": 1220,
       "payment_fee_credit_debit": "",
       "payment_fee": 20,
       "transaction_fee": 0,
       "currency": "EUR",
       "billing_country": "DE",
       "billing_city": "Marburg",
       "billing_street": "Emil-von-Behring-Str. 76",
       "shipping_country": "DE",
       "shipping_city": "Marburg",
       "shipping_street": "Emil-von-Behring-Str. 76"
     }
    ]
    """

  Scenario: Generate external settlement report (json) with wrong business id in header is forbidden
    Given I set header "x-payever-business" with value "wrong_id"
    When I send a POST request to "/api/settlement/report" with json:
    """
    {
      "filter": {
        "start_date": "2023-09-01",
        "end_date": "2023-09-30",
        "currency": "EUR",
        "payment_method": "psa_b2b_bnpl",
        "operation_type": "paid"
      },
      "format": "json",
      "fields": [
      ]
    }
    """
    Then print last response
    And the response status code should be 403
    And response should contain json:
    """
    {
      "statusCode": 403,
      "message": "You're not allowed to get the report",
      "error": "Forbidden"
    }
    """
