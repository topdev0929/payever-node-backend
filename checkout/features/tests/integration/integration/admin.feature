Feature: Admin Integration API
  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "integrationName" following value:
      """
      "santander_factoring_de"
      """
    Given I remember as "integrationCategory" following value:
      """
      "payments"
      """
    Given I remember as "integrationTitle" following value:
      """
      "integrations.payments.santander_factoring_de.title"
      """
    Given I remember as "integrationIcon" following value:
      """
      "#icon-payment-option-santander"
      """
    Given I remember as "integrationOrder" following value:
      """
      "0"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin",
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

  Scenario: Get all integrations
    Given I use DB fixture "integration/integration/find-all/many"
    When I send a GET request to "/api/admin/integrations"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
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
        {
          "_id":"46dff89b-6190-4e55-bdc4-fa1888bda518",
          "category":"shippings",
          "displayOptions":{
            "_id":"*",
            "icon":"#icon-shipping-dhl-32",
            "title":"integrations.shippings.dhl.title"
          },
          "name":"dhl",
          "settingsOptions":{
            "_id":"*",
            "source":"source"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
          "_id":"4fa49de4-1fc6-4d5b-a40e-c9df48058c24",
          "category":"shippings",
          "displayOptions":{
            "_id":"*",
            "icon":"#icon-apps-shipping",
            "title":"integrations.shippings.shipping.title"
          },
          "name":"shipping",
          "settingsOptions":{
            "_id":"*",
            "source":"source"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
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
        {
          "isVisible": true,
          "category": "shopsystems",
          "displayOptions": {
            "icon": "#icon-opencart",
            "title": "OpenCart"
          },
          "name": "opencart",
          "settingsOptions": {
            "source": "thirdparty"
          }
        },
        {
          "isVisible": true,
          "category": "shopsystems",
          "displayOptions": {
            "icon": "#icon-oro-commerce",
            "title": "OroCommerce"
          },
          "name": "oro_commerce",
          "settingsOptions": {
            "source": "thirdparty"
          }
        },
        {
          "isVisible": true,
          "category": "shopsystems",
          "displayOptions": {
            "icon": "#icon-shopware-cloud",
            "title": "ShopwareCloud"
          },
          "name": "shopware_cloud",
          "settingsOptions": {
            "source": "thirdparty"
          }
        },
        {
          "isVisible": true,
          "category": "shopsystems",
          "displayOptions": {
            "icon": "#icon-smartstore",
            "title": "Smartstore"
          },
          "name": "smartstore",
          "settingsOptions": {
            "source": "thirdparty"
          }
        },
        {
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
        {
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
        {
          "_id":"07056a9a-e75f-49da-89ad-ba0e02680935",
          "category":"shippings",
          "displayOptions":{
            "_id":"*",
            "icon":"#icon-shipping-ups-white",
            "title":"integrations.shippings.ups.title"
          },
          "name":"ups",
          "settingsOptions":{
            "_id":"*",
            "source":"source"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"46882690-798f-468e-8bce-4ab5e0bb6d92",
          "category":"payments",
          "displayOptions":{
            "_id":"*",
            "icon":"#icon-payment-option-apple-pay",
            "title":"integrations.payments.apple-pay.title"
          },
          "name":"apple_pay",
          "settingsOptions":{
            "_id":"*",
            "source":"source"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"86650b25-05e1-45ea-b42e-089dec7cc180",
          "category":"payments",
          "displayOptions":{
            "_id":"*",
            "icon":"#icon-payment-option-google-pay",
            "title":"integrations.payments.google-pay.title"
          },
          "name":"google_pay",
          "settingsOptions":{
            "_id":"*",
            "source":"source"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"df1530a1-3c91-4ba1-8582-40b18d354f24",
          "category":"payments",
          "displayOptions":{
            "_id":"*",
            "icon":"#icon-payment-option-openbank",
            "title":"integrations.payments.openbank.title"
          },
          "name":"openbank",
          "settingsOptions":{
            "_id":"*",
            "source":"source"
          },
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: Get integrations without permission
    Given I am not authenticated
    Given I use DB fixture "integration/integration/find-all/many"
    When I send a GET request to "/api/admin/integrations"
    Then print last response
    And the response status code should be 403

  Scenario: Create new integration with admin permission
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """
    When I send a POST request to "/api/admin/integrations" with json:
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}",
        "displayOptions": {
          "title": "{{integrationTitle}}",
          "icon": "{{integrationIcon}}",
          "order": "{{integrationOrder}}"
        }
      }
      """
    Then print last response
    And the response status code should be 201
    Then I look for model "Integration" by following JSON and remember as "foundIntegration":
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}"
      }
      """
    And stored value "foundIntegration" should contain json:
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}",
        "displayOptions": {
          "title": "{{integrationTitle}}",
          "icon": "{{integrationIcon}}",
          "order": "{{integrationOrder}}"
        }
      }
      """

  Scenario: Create new integration with admin permission on existing name
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """
    Given I use DB fixture "integration/integration/create/existing-payment"
    When I send a POST request to "/api/admin/integrations" with json:
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}",
        "displayOptions": {
          "title": "{{integrationTitle}}",
          "icon": "{{integrationIcon}}",
          "order": "{{integrationOrder}}"
        }
      }
      """
    Then print last response
    And the response status code should be 409

  Scenario: Create new integration with merchant permission, forbidden
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": []
          }
        ]
      }
      """
    Given I use DB fixture "integration/integration/find-all/many"
    When I send a POST request to "/api/admin/integrations" with json:
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}",
        "displayOptions": {
          "title": "{{integrationTitle}}",
          "icon": "{{integrationIcon}}",
          "order": "{{integrationOrder}}"
        }
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: Create new integration with anonymous permission, forbidden
    Given I am not authenticated
    Given I use DB fixture "integration/integration/find-all/many"
    When I send a POST request to "/api/admin/integrations" with json:
      """
      {
        "name": "{{integrationName}}",
        "category": "{{integrationCategory}}",
        "displayOptions": {
          "title": "{{integrationTitle}}",
          "icon": "{{integrationIcon}}",
          "order": "{{integrationOrder}}"
        }
      }
      """
    Then print last response
    And the response status code should be 403
