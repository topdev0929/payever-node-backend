Feature: Feature name
  Scenario: retreive last daily
    Given I use DB fixture "marketing-app/campaigns/retrieve-last-daily"
    Given I authenticate as a user with the following data:
    """
    {
      "_id": "f07c5841-2ec5-419b-95ed-2583b1ae0b84",
      "roles": [{
        "name": "merchant",
        "permissions": [
          {
            "businessId": "249f604f-624c-4268-bf49-4a8462b6d7b0",
            "acls": []
          }
        ]
      }]
    }
    """
    When I send a GET request to "/campaign-app/business/249f604f-624c-4268-bf49-4a8462b6d7b0"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    [
      { "_id": "478fd956-fe8e-4b4d-8175-a0bb3ffaedaa" },
      { "_id": "611ca64b-9831-4c12-9c6d-38d8290c8e9d" },
      { "_id": "6695dd72-5dba-4b8c-820f-0f944e42c801" }
    ]
    """

  Scenario: retrieve last daily should return 404 if business not found
    Given I authenticate as a user with the following data:
    """
    {
      "_id": "f07c5841-2ec5-419b-95ed-2583b1ae0b84",
      "roles": [{
        "name": "merchant",
        "permissions": [
          {
            "businessId": "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99",
            "acls": []
          }
        ]
      }]
    }
    """
    Given I use DB fixture "marketing-app/campaigns/retrieve-last-daily-should-return-404-if-business-not-found"
    When I send a GET request to "/campaign-app/business/3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"
    Then print last response
    Then the response status code should be 404
