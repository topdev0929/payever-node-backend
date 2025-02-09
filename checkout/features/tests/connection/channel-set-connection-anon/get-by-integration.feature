Feature: Get default connection by channel-set and integration name,
  Background:
    Given I remember as "connectionIdOne" following value:
      """
      "4ca57652-6881-4b54-9c11-ce00c79fcb45"
      """
    Given I remember as "connectionIdTwo" following value:
      """
      "ce00c79f-6881-4b54-cb45-4ca576529c11"
      """
    Given I remember as "integrationName" following value:
      """
      "santander_factoring_de"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "connectionName" following value:
      """
      "TestConnectionOne"
      """
    Given I remember as "channelSetId" following value:
      """
      "a084c7a1-3954-439a-ac42-45e7218cd512"
      """

  Scenario: Many connections exist, connection with empty name should be returned
    Given I use DB fixture "connection/channel-set-connection-anon/get-by-integration/many-connections-one-empty-name"
    When I send a GET request to "/api/channel-set/{{channelSetId}}/default-connection/{{integrationName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id":"{{connectionIdTwo}}",
        "integration":"{{integrationName}}"
      }
      """

  Scenario: Many connections exist, first from list should be returned if all names filled
    Given I use DB fixture "connection/channel-set-connection-anon/get-by-integration/many-connections-filled-names"
    When I send a GET request to "/api/channel-set/{{channelSetId}}/default-connection/{{integrationName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id":"{{connectionIdOne}}",
        "integration":"{{integrationName}}",
        "name": "{{connectionName}}"
      }
      """

  Scenario: One connection exists with empty name, it should be returned
    Given I use DB fixture "connection/channel-set-connection-anon/get-by-integration/one-connection-empty-name"
    When I send a GET request to "/api/channel-set/{{channelSetId}}/default-connection/{{integrationName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id":"{{connectionIdOne}}",
        "integration":"{{integrationName}}"
      }
      """

  Scenario: One connection exists with filled name, it should be returned
    Given I use DB fixture "connection/channel-set-connection-anon/get-by-integration/one-connection-filled-name"
    When I send a GET request to "/api/channel-set/{{channelSetId}}/default-connection/{{integrationName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id":"{{connectionIdOne}}",
        "integration":"{{integrationName}}",
        "name": "{{connectionName}}"
      }
      """

  Scenario: No connections found
    Given I use DB fixture "connection/channel-set-connection-anon/get-by-integration/no-connections"
    When I send a GET request to "/api/channel-set/{{channelSetId}}/default-connection/{{integrationName}}"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {
        "statusCode":404,
        "error":"Not Found",
        "message":"Connections not found for integration 'santander_factoring_de'"
      }
      """
