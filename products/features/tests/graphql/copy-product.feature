Feature: Create product
  Background:
    Given I remember as "folderId" following value:
    """
      "ffffffff-ffff-ffff-ffff-fffffffffff1"
    """
    Given I remember as "businessId" following value:
    """
      "a560407c-b98d-40eb-8565-77c0d7ae23ea"
    """
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}]
      }]
    }
    """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """

  Scenario: Copy Product
    And I mock Elasticsearch method "search" with:
      """
      { "arguments": [ "products-folder" ] }
      """
    Given I use DB fixture "graphql/copy-products/products"
    When I send a POST request to "/products" with json:
    """
    {
      "query": "mutation copyProducts(\n  $businessId: String!\n  $productIds: [String]!\n  $targetCollectionId: String\n) {\n  copyProducts(\n    businessId: $businessId\n    productIds: $productIds\n    targetCollectionId: $targetCollectionId\n  ) {\n    products {\n      id\n      title\n      sku\n    }\n    info {\n      pagination {\n        page\n        page_count\n        per_page\n        item_count\n      }\n    }\n  }\n}\n",
      "variables": {
        "businessId": "21f4947e-929a-11e9-bb05-7200004fe4c0",
        "productIds": [
        "3799bb06-929a-11e9-b5a6-7200004fe4c0",
          "4e58fe33-97d3-41d0-a789-cf43a11e469f"
        ]
      },
      "operationName": "copyProducts"
    }
    """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "data": {
        "copyProducts": {
          "products": [
            {
              "id": "*",
              "title": "*-copy-1",
              "sku": "*-copy-1"
            },
            {
              "id": "*",
              "title": "*-copy-1",
              "sku": "*-copy-1"
            }
          ],
          "info": {
            "pagination": {
              "page": 1,
              "page_count": 1,
              "per_page": 2,
              "item_count": 2
            }
          }
        }
      }
    }
    """

  Scenario: Copy Product from other business
    Given I use DB fixture "graphql/copy-products/products"
    When I send a POST request to "/products" with json:
    """
    {
      "query": "mutation copyProducts(\n  $businessId: String!\n  $productIds: [String]!\n  $targetCollectionId: String\n) {\n  copyProducts(\n    businessId: $businessId\n    productIds: $productIds\n    targetCollectionId: $targetCollectionId\n  ) {\n    products {\n      id\n      title\n      sku\n    }\n    info {\n      pagination {\n        page\n        page_count\n        per_page\n        item_count\n      }\n    }\n  }\n}\n",
      "variables": {
        "businessId": "21f4947e-929a-11e9-bb05-7200004fe4c0",
        "productIds": [
          "e563339f-0b4c-4aef-92e7-203b9761981c",
          "a482bf57-1aec-4304-8751-4ce5cea603a4"
        ]
      },
      "operationName": "copyProducts"
    }
    """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "data": {
        "copyProducts": {
          "products": [],
          "info": {
            "pagination": {
              "page": 1,
              "page_count": 1,
              "per_page": 0,
              "item_count": 0
            }
          }
        }
      }
    }
    """

  Scenario: Copy Product from with collection
    And I mock Elasticsearch method "search" with:
      """
      { "arguments": [ "products-folder" ] }
      """
    Given I use DB fixture "graphql/copy-products/collection"
    Given I use DB fixture "graphql/copy-products/products"
    When I send a POST request to "/products" with json:
    """
    {
      "query": "mutation copyProducts(\n  $businessId: String!\n  $productIds: [String]!\n  $targetCollectionId: String\n) {\n  copyProducts(\n    businessId: $businessId\n    productIds: $productIds\n    targetCollectionId: $targetCollectionId\n  ) {\n    products {\n      id\n      title\n      sku\n      collections {\n        _id\n      }\n    }\n    info {\n      pagination {\n        page\n        page_count\n        per_page\n        item_count\n      }\n    }\n  }\n}\n",
      "variables": {
        "businessId": "21f4947e-929a-11e9-bb05-7200004fe4c0",
        "productIds": [
          "3799bb06-929a-11e9-b5a6-7200004fe4c0",
          "4e58fe33-97d3-41d0-a789-cf43a11e469f"
        ],
        "targetCollectionId": "74db030f-3a79-4b6d-9a2e-10f7588b93f1"
      },
      "operationName": "copyProducts"
    }
    """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "data": {
        "copyProducts": {
          "products": [
            {
              "id": "*",
              "title": "*-copy-1",
              "sku": "*-copy-1",
              "collections": [
                {
                  "_id": "74db030f-3a79-4b6d-9a2e-10f7588b93f1"
                }
              ]
            },
            {
              "id": "*",
              "title": "*-copy-1",
              "sku": "*-copy-1",
              "collections": [
                {
                  "_id": "74db030f-3a79-4b6d-9a2e-10f7588b93f1"
                }
              ]
            }
          ],
          "info": {
            "pagination": {
              "page": 1,
              "page_count": 1,
              "per_page": 2,
              "item_count": 2
            }
          }
        }
      }
    }
    """

  Scenario: Copy Product from with collection form other business
    And I mock Elasticsearch method "search" with:
      """
      { "arguments": [ "products-folder" ] }
      """
    Given I use DB fixture "graphql/copy-products/collection"
    Given I use DB fixture "graphql/copy-products/products"
    When I send a POST request to "/products" with json:
    """
    {
      "query": "mutation copyProducts(\n  $businessId: String!\n  $productIds: [String]!\n  $targetCollectionId: String\n) {\n  copyProducts(\n    businessId: $businessId\n    productIds: $productIds\n    targetCollectionId: $targetCollectionId\n  ) {\n    products {\n      id\n      title\n      sku\n      collections {\n        _id\n      }\n    }\n    info {\n      pagination {\n        page\n        page_count\n        per_page\n        item_count\n      }\n    }\n  }\n}\n",
      "variables": {
        "businessId": "21f4947e-929a-11e9-bb05-7200004fe4c0",
        "productIds": [
          "3799bb06-929a-11e9-b5a6-7200004fe4c0",
          "4e58fe33-97d3-41d0-a789-cf43a11e469f"
        ],
        "targetCollectionId": "db785216-fc2e-4fc6-8aa6-77bd1feead62"
      },
      "operationName": "copyProducts"
    }
    """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "data": {
        "copyProducts": {
          "products": [
            {
              "id": "*",
              "title": "*-copy-1",
              "sku": "*-copy-1",
              "collections": []
            },
            {
              "id": "*",
              "title": "*-copy-1",
              "sku": "*-copy-1",
              "collections": []
            }
          ],
          "info": {
            "pagination": {
              "page": 1,
              "page_count": 1,
              "per_page": 2,
              "item_count": 2
            }
          }
        }
      }
    }
    """

  Scenario: Copy Product from with folderId
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": [ "products-folder" ] }
      """
    Given I use DB fixture "folder/app"
    Given I use DB fixture "graphql/copy-products/products"
    When I send a POST request to "/products" with json:
    """
    {
      "query": "mutation copyProducts(\n  $businessId: String!\n  $productIds: [String]!\n  $targetFolderId: String\n) {\n  copyProducts(\n    businessId: $businessId\n    productIds: $productIds\n    targetFolderId: $targetFolderId\n  ) {\n    products {\n      id\n      title\n      sku\n      collections {\n        _id\n      }\n    }\n    info {\n      pagination {\n        page\n        page_count\n        per_page\n        item_count\n      }\n    }\n  }\n}\n",
      "variables": {
        "businessId": "21f4947e-929a-11e9-bb05-7200004fe4c0",
        "productIds": [
          "3799bb06-929a-11e9-b5a6-7200004fe4c0",
          "4e58fe33-97d3-41d0-a789-cf43a11e469f"
        ],
        "targetFolderId": "{{folderId}}"
      },
      "operationName": "copyProducts"
    }
    """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "data": {
        "copyProducts": {
          "products": [
            {
              "id": "*",
              "title": "*-copy-1",
              "sku": "*-copy-1"
            },
            {
              "id": "*",
              "title": "*-copy-1",
              "sku": "*-copy-1"
            }
          ],
          "info": {
            "pagination": {
              "page": 1,
              "page_count": 1,
              "per_page": 2,
              "item_count": 2
            }
          }
        }
      }
    }
    """
