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
      "id": "593d0945-5539-4922-892e-b355d1f73c52",
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
        },
        {
          "name": "user",
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
      When I send a GET request to "/api/personal/wallpapers"
      Then print last response
      Then the response status code should be 200
      And the response should contain json:
      """
      {
           "_id": "5c8bce42-c03b-41a5-8c15-936a74d2a461",
           "user": "593d0945-5539-4922-892e-b355d1f73c52",
           "myWallpapers": [
             {
               "theme": "dark",
               "_id": "*",
               "wallpaper": "wallpaper-1"
             },
             {
               "theme": "dark",
               "_id": "*",
               "wallpaper": "wallpaper-2"
             },
             {
               "theme": "light",
               "_id": "*",
               "wallpaper": "wallpaper-3"
             }
           ],
           "currentWallpaper": {
             "theme": "light",
             "_id": "*",
             "wallpaper": "wallpaper-3"
           }
         }
      """

    Scenario: add wallpapers
      When I send a POST request to "/api/personal/wallpapers" with json:
      """
      {
        "wallpaper": "default",
        "theme": "default"
      }
      """
      Then print last response
      Then the response status code should be 201
      And the response should contain json:
      """
      {
           "_id": "5c8bce42-c03b-41a5-8c15-936a74d2a461",
           "user": "593d0945-5539-4922-892e-b355d1f73c52",
           "myWallpapers": [
             {
               "theme": "dark",
               "_id": "*",
               "wallpaper": "wallpaper-1"
             },
             {
               "theme": "dark",
               "_id": "*",
               "wallpaper": "wallpaper-2"
             },
             {
               "theme": "light",
               "_id": "*",
               "wallpaper": "wallpaper-3"
             },
             {
               "theme": "default",
               "_id": "*",
               "wallpaper": "default"
             }
           ],
           "currentWallpaper": {
             "theme": "light",
             "_id": "*",
             "wallpaper": "wallpaper-3"
           }
         }
      """

    Scenario: Check whether /active endpoints works
      When I send a POST request to "/api/personal/wallpapers/active" with json:
      """
      {
        "wallpaper": "wallpaper-1",
        "theme": "light"
      }
      """
      Then print last response
      Then the response status code should be 201

    Scenario: delete /active wall
      When I send a DELETE request to "/api/personal/wallpapers/active"
      Then the response status code should be 200

    Scenario: delete wallpaper
      When I send a DELETE request to "/api/personal/wallpapers/wallpaper-1"
      Then print last response
      Then the response status code should be 200
