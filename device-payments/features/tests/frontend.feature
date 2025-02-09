Feature: Frontend API controller
  Scenario: Create payment code
    Given I use DB fixture "businesses"
    And I use DB fixture "applications"
    And I use DB fixture "checkouts"

    When I send a POST request to "/api/v1/code/7013667a-2344-4bb5-bc1f-fa10eae21c91" with json:
    """
    {
      "source": 3,
      "paymentFlowId": "paymentFlowId",
      "amount": 200
    }
    """
    And I look for model "PaymentCode" by following JSON and remember as "payment_code":
    """
    {
      "flow.amount": 200
    }
    """
    Then print last response

    And stored value "payment_code" should contain json:
    """
    {
      "log": {
        "source": 3
      }
    }
    """
    And the response status code should be 201
    And the response should contain json:
    """
    {
       "status": "STATUS_ACCEPTED",
       "code": "*",
       "terminalId": "c26f4496-c5dd-482c-9380-5d6bc1ecb989",
       "applicationId": "c26f4496-c5dd-482c-9380-5d6bc1ecb989",
       "flow": {
         "business_id": "21e67ee2-d516-42e6-9645-46765eadd0ac",
         "channel_set_id": "7013667a-2344-4bb5-bc1f-fa10eae21c91",
         "amount": 200,
         "id": "paymentFlowId"
       },
       "log": {
         "secondFactor": false,
         "source": 3,
         "verificationType": 0
       },
       "_id": "*",
       "createdAt": "*",
       "updatedAt": "*"
    }
    """


  Scenario: Assign payment flow
    Given I use DB fixture "codes"

    When I send a POST request to "/api/v1/code/assign-payment-flow/d9793a20-9bdd-4140-9d33-9b3e208f20e2" with json:
    """
    {
      "paymentFlowId": "9b0f442e78068b0ed0dc6e745b413bf2"
    }
    """

    Then the response status code should be 201
    And model "PaymentCode" with id "d9793a20-9bdd-4140-9d33-9b3e208f20e2" should contain json:
    """
    {
      "code": 123456,
      "flow": {"id": "9b0f442e78068b0ed0dc6e745b413bf2"}
    }
    """


  Scenario: Get payment code
    Given I use DB fixture "codes"

    When I send a GET request to "/api/v1/code?_id=d9793a20-9bdd-4140-9d33-9b3e208f20e2"

    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "code": 123456
    }
    """


  Scenario: Get payment code by nested data
    Given I use DB fixture "codes"

    When I send a GET request to "/api/v1/code?flow.id=f74a39e21811682c89eedf64df58a7bc"

    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "code": 123456,
      "flow": {"id": "f74a39e21811682c89eedf64df58a7bc"}
    }
    """
