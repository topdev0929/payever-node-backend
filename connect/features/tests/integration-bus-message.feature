Feature: Integration bus messages
  Background:
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["category-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "count" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "service@payever.de",
        "roles": [
          {"name": "user", "permissions": []},
          {"name": "admin", "permissions": []}
        ]
      }
      """
    And I use DB fixture "integrations/businesses"
    And I use DB fixture "integrations/integrations"
    And I remember as "integrationId" following value:
    """
    "06b3464b-9ed2-4952-9cb8-07aac0108a55"
    """
    And I remember as "business1" following value:
    """
    "d5b25c5c-3684-4ab7-a769-c95f4c0f7546"
    """
    And I remember as "business2" following value:
    """
    "2135dc62-c904-4b2c-8aaa-73083c3b2a94"
    """

  Scenario: Received Integration enabled method
    When I send a GET request to "/api/business/{{business1}}/integration"
  When I publish in RabbitMQ channel "async_events_connect_micro" message with json:
    """
    {
        "name": "mailer-report.event.report-data.requested",
        "payload": {
            "businessIds": ["{{businessId}}"]
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_connect_micro" channel
    And process messages from RabbitMQ "async_events_connect_micro" channel
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following messages:
      """
      [
          {
             "name": "connect.event.report-data.prepared",
             "payload": [
               {
                 "connectData": []
               }
             ]
           }
      ]
      """
