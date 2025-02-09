Feature: Keep track inventory for different locations
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "sku1" following value:
      """
      "testSku1"
      """
    Given I remember as "sku2" following value:
      """
      "testSku2"
      """

    Given I remember as "inventoryId1" following value:
      """
      "iiiiiiii-iiii-iiii-iiii-iiiiiiiiiii1"
      """
    Given I remember as "inventoryId2" following value:
      """
      "iiiiiiii-iiii-iiii-iiii-iiiiiiiiiii2"
      """

    Given I remember as "locationId1" following value:
      """
      "llllllll-llll-llll-llll-lllllllllll1"
      """
    Given I remember as "locationId2" following value:
      """
      "llllllll-llll-llll-llll-lllllllllll2"
      """
    Given I remember as "locationId3" following value:
      """
      "llllllll-llll-llll-llll-lllllllllll3"
      """
    
    Given I remember as "locationId4" following value:
      """
      "llllllll-llll-llll-llll-lllllllllll4"
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
    Given I use DB fixture "inventory/inventory-location"

  Scenario: Validate add/remove inventory request
    
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{sku1}}/add" with json:
      """
      {
        "quantity": 99,
        "inventoryLocations":[
          {
            "locationId":"{{locationId}}",
            "stock": -10
          }
        ]
      }
      """
    Then print last response
    And the response status code should be 400
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{sku1}}/add" with json:
      """
      {
        "quantity": 99,
        "inventoryLocations":[
          {
            "locationId":"{{locationId}}",
            "stock": 10
          }
        ]
      }
      """
    Then print last response
    And the response status code should be 400

  Scenario: Add inventory to multiple locations
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{sku1}}/add" with json:
        """
        {
          "quantity": 6,
          "inventoryLocations":[
            {
              "locationId":"{{locationId1}}",
              "stock": 1
            },
            {
              "locationId":"{{locationId2}}",
              "stock": 2
            },
            {
              "locationId":"{{locationId3}}",
              "stock": 3
            }
          ]
        }
        """
    Then print last response
    Then the response should contain json:
      """
      {
        "_id": "{{inventoryId1}}",
        "stock": 106,
        "sku": "{{sku1}}",
        "businessId": "{{businessId}}"
      }
      """
    Then the response status code should be 200

    When I send a GET request to "/api/business/{{businessId}}/inventory/{{inventoryId1}}/inventory-locations"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      [
           {
             
             "locationId": "{{locationId1}}",
             "inventoryId": "{{inventoryId1}}",
             "stock": 1
           },
           {
             
             "locationId": "{{locationId2}}",
             "inventoryId": "{{inventoryId1}}",
             "stock": 2
           },
           {
             
             "locationId": "{{locationId3}}",
             "inventoryId": "{{inventoryId1}}",
             "stock": 3
           }
         ]
      """
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{sku2}}/add" with json:
        """
        {
          "quantity": 60,
          "inventoryLocations":[
            {
              "locationId":"{{locationId1}}",
              "stock": 60
            }
          ]
        }
        """
    Then print last response
    Then the response should contain json:
      """
      {
        "_id": "{{inventoryId2}}",
        "stock": 160,
        "sku": "{{sku2}}",
        "businessId": "{{businessId}}"
      }
      """
    Then the response status code should be 200

    When I send a GET request to "/api/business/{{businessId}}/inventory/{{inventoryId2}}/inventory-locations"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      [
           {
             
             "locationId": "{{locationId1}}",
             "inventoryId": "{{inventoryId2}}",
             "stock": 60
           }
         ]
      """

  Scenario: Remove inventory from multiple locations
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{sku1}}/subtract" with json:
        """
        {
          "quantity": 6,
          "inventoryLocations":[
            {
              "locationId":"{{locationId1}}",
              "stock": 1
            },
            {
              "locationId":"{{locationId2}}",
              "stock": 2
            },
            {
              "locationId":"{{locationId3}}",
              "stock": 3
            }
          ]
        }
        """
    Then print last response
    Then the response should contain json:
      """
      {
        "_id": "{{inventoryId1}}",
        "stock": 94,
        "sku": "{{sku1}}",
        "businessId": "{{businessId}}"
      }
      """
    Then the response status code should be 200

    When I send a GET request to "/api/business/{{businessId}}/inventory/{{inventoryId1}}/inventory-locations"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      [
           {
             
             "locationId": "{{locationId1}}",
             "inventoryId": "{{inventoryId1}}",
             "stock": -1
           },
           {
             
             "locationId": "{{locationId2}}",
             "inventoryId": "{{inventoryId1}}",
             "stock": -2
           },
           {
             
             "locationId": "{{locationId3}}",
             "inventoryId": "{{inventoryId1}}",
             "stock": -3
           }
         ]
      """
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{sku2}}/subtract" with json:
        """
        {
          "quantity": 60,
          "inventoryLocations":[
            {
              "locationId":"{{locationId1}}",
              "stock": 60
            }
          ]
        }
        """
    Then print last response
    Then the response should contain json:
      """
      {
        "_id": "{{inventoryId2}}",
        "stock": 40,
        "sku": "{{sku2}}",
        "businessId": "{{businessId}}"
      }
      """
    Then the response status code should be 200

    When I send a GET request to "/api/business/{{businessId}}/inventory/{{inventoryId2}}/inventory-locations"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      [
           {
             
             "locationId": "{{locationId1}}",
             "inventoryId": "{{inventoryId2}}",
             "stock": -60
           }
         ]
      """

  Scenario: Transfer stock from one location to another(same location for multiple sku)
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{sku1}}/transfer" with json:
        """
        {
          "quantity": 6,
          "fromLocationId": "{{locationId1}}",
          "toLocationId": "{{locationId2}}"
        }
        """
    Then print last response
    Then the response should contain json:
      """
      [
        {
          "inventoryId": "{{inventoryId1}}",
          "locationId": "{{locationId1}}",
          "stock": -6
        },
        {
          "inventoryId": "{{inventoryId1}}",
          "locationId": "{{locationId2}}",
          "stock": 6
        }
      ]
      """

    When I send a GET request to "/api/business/{{businessId}}/inventory/{{inventoryId1}}/inventory-locations"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      [
           {
             
             "locationId": "{{locationId1}}",
             "inventoryId": "{{inventoryId1}}",
             "stock": -6
           },
           {
             
             "locationId": "{{locationId2}}",
             "inventoryId": "{{inventoryId1}}",
             "stock": 6
           }
         ]
      """

    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{sku2}}/transfer" with json:
        """
        {
          "quantity": 6,
          "fromLocationId": "{{locationId1}}",
          "toLocationId": "{{locationId2}}"
        }
        """
    Then print last response
    Then the response should contain json:
      """
      [
        {
          "inventoryId": "{{inventoryId2}}",
          "locationId": "{{locationId1}}",
          "stock": -6
        },
        {
          "inventoryId": "{{inventoryId2}}",
          "locationId": "{{locationId2}}",
          "stock": 6
        }
      ]
      """





