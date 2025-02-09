@onboarding
Feature: Onboarding
  Background:
    Given I remember as "partner" following value:
    """
    "facebook"
    """
    Given I remember as "businessId" following value:
    """
    "62639983-bf49-41cc-931a-84caec30c723"
    """
    Given I remember as "connectionId" following value:
    """
    "2f95e9b8-5314-43ff-848c-aef146a3cc60"
    """

  Scenario: Get partner data with get method
    Given I use DB fixture "onboardings"
    When I send a GET request to "/api/onboarding/{{partner}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "afterLogin": [
        {
          "method": "PATCH",
          "name": "install-facebook",
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/facebook/install",
          "_id": "*"
        },
        {
          "method": "POST",
          "name": "pre-install-facebook",
          "url": "https://products-third-party.test.devpayever.com/api/business/:businessId/integration/facebook/pre-install",
          "_id": "*"
        }
      ],
      "afterRegistration": [
        {
          "method": "PATCH",
          "name": "install-facebook",
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/facebook/install",
          "_id": "*"
        },
        {
          "method": "POST",
          "name": "pre-install-facebook",
          "url": "https://products-third-party.test.devpayever.com/api/business/:businessId/integration/facebook/pre-install",
          "_id": "*"
        }
      ],
      "_id": "*",
      "logo": "#icon-industries-facebook",
      "name": "facebook",
      "type": "partner",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-facebook.jpg",
      "createdAt": "*",
      "updatedAt": "*",
      "__v": 0
    }
    """

  Scenario: Get partner data with post method
    Given I use DB fixture "onboardings"
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
      "afterLogin": [
        {
          "method": "PATCH",
          "name": "install-facebook",
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/facebook/install",
          "_id": "*"
        },
        {
          "method": "POST",
          "name": "pre-install-facebook",
          "url": "https://products-third-party.test.devpayever.com/api/business/:businessId/integration/facebook/pre-install",
          "_id": "*"
        }
      ],
      "afterRegistration": [
        {
          "method": "PATCH",
          "name": "install-facebook",
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/facebook/install",
          "_id": "*"
        },
        {
          "method": "POST",
          "name": "pre-install-facebook",
          "url": "https://products-third-party.test.devpayever.com/api/business/:businessId/integration/facebook/pre-install",
          "_id": "*"
        }
      ],
      "_id": "*",
      "logo": "#icon-industries-facebook",
      "name": "facebook",
      "type": "partner",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-facebook.jpg",
      "createdAt": "*",
      "updatedAt": "*",
      "__v": 0
    }
    """

  Scenario: Get cached partner data
    Given I use DB fixture "onboardings"
    When I send a GET request to "/api/onboarding/cached/{{partner}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "afterLogin": [
        {
          "method": "PATCH",
          "name": "install-facebook",
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/facebook/install",
          "_id": "*"
        },
        {
          "method": "POST",
          "name": "pre-install-facebook",
          "url": "https://products-third-party.test.devpayever.com/api/business/:businessId/integration/facebook/pre-install",
          "_id": "*"
        }
      ],
      "afterRegistration": [
        {
          "method": "PATCH",
          "name": "install-facebook",
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/facebook/install",
          "_id": "*"
        },
        {
          "method": "POST",
          "name": "pre-install-facebook",
          "url": "https://products-third-party.test.devpayever.com/api/business/:businessId/integration/facebook/pre-install",
          "_id": "*"
        }
      ],
      "_id": "*",
      "logo": "#icon-industries-facebook",
      "name": "facebook",
      "type": "partner",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-facebook.jpg",
      "createdAt": "*",
      "updatedAt": "*",
      "__v": 0
    }
    """


  Scenario: Get cached partner data with post method
    Given I use DB fixture "onboardings"
    When I send a POST request to "/api/onboarding/cached" with json:
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
      "afterLogin": [
        {
          "method": "PATCH",
          "name": "install-facebook",
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/facebook/install",
          "_id": "*"
        },
        {
          "method": "POST",
          "name": "pre-install-facebook",
          "url": "https://products-third-party.test.devpayever.com/api/business/:businessId/integration/facebook/pre-install",
          "_id": "*"
        }
      ],
      "afterRegistration": [
        {
          "method": "PATCH",
          "name": "install-facebook",
          "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/facebook/install",
          "_id": "*"
        },
        {
          "method": "POST",
          "name": "pre-install-facebook",
          "url": "https://products-third-party.test.devpayever.com/api/business/:businessId/integration/facebook/pre-install",
          "_id": "*"
        }
      ],
      "_id": "*",
      "logo": "#icon-industries-facebook",
      "name": "facebook",
      "type": "partner",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-facebook.jpg",
      "createdAt": "*",
      "updatedAt": "*",
      "__v": 0
    }
    """

  Scenario: Update cache
    And I authenticate as a user with the following data:
      """
      {
        "id": "9bd92439-66a7-4861-b311-56f826b410d6",
        "roles": [
          {
            "name": "admin",
            "permissions": [
              {
                "businessId": "25b3057a-328b-4559-a6e9-b55936659ba9",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a POST request to "/api/onboarding/update-cache"
    And the response status code should be 202

  Scenario: Check redirect to partner
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "*/api/business/{{businessId}}/connection/{{partner}}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "authorization": "*"
        }
      },
      "response": {
        "status": 200,
        "body":
          [
            {
              "connected": false,
              "_id": "{{connectionId}}",
              "authorizationId": "c8a183e1-0b77-490c-bacc-2d35a2a95953",
              "business": "{{businessId}}",
              "integration": "1246e4a6-9845-4dd9-b4d0-17133f2e03ab",
              "actions": [],
              "createdAt": "2021-04-19T06:30:07.110Z",
              "updatedAt": "2021-04-19T06:30:07.110Z",
              "__v": 0
            }
          ]
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/connection/{{connectionId}}/action/get-redirect-auth-url",
        "body": "{\"redirectUrl\":\"http://facebook.com\"}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
          "authorization": "*"
        }
      },
      "response": {
        "status": 200,
        "body": "http://facebook.com&extras={\"business_config\":{\"business\":{\"name\":\"payever\"}},\"repeat\":false,\"setup\":{\"business_vertical\":\"ECOMMERCE\",\"currency\":\"EUR\",\"external_business_id\":\"c8a183e1-0b77-490c-bacc-2d35a2a95953\",\"timezone\":\"Europe/Berlin\"}}"
      }
    }
    """
    When I send a GET request to "/api/onboarding/redirect-to-partner/business/{{businessId}}/integration/{{partner}}?redirectUrl=http://facebook.com"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "redirectUrl": "http://facebook.com&extras={*}"
    }
    """

  Scenario: Check redirect to partner empty url
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "*/api/business/{{businessId}}/connection/{{partner}}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "authorization": "*"
        }
      },
      "response": {
        "status": 200,
        "body":
          [
            {
              "connected": false,
              "_id": "{{connectionId}}",
              "authorizationId": "c8a183e1-0b77-490c-bacc-2d35a2a95953",
              "business": "{{businessId}}",
              "integration": "1246e4a6-9845-4dd9-b4d0-17133f2e03ab",
              "actions": [],
              "createdAt": "2021-04-19T06:30:07.110Z",
              "updatedAt": "2021-04-19T06:30:07.110Z",
              "__v": 0
            }
          ]
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/connection/{{connectionId}}/action/get-redirect-auth-url",
        "body": "{\"redirectUrl\":\"http://facebook.com\"}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
          "authorization": "*"
        }
      },
      "response": {
        "status": 200,
        "body": ""
      }
    }
    """
    When I send a GET request to "/api/onboarding/redirect-to-partner/business/{{businessId}}/integration/{{partner}}?redirectUrl=http://facebook.com"
    Then print last response
    And the response status code should be 412


  Scenario: Get fake partner returns default
    Given I use DB fixture "onboardings"
    When I send a POST request to "/api/onboarding" with json:
    """
    {
      "name": "hello"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "c77eb766-6dbf-49c2-9aed-f8bae410067e",
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
                "app": "c4094635-0f1d-42ed-b059-9a5a0dc9b5bb",
                "code": "products",
                "order": 30
              },
              {
                "installed": true,
                "app": "e0504b4c-8852-49d3-9996-ddfdfec7fc39",
                "code": "transactions",
                "order": 10
              },
              {
                "installed": true,
                "app": "954fbf2f-5cb0-472c-8582-130ca23b7f7d",
                "code": "pos",
                "order": 120
              },
              {
                "installed": true,
                "app": "252cfe31-f217-4fb6-a0ab-eea7161ade0f",
                "code": "settings",
                "order": 20
              },
              {
                "installed": true,
                "app": "51cce2bb-5a89-4442-a1cc-c6eed25c614a",
                "code": "shop",
                "order": 90
              }
            ]
          },
          "url": "https://commerceos-backend.test.devpayever.com/api/apps/business/:businessId/toggle-installed",
          "_id": "*"
        }
      ],
      "defaultLoginByEmail": true,
      "logo": "#icon-industries-hello",
      "name": "industry",
      "type": "industry",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-hello.jpg",
      "afterLogin": []
    }
    """

  Scenario: Get fake cached partner data returns default
    Given I use DB fixture "onboardings"
    When I send a POST request to "/api/onboarding/cached" with json:
    """
    {
      "name": "hello"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "c77eb766-6dbf-49c2-9aed-f8bae410067e",
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
                "app": "c4094635-0f1d-42ed-b059-9a5a0dc9b5bb",
                "code": "products",
                "order": 30
              },
              {
                "installed": true,
                "app": "e0504b4c-8852-49d3-9996-ddfdfec7fc39",
                "code": "transactions",
                "order": 10
              },
              {
                "installed": true,
                "app": "954fbf2f-5cb0-472c-8582-130ca23b7f7d",
                "code": "pos",
                "order": 120
              },
              {
                "installed": true,
                "app": "252cfe31-f217-4fb6-a0ab-eea7161ade0f",
                "code": "settings",
                "order": 20
              },
              {
                "installed": true,
                "app": "51cce2bb-5a89-4442-a1cc-c6eed25c614a",
                "code": "shop",
                "order": 90
              }
            ]
          },
          "url": "https://commerceos-backend.test.devpayever.com/api/apps/business/:businessId/toggle-installed",
          "_id": "*"
        }
      ],
      "defaultLoginByEmail": true,
      "logo": "#icon-industries-hello",
      "name": "industry",
      "type": "industry",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-hello.jpg",
      "afterLogin": []
    }
    """

  Scenario: Get partner data with post method empty name apply default business
    Given I use DB fixture "onboardings"
    When I send a POST request to "/api/onboarding" with json:
    """
    {
      "name": ""
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "c77eb766-6dbf-49c2-9aed-f8bae410067e",
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
                "app": "c4094635-0f1d-42ed-b059-9a5a0dc9b5bb",
                "code": "products",
                "order": 30
              },
              {
                "installed": true,
                "app": "e0504b4c-8852-49d3-9996-ddfdfec7fc39",
                "code": "transactions",
                "order": 10
              },
              {
                "installed": true,
                "app": "954fbf2f-5cb0-472c-8582-130ca23b7f7d",
                "code": "pos",
                "order": 120
              },
              {
                "installed": true,
                "app": "252cfe31-f217-4fb6-a0ab-eea7161ade0f",
                "code": "settings",
                "order": 20
              },
              {
                "installed": true,
                "app": "51cce2bb-5a89-4442-a1cc-c6eed25c614a",
                "code": "shop",
                "order": 90
              }
            ]
          },
          "url": "https://commerceos-backend.test.devpayever.com/api/apps/business/:businessId/toggle-installed"
        }
      ],
      "defaultLoginByEmail": true,
      "logo": "#icon-industries-industry",
      "name": "industry",
      "type": "industry",
      "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-industry.jpg"
    }
    """
