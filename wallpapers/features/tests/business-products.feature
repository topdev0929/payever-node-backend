Feature: Setting wallpaper theme
  Background:
    Given I use DB fixture "business-wallpapers"
    Given I remember as "businessId" following value:
    """
    "593d0945-5539-4922-892e-b355d1f73c53"
    """
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@email.com",
      "roles": [
        {
          "name": "merchant",
          "permissions": [
            {
              "businessId": "{{businessId}}",
              "acls": []
            }
          ]
        }
      ]
    }
    """

    Scenario: Check whether current wallpaper is loaded
      When I send a GET request to "/api/products/wallpapers"
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
                 "wallpapers": [
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
               }
             ]
           }
         ]
      """

    Scenario: Check whether all wallpaper is loaded
      When I send a GET request to "/api/products/wallpapers/all"
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
      When I send a GET request to "/api/products/wallpapers/tree"
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
      When I send a GET request to "/api/products/wallpapers/byId/5c8bce42-c03b-41a5-8c15-936a74d2a462"
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

    Scenario: Check whether current wallpaper by id is loaded
      When I send a POST request to "/api/products/wallpapers/search" with json:
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
