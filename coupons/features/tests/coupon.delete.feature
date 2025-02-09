Feature: Delete coupon
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
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["coupons-folder"], "result": [] }
      """

  Scenario: Delete existing coupon
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a DELETE request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/id-to-delete"
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

  Scenario: Delete nonexisting coupon
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a DELETE request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/non-existing-id"
    Then print last response
    And the response status code should be 404
