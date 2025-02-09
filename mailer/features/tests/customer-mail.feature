@customer-mails
Feature: Customer mails
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: New user register to an application
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "auth.event.user-customer.application-access-request.created",
        "payload": {
          "business": {
            "contactEmails": [
              "efw@e3wfre.wer",
              "test@gtest.com"
            ],
            "_id": "00d6d43b-4f6f-4d37-ae22-cf5158920e90",
            "__v": 0,
            "createdAt": "2021-10-28T07:46:12.240Z",
            "name": "Test business",
            "owner": "2673fa45-82b9-484c-bcbe-46da250c2639",
            "updatedAt": "2021-10-29T09:40:23.193Z",
            "id": "00d6d43b-4f6f-4d37-ae22-cf5158920e90"
          },
          "customer": {
            "id": "de4bfeb9-f5ba-4d40-9ec7-8288395e930e",
            "first_name": "test2",
            "email": "test2@hasep.io"
          },
          "owner": {
            "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
            "first_name": "Test",
            "email": "testcases@payever.de"
          },
          "applicationType": "shop",
          "applicationId": "698f68cd-10ce-4918-8aa7-af9a1d5ecb35",
          "status": "PENDING"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "New customer registered in your shop",
      "html": "*Hi Test, someone has registered in your shop.*"
    }
    """

  Scenario: Customer approved
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "auth.event.user-customer.application-access-request.approved",
        "payload": {
          "business": {
            "contactEmails": [
              "efw@e3wfre.wer",
              "test@gtest.com"
            ],
            "_id": "00d6d43b-4f6f-4d37-ae22-cf5158920e90",
            "__v": 0,
            "createdAt": "2021-10-28T07:46:12.240Z",
            "name": "Test business",
            "owner": "2673fa45-82b9-484c-bcbe-46da250c2639",
            "updatedAt": "2021-10-29T09:40:23.193Z",
            "id": "00d6d43b-4f6f-4d37-ae22-cf5158920e90"
          },
          "customer": {
            "id": "de4bfeb9-f5ba-4d40-9ec7-8288395e930e",
            "first_name": "test2",
            "email": "test2@hasep.io"
          },
          "owner": {
            "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
            "first_name": "Test",
            "email": "testcases@payever.de"
          },
          "applicationType": "shop",
          "applicationId": "698f68cd-10ce-4918-8aa7-af9a1d5ecb35",
          "status": "APPROVED"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Registration process for shop has been approved",
      "html": "*Hi test2, your registration process for shop has been approved.*"
    }
    """

  Scenario: Customer Denied
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "auth.event.user-customer.application-access-request.denied",
        "payload": {
          "business": {
            "contactEmails": [
              "efw@e3wfre.wer",
              "test@gtest.com"
            ],
            "_id": "00d6d43b-4f6f-4d37-ae22-cf5158920e90",
            "__v": 0,
            "createdAt": "2021-10-28T07:46:12.240Z",
            "name": "Test business",
            "owner": "2673fa45-82b9-484c-bcbe-46da250c2639",
            "updatedAt": "2021-10-29T09:40:23.193Z",
            "id": "00d6d43b-4f6f-4d37-ae22-cf5158920e90"
          },
          "customer": {
            "id": "de4bfeb9-f5ba-4d40-9ec7-8288395e930e",
            "first_name": "test2",
            "email": "test2@hasep.io"
          },
          "owner": {
            "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
            "first_name": "Test",
            "email": "testcases@payever.de"
          },
          "applicationType": "shop",
          "applicationId": "698f68cd-10ce-4918-8aa7-af9a1d5ecb35",
          "status": "DENIED"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Registration process for shop has been denied",
      "html": "*Hi test2, your registration process for shop has been denied.*"
    }
    """
