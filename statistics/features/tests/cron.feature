Feature: Cron
  Scenario: Run cron job
    Given I use DB fixture "cron"
    When I send a POST request to "/api/run-cron-job"
    Then print last response
    And the response status code should be 200
    And model "Payment" with id "8fd31f6c-fdd6-4504-9039-1935a071bec2" should contain json:
      """
      {
        "browser": "Safari",
        "device": "Mobile",
        "amount": 1
      }
      """
