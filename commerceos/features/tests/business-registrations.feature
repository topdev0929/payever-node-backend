Feature: Business registration contoller
  Scenario: get form data
    Given I use DB fixture "business-products"
    When I send a GET request to "/api/business-registration/form-data"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "businessStatuses": [
        "REGISTERED_BUSINESS",
        "SOLO_ENTREPRENEUR"
      ],
      "products": [
        {
          "_id": "*",
          "code": "123",
          "order": 1,
          "industries": []
        },
        {
          "_id": "*",
          "code": "456",
          "order": 2,
          "industries": [
            {
              "_id": "*",
              "code": "123456",
              "industry": "*"
            }
          ]
        },
        {
          "_id": "*",
          "code": "789",
          "order": 3,
          "industries": []
        }
      ],
      "statuses": [
        "BUSINESS_STATUS_JUST_LOOKING",
        "BUSINESS_STATUS_HAVE_IDEA",
        "BUSINESS_STATUS_TURN_EXISTING",
        "BUSINESS_STATUS_GROWING_BUSINESS",
        "BUSINESS_STATUS_REPLACE_BUSINESS"
      ]
    }
    """
