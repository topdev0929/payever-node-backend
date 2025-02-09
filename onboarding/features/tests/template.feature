Feature: Onboarding
  Background: Template db fixture
    Given I use DB fixture "template"
    Then look for model "Template" by following JSON and remember as "template1":
    """
    {
      "name": "cucumber-template-1"
    }
    """
    Then look for model "Template" by following JSON and remember as "template2":
    """
    {
      "name": "cucumber-template-2"
    }
    """
  Scenario: Add template
    Given I authenticate as a user with the following data:
    """
    {
      "email": "admin@example.com",
      "id": "9a08b4bf-1068-4b5c-9428-e5233bbcafae",
      "roles": [
        {
          "name": "admin",
          "permissions": []
        }
      ]
    }
    """
    When I send a PUT request to "/api/template" with json:
    """
    {
      "name": "cucumber-template",
      "config":
      [
        {
          "verificationRequired": true
        }
      ]
    }
    """
    Then print last response
    Then response status code should be 200
    And the response should contain json:
    """
    {
      "name": "cucumber-template",
      "config": 
      [
        {
          "verificationRequired": true
        }
      ],
      "_id": "*"
    }
    """
    And I store a response as "created_template"
    When I send a GET request to "/api/template"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
    """
    [
      {
        "_id": "{{created_template._id}}",
        "name": "cucumber-template",
        "config": [
          {
            "verificationRequired": true
          }
        ]
      }
    ]
    """
  Scenario: Get information of an specific template 
    Given I authenticate as a user with the following data:
    """
    {
      "email": "anonymous@example.com",
      "id": "9a08b4bf-1068-4b5c-9428-e5233bbcafae",
      "roles": []
    }
    """
    When I send a GET request to "/api/template/name/{{template1.name}}"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
    """
    {
      "name": "{{template1.name}}",
      "config": "{{template1.config}}",
      "_id": "{{template1._id}}"
    }
    """
    When I send a GET request to "/api/template/{{template1._id}}"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
    """
    {
      "name": "{{template1.name}}",
      "config": "{{template1.config}}",
      "_id": "{{template1._id}}"
    }
    """
  Scenario: Delete an specific template by Id
    Given I authenticate as a user with the following data:
    """
    {
      "email": "admin@example.com",
      "id": "9a08b4bf-1068-4b5c-9428-e5233bbcafae",
      "roles": [
        {
          "name": "admin",
          "permissions": []
        }
      ]
    }
    """
    When I send a DELETE request to "/api/template/{{template1._id}}"
    Then print last response
    Then response status code should be 200
    And model "Template" with id "{{template1._id}}" should not exist
  Scenario: Delete an specific template by name
    Given I authenticate as a user with the following data:
    """
    {
      "email": "admin@example.com",
      "id": "9a08b4bf-1068-4b5c-9428-e5233bbcafae",
      "roles": [
        {
          "name": "admin",
          "permissions": []
        }
      ]
    }
    """
    When I send a DELETE request to "/api/template/name/{{template2.name}}"
    Then print last response
    Then response status code should be 200
    And model "Template" with id "{{template2._id}}" should not exist