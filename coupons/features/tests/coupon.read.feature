Feature: Read coupon
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

  Scenario: Get all coupons
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a GET request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
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
      """

  Scenario: Get coupon by id
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a GET request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/existing-id"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "code": "FIXED5EVERYONESPECPROD2"
      }
      """

  Scenario: Get coupon by code
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a GET request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/by-code/FIXED5"
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
    When I send a GET request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/by-channelset/4a5d4861-ead6-47bc-9c23-e16300e6508b?customerEmail=test1@gmail.com"
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
    When I send a GET request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/by-code/NONEXISTINGCODE"
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
    When I send a GET request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/existing-id/eligibility"
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
    When I send a GET request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/existing-id/type-extra-fields"
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
