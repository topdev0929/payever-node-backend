Feature: OAuth token bus message handling
  Background:
    Given I remember as "clientId" following value:
      """
      "d916ec94-3b2e-4728-bce2-3e9b4f9d353d"
      """

  Scenario: Create OAuth token
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "auth.event.oauth-token.issued",
      "payload": {
        "businesses": [
          "123-456",
          "789-012"
        ],
        "clientId": "{{clientId}}",
        "createdAt": "2021-04-06T12:52:50.228+00:00",
        "executionTime": 9.456
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel

    When look for model "OAuthToken" by following JSON and remember as "oauthToken":
      """
      {
        "clientId": "{{clientId}}"
      }
      """
    Then print storage key "oauthToken"
    And stored value "oauthToken" should contain json:
      """
      {
        "businessIds": [
           "123-456",
           "789-012"
         ],
         "createdAt": "2021-04-06T12:52:50.228Z",
         "clientId": "{{clientId}}",
         "executionTime": 9.456
      }
      """
