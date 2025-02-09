@cron-service-by-after-interval
Feature: Test cron service
  Background:
    Given I remember as "errorNotificationIdLastTrTime" following value:
    """
      "bcee5dad-6cc4-4cf7-a9dc-57d3a5b2bba0"
    """
    Given I remember as "errorNotificationIdLastTrTimeReminder" following value:
    """
      "97356abe-5bf8-11eb-ae93-0242ac130002"
    """

  Scenario: Send notification-errors
    Given I use DB fixture "error-notifications"
    Given I use DB fixture "settings/send-by-after-interval"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{errorNotificationIdLastTrTimeNew}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{errorNotificationIdLastTrTimeNew}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/after-interval"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdLastTrTime}}",
          "locale": "en",
          "templateName": "error_notifications.last-transaction-time",
          "variables": {
            "errorDateFormatted": "*",
            "integration": "santander_installment_dk",
            "timeAgo": "3 hours ago"
          }
        }
      },
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdLastTrTime}}",
          "locale": "en",
          "templateName": "error_notifications.last-transaction-time",
          "variables": {
            "errorDateFormatted": "*",
            "integration": "santander_installment_se",
            "timeAgo": "3 days ago"
          }
        }
      }
    ]
    """
    And the RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
       {
         "name": "payever.event.business.email",
         "payload": {
           "businessId": "*",
           "locale": "en",
           "templateName": "error_notifications.last-transaction-time",
           "variables": {
             "errorDateFormatted": "*",
             "integration": "paypal",
             "timeAgo": "3 minutes ago"
           }
         }
       },
       {
         "name": "payever.event.business.email",
         "payload": {
           "businessId": "*",
           "locale": "en",
           "templateName": "error_notifications.last-transaction-time",
           "variables": {
             "errorDateFormatted": "*",
             "integration": "santander_installment",
             "timeAgo": "3 days ago"
           }
         }
       },
       {
         "name": "payever.event.business.email",
         "payload": {
           "businessId": "*",
           "locale": "en",
           "templateName": "error_notifications.last-transaction-time",
           "variables": {
             "errorDateFormatted": "*",
             "integration": "santander_installment_nl",
             "timeAgo": "3 days ago"
           }
         }
       }
    ]
    """
  Scenario: Send reminded notification after interval
    Given I use DB fixture "error-notifications-reminder"
    Given I use DB fixture "settings/send-by-after-interval"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{errorNotificationIdLastTrTimeReminder}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{errorNotificationIdLastTrTimeReminder}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/after-interval"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdLastTrTimeReminder}}",
          "locale": "en",
          "templateName": "error_notifications.last-transaction-time",
          "variables": {
            "integration": "stripe",
            "timeAgo": "an hour ago"
          }
        }
      }
    ]
    """

  Scenario: Send notification-errors with status condition
    Given I use DB fixture "error-notifications"
    Given I use DB fixture "settings/send-by-after-interval-with-status-option"
    Given I use DB fixture "transactions"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{errorNotificationIdLastTrTime}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{errorNotificationIdLastTrTime}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/after-interval"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdLastTrTime}}",
          "locale": "en",
          "templateName": "error_notifications.last-transaction-time",
          "variables": {
            "errorDateFormatted": "*",
            "integration": "santander_installment_se",
            "timeAgo": "3 days ago"
          }
        }
      }
    ]
    """
    And the RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
       {
         "name": "payever.event.business.email",
         "payload": {
           "businessId": "*",
           "locale": "en",
           "templateName": "error_notifications.last-transaction-time",
           "variables": {
             "errorDateFormatted": "*",
             "integration": "santander_installment",
             "timeAgo": "3 days ago"
           }
         }
       }
    ]
    """

  Scenario: Send notification-errors cover all day
    Given I use DB fixture "error-notifications"
    Given I use DB fixture "settings/send-by-after-interval-cover-all-day"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{errorNotificationIdLastTrTime}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{errorNotificationIdLastTrTime}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/after-interval"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdLastTrTime}}",
          "locale": "en",
          "templateName": "error_notifications.last-transaction-time",
          "variables": {
            "errorDateFormatted": "*",
            "integration": "paypal",
            "timeAgo": "3 minutes ago"
          }
        }
      }
    ]
    """
    And the RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
       {
         "name": "payever.event.business.email",
         "payload": {
           "businessId": "*",
           "locale": "en",
           "templateName": "error_notifications.last-transaction-time",
           "variables": {
             "errorDateFormatted": "*",
             "integration": "santander_installment_dk",
             "timeAgo": "3 hours ago"
           }
         }
       }
    ]
    """
