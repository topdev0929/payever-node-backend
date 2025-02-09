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
          "name": "admin"
        }
      ]
    }
    """

  Scenario: Wallpapers list for admin
    When I send a GET request to "/api/admin/wallpapers"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "wallpapers": [
        {
          "_id": "5c8bce42-c03b-41a5-8c15-936a74d2a461",
          "business": "{{businessId}}"
        }
      ]
    }
    """

  Scenario: add wallpapers
    When I send a POST request to "/api/admin/wallpapers" with json:
    """
    {
      "businessId": "{{businessId}}",
      "wallpaper": "wallpaper-4",
      "theme": "light"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "currentWallpaper": {
        "theme": "light",
        "wallpaper": "wallpaper-3"
      },
      "business": "{{businessId}}"
    }
    """

  Scenario: delete /active wall
    When I send a DELETE request to "/api/admin/wallpapers/active" with json:
    """
    {
      "businessId": "{{businessId}}"
    }
    """
    Then the response status code should be 200

  Scenario: delete wallpaper
    When I send a DELETE request to "/api/admin/wallpapers/wallpaper-1" with json:
    """
    {
      "businessId": "{{businessId}}"
    }
    """
    Then print last response
    Then the response status code should be 200

  Scenario: Check whether /active endpoints works
      When I send a POST request to "/api/admin/wallpapers/active" with json:
      """
      {
        "businessId": "{{businessId}}",
        "wallpaper": "wallpaper-1",
        "theme": "light"
      }
      """
      Then the response status code should be 201
      When look for model "BusinessWallpapers" by following JSON and remember as "business-wallpaper":
      """
      {
        "businessId": "{{businessId}}"
      }
      """
      Then stored value "business-wallpaper" should contain json:
      """
      {
        "currentWallpaper" :  {
            "wallpaper": "wallpaper-1",
            "theme": "light"
          }
      }
      """
