Feature: Update coupon
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
      { "arguments": ["coupons-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["coupons-folder"], "result": [] }
      """

  Scenario: Update coupon - change name
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a PUT request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/id-to-update" with json:
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

  Scenario: Update coupon - change code
    Given I use DB fixture "coupons"
    When I send a PUT request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/id-to-update" with json:
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
        "channelSetsIds": [
          "4a5d4861-ead6-47bc-9c23-e16300e6508b"
        ],
        "type": {
          "type": "FREE_SHIPPING",
          "appliesTo": "ALL_PRODUCTS",
          "minimumRequirements": "NONE",
          "minimumRequirementsValue": 4,
          "freeShippingType": "SELECTED_COUNTRIES",
          "freeShippingToCountries": [
            "RU"
          ],
          "excludeShippingRatesOverCertainAmount": true,
          "excludeShippingRatesOverCertainAmountValue": 350
        },
        "status": "INACTIVE",
        "customerEligibility": "SPECIFIC_GROUPS_OF_CUSTOMERS",
        "customerEligibilitySpecificCustomers": "123",
        "customerEligibilityCustomerGroups": [],
        "code": "NEWCODEVALUE"
      }
      """
    Then print last response
    And the response status code should be 400
