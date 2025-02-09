Feature: Admin access API
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "accessId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "subscriptionNetworkId" following value:
      """
        "ssssssss-ssss-ssss-ssss-ssssssssssss"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {"name":"admin","permissions":[]},
          {"name": "merchant","permissions": []}
        ]
      }
      """

  Scenario: update access config
    Given I use DB fixture "access-config"
    When I send a PATCH request to "/api/admin/subscription-network/access/{{subscriptionNetworkId}}" with json:
      """
      {
        "businessId": "{{businessId}}",
        "isLive": true
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "isLive": true,
        "isLocked": false,
        "isPrivate": false,
        "business": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",        
        "_id": "*"
      }
      """

  Scenario: get is live for access config
    Given I use DB fixture "access-config"
    When I send a GET request to "/api/admin/subscription-network/access/{{subscriptionNetworkId}}/business/{{businessId}}/is-live"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      true
      """

  Scenario: get access config
    Given I use DB fixture "access-config"
    When I send a GET request to "/api/admin/subscription-network/access/{{subscriptionNetworkId}}/business/{{businessId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "isLive": true,
        "isLocked": false,
        "isPrivate": false,
        "business": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      }
      """

  Scenario: domain check access config
    Given I use DB fixture "access-config"
    When I send a POST request to "/api/admin/subscription-network/access/{{subscriptionNetworkId}}/business/{{businessId}}/domain/check"
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "cnames": [],
        "currentCname": "",
        "currentIp": "*",
        "isConnected": false
      }
      """
