Feature: Oauth
  Scenario: Post a token
    Given I use DB fixture "users"
    And I use DB fixture "oauth-clients"

    When I send a POST request to "/oauth/v3/token" with json:
    """
    {
      "client_id": "10276_4r9ki908848w844scwcwooo0swwcggg8csows8cwsso8swgsk4",
      "client_secret": "3vxgud9q10o48w8socow4cwogw48c8cwscw4gos48o00wo4gkg",
      "grant_type": "http://www.payever.de/api/payment",
      "scopes": [
        "API_CREATE_PAYMENT"
      ]
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "token_type": "bearer",
      "scopes": [
        "API_CREATE_PAYMENT"
      ],
      "access_token": "*",
      "refresh_token": "*",
      "expires_in": "*"
    }
    """

  Scenario: Get a token
    Given I use DB fixture "users"
    And I use DB fixture "oauth-clients"

    When I send a GET request to "/oauth/v3/token?scopes=API_CREATE_PAYMENT&grant_type=http://www.payever.de/api/payment&client_secret=3vxgud9q10o48w8socow4cwogw48c8cwscw4gos48o00wo4gkg&client_id=10276_4r9ki908848w844scwcwooo0swwcggg8csows8cwsso8swgsk4"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "token_type": "bearer",
      "scopes": [
        "API_CREATE_PAYMENT"
      ],
      "access_token": "*",
      "refresh_token": "*",
      "expires_in": "*"
    }
    """

  Scenario: Get a token with businessId
    Given I use DB fixture "users"
    And I use DB fixture "oauth-clients"

    When I send a GET request to "/oauth/v3/token?business_id=fe593efa-c439-44be-9eaa-52c78962c817&scopes=API_CREATE_PAYMENT&grant_type=http://www.payever.de/api/payment&client_secret=3vxgud9q10o48w8socow4cwogw48c8cwscw4gos48o00wo4gkg&client_id=10276_4r9ki908848w844scwcwooo0swwcggg8csows8cwsso8swgsk4"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "token_type": "bearer",
      "scopes": [
        "API_CREATE_PAYMENT"
      ],
      "access_token": "*",
      "refresh_token": "*",
      "expires_in": "*"
    }
    """
