Feature: Business RPC
  Scenario: create business via RPC
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "employee-folder",
          []
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "users",
          {
            "userAccount": {
              "firstName": "firstname",
              "lastName": "lastname",
              "email": "email@test.com"
            }
          }
         ],
        "result": {}
      }
      """
    And I mock RPC request "users.rpc.business.created" to "users.rpc.business.created" with:
      """
      {
        "requestPayload": { },
        "responsePayload": true
      }
      """
    Given I use DB fixture "countries"
    When I publish in RabbitMQ channel "async_events_users_micro" message with json:
      """
      {
        "name": "users.rpc.business.create",
        "payload": {
          "business": {
            "id": "71bc1780-1a92-47ec-837a-69d68be8c014",
            "name": "test business",
            "logo": "logo",
            "wallpaper": "wp",
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
              "industry": "Some Industry"
            },
            "contactDetails": {
              "salutation": "test",
              "firstName": "test",
              "lastName": "test",
              "phone": "+12315135135",
              "fax": "+12315135135",
              "additionalPhone": "+12315135135"
            },
            "taxes": {
              "companyRegisterNumber": "123",
              "taxId": "123",
              "taxNumber": "123",
              "turnoverTaxAct": false
            }
          },
          "user": {
            "email": "email@test.com",
            "firstName": "firstname",
            "lastName": "lastname"
          },
          "userId": "08a3fac8-43ef-4998-99aa-cabc97a39261"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_users_micro" channel
    Then I look for model "User" by following JSON and remember as "savedUser":
      """
      {
        "businesses": ["71bc1780-1a92-47ec-837a-69d68be8c014"]
      }
      """
    And stored value "savedUser" should contain json:
      """
      {
        "_id": "*",
        "businesses": ["71bc1780-1a92-47ec-837a-69d68be8c014"],
        "userAccount": {
          "email": "email@test.com",
          "firstName": "firstname",
          "language": "en",
          "lastName": "lastname",
          "_id": "*",
          "shippingAddresses": [],
          "hasUnfinishedBusinessRegistration": false
        }
      }
      """
    Then I look for model "BusinessActive" by following JSON and remember as "activeBusiness":
      """
      {
        "owner": "08a3fac8-43ef-4998-99aa-cabc97a39261"
      }
      """
    And stored value "activeBusiness" should contain json:
      """
      {
        "_id": "*",
        "owner": "08a3fac8-43ef-4998-99aa-cabc97a39261",
        "businessId": "71bc1780-1a92-47ec-837a-69d68be8c014"
      }
      """

  Scenario: delete business via RPC
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    When I publish in RabbitMQ channel "async_events_users_micro" message with json:
      """
      {
        "name": "users.rpc.business.delete",
        "payload": {
          "businessId": "6502b371-4cda-4f1d-af9c-f9c5c886c455"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_users_micro" channel

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

    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "6502b371-4cda-4f1d-af9c-f9c5c886c455", "acls": []},
            {"businessId": "fa8b1d32-8d5c-4839-9ea6-4af777098465", "acls": []}
          ]
        }]
      }
      """
    When I send a GET request to "/business/6502b371-4cda-4f1d-af9c-f9c5c886c455"
    Then print last response
    Then the response status code should be 404
