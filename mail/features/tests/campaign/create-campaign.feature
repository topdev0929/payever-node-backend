Feature: Create mails
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "foreignBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa"
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}, {"businessId": "{{anotherBusinessId}}", "acls": []}]
      }]
    }
    """

  Scenario: Create campaign
    Given I use DB fixture "mail/mail"
    When I send a POST request to "/graphql" with json:
      """
      {
        "query": "mutation createCampaign(\n  $businessId: String!,\n  $data: CreateCampaignInput!,\n) {\n  createCampaign(\n    businessId: $businessId,\n    data: $data,\n  ) {\n   id \n    business\n    themeId\n    name\n    from\n    categories {\n      id\n      name\n      description\n    }\n    schedules {\n      id\n      date\n      type\n      interval {\n        number\n        type\n      }\n      recurring {\n        target\n        fulfill\n      }\n    }\n    createdAt\n    updatedAt\n  }\n}\n",
        "variables": {
          "businessId": "{{businessId}}",
          "data": {
            "name": "test email campaign",
            "themeId": "5d085102-0cf6-403a-87ec-ebc97246e935",
            "categories": [
              "3f1a5efe-df10-47a6-8296-19090050cd26"
            ],
            "from": "campaign@payever.com",
            "contacts": [
              "mh.septiadi@gmail.com"
            ],
            "schedules": [
              {
                "type": "now"
              }
            ],
            "date": "2020-10-20T16:31:41.813+00:00",
            "status": "new"
          }
        },
        "operationName": "createCampaign"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "createCampaign": {
            "id": "*",
            "business": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "themeId": "5d085102-0cf6-403a-87ec-ebc97246e935",
            "name": "test email campaign",
            "from": "campaign@payever.com",
            "categories": [],
            "schedules": [
              {
                "id": "*",
                "type": "now"
              }
            ],
            "createdAt": "*",
            "updatedAt": "*"
          }
        }
      }
      """
    And I look for model "Campaign" by following JSON and remember as "Campaign":
      """
      {
        "name": "test email campaign"
      }
      """


