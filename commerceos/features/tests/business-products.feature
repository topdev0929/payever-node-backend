Feature: Business products contoller
  Scenario: get products
    Given I use DB fixture "business-products"
    When I send a GET request to "/api/business-products"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "_id": "3512fbfe-91a0-11e9-b480-7200004fe4c0",
        "code": "123",
        "industries": [],
        "order": 1
      },
      {
        "_id": "79f75166-91a0-11e9-a799-7200004fe4c0",
        "code": "456",
        "industries": [],
        "order": 2
      },
      {
        "_id": "842a717c-91a0-11e9-b28a-7200004fe4c0",
        "code": "789",
        "industries": [],
        "order": 3
      }
    ]
    """

  Scenario: get products (empty)
    When I send a GET request to "/api/business-products"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    []
    """

  Scenario: get product industry
    Given I use DB fixture "business-products"
    When I send a GET request to "/api/business-products/456/industry"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
    """
    [
      {
        "_id": "0eff50bc-91a4-11e9-a520-7200004fe4c0",
        "code": "123456"
      }
    ]
    """

  Scenario: get product industry (product not found)
    Given I use DB fixture "business-products"
    When I send a GET request to "/api/business-products/456566/industry"
    Then print last response
    Then response status code should be 404

  Scenario: get products list
    Given I use DB fixture "business-products"
    When I send a GET request to "/api/business-products/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "_id": "0eff50bc-91a4-11e9-a520-7200004fe4c0",
        "code": "123456",
        "industry": "79f75166-91a0-11e9-a799-7200004fe4c0"
      }
    ]
    """
  Scenario: get wallpapers
    Given I use DB fixture "business-products"
    When I send a GET request to "/api/business-products/wallpaper/slug"
    Then print last response
    Then the response status code should be 302
