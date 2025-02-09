@create-widget
Feature: Create widget
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "checkoutId" following value:
      """
        "2d873385-5c32-479c-a830-26de40bd4fd1"
      """
    Given I remember as "checkoutId2" following value:
      """
        "ab6eac58-db32-4d2b-86db-835888e24c24"
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

  Scenario: Received create widget request
    Given I use DB fixture "businesses"
    When I send a POST request to "/api/business/{{businessId}}/widget" with json:
      """
      {
        "amountLimits": {
          "min": 10,
          "max": 2000
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
            "paymentMethod": "santander_factoring_de",
            "amountLimits": {
              "min": 10,
              "max": 750
            },
            "enabled": true,
            "isBNPL": false,
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
          },
          {
            "paymentMethod": "santander_installment",
            "amountLimits": {
              "min": 750,
              "max": 2000
            },
            "enabled": true,
            "isBNPL": true,
            "productId": "125"
          }
        ],
        "ratesOrder": "asc",
        "styles": {
          "color": "green",
          "anotherStyle": "someValue"
        },
        "type": "dropdownCalculator",
        "cancelUrl": "cancel_url",
        "failureUrl": "failure_url",
        "noticeUrl": "notice_url",
        "pendingUrl": "pending_url",
        "successUrl": "success_url"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
           "amountLimits": {
           "min": 10,
           "max": 2000
        },
        "businessId": "{{businessId}}",
        "channelSet": {
         "channel": {
           "type": "finance_express"
         },
         "_id": "*"
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
           "paymentMethod": "santander_factoring_de",
           "amountLimits": {
             "min": 10,
             "max": 750
           },
           "enabled": true,
           "isBNPL": false,
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
         },
         {
           "paymentMethod": "santander_installment",
           "amountLimits": {
             "min": 750,
             "max": 2000
           },
           "enabled": true,
           "isBNPL": true,
           "productId": "125"
         }
        ],
        "ratesOrder": "asc",
        "styles": {
          "color": "green",
          "anotherStyle": "someValue"
        },
        "type": "dropdownCalculator",
        "cancelUrl": "cancel_url",
        "failureUrl": "failure_url",
        "noticeUrl": "notice_url",
        "pendingUrl": "pending_url",
        "successUrl": "success_url",
        "_id": "*"
      }
      """
    And I store a response as "response"
    And model "Widget" with id "{{response._id}}" should contain json:
      """
      {
        "amountLimits": {
           "min": 10,
           "max": 2000
        },
        "businessId": "{{businessId}}",
        "channelSet": "{{response.channelSet._id}}",
        "checkoutId": "{{checkoutId}}",
        "checkoutMode": "calculator",
        "checkoutPlacement": "rightSidebar",
        "maxHeight": 120,
        "minHeight": 400,
        "theme": "green",
        "alignment": "top",           
        "maxHeight": 120,
        "minHeight": 400,
        "theme": "green",
        "alignment": "top",        
        "isVisible": true,
        "maxWidth": 1000,
        "minWidth": 100,
        "payments": [
         {
           "paymentMethod": "santander_factoring_de",
           "amountLimits": {
             "min": 10,
             "max": 750
           },
           "enabled": true,
           "isBNPL": false,
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
         },
         {
           "paymentMethod": "santander_installment",
           "amountLimits": {
             "min": 750,
             "max": 2000
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
        "cancelUrl": "cancel_url",
        "failureUrl": "failure_url",
        "noticeUrl": "notice_url",
        "pendingUrl": "pending_url",
        "successUrl": "success_url",
        "_id": "*"
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
         {
           "name": "channels.event.channel-set.created",
           "payload": {
             "business": {
               "id": "{{businessId}}"
             },
             "channel": {
               "customPolicy": false,
               "enabledByDefault": false,
               "type": "finance_express"
             },
             "id": "{{response.channelSet._id}}"
           }
         }

      ]
      """

  Scenario: Create widget for another business should be forbidden
    Given I use DB fixture "businesses"
    When I send a POST request to "/api/business/{{anotherBusinessId}}/widget" with json:
      """
      {
        "amountLimits": {
          "min": 10,
          "max": 2000
        },
        "checkoutId": "{{checkoutId}}",
        "checkoutMode": "calculator",
        "checkoutPlacement": "rightSidebar",
        "maxHeight": 120,
        "minHeight": 400,
        "theme": "green",
        "alignment": "top",           
        "isBNPL": false,
        "isVisible": true,
        "maxWidth": 1000,
        "minWidth": 100,
        "payments": [
          {
            "paymentMethod": "santander_factoring_de",
            "amountLimits": {
              "min": 10,
              "max": 750
           },
           "enabled": true
          },
          {
            "paymentMethod": "santander_installment",
            "amountLimits": {
              "min": 750,
              "max": 2000
           },
           "enabled": true
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


  Scenario: Create widget with another checkout
    Given I use DB fixture "businesses"
    Given I use DB fixture "widgets"
    When I send a POST request to "/api/business/{{businessId}}/widget" with json:
      """
      {
        "amountLimits": {
          "min": 10,
          "max": 2000
        },
        "checkoutId": "{{checkoutId2}}",
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
            "paymentMethod": "santander_factoring_de",
            "amountLimits": {
              "min": 10,
              "max": 750
            },
            "enabled": true,
            "isBNPL": false
          },
          {
            "paymentMethod": "santander_installment",
            "amountLimits": {
              "min": 750,
              "max": 2000
            },
            "enabled": true,
            "isBNPL": true,
            "productId": "125"
          }
        ],
        "ratesOrder": "asc",
        "styles": {
          "color": "green",
          "anotherStyle": "someValue"
        },
        "type": "dropdownCalculator",
        "cancelUrl": "cancel_url",
        "failureUrl": "failure_url",
        "noticeUrl": "notice_url",
        "pendingUrl": "pending_url",
        "successUrl": "success_url"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
           "amountLimits": {
           "min": 10,
           "max": 2000
        },
        "businessId": "{{businessId}}",
        "channelSet": {
         "channel": {
           "type": "finance_express"
         },
         "_id": "*"
        },
        "checkoutId": "{{checkoutId2}}",
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
           "paymentMethod": "santander_factoring_de",
           "amountLimits": {
             "min": 10,
             "max": 750
           },
           "enabled": true,
           "isBNPL": false
         },
         {
           "paymentMethod": "santander_installment",
           "amountLimits": {
             "min": 750,
             "max": 2000
           },
           "enabled": true,
           "isBNPL": true,
           "productId": "125"
         }
        ],
        "ratesOrder": "asc",
        "styles": {
          "color": "green",
          "anotherStyle": "someValue"
        },
        "type": "dropdownCalculator",
        "cancelUrl": "cancel_url",
        "failureUrl": "failure_url",
        "noticeUrl": "notice_url",
        "pendingUrl": "pending_url",
        "successUrl": "success_url",
        "_id": "*"
      }
      """
    And I store a response as "response"
    And model "Widget" with id "{{response._id}}" should contain json:
      """
      {
        "amountLimits": {
           "min": 10,
           "max": 2000
        },
        "businessId": "{{businessId}}",
        "channelSet": "{{response.channelSet._id}}",
        "checkoutId": "{{checkoutId2}}",
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
           "paymentMethod": "santander_factoring_de",
           "amountLimits": {
             "min": 10,
             "max": 750
           },
           "enabled": true,
           "isBNPL": false
         },
         {
           "paymentMethod": "santander_installment",
           "amountLimits": {
             "min": 750,
             "max": 2000
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
        "cancelUrl": "cancel_url",
        "failureUrl": "failure_url",
        "noticeUrl": "notice_url",
        "pendingUrl": "pending_url",
        "successUrl": "success_url",
        "_id": "*"
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
         {
           "name": "channels.event.channel-set.created",
           "payload": {
             "business": {
               "id": "{{businessId}}"
             },
             "channel": {
               "customPolicy": false,
               "enabledByDefault": false,
               "type": "finance_express"
             },
             "id": "{{response.channelSet._id}}"
           }
         }

      ]
      """
