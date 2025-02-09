@folders
Feature: Test for Integration Wrapper controller
  Background:
    Given I load constants from "features/fixtures/const.ts"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_1}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          },
          {
            "name": "user",
            "permissions": []
          },
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """
    And I use DB fixture "integrations/businesses"
  Scenario: Get integration by name and business
    And I use DB fixture "integrations/integration-wrapper"
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/integration-wrapper/credit_card"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "wrapperType": "credit_card",
        "displayOptions": {
          "icon": "#icon-payment-option-credit-card",
          "title": "integrations.payments.credit-card.title",
          "bgColor": "#59AFF9-#6755FF"
        },
        "optionIcon": "#icon-payment-option-credit-card",
        "category": "integrations.payments.credit-card.category",
        "developer": "integrations.payments.credit-card.developer",
        "languages": "integrations.payments.credit-card.languages",
        "description": "integrations.payments.credit-card.description",
        "connect": {
          "formAction": {
            "installEndpoint": "/business/{businessId}/integration-wrapper/credit_card/install",
            "uninstallEndpoint": "/business/{businessId}/integration-wrapper/credit_card/uninstall"
          }
        },
        "installationOptions": {
          "links": [
            {
              "type": "img",
              "url": "*"
            }
          ]
        },
        "businessId": "_id-of-existing-business",
        "installed": true,
        "wrappedIntegrations": [
          {
            "allowedBusinesses": [
              "_id-of-existing-business"
            ],
            "enabled": true,
            "order": 1,
            "scopes": [
              "read_products",
              "write_products"
            ],
            "category": "payment",
            "displayOptions": {
              "title": "stripe",
              "icon": "icon-stripe.png"
            },
            "installationOptions": {
              "countryList": [],
              "links": [],
              "appSupport": "",
              "category": "payment",
              "description": "pay via stripe",
              "developer": "1",
              "languages": "en, de",
              "optionIcon": "icon-stripe.png",
              "price": "0.00",
              "pricingLink": "",
              "website": "",
              "wrapperType": "credit_card"
            },
            "name": "stripe",
            "reviews": [],
            "versions": [],
            "installed": false
          }
        ]
      }
      """
  Scenario: Install new wrapper
    When I send a PATCH request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/integration-wrapper/credit_card/install"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "businessId": "_id-of-existing-business",
        "installed": true,
        "type": "credit_card"
      }
      """
  Scenario: Uninstall wrapper
    And I use DB fixture "integrations/integration-wrapper"
    When I send a PATCH request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/integration-wrapper/credit_card/uninstall"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "businessId": "_id-of-existing-business",
        "installed": false,
        "type": "credit_card"
      }
      """