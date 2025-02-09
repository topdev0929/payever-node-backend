Feature: Admin collection
  Background: constants
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "admin@payever.de",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """
    Given I remember as "BUSINESS_ID_1" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1"
      """
    Given I remember as "BUSINESS_ID_2" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2"
      """
    Given I remember as "BUSINESS_ID_3" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3"
      """

    Given I remember as "COLLECTION_ID_1" following value:
      """
      "pppppppp-pppp-pppp-pppp-ppppppppppp1"
      """
    Given I remember as "COLLECTION_ID_2" following value:
      """
      "pppppppp-pppp-pppp-pppp-ppppppppppp2"
      """
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "product-collection",
          {}
        ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "product-collection",
          {}
        ],
        "result": {}
      }
      """

  Scenario: Only admin role has access to admin endpoint
    Given I authenticate as a user with the following data:
      """
      {
        "roles": [
          {
            "name": "merchant"
          }
        ]
      }
      """
    When I send a GET request to "/admin/collections"
    Then response status code should be 403

  Scenario: Get all collections
    Given I use DB fixture "admin/admin-collection"
    When I send a GET request to "/admin/collections"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "id": "*",
            "businessId": "{{BUSINESS_ID_1}}"
          },
          {
            "id": "*",
            "businessId": "{{BUSINESS_ID_2}}"
          }
        ]
      }
      """

  Scenario: Get all collections with filter
    Given I use DB fixture "admin/admin-collection"
    When I send a GET request to "/admin/collections?businessIds={{BUSINESS_ID_1}}"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "id": "*",
            "businessId": "{{BUSINESS_ID_1}}"
          }
        ]
      }
      """
    And the response should not contain json:
      """
      {
        "documents": [
          {
            "id": "*",
            "businessId": "{{BUSINESS_ID_2}}"
          }
        ]
      }
      """

  Scenario: Get collection by id
    Given I use DB fixture "admin/admin-collection"
    When I send a GET request to "/admin/collections/{{COLLECTION_ID_1}}"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{COLLECTION_ID_1}}",
        "businessId": "{{BUSINESS_ID_1}}"
      }
      """

  Scenario: Create a collection
    Given I use DB fixture "admin/admin-collection"
    When I send a POST request to "/admin/collections" with json:
      """
      {
        "channelSets": [],
        "slug": "slug",
        "activeSince": "2020-06-09T11:00:35.316Z",
        "name": "Collections test",
        "description": "test ahahah",
        "automaticFillConditions": {
          "strict": false,
          "filters": []
        },
        "image": "359f6962-dc9c-4d55-ab01-c74e80acb1d9-hero-high-viewport@2.jpg",
        "businessId": "{{BUSINESS_ID_3}}"
      }
      """
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "businessId": "{{BUSINESS_ID_3}}",
        "channelSets": [],
        "ancestors": [],
        "slug": "slug",
        "activeSince": "2020-06-09T11:00:35.316Z",
        "name": "Collections test",
        "description": "test ahahah",
        "automaticFillConditions": {
          "strict": false,
          "manualProductsList": [],
          "filters": []
        },
        "image": "359f6962-dc9c-4d55-ab01-c74e80acb1d9-hero-high-viewport@2.jpg",
        "parent": null
      }
      """

    And store a response as "response"
    And model "Collection" with id "{{response._id}}" should contain json:
      """
      {
        "businessId": "{{BUSINESS_ID_3}}",
        "channelSets": [],
        "ancestors": [],
        "slug": "slug",
        "activeSince": "2020-06-09T11:00:35.316Z",
        "name": "Collections test",
        "description": "test ahahah",
        "image": "359f6962-dc9c-4d55-ab01-c74e80acb1d9-hero-high-viewport@2.jpg"
      }
      """

  Scenario: Update a collection
    Given I use DB fixture "admin/admin-collection"
    When I send a PATCH request to "/admin/collections/{{COLLECTION_ID_1}}" with json:
      """
      {
        "channelSets": [],
        "slug": "slug",
        "activeSince": "2020-06-09T11:00:35.316Z",
        "name": "Collections test",
        "description": "test ahahah",
        "automaticFillConditions": {
          "strict": false,
          "filters": []
        },
        "image": "359f6962-dc9c-4d55-ab01-c74e80acb1d9-hero-high-viewport@2.jpg"
      }
      """
    Then print last response
    Then response status code should be 200
    And the response should contain json:
      """
      {
        "businessId": "{{BUSINESS_ID_1}}",
        "channelSets": [],
        "ancestors": [],
        "slug": "slug",
        "activeSince": "2020-06-09T11:00:35.316Z",
        "name": "Collections test",
        "description": "test ahahah",
        "automaticFillConditions": {
          "strict": false,
          "manualProductsList": [],
          "filters": []
        },
        "image": "359f6962-dc9c-4d55-ab01-c74e80acb1d9-hero-high-viewport@2.jpg"
      }
      """

    And store a response as "response"
    And model "Collection" with id "{{response._id}}" should contain json:
      """
      {
        "businessId": "{{BUSINESS_ID_1}}",
        "channelSets": [],
        "ancestors": [],
        "slug": "slug",
        "activeSince": "2020-06-09T11:00:35.316Z",
        "name": "Collections test",
        "description": "test ahahah",
        "automaticFillConditions": {
          "strict": false,
          "manualProductsList": [],
          "filters": []
        },
        "image": "359f6962-dc9c-4d55-ab01-c74e80acb1d9-hero-high-viewport@2.jpg"
      }
      """

  Scenario: Delete collection
    Given I use DB fixture "admin/admin-collection"
    When I send a DELETE request to "/admin/collections/{{COLLECTION_ID_1}}"
    Then print last response
    And the response status code should be 200
    And model "Collection" with id "{{COLLECTION_ID_1}}" should not contain json:
      """
      {
        "_id": "{{COLLECTION_ID_1}}"
      }
      """

