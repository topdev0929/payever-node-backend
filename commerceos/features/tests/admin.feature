Feature: apps management
  Background:
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "service@payever.de",
        "roles": [
          {"name": "user", "permissions": []},
          {"name": "admin", "permissions": []}
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

  Scenario: create default apps
    Given I use DB fixture "dashboard"
    And I use DB fixture "admin"
    When I send a POST request to "/api/admin/apps/default" with json:
    """
    {
      "_id": "partner",
      "installedApps": [{
        "installed": true,
        "app": "id",
        "code": "statistics"
      }]
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "partner",
      "installedApps": [{
        "installed": true,
        "app": "id",
        "code": "statistics"
      }]
    }
    """

  Scenario: edit default apps
    Given I use DB fixture "dashboard"
    And I use DB fixture "admin"
    When I send a PATCH request to "/api/admin/apps/default/business" with json:
    """
    {
      "_id": "business",
      "installedApps": [{
        "installed": true,
        "app": "id",
        "code": "statistics2"
      }]
    }
    """
    Then print last response
    And the response status code should be 200
    And model "DefaultApps" with id "business" should contain json:
    """
    {
      "_id": "business",
      "installedApps": [{
        "installed": true,
        "app": "id",
        "code": "statistics2"
      }]
    }
    """

  Scenario: remove defaultapp
    Given I use DB fixture "dashboard"
    And I use DB fixture "admin"
    When I send a DELETE request to "/api/admin/apps/default/business"
    Then print last response
    And the response status code should be 200
    And model "DefaultApps" with id "business" should not contain json:
    """
    {
      "_id": "business",
      "installedApps": [
        {
          "app": "37370e19-1ab0-4a22-83ed-2f2a090f485d",
          "code": "business-app1",
          "installed": false
        },
        {
          "app": "44f60143-2aee-40fb-87ad-074dd133e048",
          "code": "business-app2",
          "installed": false
        }
      ]
    }
    """

  Scenario: get defaultapp
    Given I use DB fixture "dashboard"
    And I use DB fixture "admin"
    When I send a GET request to "/api/admin/apps/default"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [{
      "_id": "business",
      "installedApps": [
        {
          "app": "37370e19-1ab0-4a22-83ed-2f2a090f485d",
          "code": "business-app1",
          "installed": false
        },
        {
          "app": "44f60143-2aee-40fb-87ad-074dd133e048",
          "code": "business-app2",
          "installed": false
        }
      ]
    }]
    """

  Scenario: create dashboard apps
    Given I use DB fixture "dashboard"
    And I use DB fixture "admin"
    When I send a POST request to "/api/admin/apps/dashboard" with json:
    """
    {
      "_id": "37370e19-1ab0-4a22-83ed-2f2a0901234d",
      "access": {
        "admin": {
          "defaultInstalled": false,
          "isDefault": false
        },
        "business": {
          "defaultInstalled": false,
          "isDefault": false
        },
        "partner": {
          "defaultInstalled": false,
          "isDefault": false
        },
        "user": {
          "defaultInstalled": false,
          "isDefault": false
        }
      },
      "order": 6,
      "bootstrapScriptUrl": "https://payment-santander-at-frontend.test.devpayever.com/micro.js?AQ0GXjl",
      "code": "paymentSantanderAt",
      "allowedAcls": {
        "create": true,
        "delete": true,
        "read": true,
        "update": true
      },
      "tag": ""
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "*",
      "access": {
        "admin": {
          "defaultInstalled": false,
          "isDefault": false
        },
        "business": {
          "defaultInstalled": false,
          "isDefault": false
        },
        "partner": {
          "defaultInstalled": false,
          "isDefault": false
        },
        "user": {
          "defaultInstalled": false,
          "isDefault": false
        }
      },
      "order": 6,
      "bootstrapScriptUrl": "https://payment-santander-at-frontend.test.devpayever.com/micro.js?AQ0GXjl",
      "code": "paymentSantanderAt",
      "tag": ""
    }
    """

  Scenario: edit dashboard apps
    Given I use DB fixture "dashboard"
    And I use DB fixture "admin"
    When I send a PATCH request to "/api/admin/apps/dashboard/37370e19-1ab0-4a22-83ed-2f2a090f485d" with json:
    """
    {
      "_id": "37370e19-1ab0-4a22-83ed-2f2a090f485d",
      "access": {
        "admin": {
          "defaultInstalled": true,
          "isDefault": true
        },
        "business": {
          "defaultInstalled": true,
          "isDefault": true
        },
        "partner": {
          "defaultInstalled": true,
          "isDefault": true
        },
        "user": {
          "defaultInstalled": true,
          "isDefault": true
        }
      },
      "order": 6,
      "bootstrapScriptUrl": "https://payment-santander-at-frontend.test.devpayever.com/micro.js?AQ0GXjl",
      "code": "paymentSantanderAt",
      "allowedAcls": {
        "create": true,
        "delete": true,
        "read": true,
        "update": true
      },
      "tag": ""
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "access": {
        "admin": {
          "defaultInstalled": true,
          "isDefault": true
        },
        "business": {
          "defaultInstalled": true,
          "isDefault": true
        },
        "partner": {
          "defaultInstalled": true,
          "isDefault": true
        },
        "user": {
          "defaultInstalled": true,
          "isDefault": true
        }
      },
      "order": 6,
      "bootstrapScriptUrl": "https://payment-santander-at-frontend.test.devpayever.com/micro.js?AQ0GXjl",
      "code": "paymentSantanderAt",
      "tag": ""
    }
    """
    And model "DashboardApp" with id "37370e19-1ab0-4a22-83ed-2f2a090f485d" should contain json:
    """
    {
      "access": {
        "admin": {
          "defaultInstalled": true,
          "isDefault": true
        },
        "business": {
          "defaultInstalled": true,
          "isDefault": true
        },
        "partner": {
          "defaultInstalled": true,
          "isDefault": true
        },
        "user": {
          "defaultInstalled": true,
          "isDefault": true
        }
      },
      "order": 6,
      "bootstrapScriptUrl": "https://payment-santander-at-frontend.test.devpayever.com/micro.js?AQ0GXjl",
      "code": "paymentSantanderAt",
      "tag": ""
    }
    """

  Scenario: remove dashboardapp
    Given I use DB fixture "dashboard"
    And I use DB fixture "admin"
    When I send a DELETE request to "/api/admin/apps/dashboard/37370e19-1ab0-4a22-83ed-2f2a090f485d"
    Then print last response
    And the response status code should be 200
    And model "DashboardApp" with id "37370e19-1ab0-4a22-83ed-2f2a090f485d" should not contain json:
    """
    {
      "access": {
        "business": {
          "defaultInstalled": false,
          "isDefault": false,
          "url": "http://business-url1"
        },
        "user": {
          "defaultInstalled": false,
          "isDefault": false,
          "url": "http://user-url1"
        }
      },
      "allowedAcls": { "create": true, "delete": false },
      "bootstrapScriptUrl": "http://bootstrapScriptUrl1",
      "code": "business-app1",
      "order": 1,
      "tag": "tag1"
    }
    """

  Scenario: get dashboardapp
    Given I use DB fixture "dashboard"
    And I use DB fixture "admin"
    When I send a GET request to "/api/admin/apps/dashboard"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [{
      "access": {
        "business": {
          "defaultInstalled": false,
          "isDefault": false,
          "url": "http://business-url2"
        },
        "user": {
          "defaultInstalled": false,
          "isDefault": false,
          "url": "http://user-url2"
        }
      },
      "allowedAcls": { "create": true, "delete": false },
      "bootstrapScriptUrl": "http://bootstrapScriptUrl2",
      "code": "settings",
      "order": 2,
      "tag": "tag2"
    }]
    """

  Scenario: Toggle installed as a merchant
    And I use DB fixture "default"
    And I use DB fixture "business"
    When I send a PATCH request to "/api/admin/apps/business/25b3057a-328b-4559-a6e9-b55936659ba9/toggle-installed/37370e19-1ab0-4a22-83ed-2f2a090f485d" with json:
      """
      {
        "installed": true
      }
      """
    Then print last response
    Then model "Business" with id "25b3057a-328b-4559-a6e9-b55936659ba9" should contain json:
      """
      {
        "installedApps": [
          {
            "app": "37370e19-1ab0-4a22-83ed-2f2a090f485d",
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

  Scenario: Toggle disallowed as a merchant
    And I use DB fixture "default"
    And I use DB fixture "business"
    When I send a PATCH request to "/api/admin/apps/business/25b3057a-328b-4559-a6e9-b55936659ba9/toggle-disallowed/37370e19-1ab0-4a22-83ed-2f2a090f485d" with json:
      """
      {
        "code": "site",
        "setupStatus": "notStarted"
      }
      """
    Then print last response
    Then model "Business" with id "25b3057a-328b-4559-a6e9-b55936659ba9" should contain json:
      """
      {
        "disallowedApps": [
          {
            "app": "37370e19-1ab0-4a22-83ed-2f2a090f485d"
          }
        ]
      }
      """
    And the response status code should be 201