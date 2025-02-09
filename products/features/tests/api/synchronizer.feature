Feature: Synchronizer API
  Background:
    Given I remember as "businessId" following value:
    """
      "21f4947e-929a-11e9-bb05-7200004fe4c0"
    """
    And I mock an axios request with parameters:
    """
      {
        "request": {
          "method": "post",
          "url": "https://backend-inventory.test.devpayever.com/api/business/21f4947e-929a-11e9-bb05-7200004fe4c0/inventory/sku/stock"
        },
        "response": {
          "status": 200,
          "body": "{}"
        }
      }
    """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
         ],
        "result": {}
      }
      """

  Scenario: GET /api/synchronizer/:businessUuid
    Given I use DB fixture "api/synchronizer/get-products-by-business-uuid"
    When I send a GET request to "/api/synchronizer/21f4947e-929a-11e9-bb05-7200004fe4c0?limit=10&offset=0"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "info": {
        "pagination": {
          "page": 1,
          "page_count": 1,
          "per_page": 10,
          "item_count": 3
        }
      },
      "items": [
        {
          "uuid": "a482bf57-1aec-4304-8751-4ce5cea603a4"
        },
        {
          "uuid": "e563339f-0b4c-4aef-92e7-203b9761981c"
        },
        {
          "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0"
        }
      ]
    }
    """

  Scenario: GET /api/synchronizer/:businessUuid - check that when no items in db response returns empty list
    When I send a GET request to "/api/synchronizer/21f4947e-929a-11e9-bb05-7200004fe4c0?"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "items": []
    }
    """

  Scenario: GET /api/synchronizer/:businessUuid - check pagination
    Given I use DB fixture "api/synchronizer/get-products-check-pagination"
    When I send a GET request to "/api/synchronizer/21f4947e-929a-11e9-bb05-7200004fe4c0?limit=2&offset=0"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "info": {
        "pagination": {
          "page": 1,
          "page_count": 2,
          "per_page": 2,
          "item_count": 3
        }
      },
      "items": [
        {
          "uuid": "a482bf57-1aec-4304-8751-4ce5cea603a4"
        },
        {
          "uuid": "e563339f-0b4c-4aef-92e7-203b9761981c"
        }
      ]
    }
    """
    When I send a GET request to "/api/synchronizer/21f4947e-929a-11e9-bb05-7200004fe4c0?limit=2&offset=2"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "info": {
        "pagination": {
          "page": 2,
          "page_count": 2,
          "per_page": 2,
          "item_count": 3
        }
      },
      "items": [
        {
          "uuid": "3799bb06-929a-11e9-b5a6-7200004fe4c0"
        }
      ]
    }
    """
