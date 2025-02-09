Feature: Integration API

  Background:
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "5f02c4a8-929a-11e9-812b-7200004fe4c0",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Get integrations by category
    Given I use DB fixture "integration/integration/by-category"

    When I send a GET request to "/api/integration/category/testCategory"

    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "*",
          "name": "testName",
          "category": "testCategory",
          "displayOptions": {
            "_id": "*",
            "icon": "#icon-payment-option-santander1",
            "title": "integrations.payments.santander_pos_installment.title1"
          },
          "settingsOptions": {
            "_id": "*",
            "source": "source"
          },
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0
        }
      ]
      """

  Scenario: Get integrations by name
    Given I use DB fixture "integration/integration/by-name"

    When I send a GET request to "/api/integration/testName"

    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "name": "testName",
        "category": "testCategory",
        "displayOptions": {
          "_id": "*",
          "icon": "#icon-payment-option-santander1",
          "title": "integrations.payments.santander_pos_installment.title1"
        },
        "settingsOptions": {
          "_id": "*",
          "source": "source"
        },
        "createdAt": "*",
        "updatedAt": "*",
        "__v": 0
      }
      """

  Scenario: Get all integrations
    Given I use DB fixture "integration/integration/get-all"

    When I send a GET request to "/api/integration"

    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "*",
          "name": "testName",
          "category": "testCategory",
          "displayOptions": {
            "_id": "*",
            "icon": "#icon-payment-option-santander1",
            "title": "integrations.payments.santander_pos_installment.title1"
          },
          "settingsOptions": {
            "_id": "*",
            "source": "source"
          },
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0
        },
        {
          "_id": "*",
          "name": "myName",
          "category": "finance",
          "displayOptions": {
            "_id": "*",
            "icon": "#icon-payment-option-santander1",
            "title": "integrations.payments.santander_pos_installment.title1"
          },
          "settingsOptions": {
            "_id": "*",
            "source": "source"
          },
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0
        }
      ]
      """

  Scenario: Create new integration by merhant without rights - got 403
    When I send a POST request to "/api/integration" with json:
      """
      {
        "name": "test",
        "category": "Test",
        "displayOptions": {
          "title": "Test"
        }
      }
      """

    Then print last response
    And the response status code should be 403
