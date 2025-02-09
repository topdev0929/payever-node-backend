Feature: Widgets API
  Background:
    Given I remember as "businessId" following value:
    """
    "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"
    """
    Given I use DB fixture "business/existing-widgets"
    Given I authenticate as a user with the following data:
    """
    {
      "_id": "f07c5841-2ec5-419b-95ed-2583b1ae0b84",
      "roles": [{
        "name": "admin",
        "permissions": [{ "businessId": "{{businessId}}", "acls": [] }]
      }]
    }
    """

  Scenario: Find all
    When I send a GET request to "/business/{{businessId}}/widget-tutorial"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    [
           {
             "_id": "*",
             "$init": true,
             "title": "*",
             "url": "*",
             "urls": [],
             "order": 1,
             "type": "connect",
             "watched": false
           },
           {
             "_id": "*",
             "title": "*",
             "url": "*",
             "urls": [],
             "order": 1,
             "type": "pos",
             "watched": false
           },
           {
             "_id": "*",
             "title": "*",
             "url": "*",
             "urls": [],
             "order": 1,
             "type": "checkout",
             "watched": false
           }
         ]
    """

  Scenario: Update widget
    When I send a PATCH request to "/business/{{businessId}}/widget-tutorial/25e394f9-a596-4410-9403-4d111420b1c8/watched"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "type": "checkout",
      "watched": true
    }
    """
