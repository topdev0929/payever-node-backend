Feature: Get by domain
  Background: Constants
    Given I load constants from "features/fixtures/const.ts"

  Scenario: Get public site by domain
    Given I use DB fixture "partial/public-site"

    When I send a GET request to "/api/site/by-domain?domain=public-site"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "domain": [],
        "isDefault": true,
        "_id": "{{SITE_1_ID}}",
        "id": "{{SITE_1_ID}}",
        "business": {
          "channelSets": [
            "*"
          ],
          "subscriptions": [],
          "_id": "{{BUSINESS_1_ID}}",
          "name": "*",
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0,
          "id": "{{BUSINESS_1_ID}}"
        },
        "channelSet": "*",
        "name": "*",
        "picture": "*",
        "accessConfig": {
          "isLive": true,
          "isLocked": false,
          "isPrivate": false,
          "_id": "{{SITE_ACCESS_CONFIG_1_ID}}",
          "id": "{{SITE_ACCESS_CONFIG_1_ID}}",
          "site": "{{SITE_1_ID}}",
          "internalDomain": "public-site",
          "internalDomainPattern": "public-site",
          "ownDomain": "public-site",
          "privateMessage": "",
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0
        },
        "createdAt": "*",
        "updatedAt": "*",
        "__v": 0
      }
      """

  Scenario: Forbid to get private site by domain by unauthenticated user
    Given I use DB fixture "partial/private-site"
    When I send a GET request to "/api/site/by-domain?domain=private-site"
    Then print last response
    And the response status code should be 403
    And the response should contain json:
      """
      {
        "message": "You have no permission to access site with domain \"private-site\"",
        "statusCode": 403
      }
      """

    When I send a GET request to "/api/site/by-domain/info?domain=private-site"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{SITE_1_ID}}",
        "accessConfig": {
          "isLive": true,
          "isLocked": false,
          "isPrivate": true,
          "_id": "{{SITE_ACCESS_CONFIG_1_ID}}",
          "approvedCustomersAllowed": true
        }
      }
      """

  Scenario: Get private site by domain by approved user
    Given I use DB fixture "partial/private-site"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [{
          "name": "customer",
          "applications": [{
            "applicationId": "{{SITE_1_ID}}",
            "businessId": "{{BUSINESS_1_ID}}",
            "type": "site",
            "status": "APPROVED"
          }]
        }]
      }
      """
    When I send a GET request to "/api/site/by-domain?domain=private-site"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{SITE_1_ID}}"
      }
      """

  Scenario: Get private site by domain using password
    Given I use DB fixture "partial/private-site"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [{
          "name": "guest",
          "permissions": [{
            "siteId": "{{SITE_1_ID}}",
            "acls": [{
              "microservice": "site",
              "read": true
            }]
          }]
        }]
      }
      """
    When I send a GET request to "/api/site/by-domain?domain=private-site"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{SITE_1_ID}}"
      }
      """

  Scenario: Get private site by domain by site owner
    Given I use DB fixture "partial/private-site"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{
            "businessId": "{{BUSINESS_1_ID}}",
            "acls": [{
              "microservice": "site",
              "read": true
            }]
          }]
        }]
      }
      """
    When I send a GET request to "/api/site/by-domain?domain=private-site"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{SITE_1_ID}}"
      }
      """
