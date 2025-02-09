Feature: Business shipping boxes
  Background:
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I remember as "settingId" following value:
      """
      "f59850e6-a027-4338-b9ba-979e07037023"
      """
    Given I remember as "originId" following value:
      """
      "0acf9a70-db1d-4af9-8be3-4d97d671cf14"
      """
    And I authenticate as a user with the following data:
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

  Scenario: Get business shipping settings
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/business/{{businessId}}/shipping-settings"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [{
          "boxes": "*",
          "_id": "{{settingId}}",
          "zones": "*",
          "origins": "*",
          "businessId": "{{businessId}}"
        }]
      """

  Scenario: Get business shipping setting by id
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/business/{{businessId}}/shipping-settings/{{settingId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "boxes": "*",
          "_id": "{{settingId}}",
          "zones": "*",
          "origins": "*",
          "businessId": "{{businessId}}"
        }
      """

  Scenario: create business shipping setting
    Given I use DB fixture "shipping/shipping"
    When I send a POST request to "/api/business/{{businessId}}/shipping-settings" with json:
    """
    {
      "boxes": ["f59850e6-a027-4338-b9ba-979e07037024"],
      "zones": ["f59850e6-a027-4338-b9ba-979e07037026"],
      "origins": ["f59850e6-a027-4338-b9ba-979e07037003"],
      "business": "{{businessId}}"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
        {
          "boxes": "*",
          "_id": "*",
          "zones": "*",
          "origins": "*",
          "businessId": "{{businessId}}"
        }
      """

  Scenario: update business shipping setting
    Given I use DB fixture "shipping/shipping"
    When I send a PUT request to "/api/business/{{businessId}}/shipping-settings/{{settingId}}" with json:
    """
    {
      "boxes": ["f59850e6-a027-4338-b9ba-979e07037024"],
      "zones": ["f59850e6-a027-4338-b9ba-979e07037026"],
      "origins": ["f59850e6-a027-4338-b9ba-979e07037003"],
      "business": "{{businessId}}"
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "boxes": "*",
          "_id": "{{settingId}}",
          "zones": "*",
          "origins": "*",
          "businessId": "{{businessId}}"
        }
      """

  Scenario: delete business shipping setting
    Given I use DB fixture "shipping/shipping"
    When I send a DELETE request to "/api/business/{{businessId}}/shipping-settings/{{settingId}}"
    Then print last response
    And the response status code should be 200
    Then model "ShippingSetting" with id "{{settingId}}" should not contain json:
      """
      {
        "_id": "{{settingId}}"
      }
      """

  Scenario: Update business shipping box by id
    Given I use DB fixture "shipping/shipping"
    When I send a PUT request to "/api/business/{{businessId}}/shipping-settings/default-origin/{{originId}}"
    Then print last response
    And the response status code should be 200
