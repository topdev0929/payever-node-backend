Feature: Admin customer sub plans management
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "planId" following value:
      """
        "eeeeeeee-1111-1111-1111-111111111111"
      """
    Given I remember as "sGroupId" following value:
      """
        "gggggggg-1111-1111-1111-111111111111"
      """
    Given I remember as "sGroupPlanId" following value:
      """
        "pppppppp-1111-1111-1111-111111111111"
      """
    Given I use DB fixture "customer-subscription-plan"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "08a3fac8-43ef-4998-99aa-cabc97a39261",
        "email": "email@email.com",
        "roles": [
          {"name":"admin","permissions":[]},
          {"name": "merchant","permissions": []}
        ]
      }
      """

  Scenario: Create customer sub plan
    When I send a POST request to "/api/admin/customer-plan-subscriptions" with json:
      """
      {
        "plan": "dddddddd-dddd-dddd-dddd-dddddddddddd",
        "plansGroup": ["dddddddd-1111-1111-1111-111111111111"],
        "customer": "customer",
        "reference": "ref",
        "subscribersGroups": ["subscribersGroups"]
      }
      """
    And print last response
    Then the response status code should be 201
    When I send a GET request to "/api/admin/customer-plan-subscriptions"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "subscribersGroups": [],
          "_id": "eeeeeeee-1111-1111-1111-111111111111",
          "plan": {
            "_id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
            "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "connection": "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
            "subscriptionPlan": "dddddddd-1111-1111-1111-111111111111"
          },
          "quantity": 2,
          "reference": "ref",
          "transactionId": "tId"
        },
        {
          "subscribersGroups": [],
          "_id": "*",
          "plan": {
            "_id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
            "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "connection": "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
            "subscriptionPlan": "dddddddd-1111-1111-1111-111111111111"
          },
          "reference": "ref"
        }
      ]
      """

  Scenario: Create customer sub plan
    When I send a GET request to "/api/admin/customer-plan-subscriptions/{{planId}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "subscribersGroups": [],
        "_id": "eeeeeeee-1111-1111-1111-111111111111",
        "plan": {
          "_id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
          "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          "connection": "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
          "subscriptionPlan": "dddddddd-1111-1111-1111-111111111111"
        },
        "quantity": 2,
        "reference": "ref",
        "transactionId": "tId"
      }
      """

  Scenario: update customer sub plan
    When I send a PUT request to "/api/admin/customer-plan-subscriptions/{{planId}}" with json:
      """
      {
        "plan": "dddddddd-dddd-dddd-dddd-dddddddddddd",
        "plansGroup": ["dddddddd-1111-1111-1111-111111111111"],
        "customer": "customer",
        "reference": "ref",
        "subscribersGroups": ["subscribersGroups"]
      }
      """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "subscribersGroups": [
          "subscribersGroups"
        ],
        "_id": "eeeeeeee-1111-1111-1111-111111111111",
        "plan": "dddddddd-dddd-dddd-dddd-dddddddddddd",
        "quantity": 2,
        "reference": "ref",
        "transactionId": "tId",
        "customer": "customer"
      }
      """

  Scenario: delete customer sub plan
    When I send a DELETE request to "/api/admin/customer-plan-subscriptions/{{planId}}"
    And print last response
    Then the response status code should be 200

  Scenario: Create sub plan group
    When I send a POST request to "/api/admin/customer-plan-subscriptions/{{planId}}/subscribers-group" with json:
      """
      {
        "name": "dddddddd-dddd-dddd-dddd-dddddddddddd",
        "subscribers": ["dddddddd-1111-1111-1111-111111111111"]
      }
      """
    And print last response
    Then the response status code should be 201
    When I send a GET request to "/api/admin/customer-plan-subscriptions/{{planId}}/subscribers-group"
    Then the response status code should be 200
    And print last response
    And the response should contain json:
      """
      [
        {
          "subscribers": [
            "dddddddd-1111-1111-1111-111111111111"
          ],
          "_id": "*",
          "name": "dddddddd-dddd-dddd-dddd-dddddddddddd"
        }
      ]
      """

  Scenario: update get sub plan group by id
    When I send a PUT request to "/api/admin/customer-plan-subscriptions/{{planId}}/subscribers-group/{{sGroupId}}" with json:
      """
      {
        "subscribers": [
          "dddddddd-1111-1111-1111-111111111111"
        ],
        "name": "test"
      }
      """
    And print last response
    Then the response status code should be 200
    When I send a GET request to "/api/admin/customer-plan-subscriptions/{{planId}}/subscribers-group/{{sGroupId}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "subscribers": [
          "dddddddd-1111-1111-1111-111111111111"
        ],
        "_id": "gggggggg-1111-1111-1111-111111111111",
        "name": "test"
      }
      """

  Scenario: delete customer sub plan group
    When I send a DELETE request to "/api/admin/customer-plan-subscriptions/{{planId}}/subscribers-group/{{sGroupId}}"
    And print last response
    Then the response status code should be 200
    And I send a GET request to "/api/admin/customer-plan-subscriptions/{{planId}}/subscribers-group/{{sGroupId}}"
    And print last response
    Then the response status code should be 404

  Scenario: Create sub plan group
    When I send a POST request to "/api/admin/customer-plan-subscriptions/{{planId}}/plans-group" with json:
      """
      {
        "name": "dddddddd-dddd-dddd-dddd-dddddddddddd",
        "plans": [
          "dddddddd-1111-1111-1111-111111111111"
        ]
      }
      """
    And print last response
    Then the response status code should be 201
    When I send a GET request to "/api/admin/customer-plan-subscriptions/{{planId}}/plans-group"
    Then the response status code should be 200
    And print last response
    And the response should contain json:
      """
      [
        {
          "plans": [
            "dddddddd-1111-1111-1111-111111111111"
          ],
          "_id": "*",
          "name": "dddddddd-dddd-dddd-dddd-dddddddddddd"
        }
      ]
      """

  Scenario: update get sub plan group by id
    When I send a PUT request to "/api/admin/customer-plan-subscriptions/{{planId}}/plans-group/{{sGroupPlanId}}" with json:
      """
      {
        "plans": [
          "dddddddd-1111-1111-1111-111111111111"
        ],
        "name": "test"
      }
      """
    And print last response
    Then the response status code should be 200
    When I send a GET request to "/api/admin/customer-plan-subscriptions/{{planId}}/plans-group/{{sGroupPlanId}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "plans": [
          "dddddddd-1111-1111-1111-111111111111"
        ],
        "_id": "pppppppp-1111-1111-1111-111111111111",
        "name": "test"
      }
      """

  Scenario: delete customer sub plan group
    When I send a DELETE request to "/api/admin/customer-plan-subscriptions/{{planId}}/plans-group/{{sGroupPlanId}}"
    And print last response
    Then the response status code should be 200
    And I send a GET request to "/api/admin/customer-plan-subscriptions/{{planId}}/plans-group/{{sGroupPlanId}}"
    And print last response
    Then the response status code should be 404
