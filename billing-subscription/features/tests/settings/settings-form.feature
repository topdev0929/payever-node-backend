Feature: Get settings form
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "connectionId" following value:
      """
        "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    Given I remember as "integrationName" following value:
      """
        "stripe"
      """

  Scenario: Not authenticated attempts to get settings form
    Given I am not authenticated
    When I send a POST request to "/api/settings/{{businessId}}/form"
    Then print last response
    Then the response status code should be 403

  Scenario: Get form without saved data
    Given I use DB fixture "settings/save-new-integration"
    When I send a POST request to "/api/settings/{{businessId}}/form"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "form": {
          "contentType": "accordion",
          "title": "Billing subscriptions",
          "type": "info-box",
          "content": {
            "accordion": [
              {
                "title": "Payment integrations",
                "icon": "#icon-settings",
                "data": [
                  [
                    {
                      "type": "text",
                      "value": "stripe"
                    },
                    {
                      "checked": false,
                      "requestOff": {
                        "method": "post",
                        "url": "http://billing-subscriptions.service/api/settings/{{businessId}}/disable/confirmation/{{connectionId}}"
                      },
                      "requestOn": {
                        "method": "post",
                        "url": "http://billing-subscriptions.service/api/settings/{{businessId}}/enable/{{connectionId}}"
                      },
                      "size": "xs",
                      "type": "toggle"
                    }
                  ]
                ]
              }
            ],
            "html": {
              "icon": "#icon-check-rounded-16",
              "innerHtml": "Subscriptions"
            }
          }
        }
      }
      """

  Scenario: Get form with saved data
    Given I use DB fixture "settings/disable-integration"
    When I send a POST request to "/api/settings/{{businessId}}/form"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "form": {
          "contentType": "accordion",
          "title": "Billing subscriptions",
          "type": "info-box",
          "content": {
            "accordion": [
              {
                "title": "Payment integrations",
                "icon": "#icon-settings",
                "data": [
                  [
                    {
                      "type": "text",
                      "value": "{{integrationName}}"
                    },
                    {
                      "checked": true,
                      "requestOff": {
                        "method": "post",
                        "url": "http://billing-subscriptions.service/api/settings/{{businessId}}/disable/confirmation/{{connectionId}}"
                      },
                      "requestOn": {
                        "method": "post",
                        "url": "http://billing-subscriptions.service/api/settings/{{businessId}}/enable/{{connectionId}}"
                      },
                      "size": "xs",
                      "type": "toggle"
                    }
                  ]
                ]
              }
            ],
            "html": {
              "icon": "#icon-check-rounded-16",
              "innerHtml": "Subscriptions"
            }
          }
        }
      }
      """

  Scenario: Get form without saved data
    Given I use DB fixture "settings/save-new-integration"
    When I send a POST request to "/api/settings/{{businessId}}/form"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "form": {
          "contentType": "accordion",
          "title": "Billing subscriptions",
          "type": "info-box",
          "content": {
            "accordion": [
              {
                "title": "Payment integrations",
                "icon": "#icon-settings",
                "data": [
                  [
                    {
                      "type": "text",
                      "value": "stripe"
                    },
                    {
                      "checked": false,
                      "requestOff": {
                        "method": "post",
                        "url": "http://billing-subscriptions.service/api/settings/{{businessId}}/disable/confirmation/{{connectionId}}"
                      },
                      "requestOn": {
                        "method": "post",
                        "url": "http://billing-subscriptions.service/api/settings/{{businessId}}/enable/{{connectionId}}"
                      },
                      "size": "xs",
                      "type": "toggle"
                    }
                  ]
                ]
              }
            ],
            "html": {
              "icon": "#icon-check-rounded-16",
              "innerHtml": "Subscriptions"
            }
          }
        }
      }
      """

  Scenario: Get disable confirmation form
    Given I use DB fixture "settings/disable-integration"
    When I send a POST request to "/api/settings/{{businessId}}/disable/confirmation/{{connectionId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
         "form": {
           "title": "",
           "type": "confirm",
           "confirmContent": {
             "operations": [
               {
                 "request": {
                   "url": "http://billing-subscriptions.service/api/settings/{{businessId}}/form"
                 },
                 "text": "No"
               },
               {
                 "request": {
                   "url": "http://billing-subscriptions.service/api/settings/{{businessId}}/disable/{{connectionId}}"
                 },
                 "text": "Yes"
               }
             ],
             "text": "This will stop all current subscriptions.",
             "title": "Are you sure you want to disable \"{{integrationName}}\"?"
           }
         }
      }
      """

  Scenario: Business has unsupported integration
    Given I use DB fixture "settings/settings-form-unsupported-integration"
    When I send a POST request to "/api/settings/{{businessId}}/form"
    Then print last response
    And the response status code should be 200
    And the response should not contain json:
      """
      {
        "form": {
          "content": {
            "accordion": [
              {
                "data": [
                  [
                    {
                      "type": "text",
                      "value": "unsupported_integration"
                    }
                  ]
                ]
              }
            ]
          }
        }
      }
      """
