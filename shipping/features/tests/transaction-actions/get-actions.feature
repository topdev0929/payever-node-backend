Feature: Get shipping actions for transaction
  Scenario: Processed shipping order with non-custom shipping should have actions for download slip and label
    Given I use DB fixture "shipping-orders/processed/integration-method-selected-with-shipping-label-and-slip"
    And I authenticate as a user with the following data:
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
        "uuid": "4374c56d-866f-5ed7-c13f-fef4f74859c5",
        "created_at": "2019-10-01"
      },
      "shipping": {
        "order_id": "3263d46c-755d-4fe6-b02e-ede4d63748b4"
      },
      "status": {
        "general": "ACCEPTED",
        "specific": "ACCEPTED"
      },
      "payment_option": {
        "type": "santander_installment"
      }
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
        [
          {
            "action": "download_shipping_slip",
            "enabled": true
          },
          {
            "action": "download_shipping_label",
            "enabled": true
          }
        ]
      """

  Scenario: Processed shipping order with custom shipping should have action for download slip
    Given I use DB fixture "shipping-orders/processed/custom-method-selected"
    And I authenticate as a user with the following data:
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
        "uuid": "4374c56d-866f-5ed7-c13f-fef4f74859c5",
        "created_at": "2019-10-01"
      },
      "shipping": {
        "order_id": "3263d46c-755d-4fe6-b02e-ede4d63748b4"
      },
      "status": {
        "general": "ACCEPTED",
        "specific": "ACCEPTED"
      },
      "payment_option": {
        "type": "santander_installment"
      }
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should be equal to "[{"action":"download_shipping_slip","enabled":true}]"

  Scenario: Not processed shipping order, for transaction not in success status shouldn't have process shipping order action
    Given I use DB fixture "shipping-orders/not-processed/custom-method-selected"
    And I authenticate as a user with the following data:
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
        "uuid": "4374c56d-866f-5ed7-c13f-fef4f74859c5",
        "created_at": "2019-10-01"
      },
      "shipping": {
        "order_id": "3263d46c-755d-4fe6-b02e-ede4d63748b4"
      },
      "status": {
        "general": "SOME_UNSUCCESSFUL_STATUS",
        "specific": "SOME_UNSUCCESSFUL_STATUS"
      },
      "payment_option": {
        "type": "santander_installment"
      }
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should be equal to "[]"

  Scenario: Not processed shipping order, for transaction in success status should have process shipping order action
    Given I use DB fixture "shipping-orders/not-processed/custom-method-selected"
    And I authenticate as a user with the following data:
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
        "uuid": "4374c56d-866f-5ed7-c13f-fef4f74859c5",
        "created_at": "2019-10-01"
      },
      "shipping": {
        "order_id": "3263d46c-755d-4fe6-b02e-ede4d63748b4"
      },
      "status": {
        "general": "APPROVED",
        "specific": "SIGNED"
      },
      "payment_option": {
        "type": "santander_pos_installment_se"
      }
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should be equal to "[{"action":"process_shipping_order","enabled":true}]"
