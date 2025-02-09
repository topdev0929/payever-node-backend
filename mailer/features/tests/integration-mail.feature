Feature: Integration mail
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send integration mail
    Given I use DB fixture "businesses"
    And I set header "integration-access-token" with value "78c5b4b5-f47c-43bb-8f60-7f3d422071a9"
    When I send a POST request to "/api/business/integration/mail" with json:
      """
      {
        "data": {
            "businessId": "614cb154-0323-4df0-be89-85376b9de666",
            "subject": "lorem ipsum",
            "to": "payever.devtest@gmail.com",
            "body":"<scr<script>Ha!</script>ipt> alert(document.cookie);</script><script test=\"\">console.log(\"etst\");</script><div id=\"Translation\"><h3>The standard Lorem Ipsum passage, used since the 1500s</h3>"
        }
      }
      """
    Then print last response
    And response status code should be 201
    And the response should contain json:
    """
    {
      "subject": "lorem ipsum",
      "html": "<div><h3>The standard Lorem Ipsum passage, used since the 1500s</h3></div>",
      "to": "payever.devtest@gmail.com"
    }
    """

  Scenario: Send integration mail
    Given I use DB fixture "integrationaccesses"
    And I set header "integration-access-token" with value "78c5b4b5-f47c-43bb-8f60-7f3d422071a9"
    When I send a POST request to "/api/integration/jira" with json:
      """
      {
        "from": "sender@example.com",
        "to": "recipient@example.com",
        "subject": "this is subject",
        "body": "This is the body of the email"
      }
      """
    Then print last response
    And response status code should be 201
