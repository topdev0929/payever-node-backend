@business
Feature: Business
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario Outline: Create business
    Given I remember as "businessId" following value:
    """
    "88038e2a-90f9-11e9-a492-7200004fe4c0"
    """
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "<event_name>",
        "payload": {
          "userAccountId": "08a3fac8-43ef-4998-99aa-cabc97a39261",
          "active": true,
          "hidden": false,
          "contactEmails": [
            "test1@email.com"
          ],
          "cspAllowedHosts": [
            "host1"
          ],
          "name": "test business",
          "logo": "logo",
          "companyAddress": {
            "country": "RU",
            "city": "Moscow",
            "street": "Some street",
            "zipCode": "123456",
            "_id": "*",
            "createdAt": "*",
            "updatedAt": "*"
          },
          "companyDetails": {
            "legalForm": "Legal Form",
            "phone": "999-8888-7777",
            "product": "Some Product",
            "industry": "Some Industry",
            "employeesRange": {
              "min": 100,
              "max": 200,
              "_id": "*"
            },
            "salesRange": {
              "min": 50,
              "max": 100,
              "_id": "*"
            },
            "status": "BUSINESS_STATUS_JUST_LOOKING",
            "_id": "*",
            "createdAt": "*",
            "updatedAt": "*"
          },
          "contactDetails": {
            "salutation": "test",
            "firstName": "firstname",
            "lastName": "lastname",
            "phone": "+12315135135",
            "fax": "+12315135135",
            "additionalPhone": "+12315135135",
            "_id": "*",
            "createdAt": "*",
            "updatedAt": "*"
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
            "iban": "test",
            "_id": "*",
            "createdAt": "*",
            "updatedAt": "*"
          },
          "taxes": {
            "companyRegisterNumber": "123",
            "taxId": "123",
            "taxNumber": "123",
            "turnoverTaxAct": false,
            "_id": "*",
            "createdAt": "*",
            "updatedAt": "*"
          },
          "documents": {
            "commercialRegisterExcerptFilename": "test",
            "_id": "*",
            "createdAt": "*",
            "updatedAt": "*"
          },
          "_id": "88038e2a-90f9-11e9-a492-7200004fe4c0",
          "owner": "08a3fac8-43ef-4998-99aa-cabc97a39261",
          "currency": "USD",
          "createdAt": "*",
          "updatedAt": "*"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And model "businesses" with id "{{businessId}}" should contain json:
    """
    {
      "companyAddress":{
        "country": "RU",
        "city":"Moscow",
        "street":"Some street",
        "zipCode":"123456"
       },
      "companyDetails":{
        "legalForm":"Legal Form"
      },
      "contactDetails":{
        "firstName":"firstname",
        "lastName":"lastname",
        "phone":"+12315135135"
      },
      "contactEmails":["test1@email.com"],
      "logo":"logo",
      "name":"test business",
      "owner":"08a3fac8-43ef-4998-99aa-cabc97a39261"
    }
    """
  Examples:
    | event_name                   |
    | users.event.business.created |
    | users.event.business.updated |
    | users.event.business.export  |

  Scenario: Remove business
    Given I use DB fixture "businesses"
        Given I remember as "businessId" following value:
    """
    "614cb154-0323-4df0-be89-85376b9de666"
    """
    Given I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name":"users.event.business.removed",
        "uuid":"7ee31df2-e6eb-4467-8e8d-522988f426b8",
        "version":0,
        "encryption":"none",
        "createdAt":"2019-08-28T12:32:26+00:00",
        "metadata":{
          "locale":"de",
          "client_ip":"176.198.69.86"
        },
        "payload":{
          "_id":"{{businessId}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_mailer_micro" channel
    Then model "businesses" with id "{{businessId}}" should not exist
