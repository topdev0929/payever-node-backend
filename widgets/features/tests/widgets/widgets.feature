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

  Scenario: Find one
    Given I use DB fixture "widgets/find-one"
    When I send a GET request to "/widget/25e394f9-a596-4410-9403-4d111420b1c8"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "25e394f9-a596-4410-9403-4d111420b1c8",
      "type": "widget-type",
      "icon": "some-icon",
      "title": "Some widget",
      "default": false,
      "helpURL": "https://some-widget.test/help",
      "tutorial": {
        "title": "Some widget tutorial",
        "icon": "some-icon",
        "url": "https://some-widget.test/tutorial"
      },
      "order": 1
    }
    """

  Scenario: Find one [if not found should return 404]
    Given I use DB fixture "widgets/find-one"
    When I send a GET request to "/widget/d763c3ca-8554-4a04-a3dd-a8f0236a70a5"
    Then print last response
    Then the response status code should be 404

  Scenario: Find one by type
    Given I use DB fixture "widgets/find-one-by-type"
    When I send a GET request to "/widget/type/widget-type-2"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "358ada94-6559-4f92-9cdc-077ea46bc3d7",
      "type": "widget-type-2"
    }
    """

  Scenario: Find one by type [if not found should return 404]
    Given I use DB fixture "widgets/find-one-by-type"
    When I send a GET request to "/widget/type/widget-type-5"
    Then print last response
    Then the response status code should be 404

  Scenario: Find all
    Given I use DB fixture "widgets/find-all"
    When I send a GET request to "/widget"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "_id": "25e394f9-a596-4410-9403-4d111420b1c8"
      },
      {
        "_id": "358ada94-6559-4f92-9cdc-077ea46bc3d7"
      },
      {
        "_id": "e62b4849-b946-49ce-b863-7bcb7e8b978b"
      }
    ]
    """

  Scenario: Find all [should return empty array if no records]
    Given I use DB fixture "widgets/find-all"
    When I send a GET request to "/widget"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    []
    """
