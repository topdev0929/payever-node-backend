Feature: Api controller
  Scenario: Create a code from external api
    Given I use DB fixture "businesses"
    And I use DB fixture "applications"
    And I use DB fixture "checkouts"
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@email.com",
      "roles": [{
        "name": "oauth",
        "permissions": [{"businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac", "acls": []}]
      }]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://communications-third-party.*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/integration/twilio/action/send-message"
      },
      "response": {
        "status": 200,
        "body": ""
      }
    }
    """


    When I send a POST request to "/api/v1/external/21e67ee2-d516-42e6-9645-46765eadd0ac" with json:
    """
    {
      "amount": 500.17,
      "phone_number": "+79528224321"
    }
    """

    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "merchant_id": "21e67ee2-d516-42e6-9645-46765eadd0ac",
      "timestamp": "*"
    }
    """


  Scenario: Create a code from external api with extended data
    Given I use DB fixture "businesses"
    And I use DB fixture "applications"
    And I use DB fixture "checkouts"
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@email.com",
      "roles": [{
        "name": "oauth",
        "permissions": [{"businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac", "acls": []}]
      }]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://communications-third-party.*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/integration/twilio/action/send-message"
      },
      "response": {
        "status": 200,
        "body": ""
      }
    }
    """


    When I send a POST request to "/api/v1/external/21e67ee2-d516-42e6-9645-46765eadd0ac" with json:
    """
    {
      "amount": 500.17,
      "phone_number": "+79528224321",
      "reference": "reference",
      "salutation": "SALUTATION_MR",
      "first_name": "firstName",
      "last_name": "lastName",
      "address": {
        "country": "DE",
        "city": "Berlin",
        "zip_code": "12345",
        "street": "Berlinerstrasse",
        "email": "example@example.com"
      },
      "cart": [
        {
          "name": "Test item",
          "price": 100,
          "quantity": 1
        }
      ]
    }
    """

    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "merchant_id": "21e67ee2-d516-42e6-9645-46765eadd0ac",
      "timestamp": "*"
    }
    """
    And I look for model "PaymentCode" by following JSON and remember as "payment_code":
    """
    {
      "flow.amount": 500.17,
      "flow.reference": "reference"
    }
    """
    And print storage key "payment_code"
    And stored value "payment_code" should contain json:
    """
    {
      "flow": {
        "amount": 500.17,
        "reference": "reference",
        "billingAddress": {
          "salutation": "SALUTATION_MR",
          "firstName": "firstName",
          "lastName": "lastName",
          "email": "example@example.com",
          "country": "DE",
          "city": "Berlin",
          "street": "Berlinerstrasse",
          "phone": "+79528224321"
        },
        "cart": [
          {
            "name": "Test item",
            "price": 100,
            "quantity": 1
          }
        ]
      }
    }
    """

  Scenario: Verify code as GET
    Given I use DB fixture "codes"

    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://transactions*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/detail/9a46902d-3d6e-46b9-93b6-cf964124e420"
      },
      "response": {
        "status": 200,
        "body": {"actions": [{"action": "shipping_goods"}]}
      }
    }
    """

    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://transactions*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/9a46902d-3d6e-46b9-93b6-cf964124e420/action/shipping_goods"
      },
      "response": {
        "status": 200,
        "body": ""
      }
    }
    """

    And I generate an access token using the following data and remember it as "oauth_token":
    """
    {
      "email": "email@email.com",
      "roles": [{
        "name": "oauth",
        "permissions": [{"businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac", "acls": []}]
      }]
    }
    """

    When I send a GET request to "/api/v1/external/code/check?merchant_id=21e67ee2-d516-42e6-9645-46765eadd0ac&amount=400&code=123456&token={{oauth_token}}"
    And I look for model "PaymentCode" by following JSON and remember as "payment_code":
    """
    {
      "flow.amount": 400
    }
    """

    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "amount": 400,
      "status": "STATUS_ACCEPTED",
      "payment_method": "santander_installment",
      "payment_id": "f810171827e3923a6d3c2ec2d4f0950a"
    }
    """
    And stored value "payment_code" should contain json:
    """
    {"flow": {"amount": 400}}
    """

    When I send a GET request to "/api/v1/external/code/check?merchant_id=21e67ee2-d516-42e6-9645-46765eadd0ac&amount=400&code=123456&token={{oauth_token}}"

    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "amount": 400,
      "status": "STATUS_PAID",
      "payment_method": "santander_installment",
      "payment_id": "f810171827e3923a6d3c2ec2d4f0950a"
    }
    """

    When I send a GET request to "/api/v1/external/code/check?merchant_id=21e67ee2-d516-42e6-9645-46765eadd0ac&amount=400&code=123456&token={{oauth_token}}"

    Then the response status code should be 405
    And the response should contain json:
    """
    {
      "statusCode": 405,
      "error": "Method Not Allowed",
      "message": "This code is already verified"
    }
    """

  Scenario: Verify code as POST with shipping goods payload and verify by ID type
    Given I use DB fixture "codes"
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://transactions*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/detail/9a46902d-3d6e-46b9-93b6-cf964124e420"
      },
      "response": {
        "status": 200,
        "body": {"actions": [{"action": "verify"}]}
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://transactions*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/9a46902d-3d6e-46b9-93b6-cf964124e420/action/verify",
        "body": "{\"identification\":[{\"applicant\":1,\"idNumber\":\"12345\"}],\"fields\":{\"approved\":\"true\"}}"
      },
      "response": {
        "status": 200,
        "body": ""
      }
    }
    """
    And I generate an access token using the following data and remember it as "oauth_token":
    """
    {
      "email": "email@email.com",
      "roles": [{
        "name": "oauth",
        "permissions": [{"businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac", "acls": []}]
      }]
    }
    """

    When I send a POST request to "/api/v1/external/code/check" with json:
    """
    {
      "merchant_id": "21e67ee2-d516-42e6-9645-46765eadd0ac",
      "amount": 400,
      "code": "98765",
      "token": "{{oauth_token}}",
      "shipping_goods_data": {
        "identification": [
          {
            "applicant": 1,
            "idNumber": "12345"
          }
        ]
      },
      "verification_step": true
    }
    """
    Then print last response
    And I look for model "PaymentCode" by following JSON and remember as "payment_code":
    """
    {
      "flow.amount": 400
    }
    """
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "amount": 400,
      "status": "STATUS_PAID",
      "payment_method": "santander_installment",
      "payment_id": "f810171827e3923a6d3c2ec2d4f0950a"
    }
    """
    And stored value "payment_code" should contain json:
    """
    {"flow": {"amount": 400}}
    """

  Scenario: Verify code as POST with shipping goods payload
    Given I use DB fixture "codes"
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://transactions*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/detail/9a46902d-3d6e-46b9-93b6-cf964124e420"
      },
      "response": {
        "status": 200,
        "body": {"actions": [{"action": "shipping_goods"}]}
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://transactions*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/9a46902d-3d6e-46b9-93b6-cf964124e420/action/shipping_goods",
        "body": "{\"identification\":[{\"applicant\":1,\"idNumber\":\"12345\"}]}"
      },
      "response": {
        "status": 200,
        "body": ""
      }
    }
    """
    And I generate an access token using the following data and remember it as "oauth_token":
    """
    {
      "email": "email@email.com",
      "roles": [{
        "name": "oauth",
        "permissions": [{"businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac", "acls": []}]
      }]
    }
    """

    When I send a POST request to "/api/v1/external/code/check" with json:
    """
    {
      "merchant_id": "21e67ee2-d516-42e6-9645-46765eadd0ac",
      "amount": 400,
      "code": "123456",
      "token": "{{oauth_token}}",
      "shipping_goods_data": {
        "identification": [
          {
            "applicant": 1,
            "idNumber": "12345"
          }
        ]
      }
    }
    """
    And I look for model "PaymentCode" by following JSON and remember as "payment_code":
    """
    {
      "flow.amount": 400
    }
    """
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "amount": 400,
      "status": "STATUS_ACCEPTED",
      "payment_method": "santander_installment",
      "payment_id": "f810171827e3923a6d3c2ec2d4f0950a"
    }
    """
    And stored value "payment_code" should contain json:
    """
    {"flow": {"amount": 400}}
    """

    When I send a POST request to "/api/v1/external/code/check" with json:
    """
    {
      "merchant_id": "21e67ee2-d516-42e6-9645-46765eadd0ac",
      "amount": 400,
      "code": "123456",
      "token": "{{oauth_token}}",
      "shipping_goods_data": {
        "identification": [
          {
            "applicant": 1,
            "idNumber": "12345"
          }
        ]
      }
    }
    """
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "amount": 400,
      "status": "STATUS_PAID",
      "payment_method": "santander_installment",
      "payment_id": "f810171827e3923a6d3c2ec2d4f0950a"
    }
    """

    When I send a POST request to "/api/v1/external/code/check" with json:
    """
    {
      "merchant_id": "21e67ee2-d516-42e6-9645-46765eadd0ac",
      "amount": 400,
      "code": "123456",
      "token": "{{oauth_token}}"
    }
    """
    Then the response status code should be 405
    And the response should contain json:
    """
    {
      "statusCode": 405,
      "error": "Method Not Allowed",
      "message": "This code is already verified"
    }
    """

  Scenario: QR endpoint
    Given I use DB fixture "businesses"
    And I use DB fixture "applications"
    And I use DB fixture "checkouts"
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@email.com",
      "roles": [{
        "name": "oauth",
        "permissions": [{"businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac", "acls": []}]
      }]
    }
    """

    When I send a POST request to "/api/v1/generate-qr/21e67ee2-d516-42e6-9645-46765eadd0ac" with json:
    """
    {
      "amount": 500.17,
      "reference": "reference",
      "salutation": "SALUTATION_MR",
      "first_name": "firstName",
      "last_name": "lastName",
      "address": {
        "country": "DE",
        "city": "Berlin",
        "zip_code": "12345",
        "street": "Berlinerstrasse",
        "phone_number": "+1234567890",
        "email": "example@example.com"
      }
    }
    """
    And I look for model "PaymentCode" by following JSON and remember as "payment_code":
    """
    {
      "flow.amount": 500.17,
      "flow.reference": "reference"
    }
    """

    And stored value "payment_code" should contain json:
    """
    {
      "flow": {
        "billingAddress": {
          "salutation": "SALUTATION_MR",
          "firstName": "firstName",
          "lastName": "lastName",
          "email": "example@example.com",
          "country": "DE",
          "city": "Berlin",
          "street": "Berlinerstrasse",
          "phone": "+1234567890"
        }
      }
    }
    """

    And the response status code should be 201

  Scenario: verify code with a smaller amount in dto. it should update amount in the code.
    Given I use DB fixture "codes"

    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://transactions.*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/9a46902d-3d6e-46b9-93b6-cf964124e420/action/shipping_goods"
      },
      "response": {
        "status": 200,
        "body": ""
      }
    }
    """

    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://transactions*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/detail/9a46902d-3d6e-46b9-93b6-cf964124e420"
      },
      "response": {
        "status": 200,
        "body": {"actions": [{"action": "verify"}]}
      }
    }
    """

    And I generate an access token using the following data and remember it as "oauth_token":
    """
    {
      "email": "email@email.com",
      "roles": [{
        "name": "oauth",
        "permissions": [{"businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac", "acls": []}]
      }]
    }
    """

    When I send a GET request to "/api/v1/external/code/check?merchant_id=21e67ee2-d516-42e6-9645-46765eadd0ac&amount=400&code=123456&token={{oauth_token}}"

    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "amount": 400,
      "status": "STATUS_ACCEPTED",
      "payment_method": "santander_installment",
      "payment_id": "f810171827e3923a6d3c2ec2d4f0950a"
    }
    """
