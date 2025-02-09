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
    Given I remember as "channelSetWithFakeBusinessId" following value:
      """
      "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c1"
      """
    Given I remember as "channelSetWithNoDefaultOrigin" following value:
      """
      "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8cw"
      """
    Given I remember as "channelSetWithCustomIntegration" following value:
      """
      "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8cl"
      """
    Given I remember as "channelSetWithoutZones" following value:
      """
      "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8cm"
      """
    Given I remember as "channelSetWithCustomIntegrationWithoutRules" following value:
      """
      "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8cz"
      """
    Given I remember as "shippingOrderId" following value:
      """
      "3263d46c-755d-4fe6-b02e-ede4d63748b4"
      """
    Given I remember as "integrationSubscriptionId" following value:
      """
      "0e62e953-0cd0-4a27-88c0-ea9b5c0950c1"
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

  Scenario: Get rates
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
    When I send a POST request to "/api/channel-set/{{channelSetId}}/shipping/methods" with json:
      """
      {
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
      """
    Then print last response
    And the response status code should be 201

  Scenario: Get rates with fake business id
    Given I use DB fixture "shipping-methods/get-rates"
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
    When I send a POST request to "/api/channel-set/{{channelSetWithFakeBusinessId}}/shipping/methods" with json:
      """
      {
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
      """
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {"message": "shipping.errors.business.notfound"}
      """

  Scenario: Get rates with business with default origin
    Given I use DB fixture "shipping-methods/get-rates"
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
    When I send a POST request to "/api/channel-set/{{channelSetWithNoDefaultOrigin}}/shipping/methods" with json:
      """
      {
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
      """
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {"message": "shipping.errors.business.defaultorigin.notfound"}
      """
  Scenario: Get rates with business with custom integration and without zones
    Given I use DB fixture "shipping-methods/get-rates"
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
    When I send a POST request to "/api/channel-set/{{channelSetWithCustomIntegration}}/shipping/methods" with json:
      """
      {
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
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {"message": "shipping.errors.country.notsupported"}
      """

  Scenario: Get rates without shipping items
    Given I use DB fixture "shipping-methods/get-rates"
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
    When I send a POST request to "/api/channel-set/{{channelSetId}}/shipping/methods" with json:
      """
      {
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
        "shippingItems": []
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {"message": "shipping.errors.items.empty"}
      """

  Scenario: Get rates with business without zones
    Given I use DB fixture "shipping-methods/get-rates"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "shipping-orders",
          {
           
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
           "url": "http://shipping-third-party.devpayever.com/api/business/568192aa-36ea-48d8-bc0a-8660029e6f7m/shipping/test/rates",
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
    When I send a POST request to "/api/channel-set/{{channelSetWithoutZones}}/shipping/methods" with json:
      """
      {
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
      """
    Then print last response
    And the response status code should be 201
    
  Scenario: Get rates with business without rules
    Given I use DB fixture "shipping-methods/get-rates"
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
    When I send a POST request to "/api/channel-set/{{channelSetWithCustomIntegrationWithoutRules}}/shipping/methods" with json:
      """
      {
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
      """
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {"message": "shipping.errors.nomatchedrules"}
      """

  Scenario: Select shipping method
    Given I use DB fixture "shipping-methods/select-method"
    When I send a POST request to "/api/channel-set/{{channelSetId}}/shipping/select-method" with json:
      """
      {
        "shippingOrderId": "{{shippingOrderId}}",
        "integrationSubscriptionId": "{{integrationSubscriptionId}}"
      }
      """
    Then print last response
    And the response status code should be 201

  Scenario: Get rates
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
    When I send a POST request to "/api/channel-set/shipping/methods?channelSet={{channelSetId}}" with json:
      """
      {
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
      """
    Then print last response
    And the response status code should be 201
