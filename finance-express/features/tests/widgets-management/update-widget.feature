@update-widget
Feature: Update widget
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "widgetId" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "checkoutId" following value:
      """
        "2d873385-5c32-479c-a830-26de40bd4fd1"
      """
    And I use DB fixture "channel"
    And I authenticate as a user with the following data:
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

  Scenario: Update widget
    Given I use DB fixture "businesses"
    Given I use DB fixture "widgets"
    When I send a PUT request to "/api/business/{{businessId}}/widget/{{widgetId}}" with json:
      """
      {
        "amountLimits": {
          "min": 500,
          "max": 1000
        },
        "checkoutId": "{{checkoutId}}",
        "checkoutMode": "calculator",
        "checkoutPlacement": "rightSidebar",
        "maxHeight": 120,
        "minHeight": 400,
        "theme": "green",
        "alignment": "top",           
        "isVisible": true,
        "maxWidth": 1000,
        "minWidth": 100,
        "payments": [
          {
            "connectionId": "connectionId",
            "paymentMethod": "santander_installment",
            "amountLimits": {
              "min": 500,
              "max": 1000
            },
            "enabled": true,
            "isBNPL": true
          }
        ],
        "ratesOrder": "asc",
        "styles": {
          "color": "green",
          "anotherStyle": "someValue"
        },
        "type": "dropdownCalculator",
        "noticeUrl": "notice_new",
        "successUrl": "success_url",
        "widgetId": "{{widgetId}}"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "amountLimits": {
          "min": 500,
          "max": 1000
        },
        "checkoutId": "{{checkoutId}}",
        "checkoutMode": "calculator",
        "checkoutPlacement": "rightSidebar",
        "maxHeight": 120,
        "minHeight": 400,
        "theme": "green",
        "alignment": "top",            
        "isVisible": true,
        "maxWidth": 1000,
        "minWidth": 100,
        "payments": [
          {
            "connectionId": "connectionId",
            "paymentMethod": "santander_installment",
            "amountLimits": {
              "min": 500,
              "max": 1000
            },
            "enabled": true,
            "isBNPL": true
          }
        ],
        "ratesOrder": "asc",
        "styles": {
          "color": "green",
          "anotherStyle": "someValue"
        },
        "type": "dropdownCalculator",
        "noticeUrl": "notice_new",
        "successUrl": "success_url"
      }
      """
    And model "Widget" with id "{{widgetId}}" should contain json:
      """
      {
        "amountLimits": {
           "min": 500,
           "max": 1000
        },
        "businessId": "{{businessId}}",
        "checkoutId": "{{checkoutId}}",
        "checkoutMode": "calculator",
        "checkoutPlacement": "rightSidebar",
        "maxHeight": 120,
        "minHeight": 400,
        "theme": "green",
        "alignment": "top",            
        "isVisible": true,
        "maxWidth": 1000,
        "minWidth": 100,
        "payments": [
         {
           "paymentMethod": "santander_installment",
           "amountLimits": {
             "min": 500,
             "max": 1000
           },
           "isBNPL": true
         }
        ],
        "ratesOrder": "asc",
        "styles": {
          "color": "green",
          "anotherStyle": "someValue"
        },
        "type": "dropdownCalculator",
        "noticeUrl": "notice_new",
        "successUrl": "success_url",
        "_id": "*"
      }
      """

  Scenario: Update widget with custom styles
    Given I use DB fixture "businesses"
    Given I use DB fixture "widgets"
    When I send a PUT request to "/api/business/{{businessId}}/widget/{{widgetId}}" with json:
      """
      {
        "amountLimits": {
          "min": 500,
          "max": 1000
        },
        "checkoutId": "{{checkoutId}}",
        "checkoutMode": "calculator",
        "checkoutPlacement": "rightSidebar",
        "maxHeight": 120,
        "minHeight": 400,
        "theme": "green",
        "alignment": "top",            
        "isVisible": true,
        "maxWidth": 1000,
        "minWidth": 100,
        "payments": [
          {
            "connectionId": "connectionId",
            "paymentMethod": "santander_installment",
            "amountLimits": {
              "min": 500,
              "max": 1000
            },
            "enabled": true,
            "customWidgetSetting":{
              "isDefault": true,
              "height": 120,
              "maxWidth": 120,
              "minWidth": 400,
              "maxHeight": 120,
              "minHeight": 400,
              "theme": "green",
              "alignment": "top",               
              "styles": {
                "color": "green",
                "anotherStyle": "someValue"
              }
            },
            "isBNPL": true
          }
        ],
        "ratesOrder": "asc",
        "styles": {
          "color": "green",
          "anotherStyle": "someValue"
        },
        "type": "dropdownCalculator",
        "noticeUrl": "notice_new",
        "successUrl": "success_url",
        "widgetId": "{{widgetId}}"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "amountLimits": {
          "min": 500,
          "max": 1000
        },
        "checkoutId": "{{checkoutId}}",
        "checkoutMode": "calculator",
        "checkoutPlacement": "rightSidebar",
        "maxHeight": 120,
        "minHeight": 400,
        "theme": "green",
        "alignment": "top",            
        "isVisible": true,
        "maxWidth": 1000,
        "minWidth": 100,
        "payments": [
          {
            "connectionId": "connectionId",
            "paymentMethod": "santander_installment",
            "amountLimits": {
              "min": 500,
              "max": 1000
            },
            "enabled": true,
            "isBNPL": true,
            "customWidgetSetting":{
              "isDefault": true,
              "height": 120,
              "maxWidth": 120,
              "minWidth": 400,
              "maxHeight": 120,
              "minHeight": 400,
              "theme": "green",
              "alignment": "top",               
              "styles": {
                "color": "green",
                "anotherStyle": "someValue"
              }
            }            
          }
        ],
        "ratesOrder": "asc",
        "styles": {
          "color": "green",
          "anotherStyle": "someValue"
        },
        "type": "dropdownCalculator",
        "noticeUrl": "notice_new",
        "successUrl": "success_url"
      }
      """
    And model "Widget" with id "{{widgetId}}" should contain json:
      """
      {
        "amountLimits": {
           "min": 500,
           "max": 1000
        },
        "businessId": "{{businessId}}",
        "checkoutId": "{{checkoutId}}",
        "checkoutMode": "calculator",
        "checkoutPlacement": "rightSidebar",
        "maxHeight": 120,
        "minHeight": 400,
        "theme": "green",
        "alignment": "top",            
        "isVisible": true,
        "maxWidth": 1000,
        "minWidth": 100,
        "payments": [
         {
           "paymentMethod": "santander_installment",
           "amountLimits": {
             "min": 500,
             "max": 1000
           },
           "isBNPL": true,
           "customWidgetSetting":{
             "isDefault": true,
             "height": 120,
             "maxWidth": 120,
             "minWidth": 400,
             "maxHeight": 120,
             "minHeight": 400,
             "theme": "green",
             "alignment": "top",              
             "styles": {
               "color": "green",
               "anotherStyle": "someValue"
             }
           }          
         }
        ],
        "ratesOrder": "asc",
        "styles": {
          "color": "green",
          "anotherStyle": "someValue"
        },
        "type": "dropdownCalculator",
        "noticeUrl": "notice_new",
        "successUrl": "success_url",
        "_id": "*"
      }
      """

  Scenario: Update widget for another business
    Given I use DB fixture "widgets"
    When I send a PUT request to "/api/business/{{anotherBusinessId}}/widget/{{widgetId}}" with json:
      """
      {
        "amountLimits": {
          "min": 500,
          "max": 1000
        },
        "checkoutMode": "calculator",
        "checkoutPlacement": "rightSidebar",
        "maxHeight": 120,
        "minHeight": 400,
        "theme": "green",
        "alignment": "top",            
        "isVisible": true,
        "maxWidth": 1000,
        "minWidth": 100,
        "payments": [
          {
            "paymentMethod": "santander_installment",
            "enabled": true,
            "amountLimits": {
              "min": 500,
              "max": 1000
            },
            "isBNPL": true
          }
        ],
        "ratesOrder": "asc",
        "styles": {
          "color": "green",
          "anotherStyle": "someValue"
        },
        "type": "dropdownCalculator"
      }
      """
    Then print last response
    And the response status code should be 403
