Feature: Get checkout settings by ChannelSet
  Scenario: Get full checkout settings by channel set
    Given I remember as "channelSetId" following value:
      """
      "a084c7a1-3954-439a-ac42-45e7218cd512"
      """
    Given I use DB fixture "checkout/settings/exists-channel-set"
    When I send a GET request to "/api/checkout/channel-set/{{channelSetId}}/full-settings"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "enableCustomerAccount": false,
      "enableDisclaimerPolicy": false,
      "enableLegalPolicy": false,
      "enablePayeverTerms": false,
      "enablePrivacyPolicy": false,
      "enableRefundPolicy": false,
      "enableShippingPolicy": false,
      "paymentMethods": [
        "santander_factoring_de"
      ],
      "businessName":"*",
      "sections": [
        {
          "code": "order",
          "enabled": true,
          "options": {},
          "order": 0
        },
        {
          "code": "address",
          "enabled": true,
          "options": {},
          "order": 1
        },
        {
          "code": "choosePayment",
          "enabled": true,
          "options": {},
          "order": 2
        },
        {
          "code": "ocr",
          "enabled": true,
          "options": {
            "skipButton": false
          },
          "order": 3
        },
        {
          "code": "payment",
          "enabled": true,
          "options": {},
          "order": 4
        },
        {
          "code": "user",
          "enabled": false,
          "options": {},
          "order": 5
        }
      ]
    }
    """
    And the response should not contain json:
    """
    {
      "paymentMethods": [
        "payex_creditcard"
      ]
    }
    """

  Scenario: Get checkout ui settings by channel set
    Given I remember as "channelSetId" following value:
      """
      "a084c7a1-3954-439a-ac42-45e7218cd512"
      """
    Given I use DB fixture "checkout/settings/exists-channel-set"
    When I send a GET request to "/api/checkout/channel-set/{{channelSetId}}/ui-settings"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "sections": [
        {
          "allowed_only_channels": [
            "pos"
          ],
          "allowed_only_integrations": [],
          "excluded_integrations": [],
          "code": "order",
          "enabled": true,
          "excluded_channels": [
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
            "oro_commerce",
            "shopware_cloud",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin"
          ],
          "fixed": true,
          "options": {

          },
          "order": 0,
          "subsections": [
            {
              "_id": "*",
              "rules": [
                {
                  "_id": "261e569a-7d98-444f-87b6-28cb21cf191e",
                  "type": "flow_property",
                  "property": "cart",
                  "operator": "isNotEmpty"
                }
              ],
              "code": "cart"
            },
            {
              "_id": "*",
              "rules": [
                {
                  "_id": "3e809d11-0a15-4362-8c46-490e4520d428",
                  "type": "flow_property",
                  "property": "cart",
                  "operator": "isEmpty"
                }
              ],
              "code": "amount_reference"
            }
          ]
        },
        {
          "allowed_only_channels": [

          ],
          "allowed_only_integrations": [],
          "excluded_integrations": [
            "apple_pay","google_pay","paypal"
          ],
          "code": "address",
          "enabled": true,
          "excluded_channels": [
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "oro_commerce",
            "shopware_cloud",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin"
          ],
          "fixed": false,
          "options": {

          },
          "order": 1,
          "subsections": [
            {
              "_id": "*",
              "rules": [

              ],
              "code": "checkout-main-address"
            }
          ]
        },
        {
          "allowed_only_channels": [

          ],
          "allowed_only_integrations": [],
          "excluded_integrations": [],
          "code": "choosePayment",
          "enabled": true,
          "excluded_channels": [

          ],
          "fixed": true,
          "options": {

          },
          "order": 2,
          "subsections": [
            {
              "_id": "*",
              "rules": [

              ],
              "code": "checkout-main-choose-payment"
            }
          ]
        },
        {
          "allowed_only_channels": [

          ],
          "allowed_only_integrations": [],
          "excluded_integrations": [],
          "code": "ocr",
          "enabled": true,
          "excluded_channels": [

          ],
          "fixed": false,
          "options": {
            "skipButton": false
          },
          "order": 3,
          "subsections": [
            {
              "_id": "*",
              "rules": [

              ],
              "code": "checkout-main-ocr"
            }
          ]
        },
        {
          "allowed_only_channels": [

          ],
          "allowed_only_integrations": [],
          "excluded_integrations": [],
          "code": "payment",
          "enabled": true,
          "excluded_channels": [

          ],
          "fixed": true,
          "options": {

          },
          "order": 4,
          "subsections": [
            {
              "_id": "*",
              "rules": [

              ],
              "code": "checkout-main-payment"
            }
          ]
        },
        {
          "allowed_only_channels": [

          ],
          "allowed_only_integrations": [],
          "excluded_integrations": [],
          "code": "user",
          "enabled": false,
          "excluded_channels": [
            "api",
            "dandomain",
            "jtl",
            "magento",
            "oxid",
            "plentymarkets",
            "presta",
            "shopify",
            "opencart",
            "oro_commerce",
            "shopware_cloud",
            "shopware",
            "woo_commerce",
            "xt_commerce",
            "commercetools",
            "ccvshop",
            "connectin"
          ],
          "fixed": false,
          "options": {

          },
          "order": 5,
          "subsections": [
            {
              "_id": "*",
              "rules": [

              ],
              "code": "checkout-main-user"
            }
          ]
        }
      ],
      "styles": {
        "businessHeaderBorderColor": "#ffff",
        "buttonFill": true,
        "active": true
      },
      "uuid": "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054",
      "version": "default"
    }
    """

  Scenario: Get checkout base settings by channel set
    Given I remember as "channelSetId" following value:
      """
      "a084c7a1-3954-439a-ac42-45e7218cd512"
      """
    Given I use DB fixture "checkout/settings/exists-channel-set"
    When I send a GET request to "/api/checkout/channel-set/{{channelSetId}}/base-settings"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "businessUuid": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
      "currency": "EUR",
      "languages": [
       {
         "active": false,
         "isDefault": false,
         "code": "de",
         "name": "Deutsch",
         "_id": "*"
       },
       {
         "active": true,
         "isDefault": true,
         "code": "en",
         "name": "English",
         "_id": "*"
       }
      ],
      "limits": {},
      "name": "Checkout",
      "paymentMethods": [
       "santander_factoring_de"
      ],
      "testingMode": false,
      "uuid": "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
    }
    """
