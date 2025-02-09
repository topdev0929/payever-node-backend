Feature: Channel set transactions
  Background:
    Given I authenticate as a user with the following data:
    """
    {
      "_id": "f07c5841-2ec5-419b-95ed-2583b1ae0b84",
      "roles": [{
        "name": "merchant",
        "permissions": [
          {
            "businessId": "1ad81b43-174f-4549-b776-228cf4be9bd1",
            "acls": []
          }
        ]
      }]
    }
    """

  Scenario: Get last daily
  Given I use DB fixture "transactions-app/channel-set-transactions/get-last-daily"
  When I send a GET request to "/transactions-app/business/1ad81b43-174f-4549-b776-228cf4be9bd1/channel-set/9e9dd289-758c-44a2-9a24-8443b049aeef/last-daily?numDays=5"
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
    Given I use DB fixture "transactions-app/channel-set-transactions/get-last-monthly"
    When I send a GET request to "/transactions-app/business/1ad81b43-174f-4549-b776-228cf4be9bd1/channel-set/9e9dd289-758c-44a2-9a24-8443b049aeef/last-monthly?months=6"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      {
        "amount": 0
      },
      {
        "amount": 250
      },
      {
        "amount": 500
      },
      {
        "amount": 0
      },
      {
        "amount": 1000
      },
      {
        "amount": 400
      }
    ]
    """
