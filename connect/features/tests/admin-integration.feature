Feature: Admin integration
  Background: constants
    Given I remember as "integrationId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """

    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "admin@payever.de",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """

  Scenario: Create new integration subscriptioin
    When I send a POST request to "/api/admin/integrations" with json:
      """
      {
        "name": "my name",
        "category": "my category",
        "categoryIcon": "my categoryIcon",
        "displayOptions": {
          "icon": "#icon-message-email-2",
          "title": "email"
        },
        "installationOptions": {
          "countryList": [
            "CountryA",
            "CountryB"
          ],
          "links": [
            {
              "type": "l1",
              "url": "url"
            }
          ]
        }
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "my name",
        "category": "my category",
        "categoryIcon": "my categoryIcon",
        "displayOptions": {
          "icon": "#icon-message-email-2",
          "title": "email"
        },
        "installationOptions": {
          "countryList": [
            "CountryA",
            "CountryB"
          ],
          "links": [
            {
              "type": "l1",
              "url": "url"
            }
          ]
        }
      }
      """
    And store a response as "response"
    And model "Integration" with id "{{response._id}}" should contain json:
      """
      {
        "name": "my name",
        "category": "my category",
        "categoryIcon": "my categoryIcon",
        "displayOptions": {
          "icon": "#icon-message-email-2",
          "title": "email"
        },
        "installationOptions": {
          "countryList": [
            "CountryA",
            "CountryB"
          ],
          "links": [
            {
              "type": "l1",
              "url": "url"
            }
          ]
        }
      }
      """

  Scenario: Update integration
    Given I use DB fixture "integrations/integration-create"
    When I send a PATCH request to "/api/admin/integrations/{{integrationId}}" with json:
      """
      {
        "name": "my name -changed",
        "category": "my category -change",
        "categoryIcon": "my categoryIcon -change",
        "displayOptions": {
          "icon": "#icon-message-email-change",
          "title": "email-change"
        },
        "installationOptions": {
          "countryList": [
            "CountryA-change",
            "CountryB-change"
          ],
          "links": [
            {
              "type": "l1",
              "url": "url-change"
            }
          ]
        }
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "my name -changed",
        "category": "my category -change",
        "categoryIcon": "my categoryIcon -change",
        "displayOptions": {
          "icon": "#icon-message-email-change",
          "title": "email-change"
        },
        "installationOptions": {
          "countryList": [
            "CountryA-change",
            "CountryB-change"
          ],
          "links": [
            {
              "type": "l1",
              "url": "url-change"
            }
          ]
        }
      }
      """
    And store a response as "response"
    And model "Integration" with id "{{integrationId}}" should contain json:
      """
      {
        "name": "my name -changed",
        "category": "my category -change",
        "categoryIcon": "my categoryIcon -change",
        "displayOptions": {
          "icon": "#icon-message-email-change",
          "title": "email-change"
        },
        "installationOptions": {
          "countryList": [
            "CountryA-change",
            "CountryB-change"
          ],
          "links": [
            {
              "type": "l1",
              "url": "url-change"
            }
          ]
        }
      }
      """

  Scenario: get integration by id
    Given I use DB fixture "integrations/integration-create"
    When I send a GET request to "/api/admin/integrations/{{integrationId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{integrationId}}"
      }
      """

  Scenario: get integratin subscriptions list
    Given I use DB fixture "integrations/integration-create"
    When I send a GET request to "/api/admin/integrations?businessIds={{businessId}}&limit=1"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "_id": "*"
          }
        ]
      }
      """

  Scenario: delete integration
    Given I use DB fixture "integrations/integration-create"
    When I send a DELETE request to "/api/admin/integrations/{{integrationId}}"
    Then print last response
    And the response status code should be 200
    And model "Integration" with id "{{integrationId}}" should not contain json:
      """
      {
        "_id": "{{integrationId}}"
      }
      """


  Scenario: add allowed businesses
    Given I use DB fixture "integrations/integration-create"
    When I send a PATCH request to "/api/admin/integrations/{{integrationId}}/allowed-businesses" with json:
    """
    [
      "A","B","C","A","B","C"
    ]
    """
    And the response status code should be 200
    And the response should contain json:
    """
    [
     "B1","B2","A","B","C"
    ]
    """
    When I send a PATCH request to "/api/admin/integrations/{{integrationId}}/allowed-businesses" with json:
    """
    [
      "A","D"
    ]
    """
    And the response status code should be 200
    And the response should contain json:
    """
    [
      "B1","B2","A","B","C","D"
    ]
    """
    And model "Integration" with id "{{integrationId}}" should contain json:
    """
    {
      "allowedBusinesses": ["B1","B2","A","B","C","D"]
    }
    """

  Scenario: remove allowed businesses
    Given I use DB fixture "integrations/integration-create"
    When I send a DELETE request to "/api/admin/integrations/{{integrationId}}/allowed-businesses" with json:
    """
    [
      "B1","A","B","C"
    ]
    """
    And the response status code should be 200
    And the response should contain json:
    """
    [
      "B2"
    ]
    """
    And model "Integration" with id "{{integrationId}}" should contain json:
    """
    {
      "allowedBusinesses": ["B2"]
    }
    """
    And model "Integration" with id "{{integrationId}}" should not contain json:
    """
    {
      "allowedBusinesses": ["B1"]
    }
    """