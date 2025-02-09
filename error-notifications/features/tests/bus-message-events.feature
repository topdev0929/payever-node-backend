@bus-message-controller
Feature: Handle payment notification failed error
  Background:
    Given I remember as "businessId" following value:
    """
      "6111e145-fb5e-4098-ae0c-ad51ea92fa64"
    """
    Given I remember as "businessPaypalCron" following value:
    """
      "fe4f1cd0-71d9-11eb-9439-0242ac130002"
    """
    Given I remember as "businessPaypalAfter" following value:
    """
      "6d9c8963-6d4f-42df-9e95-d7a52206a63e"
    """
    Given I remember as "businessSantanderCron" following value:
    """
      "23c7752a-71da-11eb-9439-0242ac130002"
    """
    Given I remember as "businessSantanderAfter" following value:
    """
      "27b47d5e-71da-11eb-9439-0242ac130002"
    """
  Scenario: Payment notification failed event
    Given I use DB fixture "settings/business-settings"
    When I publish in RabbitMQ channel "async_events_error_notifications_micro" message with json:
    """
    {
      "name": "error-notifications.event.payment-notification.failed",
      "payload": {
        "deliveryAttempts": 2,
        "firstFailure": "2021-06-22T15:06:15.944Z",
        "businessId": "{{businessId}}",
        "noticeUrl": "https://test.com/notice-url",
        "paymentId": "test-payment-id",
        "statusCode": 500
      }
    }
    """
    And process messages from RabbitMQ "async_events_error_notifications_micro" channel
    Then look for model "ErrorNotification" by following JSON and remember as "payment_notification_failed_error":
    """
    {
      "businessId": "{{businessId}}"
    }
    """
    Then print storage key "payment_notification_failed_error"
    And model "ErrorNotification" with id "{{payment_notification_failed_error._id}}" should contain json:
    """
    {
      "_id": "{{payment_notification_failed_error._id}}",
      "businessId": "{{businessId}}",
      "errorDetails": {
        "deliveryAttempts": 2,
        "firstFailure": "2021-06-22T15:06:15.944Z",
        "noticeUrl": "https://test.com/notice-url",
        "paymentId": "test-payment-id",
        "statusCode": "500"
      },
      "type": "payment-notification-failed",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: API keys invalid event
    Given I use DB fixture "settings/business-settings"
    When I publish in RabbitMQ channel "async_events_error_notifications_micro" message with json:
    """
    {
      "name": "error-notifications.api-keys.invalid",
      "payload": {
        "businessId": "{{businessId}}",
        "errorDetails": {
           "name": "test",
           "clientId": "0e009066-ada1-48b2-9c06-a14ce5002637",
           "clientSecret": "0b13577c3671e174a87222a05794d2f32d679dcd289f8444"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_error_notifications_micro" channel
    Then look for model "ErrorNotification" by following JSON and remember as "payment_notification_failed_error":
    """
    {
      "businessId": "{{businessId}}"
    }
    """
    Then print storage key "payment_notification_failed_error"
    And model "ErrorNotification" with id "{{payment_notification_failed_error._id}}" should contain json:
    """
    {
      "_id": "{{payment_notification_failed_error._id}}",
      "businessId": "{{businessId}}",
      "errorDetails": {
         "name": "test",
         "clientId": "0e009066-ada1-48b2-9c06-a14ce5002637",
         "clientSecret": "0b13577c3671e174a87222a05794d2f32d679dcd289f8444"
      },
      "type": "api-keys-invalid",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: thirdparty error event
    Given I use DB fixture "settings/business-settings"
    When I publish in RabbitMQ channel "async_events_error_notifications_micro" message with json:
    """
    {
      "name": "error-notifications.event.third-party-error",
      "payload": {
        "businessId": "{{businessId}}",
        "errorDetails": {
           "name": "test",
           "clientId": "0e009066-ada1-48b2-9c06-a14ce5002637",
           "clientSecret": "0b13577c3671e174a87222a05794d2f32d679dcd289f8444"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_error_notifications_micro" channel
    Then look for model "ErrorNotification" by following JSON and remember as "payment_notification_failed_error":
    """
    {
      "businessId": "{{businessId}}"
    }
    """
    Then print storage key "payment_notification_failed _error"
    And model "ErrorNotification" with id "{{payment_notification_failed_error._id}}" should contain json:
    """
    {
      "_id": "{{payment_notification_failed_error._id}}",
      "businessId": "{{businessId}}",
      "errorDetails": {
         "name": "test",
         "clientId": "0e009066-ada1-48b2-9c06-a14ce5002637",
         "clientSecret": "0b13577c3671e174a87222a05794d2f32d679dcd289f8444"
      },
      "type": "third-party-error",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: Payment option credentials invalid event
    Given I use DB fixture "settings/business-settings"
    When I publish in RabbitMQ channel "async_events_error_notifications_micro" message with json:
    """
    {
      "name": "error-notifications.event.payment-option-credentials.invalid",
      "payload": {
        "businessId": "{{businessId}}",
        "integration": "paypal",
        "errorDetails": {
           "credentials": "credentials data"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_error_notifications_micro" channel
    Then look for model "ErrorNotification" by following JSON and remember as "payment_notification_failed_error":
    """
    {
      "businessId": "{{businessId}}"
    }
    """
    Then print storage key "payment_notification_failed_error"
    And model "ErrorNotification" with id "{{payment_notification_failed_error._id}}" should contain json:
    """
    {
      "_id": "{{payment_notification_failed_error._id}}",
      "businessId": "{{businessId}}",
      "errorDetails": {
         "credentials": "credentials data"
      },
      "type": "payment-option-credentials-invalid",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: PSP API failed event
    Given I use DB fixture "settings/business-settings"
    When I publish in RabbitMQ channel "async_events_error_notifications_micro" message with json:
    """
    {
      "name": "error-notifications.event.psp-api.failed",
      "payload": {
        "businessId": "{{businessId}}",
        "errorDetails": {
           "pspApi": "some data"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_error_notifications_micro" channel
    Then look for model "ErrorNotification" by following JSON and remember as "payment_notification_failed_error":
    """
    {
      "businessId": "{{businessId}}"
    }
    """
    Then print storage key "payment_notification_failed_error"
    And model "ErrorNotification" with id "{{payment_notification_failed_error._id}}" should contain json:
    """
    {
      "_id": "{{payment_notification_failed_error._id}}",
      "businessId": "{{businessId}}",
      "errorDetails": {
         "pspApi": "some data"
      },
      "type": "psp-api-failed",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: Integration uninstalled, disable settings connection uninstalled
    Given I use DB fixture "settings/business-settings"
    When I publish in RabbitMQ channel "async_events_error_notifications_micro" message with json:
    """
    {
      "name": "checkout.event.connection.uninstalled",
      "payload": {
        "checkout": {
          "_id": "id"
        },
        "connection": {
          "_id": "id",
          "business": "{{businessId}}",
          "integration": "paypal"
        },
        "integration": {
          "name": "paypal"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_error_notifications_micro" channel
    Then look for model "Settings" by following JSON and remember as "settings":
    """
    {
      "_id": "{{businessPaypalCron}}"
    }
    """
    Then print storage key "settings"
    And model "Settings" with id "{{businessPaypalCron}}" should contain json:
    """
    {
      "_id": "{{businessPaypalCron}}",
      "isEnabled": false,
      "updateInterval": "every-24-hours",
      "businessId": "{{businessId}}",
      "createdAt": "*",
      "integration": "paypal",
      "sendingMethod": "send-by-cron-interval",
      "type": "payment-notification-failed",
      "updatedAt": "*",
      "timeFrames": []
     }
    """
    Then look for model "Settings" by following JSON and remember as "settings":
    """
    {
      "_id": "{{businessPaypalAfter}}"
    }
    """
    Then print storage key "settings"
    And model "Settings" with id "{{businessPaypalAfter}}" should contain json:
    """
    {
      "_id": "{{businessPaypalAfter}}",
      "isEnabled": false,
      "businessId": "{{businessId}}",
      "integration": "paypal",
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "_id": "*",
          "startDayOfWeek": 1,
          "startHour": 0,
          "startMinutes": 0,
          "endDayOfWeek": 7,
          "endHour": 23,
          "endMinutes": 59,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 60
        }
      ],
      "type": "last-transaction-time"
    }
    """
    Then look for model "Settings" by following JSON and remember as "settings":
    """
    {
      "_id": "{{businessSantanderCron}}"
    }
    """
    Then print storage key "settings"
    And model "Settings" with id "{{businessSantanderCron}}" should contain json:
    """
    {
      "_id": "{{businessSantanderCron}}",
      "isEnabled": true,
      "updateInterval": "every-24-hours",
      "businessId": "{{businessId}}",
      "createdAt": "*",
      "integration": "santander_factoring_de",
      "sendingMethod": "send-by-cron-interval",
      "type": "payment-notification-failed",
      "updatedAt": "*",
      "timeFrames": []
     }
    """
    Then look for model "Settings" by following JSON and remember as "settings":
    """
    {
      "_id": "{{businessSantanderAfter}}"
    }
    """
    Then print storage key "settings"
    And model "Settings" with id "{{businessSantanderAfter}}" should contain json:
    """
    {
      "_id": "{{businessSantanderAfter}}",
      "isEnabled": true,
      "businessId": "{{businessId}}",
      "integration": "santander_factoring_de",
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "_id": "*",
          "startDayOfWeek": 1,
          "startHour": 0,
          "startMinutes": 0,
          "endDayOfWeek": 7,
          "endHour": 23,
          "endMinutes": 59,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 60
        }
      ],
      "type": "last-transaction-time"
    }
    """

  Scenario: Integration uninstalled, disable settings third party disabled
    Given I use DB fixture "settings/business-settings"
    When I publish in RabbitMQ channel "async_events_error_notifications_micro" message with json:
    """
    {
      "name": "connect.event.third-party.disabled",
      "payload": {
        "businessId": "{{businessId}}",
        "category": "category",
        "name": "paypal"
      }
    }
    """
    And process messages from RabbitMQ "async_events_error_notifications_micro" channel
    Then look for model "Settings" by following JSON and remember as "settings":
    """
    {
      "_id": "{{businessPaypalCron}}"
    }
    """
    Then print storage key "settings"
    And model "Settings" with id "{{businessPaypalCron}}" should contain json:
    """
    {
      "_id": "{{businessPaypalCron}}",
      "isEnabled": false,
      "updateInterval": "every-24-hours",
      "businessId": "{{businessId}}",
      "createdAt": "*",
      "integration": "paypal",
      "sendingMethod": "send-by-cron-interval",
      "type": "payment-notification-failed",
      "updatedAt": "*",
      "timeFrames": []
     }
    """
    Then look for model "Settings" by following JSON and remember as "settings":
    """
    {
      "_id": "{{businessPaypalAfter}}"
    }
    """
    Then print storage key "settings"
    And model "Settings" with id "{{businessPaypalAfter}}" should contain json:
    """
    {
      "_id": "{{businessPaypalAfter}}",
      "isEnabled": false,
      "businessId": "{{businessId}}",
      "integration": "paypal",
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "_id": "*",
          "startDayOfWeek": 1,
          "startHour": 0,
          "startMinutes": 0,
          "endDayOfWeek": 7,
          "endHour": 23,
          "endMinutes": 59,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 60
        }
      ],
      "type": "last-transaction-time"
    }
    """
    Then look for model "Settings" by following JSON and remember as "settings":
    """
    {
      "_id": "{{businessSantanderCron}}"
    }
    """
    Then print storage key "settings"
    And model "Settings" with id "{{businessSantanderCron}}" should contain json:
    """
    {
      "_id": "{{businessSantanderCron}}",
       "isEnabled": true,
       "updateInterval": "every-24-hours",
       "businessId": "{{businessId}}",
       "createdAt": "*",
       "integration": "santander_factoring_de",
       "sendingMethod": "send-by-cron-interval",
       "type": "payment-notification-failed",
       "updatedAt": "*",
       "timeFrames": []
     }
    """
    Then look for model "Settings" by following JSON and remember as "settings":
    """
    {
      "_id": "{{businessSantanderAfter}}"
    }
    """
    Then print storage key "settings"
    And model "Settings" with id "{{businessSantanderAfter}}" should contain json:
    """
    {
      "_id": "{{businessSantanderAfter}}",
      "isEnabled": true,
      "businessId": "{{businessId}}",
      "integration": "santander_factoring_de",
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "_id": "*",
          "startDayOfWeek": 1,
          "startHour": 0,
          "startMinutes": 0,
          "endDayOfWeek": 7,
          "endHour": 23,
          "endMinutes": 59,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 60
        }
      ],
      "type": "last-transaction-time"
    }
    """
