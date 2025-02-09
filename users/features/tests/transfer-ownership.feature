Feature: Transfer ownership
  Background:
    And I authenticate as a user with the following data:
      """
      {
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "email": "email@test1.com",
        "roles": [
          {"name": "user", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
                "acls": []
              }
            ]
          }
        ]
      }
      """


  Scenario: Trying to send transfer email - non-owner
      Given I use DB fixture "transfer-ownership"
      Given I authenticate as a user with the following data:
      """
      {
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "email": "email@test2.com",
        "roles": [
          {"name": "user", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
                "acls": []
              }
            ]
          }
        ]
      }
      """
      When I send a POST request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0/send-ownership-invite" with json:
        """
        {
          "email": "email@test1.com"
        }
        """

      Then print last response
      And the response status code should be 403


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

    Scenario: Trying to send transfer email
      Given I use DB fixture "transfer-ownership"
      When I send a POST request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0/send-ownership-invite" with json:
        """
        {
          "email": "email@test1.com"
        }
        """

      Then print last response
      And the response status code should be 400
      And the response should contain json:
        """
        {
          "errors": "You can not send invite to yourself",
          "message": "Validation failed",
          "statusCode": 400
        }
        """

    Scenario: Trying to force transfer ownership
      Given I use DB fixture "transfer-ownership"
      When I send a PATCH request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0/transfer-ownership" with json:
        """
        {
          "email": "email@test2.com"
        }
        """

      Then print last response
      And the response status code should be 403

    Scenario: Trying to send transfer email of another business 
      Given I use DB fixture "transfer-ownership"
      When I send a POST request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c1/send-ownership-invite" with json:
        """
        {
          "email": "email@test2.com"
        }
        """

      Then print last response
      And the response status code should be 403
      And the response should contain json:
        """
        {
          "statusCode": 403,
          "message": "app.employee-permission.insufficient.error"
        }
        """

    Scenario: transfer ownership
    Given I use DB fixture "transfer-ownership"
    When I send a PATCH request to "/business/transfer-ownership?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lcklkIjoiOGExM2JkMDAtOTBmMS0xMWU5LTlmNjctNzIwMDAwNGZlNGMwIiwibmV3T3duZXJJZCI6Ijg1NTQ3ZTM4LWRmZTUtNDI4Mi1iMWFlLWM1NTQyMjY3ZjM5ZSIsImJ1c2luZXNzSWQiOiI4ODAzOGUyYS05MGY5LTExZTktYTQ5Mi03MjAwMDA0ZmU0YzAiLCJpYXQiOjE2MjYxNzM0MzksImV4cCI6MjYyNjI1OTgzOX0.DLGOoMnEWOUm21SMaLdQLlLJFlLV5JtqFL5Mwr66M0k"

    Then print last response
    And the response status code should be 200


