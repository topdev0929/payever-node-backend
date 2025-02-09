Feature: Guest token
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "POST",
        "url": "*/api/guest-token",
        "body": "{\"ipHash\":\"db925cd5efc3521e35c0403d9f925afc72f39b1c340f9803bcc1aa03861cda4522\"}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "User-Agent": ""
        }
      },
      "response": {
        "status": 200,
        "body": {
          "accessToken": "{{GUEST_TOKEN}}"
        }
      }
    }
    """
  Scenario: Get guest token
    
    When I send a POST request to "/api/public-channels/live-chat/guest-token" with json:
      """
      {
        "visitorHash":"db925cd5efc3521e35c0403d9f925afc72f39b1c340f9803bcc1aa03861cda4522"
      }
      """
    Then print last response
    Then the response code should be 201
    And the response should contain json:
      """
      {
        "accessToken": "{{GUEST_TOKEN}}"
      }
      """

