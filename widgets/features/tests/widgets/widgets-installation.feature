Feature: Widgets API
  Background:
    Given I remember as "businessId" following value:
    """
    "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"
    """
    Given I remember as "channelId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe0"
    """
    Given I use DB fixture "business/existing-widgets"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "f07c5841-2ec5-419b-95ed-2583b1ae0b84",
      "roles": [{
        "name": "admin",
        "permissions": [{ "businessId": "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99", "acls": [] }]
      }]
    }
    """

  Scenario: Find one
    When I send a GET request to "/personal/widget"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "installed": false,
        "default": false,
        "installByDefault": false,
        "helpURL": "*",
        "icon": "*",
        "order": 1,
        "title": "Settings",
        "type": "settings"
      }
    ]
    """

  Scenario: Find one
    When I send a GET request to "/business/3b8e9196-ccaa-4863-8f1e-19c18f2e4b99/widget"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "installed": false,
        "default": false,
        "installByDefault": false,
        "helpURL": "*",
        "icon": "*",
        "order": 1,
        "title": "Settings",
        "type": "settings"
      }
    ]
    """

  Scenario: Find one
    When I send a GET request to "/business/3b8e9196-ccaa-4863-8f1e-19c18f2e4b99/widget/e62b4849-b946-49ce-b863-7bcb7e8b978c"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "installed": false,
      "default": false,
      "installByDefault": false,
      "helpURL": "*",
      "icon": "*",
      "order": 1,
      "title": "Settings",
      "type": "settings"
    }
    """

  Scenario: install one
    When I send a PATCH request to "/business/3b8e9196-ccaa-4863-8f1e-19c18f2e4b99/widget/e62b4849-b946-49ce-b863-7bcb7e8b978c/install"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "installed": true,
      "order": 1,
      "type": "settings"
    }
    """

  Scenario: uninstall one
    When I send a PATCH request to "/business/3b8e9196-ccaa-4863-8f1e-19c18f2e4b99/widget/e62b4849-b946-49ce-b863-7bcb7e8b978c/uninstall"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "installed": false,
      "order": 1,
      "type": "settings"
    }
    """

  Scenario: uninstall default one
    When I send a PATCH request to "/business/3b8e9196-ccaa-4863-8f1e-19c18f2e4b99/widget/e62b4849-b946-49ce-b863-7bcb7e8b978d/uninstall"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "installed": false,
      "order": 1,
      "type": "transactions"
    }
    """
