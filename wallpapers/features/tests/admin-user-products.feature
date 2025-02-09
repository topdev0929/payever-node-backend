Feature: Setting wallpaper theme
  Background:
    Given I use DB fixture "business-wallpapers"
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@email.com",
      "roles": [ { "name": "admin" } ]
    }
    """

  Scenario: update wallpapers
    When I send a PATCH request to "/api/admin/user-products" with json:
    """
    {
      "wallpapers": [{
        "theme": "dark",
        "wallpaper": "wallpaper-1"
      }],
      "industry_code": "BUSINESS_PRODUCT_OTHERS",
      "product_code": "BRANCHE_OTHER"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "wallpapers": [{
        "theme": "dark",
        "wallpaper": "wallpaper-1"
      }],
      "code": "BRANCHE_OTHER"
    }
    """
    When look for model "UserProduct" by following JSON and remember as "user-product":
    """
    {
      "code": "BRANCHE_OTHER"
    }
    """
    Then stored value "user-product" should contain json:
    """
    {
      "wallpapers": [{
        "theme": "dark",
        "wallpaper": "wallpaper-1"
      }]
    }
    """

  Scenario: delete a wallpaper
    When I send a DELETE request to "/api/admin/business-products/wallpaper-2" with json:
    """
    {
      "product_code": "BRANCHE_OTHER"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "code": "BRANCHE_OTHER",
      "wallpapers": [
        {
          "theme": "dark",
          "wallpaper": "wallpaper-1"
        },
        {
          "theme": "light",
          "wallpaper": "wallpaper-3"
        }
      ]
    }
    """
    And the response should not contain json:
    """
    {
      "wallpapers": [
        {
          "theme": "dark",
          "wallpaper": "wallpaper-2"
        }
      ]
    }
    """

