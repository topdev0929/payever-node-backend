Feature: test brute force protection
  Background:
    Given I use DB fixture "brute-force/suspicious-activity"
    And I use DB fixture "brute-force/users"

  Scenario: Merchant has exceeded his login attempts, should deny access to a user with a correct password
    Given I mock an axios request with parameters:
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
      "email": "banned-captcha@example.com",
      "plainPassword": "123456789"
    }
    """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
    """
    {
      "message": "For security reasons follow the prompts to prove you are a real person",
      "reason": "REASON_DISPLAY_CAPTCHA",
      "statusCode": 401
    }
    """

    When I send a POST request to "/api/login" with json:
    """
    {
      "email": "banned-captcha@example.com",
      "plainPassword": "123456789"
    }
    """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
    """
    {
      "message": "auth.error.reason.no_captcha",
      "reason": "REASON_NO_CAPTCHA",
      "statusCode": 401
    }
    """


  Scenario: Merchant has exceeded his login attempts, should deny access to a user with a correct password
    When I send a POST request to "/api/login" with json:
    """
    {
      "email": "banned20@example.com",
      "plainPassword": "wrongpassword"
    }
    """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
    """
    {
      "statusCode": 401,
      "message": "auth.error.reason.twenty_minutes_ban"
    }
    """


  Scenario: Merchant has exceeded his login attempts, should deny access to a user with a correct password
    When I send a POST request to "/api/login" with json:
    """
    {
      "email": "banned3Hours@example.com",
      "plainPassword": "wrongpassword"
    }
    """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
    """
    {
      "statusCode": 401,
      "message": "auth.error.reason.three_hours_ban"
    }
    """


  Scenario: Merchant has exceeded his login attempts, should deny access to a user with a correct password
    When I send a POST request to "/api/login" with json:
    """
    {
      "email": "bannedPermanently@example.com",
      "plainPassword": "wrongpassword"
    }
    """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
    """
    {
      "statusCode": 401,
      "message": "auth.error.reason.permanent_ban"
    }
    """
