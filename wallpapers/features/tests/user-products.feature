Feature: Setting wallpaper theme
  Background:
    Given I use DB fixture "business-wallpapers"
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@email.com",
      "roles": [ { "name": "merchant" }, { "name": "user" } ]
    }
    """

    Scenario: Check whether all wallpaper is loaded
      When I send a GET request to "/api/user-products/wallpapers/all"
      Then print last response
      Then the response status code should be 200
      And the response should contain json:
      """
      [
        {
          "theme": "dark",
          "wallpaper": "wallpaper-1"
        },
        {
          "theme": "dark",
          "wallpaper": "wallpaper-2"
        },
        {
          "theme": "light",
          "wallpaper": "wallpaper-3"
        }
      ]
      """

    Scenario: Check whether current wallpaper tree is loaded
      When I send a GET request to "/api/user-products/wallpapers/tree"
      Then print last response
      Then the response status code should be 200
      And the response should contain json:
      """
      [
        {
          "code": "BUSINESS_PRODUCT_SERVICES",
          "icon": "",
          "industries": [
            {
              "code": "BRANCHE_COACHING",
              "industry": "5c8bce42-c03b-41a5-8c15-936a74d2a463",
              "wallpapers": []
            }
          ]
        }
      ]
      """

    Scenario: Check whether current wallpaper by id is loaded
      When I send a POST request to "/api/user-products/wallpapers/search" with json:
      """
      {
        "conditions": [{
          "contains": 0,
          "searchText": "OTHER",
          "filter": "Industry"
        }]
      }
      """
      Then print last response
      Then the response status code should be 201
      And the response should contain json:
      """
      [
        {
          "theme": "dark",
          "wallpaper": "wallpaper-1"
        },
        {
          "theme": "dark",
          "wallpaper": "wallpaper-2"
        }
      ]
      """
