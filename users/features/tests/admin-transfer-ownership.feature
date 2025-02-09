Feature: Transfer ownership
  Background:
    And I authenticate as a user with the following data:
      """
      {
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "email": "admin@example.com",
        "roles": [
          {"name": "admin", "permissions": []}
        ]
      }
      """


    Scenario: Trying to send transfer email
      Given I use DB fixture "transfer-ownership"
      When I send a POST request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0/send-ownership-invite" with json:
        """
        {
          "email": "email@test2.com"
        }
        """

      Then print last response
      And the response status code should be 200


    Scenario: Trying to force transfer ownership
      Given I use DB fixture "transfer-ownership"
      When I send a PATCH request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0/transfer-ownership" with json:
        """
        {
          "email": "email@test2.com"
        }
        """

      Then print last response
      And the response status code should be 200
    


