Feature: Get application products
  Background:
    And I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "folderId" following value:
      """
      "ffffffff-ffff-ffff-ffff-fffffffffff1"
      """
    And I remember as "defaultFolderId" following value:
      """
      "ffffffff-ffff-ffff-ffff-fffffffffff0"
      """
    And I remember as "applicationId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I remember as "payeverMarketFolderId" following value:
      """
      "32006f8d-46cb-44c7-8a72-9709b0c77c0c"
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "products",
          { }
        ],
        "result": {
          "body": {
            "hits": {
              "hits": []
            }
          }
        }
      }
      """
    And I mock Elasticsearch method "count" with:
      """
      {
        "arguments": [
          "products",
          { }
        ],
        "result": {
          "body": {
            "count": 0
          }
        }
      }
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

  Scenario: Get default folder documents
    Given I use DB fixture "folder/app"
    When I send a GET request to "/api/folders/product/default"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "isHeadline": false,
        "isProtected": true,
        "_id": "{{defaultFolderId}}",
        "name": "All",
        "position": 1,
        "scope": "default"
      }
    ]
    """

  Scenario: Get dropshipping folder documents
    Given I use DB fixture "folder/app"
    When I send a GET request to "/api/folders/business/{{businessId}}/product/dropshipping"
    Then print last response
    And the response status code should be 200

  Scenario: Get imported folder documents
    Given I use DB fixture "folder/app"
    When I send a GET request to "/api/folders/business/{{businessId}}/product/imported"
    Then print last response
    And the response status code should be 200
