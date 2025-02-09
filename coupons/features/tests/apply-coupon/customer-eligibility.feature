Feature: Customer eligibililty
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

  Scenario: Fail specific customer
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FIXED5SPECCUST",
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
        "message": "Coupon only allowed for specific customer"
      }
      """
    And the response status code should be 400

  Scenario: Pass specific customer
    Given I mock RPC request "contacts.rpc.folder-plugin.readonly.es.search" to "contacts.rpc.folder-plugin.readonly.es.search" with:
      """
      {
        "requestPayload": [],
        "responsePayload": [{
          "collection": [{
            "serviceEntityId": "contact-id-1",
            "email": "test1@gmail.com",
            "parentFolderId": "group-id-1"
          }]
        }]
      }
      """
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FIXED5SPECCUST",
        "customerEmail": "test1@gmail.com",
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

  Scenario: Fail specific customer group
    Given I mock RPC request "contacts.rpc.folder-plugin.readonly.es.search" to "contacts.rpc.folder-plugin.readonly.es.search" with:
      """
      {
        "requestPayload": [],
        "responsePayload": [{
          "collection": []
        }]
      }
      """
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FIXED5GROUPCUST",
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
        "message": "Coupon only allowed for specific group of customers"
      }
      """
    And the response status code should be 400

  Scenario: Pass specific customer groups
    Given I mock RPC request "contacts.rpc.folder-plugin.readonly.es.search" to "contacts.rpc.folder-plugin.readonly.es.search" with:
      """
      {
        "requestPayload": [],
        "responsePayload": [{
          "collection": [{
            "email": "test1@gmail.com",
            "serviceEntityId": "2004c351-70e8-487c-96a0-ca2716a2d5bd",
            "parentFolderId": "group-id-1"
          }]
        }]
      }
      """
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FIXED5GROUPCUST",
        "customerEmail": "test1@gmail.com",
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
