Feature: Coupon apply to
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

  Scenario: Fail minimum purchase amount
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "PERC5EVERYONEMINPA",
        "customerEmail": "test1@gmail.com",
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
        "message": "Minimum purchase requirement not satisfied"
      }
      """
    And the response status code should be 400

  Scenario: Pass minimum purchase amount - with one use
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "PERC5EVERYONEMINPA",
        "customerEmail": "test1@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test-1",
            "price": 20,
            "quantity": 2,
            "identifier": "product-id-1"
          },
          {
            "name": "test-2",
            "price": 25,
            "quantity": 2,
            "identifier": "product-id-2"
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
            "name": "test-1",
            "price": 19,
            "quantity": 2,
            "identifier": "product-id-1"
          },
          {
            "name": "test-2",
            "price": 25,
            "quantity": 2,
            "identifier": "product-id-2"
          }
        ],
        "appliedOn": [
          {
            "identifier": "product-id-1",
            "reduction": 1
          }
        ]
      }
      """
    And the response status code should be 200

  Scenario: Fail minimum quantity
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "PERC5MINQOI",
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
        "message": "Minimum quantitiy not satisfied"
      }
      """
    And the response status code should be 400

  Scenario: Pass minimum quantity
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "PERC5MINQOI",
        "customerEmail": "test1@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test",
            "price": 20,
            "quantity": 3,
            "identifier": "product-id-1"
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
            "price": 19,
            "quantity": 3,
            "identifier": "product-id-1"
          }
        ],
        "appliedOn": [
          {
            "identifier": "product-id-1",
            "reduction": 1
          }
        ]
      }
      """
    And the response status code should be 200
