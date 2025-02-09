@single-mail
Feature: Single-mail
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send single email with attachments
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "to": "test@test.de",
          "subject": "Test Subj",
          "html": "some random html text",
          "attachments": [
            {
              "content": {
                "type": "Buffer",
                "data": [
                  1,
                  2,
                  3
                ]
              },
              "filename": "example.bin",
              "contentType": "octet/stream"
            }
          ]
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
      """
      {
        "subject": "Test Subj",
        "html": "some random html text",
        "attachments": [
          {
            "filename": "example.bin",
            "contentType": "octet/stream"
          }
        ]
      }
      """

  Scenario: Send single email with base64 attachments
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "to": "test@test.de",
          "subject": "Test Subj",
          "html": "some random html text",
          "attachments": [
            {
              "content": "dGVzdHRlc3R0ZXN0",
              "filename": "example.txt",
              "encoding": "base64"
            }
          ]
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
      """
      {
        "subject": "Test Subj",
        "html": "some random html text",
        "attachments": [
          {
            "filename": "example.txt",
            "encoding": "base64"
          }
        ]
      }
      """
