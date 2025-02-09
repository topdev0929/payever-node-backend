Feature: Business apps
  Background:
    Given I load constants from "features/fixtures/const.ts"
    And I mock RPC request "apps.rpc.readonly.auth-install-onboarding-apps" to "apps.rpc.readonly.auth-install-onboarding-apps" with:
     """
     {
       "requestPayload": { },
       "responsePayload": [
         true,
         true
       ]
     }
     """
    And I mock RPC request "apps.rpc.readonly.widgets-install-onboarding-apps" to "apps.rpc.readonly.widgets-install-onboarding-apps" with:
     """
     {
       "requestPayload": { },
       "responsePayload": [
         true,
         true
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
     And I mock RPC request "apps.rpc.readonly.auth-install-app" to "apps.rpc.readonly.auth-uninstall-app" with:
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
     And I mock RPC request "apps.rpc.readonly.widgets-uninstall-app" to "apps.rpc.readonly.widgets-uninstall-app" with:
      """
      {
        "requestPayload": { },
        "responsePayload": true
      }
      """

  Scenario: Get apps as anonymous
    Given I am not authenticated
    When I send a GET request to "/api/apps/business/:businessId"
    Then the response status code should be 403

  Scenario: Get apps as a merchant
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "business"
    And I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_2_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/apps/business/{{BUSINESS_2_ID}}"
    And print last response
    Then model "Business" with id "{{BUSINESS_2_ID}}" should contain json:
      """
      {
        "installedApps": [
          {
            "installed": false,
            "setupStatus": "notStarted",
            "code": "business-app1"
          }
        ]
      }
      """
    And print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
             "_id": "{{DASHBOARD_APP_APP1_ID}}",
             "appName": "commerceos.transactions.app.name",
             "bootstrapScriptUrl": "http://bootstrapScriptUrl1",
             "businessTypes": [
               "business"
             ],
             "code": "transactions",
             "dashboardInfo": {
               "icon": "#icon-commerceos-message",
               "title": "dashboard.apps.message"
             },
             "default": false,
             "installed": false,
             "setupStatus": "notStarted",
             "tag": "tag1"
           },
           {
             "_id": "{{DASHBOARD_APP_APP2_ID}}",
             "appName": "commerceos.settings.app.name",
             "bootstrapScriptUrl": "http://bootstrapScriptUrl2",
             "businessTypes": [
               "business"
             ],
             "code": "settings",
             "dashboardInfo": {},
             "default": false,
             "installed": false,
             "setupStatus": "notStarted",
             "tag": "tag2"
           }
      ]
      """

  Scenario: Get apps with installed apps with same code but different apps
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "business"
    And I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_3_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/apps/business/{{BUSINESS_3_ID}}"
    And print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "{{DASHBOARD_APP_MESSAGE_ID}}",
          "code": "message",
          "setupStatus": "completed"
        }
      ]
      """
    And the response should not contain json:
      """
      [
        {
          "code": "message",
          "setupStatus": "notStarted"
        }
      ]
      """

  Scenario: Get apps acls as a merchant
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "business"
    And I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_2_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/apps/business/{{BUSINESS_2_ID}}/acls"
    And print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "{{DASHBOARD_APP_APP1_ID}}",
          "allowedAcls": {
            "create": true,
            "delete": false
          },
          "code": "transactions",
          "dashboardInfo": {}
        }
      ]
      """

  Scenario: Toggle installed as anonymous
    Given I am not authenticated
    When I send a PATCH request to "/api/apps/business/{{BUSINESS_2_ID}}/toggle-installed/{{DASHBOARD_APP_APP1_ID}}"
    Then the response status code should be 403

  Scenario: Toggle installed on multiple apps as a merchant
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "business"
    And I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_2_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a PATCH request to "/api/apps/business/{{BUSINESS_2_ID}}/toggle-installed" with json:
      """
      {
        "apps": [
          {
            "app": "{{DASHBOARD_APP_APP1_ID}}",
            "code": "app_code",
            "installed": true
          }
        ]
      }
      """
    Then print last response
    Then model "Business" with id "{{BUSINESS_2_ID}}" should contain json:
      """
      {
        "installedApps": [
          {
            "app": "{{DASHBOARD_APP_APP1_ID}}",
            "installed": true
          }
        ]
      }
      """
    And the response status code should be 201

  Scenario: Toggle installed on multiple apps via RPC
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "business"
    When I publish in RabbitMQ channel "async_events_commerceos_micro" message with json:
      """
      {
        "name": "apps.rpc.apps.install-onboarding-apps",
        "payload": {
          "apps": [
            {
              "app": "{{DASHBOARD_APP_APP1_ID}}",
              "code": "app_code",
              "installed": true
            }
          ],
          "businessId": "{{BUSINESS_2_ID}}",
          "userId": "9bd92439-66a7-4861-b311-56f826b410d6"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_commerceos_micro" channel
    Then model "Business" with id "{{BUSINESS_2_ID}}" should contain json:
      """
      {
        "installedApps": [
          {
            "app": "{{DASHBOARD_APP_APP1_ID}}",
            "installed": true
          }
        ]
      }
      """

  Scenario: Setup business apps
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "business"
    When I publish in RabbitMQ channel "async_events_commerceos_micro" message with json:
      """
      {
        "name": "onboarding.event.setup.apps",
        "payload": {
          "onboardingName": "santandar",
          "businessId": "{{BUSINESS_2_ID}}",
          "userId": "9bd92439-66a7-4861-b311-56f826b410d6"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_commerceos_micro" channel
    Then model "Business" with id "{{BUSINESS_2_ID}}" should contain json:
      """
      {
        "installedApps": [
          {
            "app": "{{DASHBOARD_APP_APP1_ID}}"
          }
        ]
      }
      """

  Scenario: Toggle twice installed app
    And I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_3_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "business"
    When I send a PATCH request to "/api/apps/business/{{BUSINESS_3_ID}}/toggle-installed/{{DASHBOARD_APP_MESSAGE_ID}}" with json:
      """
      {
        "installed": true
      }
      """
    Then print last response
    And the response status code should be 201
    And model "Business" with id "{{BUSINESS_3_ID}}" should contain json:
      """
      {
        "installedApps": [{
          "app": "{{DASHBOARD_APP_MESSAGE_ID}}",
          "code": "message",
          "installed": true,
          "setupStatus": "completed"
        }]
      }
      """

  Scenario: Toggle installed as a merchant
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "business"
    And I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_2_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a PATCH request to "/api/apps/business/{{BUSINESS_2_ID}}/toggle-installed/{{DASHBOARD_APP_APP1_ID}}" with json:
      """
      {
        "installed": true
      }
      """
    Then print last response
    Then model "Business" with id "{{BUSINESS_2_ID}}" should contain json:
      """
      {
        "installedApps": [
          {
            "app": "{{DASHBOARD_APP_APP1_ID}}",
            "installed": true
          }
        ]
      }
      """
    And the response status code should be 201
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "app-registry.event.application.installed"
        }
      ]
      """
    When I send a PATCH request to "/api/apps/business/{{BUSINESS_2_ID}}/toggle-installed/{{DASHBOARD_APP_APP1_ID}}" with json:
      """
      {
        "installed": true,
        "setupStatus":"completed"
      }
      """
    Then model "Business" with id "{{BUSINESS_2_ID}}" should contain json:
      """
      {
        "installedApps": [
          {
            "app": "{{DASHBOARD_APP_APP1_ID}}",
            "installed": true,
            "setupStatus":"completed"
          }
        ]
      }
      """

  Scenario: Toggle installed as a merchant
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "business"
    And I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_2_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a PATCH request to "/api/apps/business/{{BUSINESS_2_ID}}/app/business-app1/change-setup-step" with json:
      """
      {
        "setupStep": "first"
      }
      """
    Then print last response
    Then model "Business" with id "{{BUSINESS_2_ID}}" should contain json:
      """
      {
        "installedApps": [
          {
            "installed": false,
            "setupStatus": "notStarted",
            "code": "business-app1",
            "setupStep": "first"
          }
        ]
      }
      """
    And the response status code should be 201

  Scenario: Toggle installed as a merchant
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "business"
    And I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "admin",
            "permissions": [
              {
                "businessId": "{{BUSINESS_1_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/apps/business/{{BUSINESS_1_ID}}/dashboard"
    Then print last response
    And the response should contain json:
      """
      [
        {
          "_id": "{{DASHBOARD_APP_APP1_ID}}",
          "bootstrapScriptUrl": "http://bootstrapScriptUrl1",
          "code": "transactions",
          "dashboardInfo": {
            "icon": "#icon-commerceos-message",
            "title": "dashboard.apps.message"
          },
          "installed": true,
          "setupStatus": "notStarted"
        }
      ]
      """
    And the response status code should be 200

    When I send a PATCH request to "/api/apps/business/{{BUSINESS_1_ID}}/update-status/{{DASHBOARD_APP_APP1_ID}}" with json:
    """
    {
      "installed": true,
      "setupStatus": "completed"
    }
    """
    Then print last response
    And the response status code should be 201
    Then model "Business" with id "{{BUSINESS_1_ID}}" should contain json:
      """
      {
        "installedApps": [
          {
            "code": "transactions",
            "app": "{{DASHBOARD_APP_APP1_ID}}",
            "setupStatus": "completed"
          }
        ]
      }
      """
