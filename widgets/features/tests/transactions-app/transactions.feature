Feature: Channel set transactions
  Background:
    Given I authenticate as a user with the following data:
    """
    {
      "_id": "f07c5841-2ec5-419b-95ed-2583b1ae0b84",
      "roles": [{
        "name": "merchant",
        "permissions": [
          { "businessId": "1ad81b43-174f-4549-b776-228cf4be9bd1", "acls": [] }
        ]
      }]
    }
    """

  Scenario: Get last daily
    Given I use DB fixture "transactions-app/transactions/get-last-daily"
    When I send a GET request to "/transactions-app/business/1ad81b43-174f-4549-b776-228cf4be9bd1/last-daily?numDays=5"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 0
      },
      {
        "amount": 50
      },
      {
        "amount": 20
      },
      {
        "amount": 100
      },
      {
        "amount": 40
      }
    ]
    """

  Scenario: Get last monthly
    Given I use DB fixture "transactions-app/transactions/get-last-monthly"
    When I send a GET request to "/transactions-app/business/1ad81b43-174f-4549-b776-228cf4be9bd1/last-monthly?months=6"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 0
      },
      {
        "amount": 500
      },
      {
        "amount": 1000
      },
      {
        "amount": 0
      },
      {
        "amount": 2000
      },
      {
        "amount": 800
      }
    ]
    """

  Scenario: get personal last daily
    Given I use DB fixture "transactions-app/transactions/get-personal-last-daily"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "525591f7-740a-4849-9f7e-e4e7b7a9af1a",
      "roles": [
        {
          "name": "user",
          "permissions": []
        }
      ]
    }
    """
    When I send a GET request to "/transactions-app/personal/last-daily?numDays=6"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 0
      },
      {
        "amount": 0
      },
      {
        "amount": 300
      },
      {
        "amount": 240
      },
      {
        "amount": 600
      },
      {
        "amount": 0
      }
    ]
    """

  Scenario: get personal last monthly
    Given I use DB fixture "transactions-app/transactions/get-personal-last-monthly"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "525591f7-740a-4849-9f7e-e4e7b7a9af1a",
      "roles": [
        {
          "name": "user",
          "permissions": []
        }
      ]
    }
    """
    When I send a GET request to "/transactions-app/personal/last-monthly?months=6"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 0
      },
      {
        "amount": 1500
      },
      {
        "amount": 3000
      },
      {
        "amount": 2400
      },
      {
        "amount": 6000
      },
      {
        "amount": 1000
      }
    ]
    """

