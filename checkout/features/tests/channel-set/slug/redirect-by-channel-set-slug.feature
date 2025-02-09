Feature: Redirect by channel set slug

  Background:
    Given I remember as "checkoutChannelSetSlugId" following value:
    """
    "25e08dec-84c9-4062-8ee6-155ef6c1ffa0"
    """

  Scenario: Not found channel set slug
    When I send a GET request to "/api/pay/init/109232/other_shopsystem/other_shopsystem"
    Then the response status code should be 404
    And response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "ChannelSet with slug 109232/other_shopsystem/other_shopsystem does not exist"
    }
    """

  Scenario: Wrong channel set slug
    When I send a GET request to "/api/pay/init/109232/undefined/api/redirect/109232/santander-installments"
    Then the response status code should be 400
    And response should contain json:
    """
    {
      "statusCode": 400,
      "error": "Bad Request",
      "message": "Unable to parse checkout slug 109232/undefined/api/redirect/109232/santander-installments"
    }
    """

  Scenario: Redirect by existing checkout channel set slug
    Given I use DB fixture "channel-set/slug/existing-checkout-slug"
    When I send a GET request to "/api/pay/init/999999/other_shopsystem/other_shopsystem"
    Then the response status code should be 302
    And the response header "location" should have value "*/pay/create-flow/channel-set-id/{{checkoutChannelSetSlugId}}"

  Scenario: Redirect by existing finance express channel set slug
    Given I use DB fixture "channel-set/slug/existing-finance-express-slug"
    When I send a GET request to "/api/pay/init/111111/santander_installments"
    Then the response status code should be 302
    And the response header "location" should have value "*/api/redirect/111111/santander_installments?"
