Feature: Download shipping slip should trigger appropriate bus message
  Scenario: Download shipping slip
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
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.test/api/business/531a43cc-e191-46a4-9d42-fd6a9cc59fb9/shipping/some-integration-name/get-label"
        },
        "response": {
          "status": 200,
          "body": "{\"status\": true, \"shipmentNumber\": \"123\", \"trackingUrl\": \"https:\/\/tracking.url\/123\", \"label\": \"https:\/\/label.url\/123\"}"
        }
      }
      """
    When I send a GET request to "/api/business/531a43cc-e191-46a4-9d42-fd6a9cc59fb9/shipping-orders/3263d46c-755d-4fe6-b02e-ede4d63748b4/slip"
    Then print last response
    And the response status code should be 200
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "shipping.event.shipping-slip.downloaded",
        "payload": {
          "shippingOrder": {
            "id": "3263d46c-755d-4fe6-b02e-ede4d63748b4"
          }
        }
      }
    ]
    """
