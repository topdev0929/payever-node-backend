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

  Scenario: Get mails list
    Given I use DB fixture "mail/mail"
    When I send a GET request to "/api/business/{{businessId}}/mail"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
         {
           "_id": "{{mailId1}}"
         }
      ]
      """
    And the response should not contain json:
      """
      [
         {
           "_id": "{{anotherBusinessMailId}}"
         }
      ]
      """

  Scenario: Get mail
    Given I use DB fixture "mail/mail"
    When I send a GET request to "/api/business/{{businessId}}/mail/{{mailId1}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "_id": "{{mailId1}}"
       }
      """

  Scenario: Get mail no id
    Given I use DB fixture "mail/mail"
    When I send a GET request to "/api/business/{{businessId}}/mail/noId"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
        {
          "statusCode": 404,
          "message": "Mail by {\"_id\":\"noId\"} not found!"
        }
      """

  Scenario: Get mail as anonymous
    Given I use DB fixture "mail/mail"
    And I am not authenticated
    When I send a GET request to "/api/business/{{businessId}}/mail/{{mailId1}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "_id": "{{mailId1}}"
       }
      """
