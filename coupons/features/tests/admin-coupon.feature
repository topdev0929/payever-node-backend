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
    When I send a GET request to "/admin/coupons"
    Then response status code should be 403

  Scenario: Get all coupons
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a GET request to "/admin/coupons"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "code": "FIXED5"
          },
          {
            "_id": "existing-id",
            "code": "FIXED5EVERYONESPECPROD2"
          },
          {
            "_id": "id-to-delete",
            "code": "BA0987654321"
          }
        ]
      }
      """

  Scenario: Get all coupons with filter
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a GET request to "/admin/coupons?businessIds=376f8103-0e09-449a-8538-9384f2f1b992"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "code": "FIXED5"
          },
          {
            "_id": "existing-id",
            "code": "FIXED5EVERYONESPECPROD2"
          },
          {
            "_id": "id-to-delete",
            "code": "BA0987654321"
          }
        ]
      }
      """

    When I send a GET request to "/admin/coupons?businessIds=invalid-business-id"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": []
      }
      """

  Scenario: Get coupon by id
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a GET request to "/admin/coupons/buy-x-get-y-2"
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "buy-x-get-y-2",
        "code": "BA04B76A4B21"
      }
      """

  Scenario: Get coupon by code
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a GET request to "/admin/coupons/code/FIXED5"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "code": "FIXED5"
      }
      """

  Scenario: Get coupon by channelset
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a GET request to "/admin/coupons/channelset/4a5d4861-ead6-47bc-9c23-e16300e6508b?customerEmail=test1@gmail.com"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "code": "FIXED5SPECCUST"
      }
      """

  Scenario: Get no coupon by code if it not exists
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a GET request to "/admin/coupons/code/NONEXISTINGCODE"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {
        "message": "Coupons by {\"code\":\"NONEXISTINGCODE\"} not found!"
      }
      """

  Scenario: Get eligibility of coupon
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a GET request to "/admin/coupons/existing-id/eligibility"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "customerEligibility": "EVERYONE",
        "customerEligibilitySpecificCustomers": [
          "eligibility-specific-customs-id"
        ]
      }
      """

  Scenario: Get applies-to of coupon
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a GET request to "/admin/coupons/existing-id/type-extra-fields"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "appliesTo": "SPECIFIC_PRODUCTS",
        "appliesToCategories": [],
        "appliesToProducts": [
          "product-id-1"
        ]
      }
      """

  Scenario: Create fixed price coupon without restictions
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/admin/coupons" with json:
      """
      {
        "businessId": "376f8103-0e09-449a-8538-9384f2f1b992",
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

  Scenario: Update coupon - change name
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a PUT request to "/admin/coupons/id-to-update" with json:
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
          "type": "FREE_SHIPPING",
          "minimumRequirements": "NONE",
          "excludeShippingRatesOverCertainAmount": false,
          "excludeShippingRatesOverCertainAmountValue": 0,
          "freeShippingType": "SELECTED_COUNTRIES",
          "freeShippingToCountries": [
            "RU"
          ]
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
        "type": {
          "type": "FREE_SHIPPING",
          "freeShippingType": "SELECTED_COUNTRIES",
          "freeShippingToCountries": [
            "RU"
          ]
        }
      }
      """
    And the response status code should be 200

  Scenario: Delete coupon
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a DELETE request to "/admin/coupons/id-to-delete"
    Then print last response
    And the response status code should be 204
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "coupons.event.code.deleted",
          "payload": {
            "coupon": {
              "_id": "id-to-delete"
            }
          }
        }
      ]
      """
    When I send a DELETE request to "/admin/coupons/id-to-delete"
    Then print last response
    And the response status code should be 404
