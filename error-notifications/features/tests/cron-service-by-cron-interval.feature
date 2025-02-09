@cron-service-by-cron-interval
Feature: Test cron service
  Background:
    Given I remember as "businessId" following value:
    """
      "550074e2-1c2c-497b-94b2-095dce0328df"
    """
    Given I remember as "errorNotificationId3HoursAgo" following value:
    """
      "9ed558b5-a1dd-4bad-b774-08aa13c4ea69"
    """
    Given I remember as "errorNotificationId5HoursAgo" following value:
    """
      "2f29424e-5b1f-11eb-ae93-0242ac130002"
    """
    Given I remember as "errorNotificationId30MinAgo" following value:
    """
      "7a085ee5-1498-4399-9e61-618445c3b213"
    """
    Given I remember as "errorNotificationId10MinAgo" following value:
    """
      "87551f22-5bf8-11eb-ae93-0242ac130002"
    """
    Given I remember as "errorNotificationIdJustNow" following value:
    """
      "97356abe-5bf8-11eb-ae93-0242ac130002"
    """
  Scenario: Send notification-errors for last 24 h
    Given I use DB fixture "error-notifications"
    Given I use DB fixture "settings/send-by-cron-interval"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{businessId}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/update-interval/every-24-hours"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationId3HoursAgo}}",
          "locale": "en",
          "templateName": "error_notifications.payment_notification.failed",
          "variables": {
             "deliveryAttempts": 2,
             "firstFailure": "2021-06-22 17:06:15 CET",
             "noticeUrl": "notice url 1",
             "paymentId": "2d4bcbce-5bf9-11eb-ae93-0242ac130002",
             "statusCode": 500,
             "integration": "cash"
          }
        }
      },
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "2f29424e-5b1f-11eb-ae93-0242ac130002",
          "locale": "en",
          "templateName": "error_notifications.payment-option-credentials.invalid",
          "variables": {
            "credentials": {
              "credentialsData": "credentials data"
            },
            "message": "not authorized",
            "statusCode": 404,
            "integration": "cash"
          }
        }
      },
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdJustNow}}",
          "locale": "en",
          "templateName": "error_notifications.api-keys.invalid",
          "variables": {
            "clientId": "98fb0520-e487-45ef-8fd3-c2b1313a55b2",
            "clientSecret": "0378ede71a1b5e8843572a5932806707a41484d62006473c",
            "name": "api name"
          }
        }
      },
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationId30MinAgo}}",
          "locale": "en",
          "templateName": "error_notifications.payment_notification.failed",
          "variables": {
             "deliveryAttempts": 2,
             "firstFailure": "2021-06-22 17:06:15 CET",
             "noticeUrl": "notice url 3",
             "paymentId": "7505b6b0-5bf8-11eb-ae93-0242ac130002",
             "statusCode": 500,
             "integration": "paypal"
          }
        }
      },
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationId10MinAgo}}",
          "locale": "en",
          "templateName": "error_notifications.psp-api.failed",
          "variables": {
            "message": "not authorized",
            "statusCode": 404,
            "integration": "paypal"
          }
        }
      }
    ]
    """

  Scenario: Send notification-errors for last 1 h
    Given I use DB fixture "error-notifications"
    Given I use DB fixture "settings/update-interval-1h"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{businessId}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/update-interval/every-hour"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdJustNow}}",
          "locale": "en",
          "templateName": "error_notifications.api-keys.invalid",
          "variables": {
            "clientId": "98fb0520-e487-45ef-8fd3-c2b1313a55b2",
            "clientSecret": "0378ede71a1b5e8843572a5932806707a41484d62006473c",
            "name": "api name"
          }
        }
      },
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationId10MinAgo}}",
          "locale": "en",
          "templateName": "error_notifications.psp-api.failed",
          "variables": {
            "message": "not authorized",
            "statusCode": 404,
            "integration": "paypal"
          }
        }
      },
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationId30MinAgo}}",
          "locale": "en",
          "templateName": "error_notifications.payment_notification.failed",
          "variables": {
             "deliveryAttempts": 2,
             "firstFailure": "2021-06-22 17:06:15 CET",
             "noticeUrl": "notice url 3",
             "paymentId": "7505b6b0-5bf8-11eb-ae93-0242ac130002",
             "statusCode": 500,
             "integration": "paypal"
          }
        }
      }
    ]
    """

  Scenario: Send notification-errors for last 5 m
    Given I use DB fixture "settings/api-key-update-5m"
    Given I use DB fixture "error-notifications"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{businessId}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/update-interval/every-5-minutes"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdJustNow}}",
          "locale": "en",
          "templateName": "error_notifications.api-keys.invalid",
          "variables": {
            "clientId": "98fb0520-e487-45ef-8fd3-c2b1313a55b2",
            "clientSecret": "0378ede71a1b5e8843572a5932806707a41484d62006473c",
            "name": "api name"
          }
        }
      }
    ]
    """

  Scenario: Do not send notification, update interval is different 24h
    Given I use DB fixture "error-notifications"
    Given I use DB fixture "settings/api-key-update-24h"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{businessId}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/update-interval/every-5-minutes"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdJustNow}}",
          "locale": "en",
          "templateName": "error_notifications.api-keys.invalid",
          "variables": {
            "clientId": "98fb0520-e487-45ef-8fd3-c2b1313a55b2",
            "clientSecret": "0378ede71a1b5e8843572a5932806707a41484d62006473c",
            "name": "api name"
          }
        }
      }
    ]
    """

  Scenario: Send notification, update interval is similar to settings
    Given I use DB fixture "error-notifications"
    Given I use DB fixture "settings/api-key-update-24h"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{businessId}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/update-interval/every-24-hours"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdJustNow}}",
          "locale": "en",
          "templateName": "error_notifications.api-keys.invalid",
          "variables": {
            "clientId": "98fb0520-e487-45ef-8fd3-c2b1313a55b2",
            "clientSecret": "0378ede71a1b5e8843572a5932806707a41484d62006473c",
            "name": "api name"
          }
        }
      }
    ]
    """

  Scenario: Do not send notification, update interval is different 5m
    Given I use DB fixture "error-notifications"
    Given I use DB fixture "settings/api-key-update-5m"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{businessId}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/update-interval/every-24-hours"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdJustNow}}"
        }
      }
    ]
    """

  Scenario: Do not send notification, update interval is never
    Given I use DB fixture "error-notifications"
    Given I use DB fixture "settings/api-key-update-never"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{businessId}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/update-interval/every-24-hours"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdJustNow}}"
        }
      }
    ]
    """
    When I send a POST request to "/api/cron-test/update-interval/every-5-minutes"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdJustNow}}"
        }
      }
    ]
    """
    When I send a POST request to "/api/cron-test/update-interval/every-hour"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdJustNow}}"
        }
      }
    ]
    """

  Scenario: Send reminded notification
    Given I use DB fixture "error-notifications-reminder"
    Given I use DB fixture "settings/api-key-update-5m"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{businessId}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }
      ]
    }
    """
    When I send a POST request to "/api/cron-test/update-interval/every-5-minutes"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdJustNow}}",
          "locale": "en",
          "templateName": "error_notifications.api-keys.invalid",
          "variables": {
            "clientId": "98fb0520-e487-45ef-8fd3-c2b1313a55b2",
            "clientSecret": "0378ede71a1b5e8843572a5932806707a41484d62006473c",
            "name": "api name"
          }
        }
      },
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "{{errorNotificationIdJustNow}}",
          "locale": "en",
          "templateName": "error_notifications.psp-api.failed",
          "variables": {
            "message": "not authorized",
            "statusCode": 404,
            "integration": "paypal"
          }
        }
      }
    ]
    """
