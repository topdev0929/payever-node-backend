Feature: Common API
  Background:
    Given I remember as "accessConfigId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "applicationId" following value:
      """
        "ssssssss-ssss-ssss-ssss-ssssssssssss"
      """

  Scenario: get application withh access config
    Given I use DB fixture "builder-theme/access-config"
    When I send a GET request to "/api/app/by-app-id?appId={{applicationId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "accessConfig": {
          "isLive": true,
          "isLocked": false,
          "isPrivate": false,
          "_id": "{{accessConfigId}}"
        }
      }
      """

  Scenario: Get by domain
    Given I use DB fixture "builder-theme/access-config"
    When I send a GET request to "/api/app/theme/by-app-id?appId={{applicationId}}"
    Then print last response
    Then response status code should be 200
    And response should contain json:
    """
    {
      "applicationId": "{{applicationId}}",
      "data": {
        "productPages": "/products/:productId",
        "categoryPages": "/zubehor/:categoryId",
        "languages": [
          {
            "language": "english",
            "active": true
          },
          {
            "language": "german",
            "active": true
          }
        ],
        "defaultLanguage": "english"
      },
      "themeId": "660d35e4-5042-41fc-a475-4156646e9822",
      "versionNumber": 43
    }
    """
