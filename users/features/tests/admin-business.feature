Feature: Admin
  Background:
    Given I remember as "adminId" following value:
      """
      "8a13bd00-90f1-11e9-9f67-7200004fe4c0"
      """
    Given I remember as "userId" following value:
      """
      "85547e38-dfe5-4282-b1ae-c5542267f39e"
      """
    Given I remember as "businessId" following value:
      """
      "6502b371-4cda-4f1d-af9c-f9c5c886c455"
      """



  Scenario: Get one business for admin
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    When I send a GET request to "/admin/business/{{businessId}}"
    Then print last response
    Then response status code should be 200



  Scenario: Get an unexisted business for admin
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    When I send a GET request to "/admin/business/e2c06825-da2f-4e1b-9c75-35f8640348d7"
    Then print last response
    Then response status code should be 404



  Scenario: Get a businesses list for admin
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    When I send a GET request to "/admin/business/list?userIds={{userId}}"
    Then print last response
    Then response status code should be 200
    And response should contain json:
    """
    {
      "businesses": [
        {
          "_id": "6502b371-4cda-4f1d-af9c-f9c5c886c455"
        },
        {
          "_id": "fa8b1d32-8d5c-4839-9ea6-4af777098465"
        }
      ],
      "page": 1,
      "total": 3
    }
    """



  Scenario: Delete a business
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    When I send a DELETE request to "/admin/business/6502b371-4cda-4f1d-af9c-f9c5c886c455"
    Then the response status code should be 200

    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "6502b371-4cda-4f1d-af9c-f9c5c886c455"
        }
      }
    ]
    """

    When I send a GET request to "/admin/business/6502b371-4cda-4f1d-af9c-f9c5c886c455"
    Then print last response
    Then the response status code should be 404



  Scenario: Delete business without admin permission
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "6502b371-4cda-4f1d-af9c-f9c5c886c455", "acls": []},
            {"businessId": "fa8b1d32-8d5c-4839-9ea6-4af777098465", "acls": []}
          ]
        }]
      }
    """
    When I send a DELETE request to "/admin/business/6502b371-4cda-4f1d-af9c-f9c5c886c455"
    Then the response status code should be 403



  Scenario: Create business
    And I mock RPC request "users.rpc.business.created" to "users.rpc.business.created" with:
      """
      {
        "requestPayload": { },
        "responsePayload": true
      }
      """
    Given I use DB fixture "countries"
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    When I send a POST request to "/admin/business/{{userId}}" with json:
    """
    {
      "id": "{{businessId}}",
      "name": "test business SQL",
      "logo": "logo",
      "active": true,
      "hidden": false,
      "companyAddress": {
        "country": "RU",
        "city": "Moscow",
        "street": "Some street",
        "zipCode": "123456"
      },
      "companyDetails": {
        "legalForm": "Legal Form",
        "phone": "999-8888-7777",
        "product": "Some Product",
        "industry": "Some Industry",
        "employeesRange": {
          "min": 100,
          "max": 200
        },
        "salesRange": {
          "min": 50,
          "max": 100
        },
        "status": "BUSINESS_STATUS_JUST_LOOKING"
      },
      "contactDetails": {
        "salutation": "test",
        "firstName": "test",
        "lastName": "test",
        "phone": "+12315135135",
        "fax": "+12315135135",
        "additionalPhone": "+12315135135"
      },
      "bankAccount": {
        "country": "DE",
        "city": "Hamburg",
        "bankName": "Some Bank",
        "bankCode": "SB",
        "swift": "test",
        "routingNumber": "1234",
        "accountNumber": "1234",
        "owner": "test",
        "bic": "bic",
        "iban": "test"
      },
      "taxes": {
        "companyRegisterNumber": "123",
        "taxId": "123",
        "taxNumber": "123",
        "turnoverTaxAct": false
      },
      "contactEmails": [
        "test1@email.com"
      ],
      "cspAllowedHosts": [
        "host1"
      ]
    }
    """
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "active": true,
      "contactEmails": [
        "test1@email.com"
      ],
      "cspAllowedHosts": [
        "host1"
      ],
      "hidden": false,
      "name": "test business SQL",
      "logo": "logo",
      "taxes": {
        "companyRegisterNumber": "123",
        "taxId": "123",
        "taxNumber": "123",
        "turnoverTaxAct": false
      },
      "_id": "{{businessId}}",
      "owner": "{{userId}}",
      "currency": "USD",
      "themeSettings": {
        "theme": "dark"
      },
      "defaultLanguage": "en",
      "businessDetail": {
        "_id": "{{businessId}}",
        "companyAddress": {
          "country": "RU",
          "city": "Moscow",
          "street": "Some street",
          "zipCode": "123456"
        },
        "companyDetails": {
          "legalForm": "Legal Form",
          "phone": "999-8888-7777",
          "product": "Some Product",
          "industry": "Some Industry",
          "employeesRange": {
            "min": 100,
            "max": 200
          },
          "salesRange": {
            "min": 50,
            "max": 100
          },
          "status": "BUSINESS_STATUS_JUST_LOOKING"
        },
        "contactDetails": {
          "salutation": "test",
          "firstName": "test",
          "lastName": "test",
          "phone": "+12315135135",
          "fax": "+12315135135",
          "additionalPhone": "+12315135135"
        },
        "bankAccount": {
          "country": "DE",
          "city": "Hamburg",
          "bankName": "Some Bank",
          "bankCode": "SB",
          "swift": "test",
          "routingNumber": "1234",
          "accountNumber": "1234",
          "owner": "test",
          "bic": "bic",
          "iban": "test"
        }
      }
    }
    """



Scenario: Update business
    Given I use DB fixture "businesses"
    And I use DB fixture "users"
    And I authenticate as a user with the following data:
     """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    When I send a PATCH request to "/admin/business/{{businessId}}" with json:
    """
      {
        "name": "New name AQI"
      }
    """
    Then print last response
    Then response status code should be 200
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "users.event.business.updated",
        "payload": {
          "_id": "{{businessId}}"
        }
      }
    ]
    """

    When I send a GET request to "/admin/business/{{businessId}}"
    Then print last response
    Then response should contain json:
    """
    {
      "_id": "{{businessId}}",
      "name": "New name AQI"
    }
    """



  Scenario: Try to update business without permission
    Given I use DB fixture "businesses"
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "some-merchant@test.com",
        "id": "274edcf4-6c35-4c06-b9c7-c2d74be300ae",
        "roles": [{ "name": "merchant" }]
      }
    """
    When I send a PATCH request to "/admin/business/{{businessId}}" with json:
    """
      {
        "name": "New name AQI"
      }
    """
    Then print last response
    Then response status code should be 403

