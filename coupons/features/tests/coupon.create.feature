Feature: Create coupon
  Background:
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "merchant@example.com",
        "roles": [
          {
            "name": "user",
            "permissions": []
          },
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "376f8103-0e09-449a-8538-9384f2f1b992",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "coupons-folder"
        ],
        "result": []
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "coupons-folder"
        ],
        "result": []
      }
      """

  Scenario: Create fixed price coupon without restictions
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons" with json:
      """
      {
        "endDate": "2021-06-04T19:00:00.000Z",
        "description": "a new description",
        "name": "nameValue",
        "startDate": "2021-05-04T19:00:00.000Z",
        "limits": {
          "limitOneUsePerCustomer": true,
          "limitUsage": true,
          "limitUsageAmount": 200
        },
        "channelSets": [],
        "type": {
          "type": "FIXED_AMOUNT",
          "discountValue": 5,
          "appliesTo": "ALL_PRODUCTS",
          "minimumRequirements": "NONE"
        },
        "status": "INACTIVE",
        "customerEligibility": "EVERYONE"
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "_id": "*",
        "status": "INACTIVE",
        "code": "*"
      }
      """
    And the response status code should be 200
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "coupons.event.code.created",
          "payload": {
            "coupon": {
              "businessId": "376f8103-0e09-449a-8538-9384f2f1b992"
            }
          }
        }
      ]
      """

  Scenario: Create fixed price coupon with restrictions
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"

    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons" with json:
      """
      {
        "endDate": "2021-06-04T19:00:00.000Z",
        "description": "a new description",
        "name": "nameValue",
        "startDate": "2021-05-04T19:00:00.000Z",
        "limits": {
          "limitOneUsePerCustomer": true,
          "limitUsage": true,
          "limitUsageAmount": 200
        },
        "channelSets": [],
        "type": {
          "type": "FIXED_AMOUNT",
          "discountValue": 5,
          "appliesTo": "SPECIFIC_PRODUCTS",
          "appliesToProducts": [
            "376f8103-0e09-449a-8548-a384f2f1b013"
          ],
          "minimumRequirements": "MINIMUM_QUANTITY_OF_ITEMS",
          "minimumRequirementsQuantityOfItems": 5
        },
        "status": "INACTIVE",
        "customerEligibility": "SPECIFIC_CUSTOMERS",
        "customerEligibilitySpecificCustomers": [
          "test@gamil.com"
        ],
        "customerEligibilityCustomerGroups": []
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "status": "*",
        "code": "*"
      }
      """
    And the response status code should be 200
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "coupons.event.code.created",
          "payload": {
            "coupon": {
              "businessId": "376f8103-0e09-449a-8538-9384f2f1b992"
            }
          }
        }
      ]
      """

  Scenario: Create BuyXGetY price coupon
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"

    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons" with json:
      """
      {
        "endDate": "2021-06-04T19:00:00.000Z",
        "description": "a new description",
        "name": "nameValue",
        "startDate": "2021-05-04T19:00:00.000Z",
        "limits": {
          "limitOneUsePerCustomer": true,
          "limitUsage": true,
          "limitUsageAmount": 200
        },
        "channelSets": [],
        "type": {
          "type": "BUY_X_GET_Y",
          "buyRequirementType": "MINIMUM_QUANTITY_OF_ITEMS",
          "buyQuantity": 4,
          "buyType": "SPECIFIC_PRODUCTS",
          "buyProducts": [
            "376f8103-0e09-449a-8548-a384f2f1b014"
          ],
          "buyCategories": [],
          "getType": "SPECIFIC_PRODUCTS",
          "getQuantity": 2,
          "getCategories": [],
          "getProducts": [
            "376f8103-0e09-449a-8548-a384f2f1b014"
          ],
          "getDiscountType": "FREE",
          "getDiscountValue": 15,
          "maxUsesPerOrder": false,
          "maxUsesPerOrderValue": 0
        },
        "status": "INACTIVE",
        "customerEligibility": "SPECIFIC_CUSTOMERS",
        "customerEligibilitySpecificCustomers": [
          "376f8103-0e09-449a-8538-9384f2f1b912"
        ],
        "customerEligibilityCustomerGroups": []
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "_id": "*",
        "businessId": "376f8103-0e09-449a-8538-9384f2f1b992",
        "type": {
          "type": "BUY_X_GET_Y"
        }
      }
      """
    And the response status code should be 200
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "coupons.event.code.created",
          "payload": {
            "coupon": {
              "businessId": "376f8103-0e09-449a-8538-9384f2f1b992",
              "type": {
                "type": "BUY_X_GET_Y"
              }
            }
          }
        }
      ]
      """


  Scenario: The user shouldn't be able to create a coupon with an end date after the start date
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"

    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons" with json:
      """
      {
        "endDate": "2021-06-04T19:00:00.000Z",
        "description": "a new description",
        "name": "nameValue",
        "startDate": "2021-07-04T19:00:00.000Z",
        "limits": {
          "limitOneUsePerCustomer": true,
          "limitUsage": true,
          "limitUsageAmount": 200
        },
        "channelSets": [],
        "type": {
          "type": "BUY_X_GET_Y",
          "buyRequirementType": "MINIMUM_QUANTITY_OF_ITEMS",
          "buyQuantity": 4,
          "buyType": "SPECIFIC_PRODUCTS",
          "buyProducts": [
            "376f8103-0e09-449a-8548-a384f2f1b014"
          ],
          "buyCategories": [],
          "getType": "SPECIFIC_PRODUCTS",
          "getQuantity": 2,
          "getCategories": [],
          "getProducts": [
            "376f8103-0e09-449a-8548-a384f2f1b014"
          ],
          "getDiscountType": "FREE",
          "getDiscountValue": 15,
          "maxUsesPerOrder": false,
          "maxUsesPerOrderValue": 0
        },
        "status": "INACTIVE",
        "customerEligibility": "SPECIFIC_CUSTOMERS",
        "customerEligibilitySpecificCustomers": [
          "376f8103-0e09-449a-8538-9384f2f1b912"
        ],
        "customerEligibilityCustomerGroups": []
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "message": [
          "The end date must be after the start date",
          "The start date must be before the end date"
        ]
      }
      """
  Scenario: The user shouldn't be able to create a coupon with the same end and start date and end time after the start time
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"

    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons" with json:
      """
      {
        "endDate": "2021-06-04T16:00:00.000Z",
        "description": "a new description",
        "name": "nameValue",
        "startDate": "2021-06-04T19:00:00.000Z",
        "limits": {
          "limitOneUsePerCustomer": true,
          "limitUsage": true,
          "limitUsageAmount": 200
        },
        "channelSets": [],
        "type": {
          "type": "BUY_X_GET_Y",
          "buyRequirementType": "MINIMUM_QUANTITY_OF_ITEMS",
          "buyQuantity": 4,
          "buyType": "SPECIFIC_PRODUCTS",
          "buyProducts": [
            "376f8103-0e09-449a-8548-a384f2f1b014"
          ],
          "buyCategories": [],
          "getType": "SPECIFIC_PRODUCTS",
          "getQuantity": 2,
          "getCategories": [],
          "getProducts": [
            "376f8103-0e09-449a-8548-a384f2f1b014"
          ],
          "getDiscountType": "FREE",
          "getDiscountValue": 15,
          "maxUsesPerOrder": false,
          "maxUsesPerOrderValue": 0
        },
        "status": "INACTIVE",
        "customerEligibility": "SPECIFIC_CUSTOMERS",
        "customerEligibilitySpecificCustomers": [
          "376f8103-0e09-449a-8538-9384f2f1b912"
        ],
        "customerEligibilityCustomerGroups": []
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "message": [
          "The end date must be after the start date",
          "The start date must be before the end date"
        ]
      }
      """

  Scenario: The user should be able to create a coupon with the same end and start date and start time after the end time
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"

    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons" with json:
      """
      {
        "endDate": "2021-06-04T19:00:00.000Z",
        "description": "a new description",
        "name": "nameValue",
        "startDate": "2021-06-04T16:00:00.000Z",
        "limits": {
          "limitOneUsePerCustomer": true,
          "limitUsage": true,
          "limitUsageAmount": 200
        },
        "channelSets": [],
        "type": {
          "type": "BUY_X_GET_Y",
          "buyRequirementType": "MINIMUM_QUANTITY_OF_ITEMS",
          "buyQuantity": 4,
          "buyType": "SPECIFIC_PRODUCTS",
          "buyProducts": [
            "376f8103-0e09-449a-8548-a384f2f1b014"
          ],
          "buyCategories": [],
          "getType": "SPECIFIC_PRODUCTS",
          "getQuantity": 2,
          "getCategories": [],
          "getProducts": [
            "376f8103-0e09-449a-8548-a384f2f1b014"
          ],
          "getDiscountType": "FREE",
          "getDiscountValue": 15,
          "maxUsesPerOrder": false,
          "maxUsesPerOrderValue": 0
        },
        "status": "INACTIVE",
        "customerEligibility": "SPECIFIC_CUSTOMERS",
        "customerEligibilitySpecificCustomers": [
          "376f8103-0e09-449a-8538-9384f2f1b912"
        ],
        "customerEligibilityCustomerGroups": []
      }
      """
    Then print last response
    And the response status code should be 200