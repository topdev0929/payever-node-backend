Feature: customer registration
  Background: constants
    Given I load constants from "features/fixtures/const.ts"

  Scenario: Create application access request
    Given I use DB fixture "customers/users"
    And I use DB fixture "business"
    Given I authenticate as a user with the following data:
      """
        {
          "id": "{{CUSTOMER_USER_ID}}",
          "email": "user1@payever.de",
          "roles": [{
            "name": "user"
          }]
        }
      """
    When I send a POST request to "/api/customers/application-access" with json:
      """
      {
        "businessId": "{{BUSINESS_1_ID}}",
        "applicationId": "838b50ac-9ab7-4808-9dbb-9cf7ea227bd2",
        "type": "site"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "id": "{{CUSTOMER_USER_ID}}",
        "email": "user1@payever.de",
        "roles": [
        {
          "name": "customer",
          "shops": [],
          "applications": [{
            "businessId": "{{BUSINESS_1_ID}}",
            "applicationId": "838b50ac-9ab7-4808-9dbb-9cf7ea227bd2",
            "type": "site",
            "status": "PENDING"
          }]
        }]
      }
    """

  Scenario: Approve application access request
    Given I use DB fixture "customers/users"
    And I use DB fixture "business"
    And I authenticate as a user with the following data:
    """
      {
        "id": "{{BUSINESS_1_OWNER_ID}}",
        "email": "merchant@example.com",
        "roles": [
        {
          "name": "merchant",
          "permissions": [{
            "businessId": "{{BUSINESS_1_ID}}",
            "acls": []
          }]
        }]
      }
    """
    When I send a POST request to "/api/customers/application-access/business/{{BUSINESS_1_ID}}" with json:
      """
      {
        "applicationId": "{{CUSTOMER_APPLICATION_ACCESS_APPLICATION_ID}}",
        "type": "site",
        "userId": "{{CUSTOMER_USER_ID}}",
        "status": "APPROVED"
      }
      """
    Then print last response
    And the response status code should be 200

  Scenario: Find application access requests for business
    And I use DB fixture "business"
    Given I use DB fixture "customers/users"
    And I authenticate as a user with the following data:
    """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "merchant@example.com",
        "roles": [
        {
          "name": "merchant",
          "permissions": [{
            "businessId": "{{BUSINESS_1_ID}}",
            "acls": []
          }]
        }]
      }
    """
    When I send a GET request to "/api/customers/application-access/business/{{BUSINESS_1_ID}}?status=PENDING&users={{CUSTOMER_USER_ID}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [{
        "applicationId": "{{CUSTOMER_APPLICATION_ACCESS_APPLICATION_ID}}",
        "businessId": "{{BUSINESS_1_ID}}",
        "status": "PENDING",
        "type": "site",
        "userId": "{{CUSTOMER_USER_ID}}"
      }]
      """
