Feature: Business shipping boxes
  Background:
    Given I remember as "businessId" following value:
      """
      "531a43cc-e191-46a4-9d42-fd6a9cc59fb9"
      """
    Given I remember as "settingId" following value:
      """
      "f59850e6-a027-4338-b9ba-979e07037023"
      """
    Given I remember as "originId" following value:
      """
      "0acf9a70-db1d-4af9-8be3-4d97d671cf14"
      """
    Given I remember as "orderId" following value:
      """
      "3263d46c-755d-4fe6-b02e-ede4d63748b4"
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
                "acls": [
                  {
                    "microservice": "shipping",
                    "read": true,
                    "create": true,
                    "update": true,
                    "delete": true
                  }
                ]
              }
            ]
          }
        ]
      }
      """

  Scenario: Get business shipping order widgetData
    Given I use DB fixture "shipping-orders/processed/processed"
    When I send a GET request to "/api/business/{{businessId}}/shipping-orders/widget-data"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "cancelled": 0,
          "return": 0,
          "shipped": 1
        }
      """

  Scenario: Get business shipping order
    Given I use DB fixture "shipping-orders/processed/processed"
    When I send a GET request to "/api/business/{{businessId}}/shipping-orders"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [
            {
              "_id": "*",
              "businessId": "531a43cc-e191-46a4-9d42-fd6a9cc59fb9",
              "businessName": "*",
              "transactionId": "ad738281-f9f0-4db7-a4f6-670b0dff5327",
              "shippingOrigin": "*",
              "trackingId": "adhakjfhdskf",
              "shippingItems": [],
              "shippingBoxes": [
                {
                  "isDefault": false
                }
              ],
              "billingAddress": {
                "_id": "*"
              },
              "shippingAddress": {
                "_id": "*"
              },
              "status": "Processed",
              "shippingMethod": {
                "_id": "*",
                "businessId": "531a43cc-e191-46a4-9d42-fd6a9cc59fb9",
                "integration": "*",
                "integrationRule": "*"
              },
              "shippingHistory": []
            }
          ]
      """

  Scenario: Get business shipping order list
    Given I use DB fixture "shipping-orders/processed/processed"
    When I send a GET request to "/api/business/{{businessId}}/shipping-orders/list"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "list": [
            {
              "_id": "*",
              "businessId": "531a43cc-e191-46a4-9d42-fd6a9cc59fb9",
              "businessName": "*",
              "transactionId": "ad738281-f9f0-4db7-a4f6-670b0dff5327",
              "shippingOrigin": "*",
              "trackingId": "adhakjfhdskf",
              "shippingItems": [],
              "shippingBoxes": [
                {
                  "isDefault": false
                }
              ],
              "billingAddress": {
                "_id": "*"
              },
              "shippingAddress": {
                "_id": "*"
              },
              "status": "Processed",
              "shippingMethod": {
                "_id": "*",
                "businessId": "531a43cc-e191-46a4-9d42-fd6a9cc59fb9",
                "integration": "*",
                "integrationRule": "*"
              },
              "shippingHistory": []
            }
          ]
        }
      """

  Scenario: Get business shipping order slips
    Given I use DB fixture "shipping-orders/processed/processed"
    When I send a GET request to "/api/business/{{businessId}}/shipping-orders/slips"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [
           {
             "billingAddress": {
               "_id": "*"
             },
             "businessName": "*",
             "legalText": "*",
             "products": [],
             "to": {
               "_id": "*"
             }
           }
         ]
      """

  Scenario: update business shipping order
    Given I use DB fixture "shipping-orders/processed/processed"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "shipping-orders",
          {
            "_id": "{{orderId}}",
            "trackingId":  "test"
          }
         ],
        "result": {}
      }
      """
    When I send a PUT request to "/api/business/{{businessId}}/shipping-orders/{{orderId}}" with json:
      """
      {
        "trackingId":  "test"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "trackingId":  "test"
      }
      """

  Scenario: delete business shipping order
    Given I use DB fixture "shipping-orders/processed/processed"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "shipping-orders",
          {
            "_id": "{{orderId}}"
          }
         ],
        "result": {}
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
           "method": "post",
           "url": "http://shipping-third-party.devpayever.com/api/business/{{businessId}}/integration/undefined/action/delete-order",
           "body": "{\"shipmentNumber\":\"false\"}",
           "headers": {
             "Accept": "application/json, text/plain, */*",
             "Content-Type": "application/json;charset=utf-8",
             "authorization": "*"
           }
         },
        "response": {
          "status": 200,
          "body": "{\"status\": true, \"shipmentNumber\": \"123\", \"trackingUrl\": \"https:\/\/tracking.url\/123\", \"label\": \"https:\/\/label.url\/123\"}"
        }
      }
      """
    When I send a DELETE request to "/api/business/{{businessId}}/shipping-orders/{{orderId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
           "_id": "*",
           "businessId": "*",
           "businessName": "*",
           "legalText": "*",
           "shipmentNumber": "false",
           "trackingId": "adhakjfhdskf"
      }
      """

  Scenario: process business shipping order
    Given I use DB fixture "shipping-orders/not-processed/custom-method-selected"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "shipping-orders",
          {
            "_id": "{{orderId}}"
          }
         ],
        "result": {}
      }
      """
    When I send a POST request to "/api/business/{{businessId}}/shipping-orders/{{orderId}}" with json:
    """
    {
      "transactionId":  "test",
      "businessName":  "name",
      "legalText": "text",
      "billingAddress": {
          "city": "city_9",
          "countryCode": "CO",
          "name": "Name_9",
          "phone": "Phone-9",
          "stateProvinceCode": "Province_9",
          "streetName": "Street name - 9",
          "streetNumber": "9",
          "zipCode": "11111"
      }
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "_id": "*",
        "businessId": "*",
        "businessName": "name",
        "transactionId": "*",
        "legalText": "text"
      }
      """

  Scenario: get tracking info
    Given I use DB fixture "shipping-orders/processed/processed"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "shipping-orders",
          {
            "_id": "{{orderId}}"
          }
         ],
        "result": {}
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
           "method": "post",
           "url": "http://shipping-third-party.devpayever.com/api/business/{{businessId}}/integration/*/action/track-shipment",
           "body": "{\"trackingNumber\":\"*\"}",
           "headers": {
             "Accept": "application/json, text/plain, */*",
             "Content-Type": "application/json;charset=utf-8",
             "authorization": "*"
           }
         },
        "response": {
          "status": 200,
          "body": "{\"status\": \"ok\", \"pieceCode\": \"123\", \"shortStatus\": \"ok\"}"
        }
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/shipping-orders/{{orderId}}/tracking"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
           "status": "ok",
           "pieceCode": "123",
           "shortStatus": "ok"
      }
      """
