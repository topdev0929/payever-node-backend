@onboarding
Feature: Onboarding
  Background:
    Given I remember as "adminId" following value:
      """
      "8a13bd00-90f1-11e9-9f67-7200004fe4c0"
      """
    Given I remember as "partner" following value:
      """
      "facebook"
      """



  Scenario: Get list of onboardings
    Given I use DB fixture "onboardings"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I send a GET request to "/api/admin/onboarding/list"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {"name": "industry"},
        {"name": "business"},
        {"name": "bmo-harris"},
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
      ]
      """



  Scenario: Get one onboarding instance
    Given I use DB fixture "onboardings"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I send a GET request to "/api/admin/onboarding/{{partner}}"
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


  Scenario: Create an onboarding instance
    Given I use DB fixture "onboardings"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I send a POST request to "/api/admin/onboarding" with json:
      """
      {
        "afterLogin": [
          {
            "method": "PATCH",
            "name": "install-facebook",
            "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/facebook/install"
          },
          {
            "method": "POST",
            "name": "pre-install-facebook",
            "url": "https://products-third-party.test.devpayever.com/api/business/:businessId/integration/facebook/pre-install"
          }
        ],
        "afterRegistration": [
          {
            "method": "PATCH",
            "name": "install-facebook",
            "url": "https://connect-backend.test.devpayever.com/api/business/:businessId/integration/facebook/install"
          },
          {
            "method": "POST",
            "name": "pre-install-facebook",
            "url": "https://products-third-party.test.devpayever.com/api/business/:businessId/integration/facebook/pre-install"
          }
        ],
        "logo": "#icon-industries-facebook",
        "name": "meta facebook",
        "type": "partner",
        "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-facebook.jpg"
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
        "name": "meta facebook",
        "type": "partner",
        "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-facebook.jpg",
        "createdAt": "*",
        "updatedAt": "*",
        "__v": 0
      }
      """


  Scenario: Throw 400 error on creation an onboarding instance with a non-unique name
    Given I use DB fixture "onboardings"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I send a POST request to "/api/admin/onboarding" with json:
      """
      {
        "logo": "#icon-industries-facebook",
        "name": "facebook",
        "type": "partner",
        "wallpaperUrl": "https://cdn.test.devpayever.com/images/commerceos-industry-background-facebook.jpg"
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      { "statusCode":400, "message":"`name` should be unique.", "error":"Bad Request" }
      """



  Scenario: Update an onboarding
    Given I use DB fixture "onboardings"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I send a PATCH request to "/api/admin/onboarding/{{partner}}" with json:
      """
      {
        "logo": "#new-logo",
        "type": "industry",
        "wallpaperUrl": "https://new.url"
      }
      """
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
        "name": "facebook",
        "logo": "#new-logo",
        "type": "industry",
        "wallpaperUrl": "https://new.url",
        "createdAt": "*",
        "updatedAt": "*",
        "__v": 0
      }
      """


  Scenario: Delete an onboarding
    Given I use DB fixture "onboardings"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I send a DELETE request to "/api/admin/onboarding/{{partner}}"
    Then print last response
    And the response status code should be 200
    When I send a DELETE request to "/api/admin/onboarding/{{partner}}"
    And the response status code should be 404
    When I send a GET request to "/api/admin/onboarding/{{partner}}"
    And the response status code should be 404



    Scenario: Delete an onboarding without admin permission
      Given I authenticate as a user with the following data:
        """
        {
          "email": "email@test.com",
          "id": "{{adminId}}",
          "roles": [{ "name": "merchant" }]
        }
        """
      When I send a DELETE request to "/api/admin/onboarding/{{partner}}"
      Then the response status code should be 403
