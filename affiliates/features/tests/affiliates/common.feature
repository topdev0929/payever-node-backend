Feature: Common API
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "connectionId" following value:
      """
        "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: get application withh access config
    Given I use DB fixture "access-config"
    When I send a GET request to "/api/affiliates-branding/by-domain?domain=domainTwo.com"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "accessConfig": {
          "isLive": true,
          "isLocked": false,
          "isPrivate": false,
          "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          "business": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          "internalDomain": "evgen8",
          "ownDomain": "google.com"
        },
        "_id": "ssssssss-ssss-ssss-ssss-ssssssssssss"
      }
      """
