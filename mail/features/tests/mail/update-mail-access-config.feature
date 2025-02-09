Feature: Update mails access config
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "mailId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "channelSetId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    And I remember as "defaultMailId" following value:
      """
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    And I remember as "siteAccessConfigId" following value:
      """
      "22222222-2222-2222-2222-222222222222"
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

  Scenario: Update mail config, change isLive status
    Given I use DB fixture "mail/mail"
    When I send a PATCH request to "/api/business/{{businessId}}/mail/access/{{mailId}}" with json:
      """
      {
        "internalDomain": "business-update",
        "internalDomainPattern": "business-update",
        "isLive": false
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "internalDomain": "business-update",
        "internalDomainPattern": "business-update",
        "isLive": false
      }
      """

  Scenario: Update mail config, invalid dto
    Given I use DB fixture "mail/mail"
    When I send a PATCH request to "/api/business/{{businessId}}/mail/access/{{mailId}}" with json:
      """
      {
        "invalidDto": "business-update"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should not contain json:
      """
      {
        "invalidDto": "business-update"
      }
      """

  Scenario: Update mail config, change isLive status
    Given I use DB fixture "mail/mail"
    And I am not authenticated
    When I send a PATCH request to "/api/business/{{businessId}}/mail/access/{{mailId}}" with json:
      """
      {
        "internalDomain": "business-update",
        "internalDomainPattern": "business-update",
        "isLive": false
      }
      """
    Then print last response
    And the response status code should be 403
    And the response should contain json:
      """
      {
        "statusCode": 403,
        "message": "app.permission.insufficient.error"
      }
      """
