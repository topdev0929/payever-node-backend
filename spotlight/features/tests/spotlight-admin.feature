Feature: Transaction export for business
  Background:
    Given I remember as "businessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "admin",
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

  Scenario: Search everything for business with admin role
    Given I use DB fixture "business"
    Given I use DB fixture "suggested-app"
    And I get file "features/fixtures/json/elastic-blogs-list.json" content and remember as "elasticBlogsListJson"
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "connect-folder",
          {}
        ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "spotlight",
          {}
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/spotlight/search?query=shop"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "result": [],
        "suggestedApps": [
          {
            "_id": "0bf1dbd0-2eee-4984-9adb-53e23260ceee",
            "title": "Shop",
            "description": "Shops"
          }
        ]
    }
      """


  Scenario: Search everything with admin role
    Given I use DB fixture "business"
    Given I use DB fixture "suggested-app"
    And I get file "features/fixtures/json/elastic-blogs-list.json" content and remember as "elasticBlogsListJson"
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "spotlight",
          {}
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    When I send a GET request to "/api/admin/spotlight/search?query=products"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "suggestedApps": [
          {
            "_id": "fffb4f50-9043-4ebc-b8be-fec5d1adf772",
            "title": "Products",
            "description": "Products"
          }
        ]
    }
      """
