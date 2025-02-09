Feature: Page management
  Background:
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "service@payever.de",
        "roles": [
          {"name": "user", "permissions": []},
          {"name": "admin", "permissions": []}
        ]
      }
      """
    And I use DB fixture "integrations"
    And I remember as "integrationId" following value:
    """
    "06b3464b-9ed2-4952-9cb8-07aac0108a55"
    """

  Scenario: create integrations
    When I send a POST request to "/api/admin/integration" with json:
    """
    {
      "category": "Category_2",
      "displayOptions": {
        "_id": "*",
        "title": "Title 1",
        "icon": "icon-1.png"
      },
      "name": "Name_2"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "category": "Category_2",
      "displayOptions": {
        "_id": "*",
        "title": "Title 1",
        "icon": "icon-1.png"
      },
      "name": "Name_2"
    }
    """


  Scenario: edit allowed businesses list
    When I send a PATCH request to "/api/admin/integration/{{integrationId}}" with json:
    """
    {
      "category": "Category_2",
      "displayOptions": {
        "_id": "*",
        "title": "Title 1",
        "icon": "icon-1.png"
      },
      "name": "Name_2"
    }
    """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "category": "Category_2",
      "displayOptions": {
        "_id": "*",
        "title": "Title 1",
        "icon": "icon-1.png"
      },
      "name": "Name_2"
    }
    """
    And model "Integration" with id "{{integrationId}}" should contain json:
    """
    {
      "category": "Category_2",
      "displayOptions": {
        "_id": "*",
        "title": "Title 1",
        "icon": "icon-1.png"
      },
      "name": "Name_2"
    }
    """


  Scenario: remove integration
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "service@payever.de",
        "roles": [
          {"name": "user", "permissions": []},
          {"name": "admin", "permissions": []}
        ]
      }
      """

    When I send a DELETE request to "/api/admin/integration/{{integrationId}}"
    Then print last response
    And the response status code should be 200
    And model "Integration" with id "{{integrationId}}" should not contain json:
    """
    {
      "_id": "{{integrationId}}"
    }
    """
