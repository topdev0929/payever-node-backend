Feature: Handling business events
  Background:
    Given I remember as "businessId" following value:
    """
    "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
    """
    Given I remember as "userId" following value:
    """
    "a4e4c682-8b89-46fa-ba05-2b3c48a2003b"
    """

  Scenario Outline: Create business on different events
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "folder_transactions",
          []
        ]
      }
      """
    Given I publish in RabbitMQ channel "async_events_transactions_micro" message with json:
      """
      {
        "name":"<event_name>",
        "uuid":"7ee31df2-e6eb-4467-8e8d-522988f426b8",
        "version":0,
        "encryption":"none",
        "createdAt":"2019-08-28T12:32:26+00:00",
        "metadata": {
          "locale":"de",
          "client_ip":"176.198.69.86"
        },
        "payload": {
          "_id":"42bf8f24-d383-4e5a-ba18-e17d2e03bb0e",
          "name":"example business",
          "currency":"EUR",
          "companyAddress": {
            "country": "DE"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_transactions_micro" channel
    Then model "Business" with id "42bf8f24-d383-4e5a-ba18-e17d2e03bb0e" should contain json:
      """
      {
        "currency":"EUR"
      }
      """
    Examples:
      | event_name                   |
      | users.event.business.created |
      | users.event.business.updated |
      | users.event.business.export  |

  Scenario: Remove business
    Given I use DB fixture "business-events"
    Given I publish in RabbitMQ channel "async_events_transactions_micro" message with json:
      """
      {
        "name":"users.event.business.removed",
        "uuid":"7ee31df2-e6eb-4467-8e8d-522988f426b8",
        "version":0,
        "encryption":"none",
        "createdAt":"2019-08-28T12:32:26+00:00",
        "metadata": {
          "locale":"de",
          "client_ip":"176.198.69.86"
        },
        "payload": {
          "_id":"{{businessId}}",
          "owner": "{{userId}}",
          "userAccount": {
            "email": "reza@payever.org"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_transactions_micro" channel
    Then model "Business" with id "{{businessId}}" should not exist
