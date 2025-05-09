Feature: Checkout API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "integrationName" following value:
      """
      "santander_factoring_de"
      """
    Given I remember as "integrationId" following value:
      """
      "bce8ef2c-e88c-4066-acb0-1154bb995efc"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "checkoutSubscriptionId" following value:
      """
      "b0a201a7-b01f-40c4-bfd0-339cfb8d0675"
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

  Scenario: Get available common sections by checkout id
    Given I use DB fixture "checkout/checkout/get-sections/common-by-checkout-id"
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/sections/available"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "code":"order",
          "fixed":true,
          "defaultEnabled":true,
          "order":0,
          "allowed_only_channels":["pos"],
          "excluded_channels":[
            "finance_express",
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"cart",
              "rules":[
                {
                  "_id":"*",
                  "type":"flow_property",
                  "property":"cart",
                  "operator":"isNotEmpty"
                }
              ]
            },
            {
              "_id":"*",
              "code":"amount_reference",
              "rules":[
                {
                  "_id":"*",
                  "type":"flow_property",
                  "property":"cart",
                  "operator":"isEmpty"
                }
              ]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"user",
          "fixed":false,
          "defaultEnabled":true,
          "order":1,
          "excluded_channels":[
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-user",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"address",
          "fixed":false,
          "defaultEnabled":true,
          "order":2,
          "excluded_channels":[
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-address",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"choosePayment",
          "fixed":true,
          "defaultEnabled":true,
          "order":4,
          "excluded_channels":[],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-choose-payment",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "excluded_channels":[],
          "code":"payment",
          "fixed":true,
          "defaultEnabled":true,
          "order":5,
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-payment",
              "rules":[]
            }
          ],
          "__v":0
        }
      ]
      """

  Scenario: Get available common sections by checkout id with shipping section
    Given I use DB fixture "checkout/checkout/get-sections/check-shipping-section"
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/sections/available"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "code":"order",
          "fixed":true,
          "defaultEnabled":true,
          "order":0,
          "excluded_channels":[
            "finance_express",
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"cart",
              "rules":[
                {
                  "_id":"*",
                  "type":"flow_property",
                  "property":"cart",
                  "operator":"isNotEmpty"
                }
              ]
            },
            {
              "_id":"*",
              "code":"amount_reference",
              "rules":[
                {
                  "_id":"*",
                  "type":"flow_property",
                  "property":"cart",
                  "operator":"isEmpty"
                }
              ]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"user",
          "fixed":false,
          "defaultEnabled":true,
          "order":1,
          "excluded_channels":[
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-user",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"address",
          "fixed":false,
          "defaultEnabled":true,
          "order":2,
          "excluded_channels":[
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-address",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"shipping",
          "order":3,
          "fixed":false,
          "defaultEnabled":false,
          "excluded_channels":[],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-shipping",
              "rules":[]
            }
          ]
        },
        {
          "_id":"*",
          "code":"choosePayment",
          "fixed":true,
          "defaultEnabled":true,
          "order":4,
          "excluded_channels":[],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-choose-payment",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "excluded_channels":[],
          "code":"payment",
          "fixed":true,
          "defaultEnabled":true,
          "order":5,
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-payment",
              "rules":[]
            }
          ],
          "__v":0
        }
      ]
      """

  Scenario: Get available common sections by checkout id with send-to-device section
    Given I use DB fixture "checkout/checkout/get-sections/check-send-to-device-section"
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/sections/available"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "code":"send_to_device",
          "order":-1,
          "fixed":false,
          "defaultEnabled":false,
          "excluded_channels":[],
          "subsections":[
            {
              "rules":[],
              "_id":"*",
              "code":"checkout-send-to-device"
            }
          ]
        },
        {
          "_id":"*",
          "code":"order",
          "fixed":true,
          "defaultEnabled":true,
          "order":0,
          "excluded_channels":[
            "finance_express",
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"cart",
              "rules":[
                {
                  "_id":"*",
                  "type":"flow_property",
                  "property":"cart",
                  "operator":"isNotEmpty"
                }
              ]
            },
            {
              "_id":"*",
              "code":"amount_reference",
              "rules":[
                {
                  "_id":"*",
                  "type":"flow_property",
                  "property":"cart",
                  "operator":"isEmpty"
                }
              ]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"user",
          "fixed":false,
          "defaultEnabled":true,
          "order":1,
          "excluded_channels":[
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-user",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"address",
          "fixed":false,
          "defaultEnabled":true,
          "order":2,
          "excluded_channels":[
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-address",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"choosePayment",
          "fixed":true,
          "defaultEnabled":true,
          "order":4,
          "excluded_channels":[],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-choose-payment",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "excluded_channels":[],
          "code":"payment",
          "fixed":true,
          "defaultEnabled":true,
          "order":5,
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-payment",
              "rules":[]
            }
          ],
          "__v":0
        }
      ]
      """

  Scenario: Get available common sections by checkout id with additional sections
    Given I use DB fixture "checkout/checkout/get-sections/check-all-additional-sections"
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/sections/available"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id":"*",
          "code":"send_to_device",
          "order":-1,
          "fixed":false,
          "defaultEnabled":false,
          "excluded_channels":[],
          "subsections":[
            {
              "rules":[],
              "_id":"*",
              "code":"checkout-send-to-device"
            }
          ]
        },
        {
          "_id":"*",
          "code":"order",
          "fixed":true,
          "defaultEnabled":true,
          "order":0,
          "excluded_channels":[
            "finance_express",
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"cart",
              "rules":[
                {
                  "_id":"*",
                  "type":"flow_property",
                  "property":"cart",
                  "operator":"isNotEmpty"
                }
              ]
            },
            {
              "_id":"*",
              "code":"amount_reference",
              "rules":[
                {
                  "_id":"*",
                  "type":"flow_property",
                  "property":"cart",
                  "operator":"isEmpty"
                }
              ]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"user",
          "fixed":false,
          "defaultEnabled":true,
          "order":1,
          "excluded_channels":[
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-user",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"address",
          "fixed":false,
          "defaultEnabled":true,
          "order":2,
          "excluded_channels":[
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "shopware_cloud",
            "oro_commerce",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin",
            "smartstore"
          ],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-address",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "code":"shipping",
          "order":3,
          "fixed":false,
          "defaultEnabled":false,
          "excluded_channels":[],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-shipping",
              "rules":[]
            }
          ]
        },
        {
          "_id":"*",
          "code":"choosePayment",
          "fixed":true,
          "defaultEnabled":true,
          "order":4,
          "excluded_channels":[],
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-choose-payment",
              "rules":[]
            }
          ],
          "__v":0
        },
        {
          "_id":"*",
          "excluded_channels":[],
          "code":"payment",
          "fixed":true,
          "defaultEnabled":true,
          "order":5,
          "subsections":[
            {
              "_id":"*",
              "code":"checkout-main-payment",
              "rules":[]
            }
          ],
          "__v":0
        }
      ]
      """

  Scenario: Get available common sections by checkout id, endpoint permission
    Given I am not authenticated
    Given I use DB fixture "checkout/checkout/get-sections/common-by-checkout-id"
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/sections/available"
    Then print last response
    Then the response status code should be 403
