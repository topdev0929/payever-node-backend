Feature: Channel set products
  Background:
    Given I authenticate as a user with the following data:
    """
    {
      "_id": "f07c5841-2ec5-419b-95ed-2583b1ae0b84",
      "roles": [{
        "name": "merchant",
        "permissions": [
          { "businessId": "e5334cbc-fdf9-4b6d-9395-e0a8a8253006", "acls": [] },
          { "businessId": "60b9a5fc-b831-4258-bc98-ac8d438e3510", "acls": [] }
        ]
      }]
    }
    """

  Scenario: Popular week
    Given I use DB fixture "products-app/channel-set-products/get-popular-last-week"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/channel-set/90865876-8b5c-4f19-982b-7ae83afb97e1/popular-week"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      { "uuid": "8f4fa65b-c537-425e-8d83-27d399980579" ,"salePrice":33 ,"price":43 },
      { "uuid": "d8dbfd96-0d31-4ded-97af-b2bdcf7e72cb" ,"salePrice":31 ,"price":41 }
    ]
    """

  Scenario: Should return 404 if business or channel set not found
    Given I use DB fixture "products-app/channel-set-products/get-popular-last-week"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/channel-set/60b9a5fc-b831-4258-bc98-ac8d438e3510/popular-week"
    Then the response status code should be 404
    When I send a GET request to "/products-app/business/60b9a5fc-b831-4258-bc98-ac8d438e3510/channel-set/90865876-8b5c-4f19-982b-7ae83afb97e1/popular-week"
    Then the response status code should be 404

  Scenario: Popular month
    Given I use DB fixture "products-app/channel-set-products/get-popular-last-month"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/channel-set/90865876-8b5c-4f19-982b-7ae83afb97e1/popular-month"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      { "uuid": "6933eb7c-63a9-4716-b854-13fa0b1e2405" },
      { "uuid": "d8dbfd96-0d31-4ded-97af-b2bdcf7e72cb" ,"salePrice":34 ,"price":44 }
    ]
    """

  Scenario: Should return 404 if business or channel set not found
    Given I use DB fixture "products-app/channel-set-products/get-popular-last-month"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/channel-set/60b9a5fc-b831-4258-bc98-ac8d438e3510/popular-week"
    Then the response status code should be 404
    When I send a GET request to "/products-app/business/60b9a5fc-b831-4258-bc98-ac8d438e3510/channel-set/90865876-8b5c-4f19-982b-7ae83afb97e1/popular-week"
    Then the response status code should be 404

  Scenario: Get last sold
    Given I use DB fixture "products-app/channel-set-products/get-last-sold"
    When I send a GET request to "/products-app/business/e5334cbc-fdf9-4b6d-9395-e0a8a8253006/channel-set/90865876-8b5c-4f19-982b-7ae83afb97e1/last-sold"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "uuid": "d8dbfd96-0d31-4ded-97af-b2bdcf7e72cb" ,"salePrice":37 ,"price":47
      },
      {
        "uuid": "6933eb7c-63a9-4716-b854-13fa0b1e2405" ,"salePrice":38 ,"price":48
      },
      {
        "uuid": "8f4fa65b-c537-425e-8d83-27d399980579"
      }
    ]
    """
