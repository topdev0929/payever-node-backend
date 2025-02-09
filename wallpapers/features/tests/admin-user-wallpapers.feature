Feature: Setting wallpaper theme
  Background:
    Given I use DB fixture "business-wallpapers"
    Given I remember as "userId" following value:
    """
    "593d0945-5539-4922-892e-b355d1f73c52"
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
    When I send a GET request to "/api/admin/user-wallpapers"
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
          "user": "{{userId}}"
        }
      ]
    }
    """

  Scenario: add wallpapers
    When I send a POST request to "/api/admin/user-wallpapers" with json:
    """
    {
      "userId": "{{userId}}",
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
      "user": "{{userId}}"
    }
    """

  Scenario: delete /active wall
    When I send a DELETE request to "/api/admin/user-wallpapers/active" with json:
    """
    {
      "userId": "{{userId}}"
    }
    """
    Then the response status code should be 200

  Scenario: delete wallpaper
    When I send a DELETE request to "/api/admin/user-wallpapers/wallpaper-1" with json:
    """
    {
      "userId": "{{userId}}"
    }
    """
    Then print last response
    Then the response status code should be 200

  Scenario: Check whether /active endpoints works
      When I send a POST request to "/api/admin/user-wallpapers/active" with json:
      """
      {
        "userId": "{{userId}}",
        "wallpaper": "wallpaper-1",
        "theme": "light"
      }
      """
      Then the response status code should be 201
      When look for model "UserWallpapers" by following JSON and remember as "user-wallpaper":
      """
      {
        "user": "{{userId}}"
      }
      """
      Then stored value "user-wallpaper" should contain json:
      """
      {
        "currentWallpaper" :  {
            "wallpaper": "wallpaper-1",
            "theme": "light"
          }
      }
      """
