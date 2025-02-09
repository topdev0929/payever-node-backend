Feature: Channel set shipping method
  Background:
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I remember as "channelSetId" following value:
      """
      "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c3"
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

  Scenario: Get shipping method rates
    Given I use DB fixture "shipping-methods/get-rates"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "shipping-orders",
          {
            "businessId": "568192aa-36ea-48d8-bc0a-8660029e6f72"
          }
         ],
        "result": {}
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
           "method": "get",
           "url": "http://shipping-third-party.devpayever.com/api/business/568192aa-36ea-48d8-bc0a-8660029e6f72/shipping/test/rates",
           "headers": {
             "Accept": "application/json, text/plain, */*"
           }
         },
        "response": {
          "status": 200,
          "body": "{\"status\": true, \"shipmentNumber\": \"123\", \"trackingUrl\": \"https:\/\/tracking.url\/123\", \"label\": \"https:\/\/label.url\/123\"}"
        }
      }
      """
    When I send a POST request to "/api/builder/integration/channel-shipping-method" with json:
      """
      {
        "contextId": "{{channelSetId}}",
        "data": {
          "shippingAddress": {
            "city": "city_9",
            "countryCode": "CO",
            "name": "Name_9",
            "phone": "Phone-9",
            "stateProvinceCode": "Province_9",
            "streetName": "Street name - 9",
            "streetNumber": "9",
            "zipCode": "11111"
          },
          "shippingItems": [{
            "uuid": "c81d8797-9805-42b5-a0a4-cdbe13877db9",
            "dimensionUnit": "cm",
            "height": 1,
            "length": 1,
            "name": "Shipped item name",
            "price": 999,
            "quantity": 100,
            "weight": 1,
            "weightUnit": "kg",
            "width": 1
          }]
        }
      }
      """
    Then print last response
    And the response status code should be 201
