Feature: Integration API
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

  Scenario: Get payments integrations subscriptions
    Given I remember as "categoryName" following value:
      """
      "payments"
      """
    Given I use DB fixture "integration/business-integration-subscription/find-by-category/many"
    When I send a GET request to "/api/business/{{businessId}}/integration/category/{{categoryName}}"
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

  Scenario: Get shopsystems integrations subscriptions
    Given I remember as "categoryName" following value:
      """
      "shopsystems"
      """
    Given I use DB fixture "integration/business-integration-subscription/find-by-category/many"
    When I send a GET request to "/api/business/{{businessId}}/integration/category/{{categoryName}}"
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
            "_id":"1459d089-0c9a-4c81-bab8-919fd66425bf",
            "category":"shopsystems",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-jtl",
              "title":"JTL"
            },
            "name":"jtl",
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
            "_id":"452d4391-9be9-44c0-9ef0-3795df38a847",
            "category":"shopsystems",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-shopify",
              "title":"Shopify"
            },
            "name":"shopify",
            "settingsOptions":{
              "_id":"*",
              "source":"thirdparty"
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
            "_id":"214c9fbb-8c0d-4c7c-b851-959d5219cd6f",
            "category":"shopsystems",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-shopware",
              "title":"Shopware"
            },
            "name":"shopware",
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
          "installed": true,
          "_id": "*",
          "enabled": true,
          "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integration": {
            "isVisible": true,
            "_id": "91793838-e584-4efb-a1dc-4c44a133479c",
            "category": "shopsystems",
            "displayOptions": {
              "_id": "*",
              "icon": "#icon-opencart",
              "title": "OpenCart"
            },
            "name": "opencart",
            "settingsOptions": {
              "source": "thirdparty"
            },
            "createdAt": "*",
            "updatedAt": "*",
            "__v": 0
          },
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0,
          "id": "*"
        },
        {
           "installed": true,
           "enabled": true,
           "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
           "integration": {
             "isVisible": true,
             "category": "shopsystems",
             "displayOptions": {
               "icon": "#icon-oro-commerce",
               "title": "OroCommerce"
             },
             "name": "oro_commerce",
             "settingsOptions": {
               "source": "thirdparty"
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
          "enabled": true,
          "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integration": {
            "isVisible": true,
            "category": "shopsystems",
            "displayOptions": {
              "icon": "#icon-shopware-cloud",
              "title": "ShopwareCloud"
            },
            "name": "shopware_cloud",
            "settingsOptions": {
              "source": "thirdparty"
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
          "enabled": true,
          "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
          "integration": {
            "isVisible": true,
            "category": "shopsystems",
            "displayOptions": {
              "icon": "#icon-smartstore",
              "title": "Smartstore"
            },
            "name": "smartstore",
            "settingsOptions": {
              "source": "thirdparty"
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

  Scenario: Get shippings integrations subscriptions
    Given I remember as "categoryName" following value:
      """
      "shopsystems"
      """
    Given I use DB fixture "integration/business-integration-subscription/find-by-category/many"
    When I send a GET request to "/api/business/{{businessId}}/integration/category/{{categoryName}}"
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
            "_id":"1459d089-0c9a-4c81-bab8-919fd66425bf",
            "category":"shopsystems",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-jtl",
              "title":"JTL"
            },
            "name":"jtl",
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
            "_id":"452d4391-9be9-44c0-9ef0-3795df38a847",
            "category":"shopsystems",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-shopify",
              "title":"Shopify"
            },
            "name":"shopify",
            "settingsOptions":{
              "_id":"*",
              "source":"thirdparty"
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
            "_id":"214c9fbb-8c0d-4c7c-b851-959d5219cd6f",
            "category":"shopsystems",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-shopware",
              "title":"Shopware"
            },
            "name":"shopware",
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

  Scenario: Get integrations without permission
    Given I am not authenticated
    Given I remember as "categoryName" following value:
      """
      "payments"
      """
    Given I use DB fixture "integration/business-integration-subscription/find-by-category/many"
    When I send a GET request to "/api/business/{{businessId}}/integration/category/{{categoryName}}"
    Then print last response
    And the response status code should be 403
