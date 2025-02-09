@onboarding-santander
Feature: Onboarding Santander
  Background:
    Given I remember as "partner" following value:
    """
    "santander"
    """
    Given I remember as "businessId" following value:
    """
    "62639983-bf49-41cc-931a-84caec30c723"
    """
    Given I remember as "connectionId" following value:
    """
    "2f95e9b8-5314-43ff-848c-aef146a3cc60"
    """
    Given I use DB fixture "onboardings-santander"

  Scenario: Get partner data santander
    When I send a POST request to "/api/onboarding" with json:
    """
    {
      "name": "{{partner}}"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "*",
      "afterRegistration": [
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-apps",
          "payload": {
            "apps": [
              {
                "installed": true,
                "app": "79cee30b-92a7-4796-a152-6303a4117d7f",
                "code": "checkout",
                "order": 50
              },
              {
                "installed": true,
                "app": "c1c70ee9-61d3-41b4-8b01-cd753a7fc202",
                "code": "connect"
              },
              {
                "installed": true,
                "app": "954fbf2f-5cb0-472c-8582-130ca23b7f7d",
                "code": "pos",
                "order": 120
              },
              {
                "installed": true,
                "app": "e0504b4c-8852-49d3-9996-ddfdfec7fc39",
                "code": "transactions",
                "order": 10
              },
              {
                "installed": true,
                "app": "252cfe31-f217-4fb6-a0ab-eea7161ade0f",
                "code": "settings",
                "order": 20
              },
              {
                "installed": true,
                "app": "c4094635-0f1d-42ed-b059-9a5a0dc9b5bb",
                "code": "products"
              }
            ]
          },
          "priority": 0,
          "url": "https://commerceos-backend.test.devpayever.com/api/apps/business/:businessId/toggle-installed"
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "refresh-token",
          "priority": 1,
          "url": "https://auth.test.devpayever.com/api/business/:businessId/enable"
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_invoice_de",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_invoice_de/install",
          "integration": {
            "country": "de",
            "method": "invoice",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_installment_nl",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_installment_nl/install",
          "integration": {
            "country": "nl",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_installment_at",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_installment_at/install",
          "integration": {
            "country": "at",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_invoice_de",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_invoice_de/install",
          "integration": {
            "country": "de",
            "method": "invoice",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_invoice_de",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_invoice_de/install",
          "integration": {
            "country": "de",
            "device": "pos",
            "method": "invoice",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_factoring_de",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_factoring_de/install",
          "integration": {
            "country": "de",
            "method": "factoring",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_factoring_de",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_factoring_de/install",
          "integration": {
            "country": "de",
            "device": "pos",
            "method": "factoring",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_installment_dk",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_installment_dk/install",
          "integration": {
            "country": "dk",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment_dk",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment_dk/install",
          "integration": {
            "country": "dk",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_installment_se",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_installment_se/install",
          "integration": {
            "country": "se",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment_se",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment_se/install",
          "integration": {
            "country": "se",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_ccp_installment",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_ccp_installment/install",
          "integration": {
            "country": "de",
            "device": "ccp",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_installment",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_installment/install",
          "integration": {
            "country": "de",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment/install",
          "integration": {
            "country": "de",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_installment_no",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_installment_no/install",
          "integration": {
            "country": "no",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment_no",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment_no/install",
          "integration": {
            "country": "no",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_invoice_no",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_invoice_no/install",
          "integration": {
            "country": "no",
            "method": "invoice",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_installment_uk",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_installment_uk/install",
          "integration": {
            "country": "gb",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment_uk",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment_uk/install",
          "integration": {
            "country": "gb",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_installment_fi",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_installment_fi/install",
          "integration": {
            "country": "fi",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment_fi",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment_fi/install",
          "integration": {
            "country": "fi",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        }
      ],
      "defaultLoginByEmail": true,
      "logo": "#icon-industries-santander",
      "name": "santander",
      "type": "partner",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-santander.jpg",
      "afterLogin": []
    }
    """

  Scenario: Get partner data santander installment de
    When I send a POST request to "/api/onboarding" with json:
    """
    {
      "name": "{{partner}}",
      "method": "installment",
      "country": "de"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "*",
      "afterRegistration": [
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-apps",
          "payload": {
            "apps": [
              {
                "installed": true,
                "app": "79cee30b-92a7-4796-a152-6303a4117d7f",
                "code": "checkout",
                "order": 50
              },
              {
                "installed": true,
                "app": "c1c70ee9-61d3-41b4-8b01-cd753a7fc202",
                "code": "connect"
              },
              {
                "installed": true,
                "app": "954fbf2f-5cb0-472c-8582-130ca23b7f7d",
                "code": "pos",
                "order": 120
              },
              {
                "installed": true,
                "app": "e0504b4c-8852-49d3-9996-ddfdfec7fc39",
                "code": "transactions",
                "order": 10
              },
              {
                "installed": true,
                "app": "252cfe31-f217-4fb6-a0ab-eea7161ade0f",
                "code": "settings",
                "order": 20
              },
              {
                "installed": true,
                "app": "c4094635-0f1d-42ed-b059-9a5a0dc9b5bb",
                "code": "products"
              }
            ]
          },
          "priority": 0,
          "url": "https://commerceos-backend.test.devpayever.com/api/apps/business/:businessId/toggle-installed"
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "refresh-token",
          "priority": 1,
          "url": "https://auth.test.devpayever.com/api/business/:businessId/enable"
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_ccp_installment",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_ccp_installment/install",
          "integration": {
            "country": "de",
            "device": "ccp",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_installment",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_installment/install",
          "integration": {
            "country": "de",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment/install",
          "integration": {
            "country": "de",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        }
      ],
      "defaultLoginByEmail": true,
      "logo": "#icon-industries-santander",
      "name": "santander",
      "type": "partner",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-santander.jpg",
      "afterLogin": []
    }
    """

  Scenario: Get partner data santander pos
    When I send a POST request to "/api/onboarding" with json:
    """
    {
      "name": "{{partner}}",
      "device": "pos"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "*",
      "afterRegistration": [
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-apps",
          "payload": {
            "apps": [
              {
                "installed": true,
                "app": "79cee30b-92a7-4796-a152-6303a4117d7f",
                "code": "checkout",
                "order": 50
              },
              {
                "installed": true,
                "app": "c1c70ee9-61d3-41b4-8b01-cd753a7fc202",
                "code": "connect"
              },
              {
                "installed": true,
                "app": "954fbf2f-5cb0-472c-8582-130ca23b7f7d",
                "code": "pos",
                "order": 120
              },
              {
                "installed": true,
                "app": "e0504b4c-8852-49d3-9996-ddfdfec7fc39",
                "code": "transactions",
                "order": 10
              },
              {
                "installed": true,
                "app": "252cfe31-f217-4fb6-a0ab-eea7161ade0f",
                "code": "settings",
                "order": 20
              },
              {
                "installed": true,
                "app": "c4094635-0f1d-42ed-b059-9a5a0dc9b5bb",
                "code": "products"
              }
            ]
          },
          "priority": 0,
          "url": "https://commerceos-backend.test.devpayever.com/api/apps/business/:businessId/toggle-installed"
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "refresh-token",
          "priority": 1,
          "url": "https://auth.test.devpayever.com/api/business/:businessId/enable"
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_invoice_de",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_invoice_de/install",
          "integration": {
            "country": "de",
            "device": "pos",
            "method": "invoice",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_factoring_de",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_factoring_de/install",
          "integration": {
            "country": "de",
            "device": "pos",
            "method": "factoring",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment_dk",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment_dk/install",
          "integration": {
            "country": "dk",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment_se",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment_se/install",
          "integration": {
            "country": "se",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment/install",
          "integration": {
            "country": "de",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment_no",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment_no/install",
          "integration": {
            "country": "no",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment_uk",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment_uk/install",
          "integration": {
            "country": "gb",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment_fi",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment_fi/install",
          "integration": {
            "country": "fi",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        }
      ],
      "defaultLoginByEmail": true,
      "logo": "#icon-industries-santander",
      "name": "santander",
      "type": "partner",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-santander.jpg",
      "afterLogin": []
    }
    """
  Scenario: Get partner data santander uk
    When I send a POST request to "/api/onboarding" with json:
    """
    {
      "name": "{{partner}}",
      "country": "gb"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "*",
      "afterRegistration": [
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-apps",
          "payload": {
            "apps": [
              {
                "installed": true,
                "app": "79cee30b-92a7-4796-a152-6303a4117d7f",
                "code": "checkout",
                "order": 50
              },
              {
                "installed": true,
                "app": "c1c70ee9-61d3-41b4-8b01-cd753a7fc202",
                "code": "connect"
              },
              {
                "installed": true,
                "app": "954fbf2f-5cb0-472c-8582-130ca23b7f7d",
                "code": "pos",
                "order": 120
              },
              {
                "installed": true,
                "app": "e0504b4c-8852-49d3-9996-ddfdfec7fc39",
                "code": "transactions",
                "order": 10
              },
              {
                "installed": true,
                "app": "252cfe31-f217-4fb6-a0ab-eea7161ade0f",
                "code": "settings",
                "order": 20
              },
              {
                "installed": true,
                "app": "c4094635-0f1d-42ed-b059-9a5a0dc9b5bb",
                "code": "products"
              }
            ]
          },
          "priority": 0,
          "url": "https://commerceos-backend.test.devpayever.com/api/apps/business/:businessId/toggle-installed"
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "refresh-token",
          "priority": 1,
          "url": "https://auth.test.devpayever.com/api/business/:businessId/enable"
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_installment_uk",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_installment_uk/install",
          "integration": {
            "country": "gb",
            "method": "installment",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_installment_uk",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_installment_uk/install",
          "integration": {
            "country": "gb",
            "device": "pos",
            "method": "installment",
            "name": "santander"
          }
        }
      ],
      "defaultLoginByEmail": true,
      "logo": "#icon-industries-santander",
      "name": "santander",
      "type": "partner",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-santander.jpg",
      "afterLogin": []
    }
    """

  Scenario: Get partner data santander factoring
    When I send a POST request to "/api/onboarding" with json:
    """
    {
      "name": "{{partner}}",
      "method": "factoring"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "*",
      "afterRegistration": [
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-apps",
          "payload": {
            "apps": [
              {
                "installed": true,
                "app": "79cee30b-92a7-4796-a152-6303a4117d7f",
                "code": "checkout",
                "order": 50
              },
              {
                "installed": true,
                "app": "c1c70ee9-61d3-41b4-8b01-cd753a7fc202",
                "code": "connect"
              },
              {
                "installed": true,
                "app": "954fbf2f-5cb0-472c-8582-130ca23b7f7d",
                "code": "pos",
                "order": 120
              },
              {
                "installed": true,
                "app": "e0504b4c-8852-49d3-9996-ddfdfec7fc39",
                "code": "transactions",
                "order": 10
              },
              {
                "installed": true,
                "app": "252cfe31-f217-4fb6-a0ab-eea7161ade0f",
                "code": "settings",
                "order": 20
              },
              {
                "installed": true,
                "app": "c4094635-0f1d-42ed-b059-9a5a0dc9b5bb",
                "code": "products"
              }
            ]
          },
          "priority": 0,
          "url": "https://commerceos-backend.test.devpayever.com/api/apps/business/:businessId/toggle-installed"
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "refresh-token",
          "priority": 1,
          "url": "https://auth.test.devpayever.com/api/business/:businessId/enable"
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_factoring_de",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_factoring_de/install",
          "integration": {
            "country": "de",
            "method": "factoring",
            "name": "santander"
          }
        },
        {
          "registerSteps": [
            "business"
          ],
          "method": "PATCH",
          "name": "install-santander_pos_factoring_de",
          "priority": 2,
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/santander_pos_factoring_de/install",
          "integration": {
            "country": "de",
            "device": "pos",
            "method": "factoring",
            "name": "santander"
          }
        }
      ],
      "defaultLoginByEmail": true,
      "logo": "#icon-industries-santander",
      "name": "santander",
      "type": "partner",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-santander.jpg",
      "afterLogin": []
    }
    """
