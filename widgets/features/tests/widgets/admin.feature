Feature: Widgets API
  Background:
    Given I authenticate as a user with the following data:
    """
    {
      "_id": "f07c5841-2ec5-419b-95ed-2583b1ae0b84",
      "roles": [{
        "name": "admin",
        "permissions": [{ "businessId": "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99", "acls": [] }]
      }]
    }
    """

  Scenario: Create widget
    When I send a POST request to "/admin/widgets" with json:
    """
    {
      "type": "new-widget",
      "title": "New widget",
      "icon": "some-icon",
      "default": true,
      "helpURL": "https://new-widget.test/help",
      "tutorial": {
        "title": "New Widget Tutorial",
        "icon": "some-icon",
        "url": "https://new-widget.test/tutorial"
      },
      "order": 1
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "type": "new-widget",
      "title": "New widget",
      "icon": "some-icon",
      "default": true,
      "helpURL": "https://new-widget.test/help",
      "tutorial": {
        "title": "New Widget Tutorial",
        "icon": "some-icon",
        "url": "https://new-widget.test/tutorial"
      },
      "order": 1
    }
    """

  Scenario: Create widget [should fail if type is not unique]
    Given I use DB fixture "widgets/create-widget-should-fail-if-type-is-not-unique"
    When I send a POST request to "/admin/widgets" with json:
    """
    {
      "type": "widget-type",
      "title": "New widget",
      "icon": "some-icon",
      "default": true,
      "helpURL": "https://new-widget.test/help",
      "tutorial": {
        "title": "New Widget Tutorial",
        "icon": "some-icon",
        "url": "https://new-widget.test/tutorial"
      },
      "order": 1
    }
    """
    Then print last response
    Then the response status code should be 400

  Scenario: Update widget
    Given I use DB fixture "widgets/update-widget"
    When I send a PATCH request to "/admin/widgets/25e394f9-a596-4410-9403-4d111420b1c8" with json:
    """
    {
      "type": "updated-widget",
      "title": "Updated widget",
      "icon": "some-new-icon",
      "default": false,
      "order": 2
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "type": "updated-widget",
      "title": "Updated widget",
      "icon": "some-new-icon",
      "default": false,
      "order": 2
    }
    """

  Scenario: Update widget [should return 404 if not found]
    Given I use DB fixture "widgets/update-widget"
    When I send a PATCH request to "/admin/widgets/263a5d9c-910e-4838-b96c-ee1691921fd0" with json:
    """
    {
      "title": "Updated widget"
    }
    """
    Then print last response
    Then the response status code should be 404

  Scenario: delete widget
    Given I use DB fixture "widgets/delete-widget"
    When I send a DELETE request to "/admin/widgets/25e394f9-a596-4410-9403-4d111420b1c8"
    Then the response status code should be 204
    When I send a GET request to "/admin/widgets/25e394f9-a596-4410-9403-4d111420b1c8"
    Then the response status code should be 404
