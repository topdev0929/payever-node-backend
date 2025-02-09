Feature: Business settings
  Scenario: Get business settings by channelset id
    Given I use DB fixture "businesses"
    And I use DB fixture "applications"
    When I send a GET request to "/api/v1/7013667a-2344-4bb5-bc1f-fa10eae21c91/channelset-settings"

    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "secondFactor": false,
      "verificationType": 0,
      "autoresponderEnabled": true
    }
    """

  Scenario: Get business settings
    Given I use DB fixture "businesses"
    When I send a GET request to "/api/v1/21e67ee2-d516-42e6-9645-46765eadd0ac/settings"

    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "secondFactor": false,
      "verificationType": 0,
      "autoresponderEnabled": true
    }
    """

  Scenario: Store business settings
    Given I use DB fixture "businesses"
    When I send a PUT request to "/api/v1/21e67ee2-d516-42e6-9645-46765eadd0ac/settings" with json:
    """
    {
      "secondFactor": true,
      "verificationType": 1,
      "autoresponderEnabled": false
    }
    """

    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "secondFactor": true,
      "verificationType": 1,
      "autoresponderEnabled": false
    }
    """
