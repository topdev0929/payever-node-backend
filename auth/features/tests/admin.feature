Feature: Users
  Background:
    Given I use DB fixture "users"
    And I remember as "userId" following value:
      """
      "b5965f9d-5971-4b02-90eb-537a0a6e07c7"
      """
    And I authenticate as a user with the following data:
    """
    {
      "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
      "email": "merchant@example.com",
      "roles": [
      {
        "name": "admin",
        "permissions": []
      }]
    }
    """


  Scenario: Edit my data
    When I send a PATCH request to "/api/admin/users/{{userId}}" with json:
    """
    {
      "secondFactorRequired": true
    }
    """

    Then print last response
    And model "User" with id "b5965f9d-5971-4b02-90eb-537a0a6e07c7" should contain json:
    """
    {
      "secondFactorRequired": true
    }
    """
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "secondFactorRequired": true
    }
    """

  Scenario: get user data endpoint
    When I send a GET request to "/api/admin/users/{{userId}}"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
     [
        {
          "name": "merchant",
          "permissions": [
            {
              "acls": [],
              "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29"
            }
          ]
        }
      ]
    """

  Scenario: Get user
    When I send a GET request to "/api/admin/users/{{userId}}/user"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "email": "merchant@example.com"
    }
    """

  Scenario: post adn get blocked-email
    When I send a POST request to "/api/admin/block-email" with json:
    """
    {
      "type": "domain",
      "value": "0-test-0.pe"
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "type": "domain",
        "value": "0-test-0.pe"
      }
    """
    When I send a GET request to "/api/admin/block-email"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [
        {
          "type": "domain",
          "value": "0-test-0.pe"
        }
      ]
    """
    
  Scenario: Edit user permissions
    When I send a PATCH request to "/api/admin/users/8b5fb669-8fa0-8c83-a8dd-8fa8d45d2091/permissions" with json:
    """
      {
        "permissions": [
          {
            "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
            "acls": [
              {
                "microservice": "pos",
                "create": true, 
                "read": false, 
                "update": true, 
                "delete": false
              }
            ]
          }
        ]
      }
    """
    Then print last response
    And the response status code should be 200

    When I send a GET request to "/api/admin/users/8b5fb669-8fa0-8c83-a8dd-8fa8d45d2091"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "permissions": [
          {
            "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
            "acls": [
              {
                "microservice": "pos",
                "create": true, 
                "read": false, 
                "update": true, 
                "delete": false
              }
            ]
          }
        ]
      }
    ]
    """

  Scenario: Delete user with Id
    When I send a DELETE request to "/api/admin/users/cc3bec59-6f88-4d48-91af-0f391bbb8ce2"
    Then print last response
    And the response status code should be 200
    And model "User" with id "cc3bec59-6f88-4d48-91af-0f391bbb8ce2" should not exist

  Scenario: Delete user with email
    When I send a DELETE request to "/api/admin/users" with json:
    """
    {
      "email" : "johnTheMerchant2@example.com"
    }
    """
    Then print last response
    And the response status code should be 200
    And model "User" with id "8b5fb669-8fa0-8c83-a8dd-8fa8d45d2098" should not exist
  
  Scenario: block an Ip
    When I send a POST request to "/api/admin/users/block" with json:
    """
    {
      "userIp": "192.168.1.133"
    }
    """
    Then print last response
    And the response status code should be 200
    When I send a GET request to "/api/admin/users/block/192.168.1.133"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      true
    """
    
  Scenario: unblock a user by Ip and another by Id
    When I send a DELETE request to "/api/admin/users/block" with json:
    """
    {
      "userId": "cc3bec59-6f88-4d48-91af-0f391bbb8ce2",
      "userIp": "192.168.1.123"
    }
    """
    Then print last response
    And the response status code should be 200
    When I send a GET request to "/api/admin/users/block/192.168.1.123"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      false
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://www.google.com/recaptcha/api/siteverify"
      },
      "response": {
        "status": 200,
        "body": {"success": true}
      }
    }
    """
    When I send a POST request to "/api/login" with json:
    """
    {
      "email": "johnTheMerchant3@example.com",
      "plainPassword": "12345678",
      "recaptchaToken": "recaptchaToken"
    }
    """
    Then print last response
    And the response status code should be 200
    
  Scenario: clear all blocks and login/register attempts
    When I send a DELETE request to "/api/admin/users/block/clear"
    Then print last response
    And the response status code should be 200
    When I send a GET request to "/api/admin/users/block/192.168.123.321"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      false
    """
    