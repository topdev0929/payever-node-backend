Feature: Coupon with limits
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

  Scenario: Use coupon
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "ABCFX0Z52ER2",
        "customerEmail": "test@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test",
            "price": 10,
            "quantity": 2,
            "identifier": "test"
          }
        ]
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "cart": [
          {
            "name": "test",
            "price": 5,
            "quantity": 2,
            "identifier": "test"
          }
        ],
        "appliedOn": [
          {
            "identifier": "test",
            "reduction": 5
          }
        ]
      }
      """
    And the response status code should be 200
    Then I look for model "CouponsUsed" by following JSON and remember as "couponUsed":
      """
      {
        "coupon": "limit-usage-amount"
      }
      """
    And model "CouponsUsed" with id "{{couponUsed._id}}" should contain json:
      """
      {
        "coupon": "limit-usage-amount",
        "email": "test@gmail.com"
      }
      """

  Scenario: Try using already once used coupon with limitOneUsePerCustomer limit
    Given I use DB fixture "coupons"
    Given I use DB fixture "coupons-used"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "0VUFX0Z52ER2",
        "customerEmail": "test@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test",
            "price": 1,
            "quantity": 2,
            "identifier": "test"
          }
        ]
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "message": "Coupon only allowed to be used once"
      }
      """
    And the response status code should be 400

  Scenario: Try using maxed-out coupon
    Given I use DB fixture "coupons"
    Given I use DB fixture "coupons-used"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "ABCFX0Z52ER2",
        "customerEmail": "test@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test",
            "price": 1,
            "quantity": 2,
            "identifier": "test"
          }
        ]
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "message": "Maximum usage for coupon reached"
      }
      """
    And the response status code should be 400
