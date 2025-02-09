Feature: Admin endpoints for campaigns
  Background:
    Given I use DB fixture "mail/mail"
    Given I use DB fixture "campaign/campaign"
    And I remember as "CAMPAIGN_ID" following value:
      """
      "ec64531c-a226-4479-a251-5ef11c6d7c25"
      """
    And I remember as "CHANNEL_SET_ID" following value:
      """
      "c07adfb6-8d2e-410c-8a99-4e8b0feb4aad"
      """
    And I remember as "NEW_CAMPAIGN_ID" following value:
      """
      "b5826252-cb39-4134-8c78-f3f1f84b1ada"
      """
    And I remember as "BUSINESS_ID" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "admin"
      }]
    }
    """

  Scenario: Get one campaign for admin
    When I send a GET request to "/api/admin/campaign/{{CAMPAIGN_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "name": "campaign test"
    }
    """

  Scenario: List of campaigns for admin
    When I send a GET request to "/api/admin/campaign/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "campaigns": [
        {
          "name": "campaign test"
        }
      ]
    }
    """

  Scenario: List of campaigns for admin with filters
    When I send a GET request to "/api/admin/campaign/list?limit=10&page=1&businessIds={{BUSINESS_ID}}&channelSetIds={{CHANNEL_SET_ID}}&projection=name business"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "campaigns": [
        {
          "business": "{{BUSINESS_ID}}",
          "name": "campaign test"
        }
      ]
    }
    """

  Scenario: Create a campaign for admin
    When I send a POST request to "/api/admin/campaign/{{BUSINESS_ID}}" with json:
    """
    {
      "name": "test email campaign",
      "themeId": "5d085102-0cf6-403a-87ec-ebc97246e935",
      "categories": [
        "3f1a5efe-df10-47a6-8296-19090050cd26"
      ],
      "from": "campaign@payever.com",
      "contacts": [
        "mh.septiadi@gmail.com"
      ],
      "schedules": [
        {
          "type": "now"
        }
      ],
      "date": "2020-10-20T16:31:41.813+00:00",
      "status": "new"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "business": "{{BUSINESS_ID}}",
      "name": "test email campaign"
    }
    """

  Scenario: Update a campaign for admin
    When I send a PATCH request to "/api/admin/campaign/{{CAMPAIGN_ID}}" with json:
    """
    {
      "name": "UPDATED campaign"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "name": "UPDATED campaign"
    }
    """

  Scenario: Delete a campaign for admin
    When I send a GET request to "/api/admin/campaign/{{CAMPAIGN_ID}}"
    Then the response status code should be 200
    When I send a DELETE request to "/api/admin/campaign/{{CAMPAIGN_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "name": "campaign test"
    }
    """
    When I send a GET request to "/api/admin/campaign/{{CAMPAIGN_ID}}"
    Then the response status code should be 404
