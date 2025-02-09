Feature: Onboarding
  Scenario: Onboard purchaser
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
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/onboard-purchaser",
        "body": "{\"externalId\":\"124563\",\"firstName\":\"Test\",\"lastName\":\"Test\",\"email\":\"test@test123456.com\",\"phone\":\"+4912345678\",\"type\":\"delegate\",\"custom\":{\"designatingPrimaryId\":\"10008\",\"idNumber\":\"12345\"},\"legal\":{\"utilityBill\":true,\"hasTradingHistory\":true,\"hasTradingHistoryWithPaymentAccount\":true},\"noticeUrl\":\"http://test.com\",\"locale\":\"en\"}"
      },
      "response": {
        "status": 201,
        "body":
          {
             "id": "12345",
             "status": "Accepted",
             "requirement": "OpenBanking",
             "verificationUrl": "https://test.com"
          }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/onboarding/b2b-invoice"
    When I send a POST request to "/api/b2b/onboarding/purchaser" with json:
    """
    {
        "external_id": "124563",
        "email": "test@test123456.com",
        "phone": "+4912345678",
        "first_name": "Test",
        "last_name": "Test",
        "type": "delegate",
        "custom": {
          "designating_primary_id": "10008",
          "id_number": "12345"
        },
        "legal": {
          "utility_bill": true,
          "has_trading_history": true,
          "has_trading_history_with_payment_account": true
        },
        "notice_url": "http://test.com",
        "locale": "en"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "12345",
      "status": "Accepted",
      "requirement": "OpenBanking",
      "verificationUrl": "https://test.com"
    }
    """

  Scenario: Update purchaser
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
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/update-purchaser",
        "body": "{\"externalId\":\"10008\",\"firstName\":\"Test\",\"lastName\":\"Test\",\"email\":\"test@test123456.com\",\"phone\":\"+4912345678\"}"
      },
      "response": {
        "status": 201,
        "body":
          {
             "id": "12345",
             "status": "Accepted"
          }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/onboarding/b2b-invoice"
    When I send a PATCH request to "/api/b2b/onboarding/purchaser" with json:
    """
    {
        "external_id": "10008",
        "email": "test@test123456.com",
        "phone": "+4912345678",
        "first_name": "Test",
        "last_name": "Test"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "id": "12345",
      "status": "Accepted"
    }
    """

  Scenario: Delete purchaser
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
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/delete-purchaser",
        "body": "{\"externalId\":\"10008\"}"
      },
      "response": {
        "status": 201,
        "body": {}
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/onboarding/b2b-invoice"
    When I send a DELETE request to "/api/b2b/onboarding/purchaser" with json:
    """
    {
        "external_id": "10008"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {}
    """

  Scenario: Deactivate purchaser
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
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/deactivate-purchaser",
        "body": "{\"externalId\":\"10008\"}"
      },
      "response": {
        "status": 201,
        "body": {}
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/onboarding/b2b-invoice"
    When I send a PATCH request to "/api/b2b/onboarding/purchaser/deactivate" with json:
    """
    {
        "external_id": "10008"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {}
    """

  Scenario: Attach purchaser address
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
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/attach-address",
        "body": "{\"externalId\":\"10008\",\"addresses\":[{\"streetName\":\"test\",\"streetNumber\":\"1\",\"country\":\"DE\",\"city\":\"Hamburg\",\"zip\":\"12345\"}]}"
      },
      "response": {
        "status": 201,
        "body":
          {
             "id": "12345",
             "status": "Accepted"
          }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/onboarding/b2b-invoice"
    When I send a POST request to "/api/b2b/onboarding/address" with json:
    """
    {
        "external_id": "10008",
        "addresses": [{
            "street_name": "test",
            "street_number": "1",
            "city": "Hamburg",
            "country": "DE",
            "zip": "12345"
        }]
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "12345",
      "status": "Accepted"
    }
    """

  Scenario: Trigger purchaser verification
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
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/trigger-verify",
        "body": "{\"externalId\":\"10008\",\"email\":\"test@test.com\",\"phone\":\"12345\"}"
      },
      "response": {
        "status": 201,
        "body":
          {
             "verificationUrl": "https://test.com"
          }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/onboarding/b2b-invoice"
    When I send a POST request to "/api/b2b/onboarding/verify" with json:
    """
    {
        "external_id": "10008",
        "email": "test@test.com",
        "phone": "12345"
   }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
       "verificationUrl": "https://test.com"
    }
    """
