Feature: Security question
  Background:
    Given I use DB fixture "users"
    Given I remember as "userId" following value:
      """
      "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81"
      """

  Scenario: Define and undefine security question
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "roles": [
          {
            "name": "user",
            "permissions": []
          }
        ]
      }
      """
    When I send a GET request to "/api/security-question"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        "auth.security_question.question.one",
        "auth.security_question.question.two",
        "auth.security_question.question.three",
        "auth.security_question.question.four",
        "auth.security_question.question.five"
      ]
      """
    When I send a POST request to "/api/security-question/define" with json:
      """
      {
        "question": "wrong.question",
        "answer": "correct answer"
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "errors": [
          {
            "target": {
              "question": "wrong.question",
              "answer": "correct answer"
            },
            "value": "wrong.question",
            "property": "question",
            "children": [],
            "constraints": {
              "isEnum": "question must be a valid enum value"
            }
          }
        ],
        "message": "Validation failed",
        "statusCode": 400
      }
      """
    When I send a POST request to "/api/security-question/define" with json:
      """
      {
        "question": "auth.security_question.question.one",
        "answer": "correct answer"
      }
      """
    Then print last response
    And the response status code should be 200

    When I send a DELETE request to "/api/security-question/undefine"
    Then print last response
    And the response status code should be 200

    When I send a DELETE request to "/api/security-question/undefine"
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "errors": "The security question for the userId={{userId}} is not defined",
        "message": "Validation failed",
        "statusCode": 400
      }
      """

  Scenario: Validate with refresh token
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "roles": [
          {
            "name": "user",
            "permissions": []
          }
        ]
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
          "body": {
            "success": true
          }
        }
      }
      """
    When I send a POST request to "/api/security-question/define" with json:
      """
      {
        "question": "auth.security_question.question.one",
        "answer": "CORRECT ANSWER"
      }
      """
    Then print last response
    And the response status code should be 200

    And I am not authenticated
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "2fa@example.com",
        "plainPassword": "12345678"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "refreshToken": "*",
        "isSecurityQuestionDefined": true
      }
      """
    And I store a response as "access_token_response"
    Then print storage key "access_token_response" by path "refreshToken"
    When I set header "Authorization" with value "Bearer {{access_token_response.refreshToken}}"

    When I send a GET request to "/api/security-question/question"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "question": "auth.security_question.question.one"
      }
      """

    And I set header "Authorization" with value "Bearer {{access_token_response.refreshToken}}"
    When I send a POST request to "/api/security-question/validate" with json:
      """
      {
        "answer": "wrong-answer",
        "recaptchaToken": "recaptchaToken"
      }
      """
    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "message": "Security question answer is invalid",
        "statusCode": 401
      }
      """

    And I set header "Authorization" with value "Bearer {{access_token_response.refreshToken}}"
    When I send a POST request to "/api/security-question/validate" with json:
      """
      {
        "answer": "correct answer",
        "recaptchaToken": "recaptchaToken"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "refreshToken": "*",
        "accessToken": "*"
      }
      """

  Scenario: Validate without captcha
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "roles": [
          {
            "name": "user",
            "permissions": []
          }
        ]
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
          "body": {
            "success": false
          }
        }
      }
      """
    When I send a POST request to "/api/security-question/define" with json:
      """
      {
        "question": "auth.security_question.question.one",
        "answer": "CORRECT ANSWER"
      }
      """
    Then print last response
    And the response status code should be 200

    And I am not authenticated
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "2fa@example.com",
        "plainPassword": "12345678"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "refreshToken": "*",
        "isSecurityQuestionDefined": true
      }
      """
    And I store a response as "access_token_response"
    Then print storage key "access_token_response" by path "refreshToken"

    And I set header "Authorization" with value "Bearer {{access_token_response.refreshToken}}"
    When I send a POST request to "/api/security-question/validate" with json:
      """
      {
        "answer": "CORRECT ANSWER"
      }
      """
    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "message": "auth.error.reason.no_captcha",
        "statusCode": 401
      }
      """

  Scenario: Validate brute force
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "roles": [
          {
            "name": "user",
            "permissions": []
          }
        ]
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
          "body": {
            "success": true
          }
        }
      }
      """
    When I send a POST request to "/api/security-question/define" with json:
      """
      {
        "question": "auth.security_question.question.one",
        "answer": "CORRECT ANSWER"
      }
      """
    Then print last response
    And the response status code should be 200

    And I am not authenticated
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "2fa@example.com",
        "plainPassword": "12345678"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "refreshToken": "*",
        "isSecurityQuestionDefined": true
      }
      """
    And I store a response as "access_token_response"
    Then print storage key "access_token_response" by path "refreshToken"

    And I set header "Authorization" with value "Bearer {{access_token_response.refreshToken}}"
    When I send a POST request to "/api/security-question/validate" with json:
      """
      {
        "answer": "wrong-answer",
        "recaptchaToken": "recaptchaToken"
      }
      """
    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "message": "Security question answer is invalid",
        "statusCode": 401
      }
      """
    When I send a POST request to "/api/security-question/validate" with json:
      """
      {
        "answer": "wrong-answer",
        "recaptchaToken": "recaptchaToken"
      }
      """
    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "message": "Security question answer is invalid",
        "statusCode": 401
      }
      """
    When I send a POST request to "/api/security-question/validate" with json:
      """
      {
        "answer": "wrong-answer",
        "recaptchaToken": "recaptchaToken"
      }
      """
    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "message": "Security question answer is invalid",
        "statusCode": 401
      }
      """
    When I send a POST request to "/api/security-question/validate" with json:
      """
      {
        "answer": "wrong-answer",
        "recaptchaToken": "recaptchaToken"
      }
      """
    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "message": "Security question answer is invalid",
        "statusCode": 401
      }
      """
    When I send a POST request to "/api/security-question/validate" with json:
      """
      {
        "answer": "wrong-answer",
        "recaptchaToken": "recaptchaToken"
      }
      """
    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "message": "Security question answer is invalid",
        "statusCode": 401
      }
      """
    When I send a POST request to "/api/security-question/validate" with json:
      """
      {
        "answer": "wrong-answer",
        "recaptchaToken": "recaptchaToken"
      }
      """
    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "message": "auth.security-question.error.reason.ban",
        "statusCode": 401
      }
      """
    When I send a POST request to "/api/security-question/validate" with json:
      """
      {
        "answer": "wrong-answer",
        "recaptchaToken": "recaptchaToken"
      }
      """
    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "message": "auth.security-question.error.reason.ban",
        "statusCode": 401
      }
      """
    Given I use DB fixture "refresh-tokens"
    And I use DB fixture "2fa-codes"
    When I send a POST request to "/api/2fa/auth" with json:
      """
      {
        "secondFactorCode": 123456
      }
      """
    Then the response status code should be 200
    Then print last response
    And the response should contain json:
      """
      {
        "accessToken": "*",
        "refreshToken": "*"
      }
      """
    When I send a POST request to "/api/security-question/validate" with json:
      """
      {
        "answer": "correct answer",
        "recaptchaToken": "recaptchaToken"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "accessToken": "*",
        "refreshToken": "*"
      }
      """
