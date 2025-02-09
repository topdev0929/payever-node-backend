Feature: Get business mails list
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "mailId1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "anotherBusinessMailId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}]
      }]
    }
    """

  Scenario: Get by domain
    Given I use DB fixture "mail/mail"
    When I send a GET request to "/api/mail/by-domain?domain=business-test"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "11111111-1111-1111-1111-111111111111",
        "business": {
          "campaigns": [],
          "channelSets": [],
          "subscriptions": [],
          "_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          "name": "business test",
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0,
          "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
        },
        "name": "business test",
        "createdAt": "*",
        "updatedAt": "*",
        "__v": 0,
        "accessConfig": {
          "isLive": true,
          "_id": "22222222-2222-2222-2222-222222222222",
          "internalDomain": "business-test",
          "internalDomainPattern": "business-test",
          "mail": "11111111-1111-1111-1111-111111111111",
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0,
          "id": "22222222-2222-2222-2222-222222222222"
        },
        "id": "11111111-1111-1111-1111-111111111111"
      }
      """

  Scenario: Get by domain not live
    Given I use DB fixture "mail/by-domain-not-live"
    When I send a GET request to "/api/mail/by-domain?domain=business-test"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {
        "statusCode": 404,
        "message": "Mail is not live yet"
      }
      """

  Scenario: Get by domain not exist
    Given I use DB fixture "mail/mail"
    When I send a GET request to "/api/mail/by-domain?domain=business-123"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {
        "statusCode": 404,
        "message": "Mail for domain is not found"
      }
      """
