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

  Scenario: Search everything for business
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
    When I send a GET request to "/api/business/{{businessId}}/spotlight/search?query=pos"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "result": [],
        "suggestedApps": [
          {
            "_id": "1e761aad-4369-4877-afe8-2376bd3eb21a",
            "description": "Pos Point of Sale",
            "title": "Point of Sale"
          }
        ]
    }
      """
