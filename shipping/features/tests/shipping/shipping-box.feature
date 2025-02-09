Feature: Business shipping boxes
  Background:
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I remember as "boxId" following value:
      """
      "f561829c-a9a2-4eb8-b3fe-9d18a7c4a622"
      """
    And I authenticate as a user with the following data:
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
       Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "shipping-box-folder",
          { }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "shipping-box-folder",
          { }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "shipping-box-folder",
          { }
         ],
        "result": {}
      }
      """

  Scenario: Get default shipping box
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/business/{{businessId}}/shipping-box/default-boxes"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [{
          "isDefault": true,
          "_id": "f561829c-a9a2-4eb8-b3fe-9d18a7c4a622",
          "dimensionUnit": "cm",
          "weightUnit": "kg"
        }]
      """

  Scenario: Get business shipping box
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/business/{{businessId}}/shipping-box"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [{
          "isDefault": true,
          "_id": "f561829c-a9a2-4eb8-b3fe-9d18a7c4a622",
          "dimensionUnit": "cm",
          "weightUnit": "kg"
        }]
      """

  Scenario: Get business shipping box by carrier
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/business/{{businessId}}/shipping-box/carrier-boxes"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [
           {
             "integration": {
               "_id": "*",
               "name": "custom",
               "category": "*",
               "displayOptions": {
                 "_id": "*"
               }
             },
             "boxes": [
               {
                 "isDefault": true,
                 "_id": "*",
                 "dimensionUnit": "cm",
                 "weightUnit": "kg",
                 "integration": "*"
               }
             ]
           }
         ]
      """

  Scenario: Create business shipping box
    Given I use DB fixture "shipping/shipping"
    When I send a POST request to "/api/business/{{businessId}}/shipping-box" with json:
      """
        {
          "isDefault": false,
          "_id": "test",
          "dimensionUnit": "cm",
          "weightUnit": "kg"
        }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
        {
          "isDefault": false,
          "_id": "test",
          "dimensionUnit": "cm",
          "weightUnit": "kg"
        }
      """

  Scenario: Create multi business shipping box
    Given I use DB fixture "shipping/shipping"
    When I send a POST request to "/api/business/{{businessId}}/shipping-box/multi" with json:
      """
        [{
          "isDefault": false,
          "_id": "test",
          "dimensionUnit": "cm",
          "weightUnit": "kg"
        }]
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
        [
           {
             "isDefault": false,
             "_id": "test",
             "dimensionUnit": "cm",
             "weightUnit": "kg"
           }
         ]
      """

  Scenario: Get business shipping box by id
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/business/{{businessId}}/shipping-box/{{boxId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "isDefault": true,
          "_id": "f561829c-a9a2-4eb8-b3fe-9d18a7c4a622",
          "dimensionUnit": "cm",
          "weightUnit": "kg"
        }
      """

  Scenario: Update business shipping box by id
    Given I use DB fixture "shipping/shipping"
    When I send a PUT request to "/api/business/{{businessId}}/shipping-box/{{boxId}}" with json:
      """
        {
          "isDefault": false
        }
      """
    Then print last response
    And the response status code should be 200

  Scenario: Delete business shipping box by id
    Given I use DB fixture "shipping/shipping"
    When I send a DELETE request to "/api/business/{{businessId}}/shipping-box/{{boxId}}"
    Then print last response
    And the response status code should be 200
