Feature: Integration subscription API

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
                "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
                "acls": []
              },
              {
                "businessId": "a903d4c3-c447-4aab-a8c7-c7f184a8e77f",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Get subscription from another business by category without rights - got 403
    When I send a GET request to "/api/business/5f02c4a8-929a-11e9-812b-7200004fe4c0/integration/category/testCategory"

    Then the response status code should be 403

  Scenario: Get subscription by category
    Given I use DB fixture "integration/integration-subscription/by-category"

    When I send a GET request to "/api/business/a803d4c3-c447-4aab-a8c7-c7f184a8e77f/integration/category/testCategory"

    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "installed": true,
          "_id": "*",
          "enabled": true,
          "integration": {
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
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0
        }
      ]
      """

  Scenario: Get all business subscriptions
    Given I use DB fixture "integration/integration-subscription/get-all"

    When I send a GET request to "/api/business/a903d4c3-c447-4aab-a8c7-c7f184a8e77f/integration"

    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "installed": true,
          "_id": "*",
          "enabled": true,
          "integration": {
            "_id": "*",
            "name": "*",
            "category": "newCategory",
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
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0
        },
        {
          "installed": true,
          "_id": "*",
          "enabled": true,
          "integration": {
            "_id": "*",
            "name": "*",
            "category": "newCategory",
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
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0
        }
      ]
      """


  Scenario: Get subscription by name
    Given I use DB fixture "integration/integration-subscription/by-name"

    When I send a GET request to "/api/business/a803d4c3-c447-4aab-a8c7-c7f184a8e77f/integration/testName"

    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "testName",
        "installed": true,
        "enabled": true
      }
      """
