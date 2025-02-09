@block-user
Feature: Block user on invalid password
  Scenario: Invalid password user, show captcha after 5th attempt and block user after 10 attempt
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "Merchant@example.com",
        "roles": [
          {"name": "user", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    Given I use DB fixture "users"
    And I am not authenticated
    # login attempt 1
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "Merchant@example.com",
        "plainPassword": "123456789"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "Wrong Email or Password",
        "reason": "REASON_WRONG_PASSWORD"
      }
      """
    # login attempt 2
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "Merchant@example.com",
        "plainPassword": "123456789"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "Wrong Email or Password",
        "reason": "REASON_WRONG_PASSWORD"
      }
      """
    # login attempt 3
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "Merchant@example.com",
        "plainPassword": "123456789"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "Wrong Email or Password",
        "reason": "REASON_WRONG_PASSWORD"
      }
      """
    # login attempt 4 wrong password
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "Merchant@example.com",
        "plainPassword": "123456789"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "Wrong Email or Password",
        "reason": "REASON_WRONG_PASSWORD"
      }
      """
    # login attempt 5 show captcha
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "Merchant@example.com",
        "plainPassword": "123456789"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "For security reasons follow the prompts to prove you are a real person",
        "reason": "REASON_DISPLAY_CAPTCHA"
      }
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
          "body": {"success": false}
        }
      }
      """
    # login attempt 6 show captcha
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "Merchant@example.com",
        "plainPassword": "123456789",
        "recaptchaToken": "recaptchaToken"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "auth.error.reason.no_captcha",
        "reason": "REASON_NO_CAPTCHA"
      }
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
          "body": {"success": false}
        }
      }
      """
    # login attempt 7 show captcha
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "Merchant@example.com",
        "plainPassword": "123456789",
        "recaptchaToken": "recaptchaToken"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "auth.error.reason.no_captcha",
        "reason": "REASON_NO_CAPTCHA"
      }
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
          "body": {"success": false}
        }
      }
      """
    # login attempt 8 show captcha
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "Merchant@example.com",
        "plainPassword": "123456789",
        "recaptchaToken": "recaptchaToken"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "auth.error.reason.no_captcha",
        "reason": "REASON_NO_CAPTCHA"
      }
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
          "body": {"success": false}
        }
      }
      """
    # login attempt 9 show captcha
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "Merchant@example.com",
        "plainPassword": "123456789",
        "recaptchaToken": "recaptchaToken"
      }
      """
    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "auth.error.reason.no_captcha",
        "reason": "REASON_NO_CAPTCHA"
      }
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
    # login attempt 11 ban user
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "Merchant@example.com",
        "plainPassword": "123456789",
        "recaptchaToken": "recaptchaToken"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "*",
        "reason": "REASON_20_MINUTES_BAN"
      }
      """

  Scenario: Invalid password employee user same ip  5 times- show captcha
    Given I authenticate as a user with the following data:
      """
      {
        "id": "787e4b36-ecfa-4e86-a915-d06fb21f4ed3",
        "email": "active.employee@payever.com",
        "roles": [
          {"name": "user", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    Given I use DB fixture "users"
    Given I use DB fixture "brute-force/suspicious-activity-employee-same-ip"
    And I am not authenticated
    # login attempt 5
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "active.employee@payever.com",
        "plainPassword": "123456789"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "For security reasons follow the prompts to prove you are a real person",
        "reason": "REASON_DISPLAY_CAPTCHA"
      }
      """

  Scenario: Invalid password employee user same ip  5+ times - block user
    Given I authenticate as a user with the following data:
      """
      {
        "id": "787e4b36-ecfa-4e86-a915-d06fb21f4ed3",
        "email": "active.employee@payever.com",
        "roles": [
          {"name": "user", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    Given I use DB fixture "users"
    Given I use DB fixture "brute-force/suspicious-activity-employee-same-ip"
    And I am not authenticated
    # login attempt 5
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "active.employee@payever.com",
        "plainPassword": "123456789"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "For security reasons follow the prompts to prove you are a real person",
        "reason": "REASON_DISPLAY_CAPTCHA"
      }
      """

    # login attempt 6 with wrong captcha
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "https://www.google.com/recaptcha/api/siteverify"
        },
        "response": {
          "status": 200,
          "body": {"success": false}
        }
      }
      """
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "active.employee@payever.com",
        "plainPassword": "123456789",
        "recaptchaToken": "recaptchaToken"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "auth.error.reason.no_captcha",
        "reason": "REASON_NO_CAPTCHA"
      }
      """

    # login attempt 7 with wrong captcha
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "https://www.google.com/recaptcha/api/siteverify"
        },
        "response": {
          "status": 200,
          "body": {"success": false}
        }
      }
      """
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "active.employee@payever.com",
        "plainPassword": "123456789",
        "recaptchaToken": "recaptchaToken"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "auth.error.reason.no_captcha",
        "reason": "REASON_NO_CAPTCHA"
      }
      """
    # login attempt 8 with wrong captcha
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "https://www.google.com/recaptcha/api/siteverify"
        },
        "response": {
          "status": 200,
          "body": {"success": false}
        }
      }
      """
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "active.employee@payever.com",
        "plainPassword": "123456789",
        "recaptchaToken": "recaptchaToken"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "auth.error.reason.no_captcha",
        "reason": "REASON_NO_CAPTCHA"
      }
      """
    # login attempt 10 with wrong captcha
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "https://www.google.com/recaptcha/api/siteverify"
        },
        "response": {
          "status": 200,
          "body": {"success": false}
        }
      }
      """
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "active.employee@payever.com",
        "plainPassword": "123456789",
        "recaptchaToken": "recaptchaToken"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "auth.error.reason.no_captcha",
        "reason": "REASON_NO_CAPTCHA"
      }
      """
    # login attempt 11 with wrong captcha
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "https://www.google.com/recaptcha/api/siteverify"
        },
        "response": {
          "status": 200,
          "body": {"success": false}
        }
      }
      """
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "active.employee@payever.com",
        "plainPassword": "123456789",
        "recaptchaToken": "recaptchaToken"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "*",
        "reason": "REASON_20_MINUTES_BAN"
      }
      """

  Scenario: Invalid password employee user different ips - block user
    Given I authenticate as a user with the following data:
      """
      {
        "id": "787e4b36-ecfa-4e86-a915-d06fb21f4ed3",
        "email": "active.employee@payever.com",
        "roles": [
          {"name": "user", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    Given I use DB fixture "users"
    Given I use DB fixture "brute-force/suspicious-activity-employee-different-ips"
    And I am not authenticated
    # login attempt 5
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "active.employee@payever.com",
        "plainPassword": "123456789",
        "recaptchaToken": "recaptchaToken"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "*",
        "reason": "REASON_20_MINUTES_BAN"
      }
      """

  Scenario: Invalid password employee user same ip  5+ times with correct captcha and wrong password, show captcha error
    Given I authenticate as a user with the following data:
      """
      {
        "id": "787e4b36-ecfa-4e86-a915-d06fb21f4ed3",
        "email": "active.employee@payever.com",
        "roles": [
          {"name": "user", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    Given I use DB fixture "users"
    Given I use DB fixture "brute-force/suspicious-activity-employee-same-ip"
    And I am not authenticated
    # login attempt 5
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "active.employee@payever.com",
        "plainPassword": "123456789"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "For security reasons follow the prompts to prove you are a real person",
        "reason": "REASON_DISPLAY_CAPTCHA"
      }
      """

    # login attempt 6 with wrong password
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
        "email": "active.employee@payever.com",
        "plainPassword": "wrongpassword",
        "recaptchaToken": "recaptchaToken"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "For security reasons follow the prompts to prove you are a real person",
        "reason": "REASON_DISPLAY_CAPTCHA"
      }
      """
