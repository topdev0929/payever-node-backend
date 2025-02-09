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

  Scenario: Get payments integrations
    Given I remember as "categoryName" following value:
      """
      "payments"
      """
    Given I use DB fixture "integration/integration/find-by-category/many"
    When I send a GET request to "/api/integration/category/{{categoryName}}"
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
          "_id":"d819a312-b8ba-452a-91b7-86d695b7e069",
          "category":"payments",
          "displayOptions":{
            "_id":"*",
            "icon":"#icon-payment-option-santander",
            "title":"integrations.payments.santander_installment_uk.title"
          },
          "name":"santander_installment_uk",
          "settingsOptions":{
            "_id":"*",
            "source":"source"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"f0ce557e-23f5-4a06-88f8-d9d8484357cc",
          "category":"payments",
          "displayOptions":{
            "_id":"*",
            "icon":"#icon-payment-option-santander",
            "title":"integrations.payments.santander_pos_installment_uk.title"
          },
          "name":"santander_pos_installment_uk",
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
        },
        {
          "_id":"c624e9f1-933b-4a17-8b22-4555230bdfee",
          "category":"payments",
          "displayOptions":{
            "_id":"*",
            "icon":"#icon-payment-option-santander",
            "title":"integrations.payments.santander_installment_fi.title"
          },
          "name":"santander_installment_fi",
          "settingsOptions":{
            "_id":"*",
            "source":"source"
          },
          "createdAt":"*",
          "updatedAt":"*"
        },
        {
          "_id":"d1bf827a-4329-4947-a36f-31dc6e43cfd7",
          "category":"payments",
          "displayOptions":{
            "_id":"*",
            "icon":"#icon-payment-option-santander",
            "title":"integrations.payments.santander_pos_installment_fi.title"
          },
          "name":"santander_pos_installment_fi",
          "settingsOptions":{
            "_id":"*",
            "source":"source"
          },
          "createdAt":"*",
          "updatedAt":"*"
        }
      ]
      """

  Scenario: Get shopsystems integrations
    Given I remember as "categoryName" following value:
      """
      "shopsystems"
      """
    Given I use DB fixture "integration/integration/find-by-category/many"
    When I send a GET request to "/api/integration/category/{{categoryName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"1459d089-0c9a-4c81-bab8-919fd66425bf",
          "category":"{{categoryName}}",
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
          "_id":"452d4391-9be9-44c0-9ef0-3795df38a847",
          "category":"{{categoryName}}",
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
          "_id":"214c9fbb-8c0d-4c7c-b851-959d5219cd6f",
          "category":"{{categoryName}}",
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
        }
      ]
      """

  Scenario: Get shippings integrations
    Given I remember as "categoryName" following value:
      """
      "shippings"
      """
    Given I use DB fixture "integration/integration/find-by-category/many"
    When I send a GET request to "/api/integration/category/{{categoryName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"46dff89b-6190-4e55-bdc4-fa1888bda518",
          "category":"{{categoryName}}",
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
          "_id":"4fa49de4-1fc6-4d5b-a40e-c9df48058c24",
          "category":"{{categoryName}}",
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
          "_id":"07056a9a-e75f-49da-89ad-ba0e02680935",
          "category":"{{categoryName}}",
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
        }
      ]
      """

  Scenario: Get integrations without permission
    Given I am not authenticated
    Given I remember as "categoryName" following value:
      """
      "payments"
      """
    Given I use DB fixture "integration/integration/find-all/many"
    When I send a GET request to "/api/integration/category/{{categoryName}}"
    Then print last response
    And the response status code should be 403
