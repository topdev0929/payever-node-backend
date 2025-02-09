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
            "permissions": [],
            "name": "user",
            "applications": []
          },
          {
            "name": "merchant",
            "permissions": [],
            "applications": []
          }
        ]
      }
      """

  Scenario: delete /active wall
    When I send a DELETE request to "/api/business/{{businessId}}/wallpapers/active"
    Then the response status code should be 403
    Then print last response
    And the response should contain json:
      """
      {
        "message": "app.employee-permission.insufficient.error",
        "statusCode": 403
      }
      """

  Scenario: add wallpapers
    When I send a POST request to "/api/business/{{businessId}}/wallpapers" with json:
      """
      {
        "wallpaper": "wallpaper-4",
        "theme": "light"
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "message": "app.employee-permission.insufficient.error",
        "statusCode": 403
      }
      """
