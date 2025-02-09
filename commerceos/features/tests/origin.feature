Feature: Business apps
  Background:
    Given I load constants from "features/fixtures/const.ts"
    And I use DB fixture "business"
    And I use DB fixture "dashboard"

  Scenario: Get apps normally
    When I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_4_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    And I send a GET request to "/api/apps/business/{{BUSINESS_4_ID}}"
    And print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "_id": "{{DASHBOARD_APP_APP2_ID}}"
      }
    ]
    """

  Scenario: Get apps by business origin
    When I use DB fixture "origin"
    And I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_4_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    And I send a GET request to "/api/apps/business/{{BUSINESS_4_ID}}"
    And print last response
    And the response status code should be 200
    And the response should not contain json:
    """
    [
      {
        "_id": "{{DASHBOARD_APP_APP2_ID}}"
      }
    ]
    """

  Scenario: get onboarding filters returned apps
    When I use DB fixture "onboardings-business"
    When I use DB fixture "origin"
    When I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_4_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    And I send a POST request to "/api/onboarding/cached" with json:
    """
    {
      "name": "business"
    }
    """
    And print last response
    And the response status code should be 201
    And the response should not contain json:
    """
    {
      "afterRegistration": [
        {
          "payload": {
            "apps": [
              {
                "app": "{{DASHBOARD_APP_APP2_ID}}"
              }
            ]
          }
        }
      ]
    }
    """

  Scenario: fail request on installing an excluded app
    When I use DB fixture "origin"
    When I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_4_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    And I send a PATCH request to "/api/apps/business/{{BUSINESS_4_ID}}/toggle-installed/{{DASHBOARD_APP_APP2_ID}}" with json:
    """
    {
      "installed": true
    }
    """
    And print last response
    And the response status code should be 400

  Scenario: success request on installing an excluded app when there is no rule on origins
    When I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_4_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    And I mock RPC request "apps.rpc.readonly.auth-install-app" to "apps.rpc.readonly.auth-install-app" with:
      """
      {
        "requestPayload": { },
        "responsePayload": true
      }
      """
    And I mock RPC request "apps.rpc.readonly.widgets-install-app" to "apps.rpc.readonly.widgets-install-app" with:
      """
      {
        "requestPayload": { },
        "responsePayload": true
      }
      """
    And I send a PATCH request to "/api/apps/business/{{BUSINESS_4_ID}}/toggle-installed/{{DASHBOARD_APP_APP2_ID}}" with json:
    """
    {
      "installed": true
    }
    """
    And print last response
    And the response status code should be 201
