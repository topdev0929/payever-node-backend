Feature: Handle business bus message events
Background:
  Given I mock Elasticsearch method "bulkIndex" with:
    """
    { "arguments": ["post-folder", []], "result": [] }
    """
  Given I mock Elasticsearch method "singleIndex" with:
    """
    { "arguments": ["post-folder"], "result": [] }
    """
  Given I mock Elasticsearch method "deleteByQuery" with:
    """
    { "arguments": ["post-folder"], "result": [] }
    """

  Scenario: Business created
    Given I remember as "businessId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe00"
    """
    Given I use DB fixture "business/existing-business"
    When I publish in RabbitMQ channel "async_events_social_micro" message with json:
    """
    {
      "name": "users.event.business.created",
      "payload": {
        "_id": "{{businessId}}",
        "currency": "EUR",
        "createdAt": "2019-05-07 06:49:48",
        "userAccount": {
          "email": "test@test.com"
        },
        "userAccountId": "12345"
      }
    }
    """
    And process messages from RabbitMQ "async_events_social_micro" channel
    And model "Business" with id "{{businessId}}" should contain json:
    """
    {
      "_id": "{{businessId}}",
      "currency": "EUR"
    }
    """
    Then I authenticate as a user with the following data:
    """
    {
      "_id": "f07c5841-2ec5-419b-95ed-2583b1ae0b84",
      "roles": [{
        "name": "merchant",
        "permissions": [{ "businessId": "{{businessId}}", "acls": [] }]
      }]
    }
    """

  Scenario: Business updated
    Given I remember as "businessId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe00"
    """
    Given I use DB fixture "business/existing-business"
    When I publish in RabbitMQ channel "async_events_social_micro" message with json:
    """
    {
      "name": "users.event.business.updated",
      "payload": {
        "_id": "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99",
        "currency": "USD",
        "createdAt": "2019-05-07 06:49:48",
        "userAccount": {
          "email": "test@test.com"
        },
        "userAccountId": "12345"
      }
    }
    """
    And process messages from RabbitMQ "async_events_social_micro" channel
    And model "Business" with id "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99" should contain json:
    """
    {
      "_id": "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99",
      "currency": "USD"
    }
    """
    
  Scenario: Business exported
    Given I remember as "businessId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe00"
    """
    Given I use DB fixture "business/existing-business"
    When I publish in RabbitMQ channel "async_events_social_micro" message with json:
    """
    {
      "name": "users.event.business.export",
      "payload": {
        "_id": "{{businessId}}",
        "currency": "USD",
        "createdAt": "2019-05-07 06:49:48",
        "userAccount": {
          "email": "test@test.com"
        },
        "userAccountId": "12345"
      }
    }
    """
    And process messages from RabbitMQ "async_events_social_micro" channel
    And model "Business" with id "{{businessId}}" should contain json:
    """
    {
      "_id": "{{businessId}}",
      "currency": "USD"
    }
    """
    
  Scenario: Business removed
    Given I remember as "businessId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe00"
    """
    Given I use DB fixture "business/existing-business"
    When I publish in RabbitMQ channel "async_events_social_micro" message with json:
    """
    {
      "name": "users.event.business.removed",
      "payload": {
        "_id": "{{businessId}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_social_micro" channel
    And model "Business" with id "{{businessId}}" should not contain json:
    """
    {
      "_id": "{{businessId}}"
    }
    """
