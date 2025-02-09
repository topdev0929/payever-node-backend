@error-notification
Feature: Send error-notification emails
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send an error-notification email
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "b3d5f17b-1bda-47cf-a752-7dc3fe0f6f0b",
          "locale": "en",
          "templateName": "error_notifications.payment_notification.failed",
          "variables": {
             "deliveryAttempts": 2,
             "firstFailure": "2021-06-22, 17:06:15 CET",
             "errorDateFormatted": "2021-06-22, 17:06:15 CET",
             "noticeUrl": "notice url 1",
             "paymentId": "2d4bcbce-5bf9-11eb-ae93-0242ac130002",
             "statusCode": 500,
             "integration": "cash"
          }
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Failed payment notification",
      "html": "*<p>Dear Merchant,</p>\n<p>unfortunately we are experiencing issues sending you payment notifications associated with your account: boehm Reichenbach. payever sends events to your server to notify you of payment updates, such as a newly-created or updated payment transactions.</p>\n<p>The URL related to the failing payment notifications is: notice url 1</p>\n<p>\n  Business: boehm Reichenbach<br>  Transaction ID: 2d4bcbce-5bf9-11eb-ae93-0242ac130002<br>  Time: 2021-06-22, 17:06:15 CET</p>\n<p>We have attempted to send payment notifications to this endpoint 2 times since the first failure on 2021-06-22, 17:06:15 CET.</p>\n<p>In most cases, a failing notice_url does not impact your payments, however the correct statuses for your payments may be delayed if your endpoint is unable to successfully receive them.</p>\n<p>For more in-depth information on how to use payment notifications, we recommend reviewing our documentation or contact our customer support.</p>*"
    }
    """
    And a mail with the following data should not be sent:
    """
    {
      "from": "bill@gates.com"
    }
    """

  Scenario: Send an error-notification email with email
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.business.email",
        "payload": {
          "to": "error-notification@gmail.com",
          "businessId": "b3d5f17b-1bda-47cf-a752-7dc3fe0f6f0b",
          "locale": "en",
          "templateName": "error_notifications.payment_notification.failed",
          "variables": {
             "deliveryAttempts": 2,
             "firstFailure": "2021-06-22, 17:06:15 CET",
             "errorDateFormatted": "2021-06-22, 17:06:15 CET",
             "noticeUrl": "notice url 1",
             "paymentId": "2d4bcbce-5bf9-11eb-ae93-0242ac130002",
             "statusCode": 500,
             "integration": "cash"
          }
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Failed payment notification",
      "html": "*<p>Dear Merchant,</p>\n<p>unfortunately we are experiencing issues sending you payment notifications associated with your account: boehm Reichenbach. payever sends events to your server to notify you of payment updates, such as a newly-created or updated payment transactions.</p>\n<p>The URL related to the failing payment notifications is: notice url 1</p>\n<p>\n  Business: boehm Reichenbach<br>  Transaction ID: 2d4bcbce-5bf9-11eb-ae93-0242ac130002<br>  Time: 2021-06-22, 17:06:15 CET</p>\n<p>We have attempted to send payment notifications to this endpoint 2 times since the first failure on 2021-06-22, 17:06:15 CET.</p>\n<p>In most cases, a failing notice_url does not impact your payments, however the correct statuses for your payments may be delayed if your endpoint is unable to successfully receive them.</p>\n<p>For more in-depth information on how to use payment notifications, we recommend reviewing our documentation or contact our customer support.</p>*"
    }
    """
    And a mail with the following data should not be sent:
    """
    {
      "from": "bill@gates.com"
    }
    """

  Scenario: Send an psp api failed email
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "b3d5f17b-1bda-47cf-a752-7dc3fe0f6f0b",
          "locale": "en",
          "templateName": "error_notifications.psp-api.failed",
          "variables": {
            "message": "{\"description\":\"Total amount is wrong.\",\"errorCode\":\"400 BAD_REQUEST\"}",
            "integration": "openbank",
            "paymentId": "2a5c6ab4-ac96-46e4-9c7a-2c1f19eba36d",
            "statusCode": 500,
            "errorDateFormatted": "2021-09-29 10:49:07 CET"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Failed payment alert",
      "html": "*<p>Dear Merchant,</p>\n<p>we were unable to successfully process your <b>Openbank</b> payment at this time. Reason: {&quot;description&quot;:&quot;Total amount is wrong.&quot;,&quot;errorCode&quot;:&quot;400 BAD_REQUEST&quot;}</p>\n<p>\n  Business: boehm Reichenbach<br>  Transaction ID: 2a5c6ab4-ac96-46e4-9c7a-2c1f19eba36d<br>    Time: 2021-09-29 10:49:07 CET</p>\n<p>This is a one-time notification, unless the issues persists, then our system will keep you updated about the status.</p>\n<p>For more details on these errors and to review your recent transactions, you can find the full list of payments in the payever Transactions application.</p>\n<p>Receiving this email too frequent? Customize your settings for the payever Checkout notifications or contact our support.</p>*"
    }
    """

  Scenario: Send an psp api failed email object message
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "b3d5f17b-1bda-47cf-a752-7dc3fe0f6f0b",
          "locale": "en",
          "templateName": "error_notifications.psp-api.failed",
          "variables": {
            "message": {
              "errors": {
                "SocialSecurityNumber": [
                  "Ssn must be valid and in a 12 digit format"
                ]
              },
              "title": "One or more validation errors occurred.",
              "status": 400
            },
            "statusCode": 400,
            "errorDateFormatted": "2021-11-21 19:26:53 CET"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Failed payment alert",
      "html": "*<p>Dear Merchant,</p>\n<p>we were unable to successfully process your payment at this time. Reason: {&quot;errors&quot;:{&quot;SocialSecurityNumber&quot;:[&quot;Ssn must be valid and in a 12 digit format&quot;]},&quot;title&quot;:&quot;One or more validation errors occurred.&quot;,&quot;status&quot;:400}</p>\n<p>\n  Business: boehm Reichenbach<br>      Time: 2021-11-21 19:26:53 CET</p>\n<p>This is a one-time notification, unless the issues persists, then our system will keep you updated about the status.</p>\n<p>For more details on these errors and to review your recent transactions, you can find the full list of payments in the payever Transactions application.</p>\n<p>Receiving this email too frequent? Customize your settings for the payever Checkout notifications or contact our support.</p>*"
    }
    """

  Scenario: Send an error-notification last transaction time email
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "b3d5f17b-1bda-47cf-a752-7dc3fe0f6f0b",
          "locale": "en",
          "templateName": "error_notifications.last-transaction-time",
          "variables": {
            "errorDateFormatted": "2021-11-17 09:49:48 CET",
            "integration": "santander_installment_dk",
            "timeAgo": "3 hours ago"
          }
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Last transactions alert",
      "html": "*<p>Dear Merchant,</p>\n<p>we have noticed an unusual trend in transactions for the following payment option: <b>Santander Installments DK</b> </p>\n<p>\n  Business: boehm Reichenbach</p>\n<p>We are concerned about potential issues with your checkout as your last transaction for this payment option was at 2021-11-17 09:49:48 CET.</p>\n<p>Please login to your payever account and confirm your payment credentials and that the payment is enabled inside your checkout correctly. Furthermore, please analyze your shopsystem integration or other conditions you might have implemented.</p>*"
    }
    """
