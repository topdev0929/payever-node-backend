Feature: Create mails
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "foreignBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa"
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}, {"businessId": "{{anotherBusinessId}}", "acls": []}]
      }]
    }
    """

  Scenario: Create default mail on business created
    When I publish in RabbitMQ channel "async_events_marketing_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "{{anotherBusinessId}}",
          "name": "Some business"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_marketing_micro" channel
    And print RabbitMQ message list
    And print storage key "business"
    And model "Business" with id "{{anotherBusinessId}}" should contain json:
      """
      {
        "name": "Some business"
      }
      """
    And I look for model "Mail" by following JSON and remember as "newMail":
      """
      {
        "name": "Some business"
      }
      """
    And I look for model "MailAccessConfig" by following JSON and remember as "newMailAccessConfig":
      """
      {
        "mail": "{{newMail._id}}",
        "name": "Some business"
      }
      """

  Scenario: Create default mail on business created with already existing mail or domain with same name
    Given I use DB fixture "mail/mail"
    When I publish in RabbitMQ channel "async_events_marketing_micro" message with json:
     """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "{{foreignBusinessId}}",
          "name": "Business Test"
        }
      }
     """
    Then I process messages from RabbitMQ "async_events_marketing_micro" channel
    And print RabbitMQ message list
    And print storage key "business"
    And model "Business" with id "{{foreignBusinessId}}" should contain json:
      """
      {
        "name": "Business Test"
      }
      """
    And I look for model "Mail" by following JSON and remember as "newMail":
      """
      {
        "businessId": "{{foreignBusinessId}}"
      }
      """
    And stored value "newMail" should contain json:
      """
        {
          "name": "Business Test"
        }
      """
    And I look for model "MailAccessConfig" by following JSON and remember as "newMailAccessConfig":
      """
      {
        "mail": "{{newMail._id}}"
      }
      """
    And stored value "newMailAccessConfig" should not contain json:
      """
      {
        "internalDomain": "business-test"
      }
      """

  Scenario: Create mail at another business
    Given I use DB fixture "mail/foreign-business"
    When I send a POST request to "/api/business/{{foreignBusinessId}}/mail" with json:
      """
      {
        "name": "test"
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: Create mail
    Given I use DB fixture "mail/mail"
    When I send a POST request to "/api/business/{{businessId}}/mail" with json:
      """
      {
        "name": "Test Mail"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "mail": {
          "businessId": "{{businessId}}",
          "name": "Test Mail",
          "_id": "*"
        },
        "access": {
          "isLive": true,
          "internalDomain": "test-mail",
          "internalDomainPattern": "test-mail",
          "mail": {
            "businessId": "{{businessId}}",
            "name": "Test Mail",
            "_id": "*"
          },
          "_id": "*"
        }
      }
      """

  Scenario: Create mail, name occupied
    Given I use DB fixture "mail/mail"
    And I remember as "occupiedName" following value:
      """
      "business test"
      """
    When I send a POST request to "/api/business/{{businessId}}/mail" with json:
      """
      {
        "name": "{{occupiedName}}",
        "picture": "picture_url"
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "statusCode": 400,
        "message": "Validation failed",
        "errors": "Mail with name \"{{occupiedName}}\" already exists for business: \"{{businessId}}\""
      }
      """

  Scenario: Create mail
    Given I use DB fixture "mail/mail"
    And I am not authenticated
    When I send a POST request to "/api/business/{{businessId}}/mail" with json:
      """
      {
        "name": "Test Mail"
      }
      """
    Then print last response
    And the response status code should be 403
    And the response should contain json:
      """
      {
        "statusCode": 403,
        "message": "app.permission.insufficient.error"
      }
      """

  Scenario: Create mail wrong dto
    Given I use DB fixture "mail/mail"
    When I send a POST request to "/api/business/{{businessId}}/mail" with json:
      """
      {
        "errors": [
          "name should not be empty",
          "name must be a string"
        ],
        "message": "Validation failed",
        "statusCode": 400
      }
      """
    Then print last response
    And the response status code should be 400
