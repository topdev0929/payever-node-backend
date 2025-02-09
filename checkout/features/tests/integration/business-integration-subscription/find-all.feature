Feature: Integration Subscription API
  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
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

  Scenario: Get all business subscriptions
    Given I use DB fixture "integration/business-integration-subscription/find-all/many"
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "installed":true,
          "_id":"*",
          "enabled":true,
          "businessId":"a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integration":{
            "_id":"ffb0b18f-dbce-4ca8-b9e7-905f67bb7ba3",
            "category":"payments",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-payment-option-wire-transfer",
              "title":"integrations.payments.cash.title"
            },
            "name":"cash",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "installed":true,
          "_id":"*",
          "enabled":true,
          "businessId":"a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integration":{
            "_id":"044aace0-866c-4221-b37a-dccf9a8c5cd5",
            "category":"payments",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-payment-option-paypall",
              "title":"integrations.payments.paypal.title"
            },
            "name":"paypal",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "installed":true,
          "_id":"*",
          "enabled":true,
          "businessId":"a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integration":{
            "_id":"4d5ea0fb-2991-4495-9d38-d58f1961c8ef",
            "category":"payments",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-payment-option-santander",
              "title":"integrations.payments.santander_ccp_installment.title"
            },
            "name":"santander_ccp_installment",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "installed":true,
          "_id":"*",
          "enabled":true,
          "businessId":"a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integration":{
            "_id":"bce8ef2c-e88c-4066-acb0-1154bb995efc",
            "category":"payments",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-payment-option-santander",
              "title":"integrations.payments.santander_factoring_de.title"
            },
            "name":"santander_factoring_de",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "installed":true,
          "_id":"*",
          "enabled":true,
          "businessId":"a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integration":{
            "_id":"459891bb-78e3-413e-b874-acbdcaef85d6",
            "category":"payments",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-payment-option-santander",
              "title":"integrations.payments.santander_installment.title"
            },
            "name":"santander_installment",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "installed":true,
          "_id":"*",
          "enabled":true,
          "businessId":"a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integration":{
            "_id":"49fe6119-cd82-43eb-acc9-2e09422feab8",
            "category":"payments",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-payment-option-santander",
              "title":"integrations.payments.santander_invoice_de.title"
            },
            "name":"santander_invoice_de",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "installed":true,
          "_id":"*",
          "enabled":true,
          "businessId":"a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integration":{
            "_id":"451b2853-565f-4d39-94f5-6e8945f738ee",
            "category":"payments",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-payment-option-santander",
              "title":"integrations.payments.santander_pos_factoring_de.title"
            },
            "name":"santander_pos_factoring_de",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "installed":true,
          "_id":"*",
          "enabled":true,
          "businessId":"a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integration":{
            "_id":"266bea2e-ae61-4d75-802e-6320416010f4",
            "category":"payments",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-payment-option-stripe-direct-debit",
              "title":"integrations.payments.stripe_directdebit.title"
            },
            "name":"stripe_directdebit",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*"
          },
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: Get all business subscriptions, payex integration should be hidden
    Given I use DB fixture "integration/business-integration-subscription/find-all/hidden"
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    And the response status code should be 200
    And the response should not contain json:
      """
      [
        {
           "installed": true,
           "_id": "*",
           "enabled": true,
           "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
           "integration": {
             "isVisible": true,
             "_id": "f77e8693-9e34-441c-82b6-53e4c0c13e19",
             "category": "payments",
             "displayOptions": {
               "_id": "c468193d-26a9-446b-b4ce-3459041ce61a",
               "icon": "#icon-payment-option-payex",
               "title": "integrations.payments.payex.title"
             },
             "name": "payex_creditcard",
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

  Scenario: Get integrations without permission
    Given I am not authenticated
    Given I use DB fixture "integration/business-integration-subscription/find-all/many"
    When I send a GET request to "/api/business/{{businessId}}/integration"
    Then print last response
    And the response status code should be 403
