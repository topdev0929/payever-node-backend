Feature: Free shipping
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

  Scenario: Fail couontry
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FSHIPEVERYONESECCOUNTMQOI",
        "customerEmail": "test1@gmail.com",
        "shippingCountry": "usa",
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
        "message": "Country not allowed"
      }
      """
    And the response status code should be 400

  Scenario: Fail minimum quantity
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FSHIPEVERYONESECCOUNTMQOI",
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
        "message": "Below minimum quantity of items"
      }
      """
    And the response status code should be 400

  Scenario: Fail minimum purchase amount
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FSHIPEVERYONESELCOUNTMPA",
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
        "message": "Below minimum purchase amount"
      }
      """
    And the response status code should be 400


  Scenario: Apply shipping coupon
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FSHIPEVERYONESELCOUNTMPA",
        "customerEmail": "test1@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test",
            "price": 20,
            "quantity": 3,
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
            "price": 20,
            "quantity": 3,
            "identifier": "test"
          }
        ],
        "freeShipping": true
      }
      """
    And the response status code should be 200

