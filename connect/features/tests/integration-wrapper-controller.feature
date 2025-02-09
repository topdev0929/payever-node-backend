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
    When I send a GET request to "/api/integration-wrapper/openbank"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "880e5eba-7bb2-43d4-9de6-104a4cfe20c1",
        "wrapperType": "openbank",
        "displayOptions": {
          "_id": "180e5eba-7bb2-43d4-9de6-104a4cfe20c1",
          "icon": "#icon-payment-option-openbank",
          "title": "integrations.payments.openbank.title",
          "bgColor": "#59AFF9-#6755FF"
        },
        "optionIcon": "#icon-payment-option-openbank",
        "category": "integrations.payments.openbank.category",
        "developer": "integrations.payments.openbank.developer",
        "languages": "integrations.payments.openbank.languages",
        "description": "integrations.payments.openbank.description",
        "createdAt": "2022-12-16T18:13:41.339+0000",
        "updatedAt": "2022-12-16T18:13:41.339+0000",
        "connect": {
          "formAction": {
            "installEndpoint": "/business/{businessId}/integration-wrapper/openbank/install",
            "uninstallEndpoint": "/business/{businessId}/integration-wrapper/openbank/uninstall"
          }
        }
      }
      """