Feature: Authentication
  Background:
    Given I use DB fixture "users"

  Scenario: Login and send a 2FA token to the user
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "2fa@example.com",
        "plainPassword": "12345678"
      }
      """
    And look for model "SecondFactorToken" by following JSON and remember as "token":
      """
      {
        "userId": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81"
      }
      """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "refreshToken": "*"
      }
      """
    And stored value "token" should contain json:
      """
      {
        "active": true
      }
      """

  Scenario: Trying to trick the system and generate an access token using a refresh endpoint - this should fail
    Given I use DB fixture "refresh-tokens"
    And I use DB fixture "2fa-codes"
    And I set header "Authorization" with value "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InRva2VuSWQiOiI1ZDM1ODQ3MGU4OWY2YzFlZWNiODIyMDgiLCJ1c2VySWQiOiJhYzAzMWZjNS00M2Q4LTRlMTctYTA3Yi1kYWExYzNiOGVhODEiLCJlbWFpbCI6IjJmYUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IjJGQSIsImxhc3ROYW1lIjoiMkZBIn0sImlhdCI6MTU2Mzc4ODQwMCwiZXhwIjoxODc5MzU3OTIwfQ.HAjMpD175A3rY70C1HkPsA0pk1kkEQfIGKa95pZ00tE"
    And I set header "User-Agent" with value "node-superagent/3.8.3"

    When I send a GET request to "/api/refresh"

    Then print last response
    And the response status code should be 403
    And the response should contain json:
      """
      {
        "statusCode": 403,
        "message": "Location not verified! 2FA required"
      }
      """

  Scenario: Validate 2FA token and generate an access token for admin
    Given I use DB fixture "refresh-tokens"
    And I use DB fixture "2fa-codes"
    And I set header "Authorization" with value "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InRva2VuSWQiOiI1ZDM1ODQ3MGU4OWY2YzFlZWNiODIyMDgiLCJ1c2VySWQiOiJhYzAzMWZjNS00M2Q4LTRlMTctYTA3Yi1kYWExYzNiOGVhODEiLCJlbWFpbCI6IjJmYUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IjJGQSIsImxhc3ROYW1lIjoiMkZBIn0sImlhdCI6MTU2Mzc4ODQwMCwiZXhwIjoxODc5MzU3OTIwfQ.HAjMpD175A3rY70C1HkPsA0pk1kkEQfIGKa95pZ00tE"

    When I send a POST request to "/api/2fa/auth" with json:
      """
      {
        "secondFactorCode": 123456
      }
      """
    And look for model "SecondFactorToken" by following JSON and remember as "token":
      """
      {
        "userId": "15edf7ca-cc8e-406c-9cd5-964b19eafb11",
        "active": true
      }
      """

    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "accessToken": "*",
        "refreshToken": "*"
      }
      """
    And I store a response as "access_token_response"
    And stored value "token" should contain json:
      """
      {
        "active": true
      }
      """

  Scenario: Validate 2FA token and generate an access token for user
    Given I use DB fixture "refresh-tokens"
    And I use DB fixture "2fa-codes"
    And I set header "Authorization" with value "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InRva2VuSWQiOiI1ZDM1ODQ3MGU4OWY2YzFlZWNiODIyMDgiLCJ1c2VySWQiOiJhYzAzMWZjNS00M2Q4LTRlMTctYTA3Yi1kYWExYzNiOGVhODEiLCJlbWFpbCI6IjJmYUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IjJGQSIsImxhc3ROYW1lIjoiMkZBIn0sImlhdCI6MTU2Mzc4ODQwMCwiZXhwIjoxODc5MzU3OTIwfQ.HAjMpD175A3rY70C1HkPsA0pk1kkEQfIGKa95pZ00tE"

    When I send a POST request to "/api/2fa/auth" with json:
      """
      {
        "secondFactorCode": 123456
      }
      """
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "accessToken": "*",
        "refreshToken": "*"
      }
      """
    And I store a response as "access_token_response"

    And look for model "SecondFactorToken" by following JSON and remember as "token":
      """
      {
        "userId": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81",
        "active": false
      }
      """
    And stored value "token" should contain json:
      """
      {
        "active": false
      }
      """

    Then print storage key "access_token_response" by path "accessToken"
    When I set header "Authorization" with value "Bearer {{access_token_response.accessToken}}"

    And I send a GET request to "/api/user"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81"
      }
      """
