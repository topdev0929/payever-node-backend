@business-created
Feature: Business API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "business" following value:
      """
      {
        "id": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
        "name": "Some Business Name",
        "currency": "EUR",
        "createdAt": "2019-11-08T08:27:18.286Z",
        "updatedAt": "2019-11-08T08:27:18.286Z"
      }
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
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
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "checkouts",
          {
          }
         ],
        "result": {}
      }
      """


  Scenario: No languages, No countries from Common module, no country in message
    Given I use DB fixture "business/business-bus-message/business.created/no-languages-from-common"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.rpc.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "{{business.name}}",
          "currency": "{{business.currency}}",
          "businessDetail": {
            "_id": "business-detail-id",
            "companyAddress": {
              "_id": "9016d8fb-6587-4990-ab8a-0b61dd44599f",
              "country": "GB",
              "updatedAt": "2022-10-04T14:17:26.866Z",
              "createdAt": "2022-10-04T14:17:26.866Z"
            }
          },
          "createdAt": "{{business.createdAt}}",
          "updatedAt": "{{business.updatedAt}}",
          "defaultLanguage": "se"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "name": "{{business.name}}",
        "currency": "{{business.currency}}",
        "defaultLanguage": "se"
      }
      """
    Then I look for model "BusinessDetails" with id "business-detail-id" and remember as "businessDetail"
    And stored value "businessDetail" should contain json:
      """
      {
        "_id": "business-detail-id",
        "companyAddress": {
          "country": "GB"
        }
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"1948724e-af13-441d-b6a8-9d54a4e26498",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-bubble-16",
              "title":"channelsList.bubble"
            },
            "name":"bubble",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"a83b54c0-333b-4e13-895e-a498eae4529d",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-ep-button-16",
              "title":"channelsList.button"
            },
            "name":"button",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"592e0d05-adf7-4d1b-a2e1-dee8be51819e",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-b-layout-32",
              "title":"channelsList.calculator"
            },
            "name":"calculator",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"eec902d8-80dd-4ce9-8bcc-f132f81b5947",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.directLink"
            },
            "name":"direct_link",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"3bfdf191-0297-44fa-97ad-ac614a922fcd",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.textLink"
            },
            "name":"textLink",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: With languages, No countries from Common module, no country in message
    Given I use DB fixture "business/business-bus-message/business.created/with-languages-no-countries-from-common"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.rpc.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "{{business.name}}",
          "currency": "{{business.currency}}",
          "createdAt": "{{business.createdAt}}",
          "updatedAt": "{{business.updatedAt}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "name": "{{business.name}}",
        "currency": "{{business.currency}}"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"1948724e-af13-441d-b6a8-9d54a4e26498",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-bubble-16",
              "title":"channelsList.bubble"
            },
            "name":"bubble",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"a83b54c0-333b-4e13-895e-a498eae4529d",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-ep-button-16",
              "title":"channelsList.button"
            },
            "name":"button",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"592e0d05-adf7-4d1b-a2e1-dee8be51819e",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-b-layout-32",
              "title":"channelsList.calculator"
            },
            "name":"calculator",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"eec902d8-80dd-4ce9-8bcc-f132f81b5947",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.directLink"
            },
            "name":"direct_link",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"3bfdf191-0297-44fa-97ad-ac614a922fcd",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.textLink"
            },
            "name":"textLink",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: With languages, With countries from Common module, no country in message
    Given I use DB fixture "business/business-bus-message/business.created/with-languages-with-countries-from-common"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.rpc.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "{{business.name}}",
          "currency": "{{business.currency}}",
          "createdAt": "{{business.createdAt}}",
          "updatedAt": "{{business.updatedAt}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "name": "{{business.name}}",
        "currency": "{{business.currency}}"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"1948724e-af13-441d-b6a8-9d54a4e26498",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-bubble-16",
              "title":"channelsList.bubble"
            },
            "name":"bubble",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"a83b54c0-333b-4e13-895e-a498eae4529d",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-ep-button-16",
              "title":"channelsList.button"
            },
            "name":"button",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"592e0d05-adf7-4d1b-a2e1-dee8be51819e",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-b-layout-32",
              "title":"channelsList.calculator"
            },
            "name":"calculator",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"eec902d8-80dd-4ce9-8bcc-f132f81b5947",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.directLink"
            },
            "name":"direct_link",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"3bfdf191-0297-44fa-97ad-ac614a922fcd",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.textLink"
            },
            "name":"textLink",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: With languages, With countries from Common module, Norway country in message
    Given I use DB fixture "business/business-bus-message/business.created/with-languages-with-countries-from-common"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.rpc.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "{{business.name}}",
          "currency": "{{business.currency}}",
          "createdAt": "{{business.createdAt}}",
          "updatedAt": "{{business.updatedAt}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "name": "{{business.name}}",
        "currency": "{{business.currency}}"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"1948724e-af13-441d-b6a8-9d54a4e26498",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-bubble-16",
              "title":"channelsList.bubble"
            },
            "name":"bubble",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"a83b54c0-333b-4e13-895e-a498eae4529d",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-ep-button-16",
              "title":"channelsList.button"
            },
            "name":"button",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"592e0d05-adf7-4d1b-a2e1-dee8be51819e",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-b-layout-32",
              "title":"channelsList.calculator"
            },
            "name":"calculator",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"eec902d8-80dd-4ce9-8bcc-f132f81b5947",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.directLink"
            },
            "name":"direct_link",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"3bfdf191-0297-44fa-97ad-ac614a922fcd",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.textLink"
            },
            "name":"textLink",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: With languages, With countries from Common module, Sweden country in message
    Given I use DB fixture "business/business-bus-message/business.created/with-languages-with-countries-from-common"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.rpc.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "{{business.name}}",
          "currency": "{{business.currency}}",
          "createdAt": "{{business.createdAt}}",
          "updatedAt": "{{business.updatedAt}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "name": "{{business.name}}",
        "currency": "{{business.currency}}"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"1948724e-af13-441d-b6a8-9d54a4e26498",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-bubble-16",
              "title":"channelsList.bubble"
            },
            "name":"bubble",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"a83b54c0-333b-4e13-895e-a498eae4529d",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-ep-button-16",
              "title":"channelsList.button"
            },
            "name":"button",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"592e0d05-adf7-4d1b-a2e1-dee8be51819e",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-b-layout-32",
              "title":"channelsList.calculator"
            },
            "name":"calculator",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"eec902d8-80dd-4ce9-8bcc-f132f81b5947",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.directLink"
            },
            "name":"direct_link",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"3bfdf191-0297-44fa-97ad-ac614a922fcd",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.textLink"
            },
            "name":"textLink",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: With languages, With countries from Common module, Germany country in message
    Given I use DB fixture "business/business-bus-message/business.created/with-languages-with-countries-from-common"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.rpc.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "{{business.name}}",
          "currency": "{{business.currency}}",
          "createdAt": "{{business.createdAt}}",
          "updatedAt": "{{business.updatedAt}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "name": "{{business.name}}",
        "currency": "{{business.currency}}"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"1948724e-af13-441d-b6a8-9d54a4e26498",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-bubble-16",
              "title":"channelsList.bubble"
            },
            "name":"bubble",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"a83b54c0-333b-4e13-895e-a498eae4529d",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-ep-button-16",
              "title":"channelsList.button"
            },
            "name":"button",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"592e0d05-adf7-4d1b-a2e1-dee8be51819e",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-b-layout-32",
              "title":"channelsList.calculator"
            },
            "name":"calculator",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"eec902d8-80dd-4ce9-8bcc-f132f81b5947",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.directLink"
            },
            "name":"direct_link",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"3bfdf191-0297-44fa-97ad-ac614a922fcd",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.textLink"
            },
            "name":"textLink",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: With languages, With countries from Common module, Great Britain country in message
    Given I use DB fixture "business/business-bus-message/business.created/with-languages-with-countries-from-common"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.rpc.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "{{business.name}}",
          "currency": "{{business.currency}}",
          "createdAt": "{{business.createdAt}}",
          "updatedAt": "{{business.updatedAt}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "name": "{{business.name}}",
        "currency": "{{business.currency}}"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"1948724e-af13-441d-b6a8-9d54a4e26498",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-bubble-16",
              "title":"channelsList.bubble"
            },
            "name":"bubble",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"a83b54c0-333b-4e13-895e-a498eae4529d",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-ep-button-16",
              "title":"channelsList.button"
            },
            "name":"button",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"592e0d05-adf7-4d1b-a2e1-dee8be51819e",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-b-layout-32",
              "title":"channelsList.calculator"
            },
            "name":"calculator",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"eec902d8-80dd-4ce9-8bcc-f132f81b5947",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.directLink"
            },
            "name":"direct_link",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"3bfdf191-0297-44fa-97ad-ac614a922fcd",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.textLink"
            },
            "name":"textLink",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: With languages, With countries from Common module, Spain country in message
    Given I use DB fixture "business/business-bus-message/business.created/with-languages-with-countries-from-common"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.rpc.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "{{business.name}}",
          "currency": "{{business.currency}}",
          "createdAt": "{{business.createdAt}}",
          "updatedAt": "{{business.updatedAt}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "name": "{{business.name}}",
        "currency": "{{business.currency}}"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"1948724e-af13-441d-b6a8-9d54a4e26498",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-bubble-16",
              "title":"channelsList.bubble"
            },
            "name":"bubble",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"a83b54c0-333b-4e13-895e-a498eae4529d",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-ep-button-16",
              "title":"channelsList.button"
            },
            "name":"button",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"592e0d05-adf7-4d1b-a2e1-dee8be51819e",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-b-layout-32",
              "title":"channelsList.calculator"
            },
            "name":"calculator",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"eec902d8-80dd-4ce9-8bcc-f132f81b5947",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.directLink"
            },
            "name":"direct_link",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"3bfdf191-0297-44fa-97ad-ac614a922fcd",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.textLink"
            },
            "name":"textLink",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: With languages, With countries from Common module, Denmark country in message
    Given I use DB fixture "business/business-bus-message/business.created/with-languages-with-countries-from-common"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.rpc.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "{{business.name}}",
          "currency": "{{business.currency}}",
          "createdAt": "{{business.createdAt}}",
          "updatedAt": "{{business.updatedAt}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "name": "{{business.name}}",
        "currency": "{{business.currency}}"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"1948724e-af13-441d-b6a8-9d54a4e26498",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-bubble-16",
              "title":"channelsList.bubble"
            },
            "name":"bubble",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"a83b54c0-333b-4e13-895e-a498eae4529d",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-ep-button-16",
              "title":"channelsList.button"
            },
            "name":"button",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"592e0d05-adf7-4d1b-a2e1-dee8be51819e",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-b-layout-32",
              "title":"channelsList.calculator"
            },
            "name":"calculator",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"eec902d8-80dd-4ce9-8bcc-f132f81b5947",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.directLink"
            },
            "name":"direct_link",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"3bfdf191-0297-44fa-97ad-ac614a922fcd",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.textLink"
            },
            "name":"textLink",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: With languages, With countries from Common module, Russia country in message (out of defaults)
    Given I use DB fixture "business/business-bus-message/business.created/with-languages-with-countries-from-common"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.rpc.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "{{business.name}}",
          "currency": "{{business.currency}}",
          "createdAt": "{{business.createdAt}}",
          "updatedAt": "{{business.updatedAt}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "name": "{{business.name}}",
        "currency": "{{business.currency}}"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"1948724e-af13-441d-b6a8-9d54a4e26498",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-bubble-16",
              "title":"channelsList.bubble"
            },
            "name":"bubble",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"a83b54c0-333b-4e13-895e-a498eae4529d",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-ep-button-16",
              "title":"channelsList.button"
            },
            "name":"button",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"592e0d05-adf7-4d1b-a2e1-dee8be51819e",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-b-layout-32",
              "title":"channelsList.calculator"
            },
            "name":"calculator",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"eec902d8-80dd-4ce9-8bcc-f132f81b5947",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.directLink"
            },
            "name":"direct_link",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"*",
          "installed":true,
          "businessId":"{{businessId}}",
          "integration":{
            "_id":"3bfdf191-0297-44fa-97ad-ac614a922fcd",
            "category":"channels",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-link2-16",
              "title":"channelsList.textLink"
            },
            "name":"textLink",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "enabled":false,
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """
