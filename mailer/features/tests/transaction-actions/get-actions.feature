Feature: Get mailer actions for transaction
  Scenario: Retrieving action for transaction that has sent email
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "531a43cc-e191-46a4-9d42-fd6a9cc59fb9",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a POST request to "/api/transaction-actions" with json:
    """
    {
      "transaction": {
        "uuid": "4374c56d-866f-5ed7-c13f-fef4f74859c5"
      },
      "history": [
        {
          "action": "email_sent",
          "mail_event": {
            "template_name": "some_email_template",
            "event_id": "f7cf9574-78bd-4490-b20f-9a97d1dbd981"
          }
        },
        {
          "action": "email_sent",
          "mail_event": {
            "template_name": "shipping_order_template",
            "event_id": "9efe0dd4-b3d8-450a-81ae-4c7d3ea22890"
          }
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [
          {
            "action": "resend_shipping_order_template",
            "enabled": true,
            "mailEvent": {
              "id": "9efe0dd4-b3d8-450a-81ae-4c7d3ea22890"
            }
          }
        ]
      """

  Scenario: Retrieving action for transaction that doesn't have sent email
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "531a43cc-e191-46a4-9d42-fd6a9cc59fb9",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a POST request to "/api/transaction-actions" with json:
    """
    {
      "transaction": {
        "uuid": "4374c56d-866f-5ed7-c13f-fef4f74859c5"
      },
      "history": [
        {
          "action": "some_action"
        },
        {
          "action": "another_action",
          "mail_event": {
            "template_name": "shipping_order_template",
            "event_id": "9efe0dd4-b3d8-450a-81ae-4c7d3ea22890"
          }
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should be equal to "[]"
