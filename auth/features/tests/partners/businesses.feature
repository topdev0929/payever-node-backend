Feature: PartnerController
  Background:
    Given I use DB fixture "tags/businesses"
    And I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "service@payever.de",
        "roles": [
          {"name": "user", "permissions": []},
          {"name": "admin", "permissions": []}
        ]
      }
      """
    And I remember as "assignBusinessTagEvent" following value:
    """
    "auth.commands.assign_partner_tag"
    """
    And I remember as "removeBusinessTagEvent" following value:
    """
    "auth.commands.remove_partner_tag"
    """
    And I remember as "businessWithSantanderTag" following value:
    """
    "426fafeb-132f-4ea1-96df-03bd993f126c"
    """
    And I remember as "businessWithoutTags" following value:
    """
    "06916ce0-c9cc-401a-ac18-22fbce616521"
    """
    And I remember as "nonExistingBusiness" following value:
    """
    "812d2cd9-84a4-455d-b724-8fb4d9e83be7"
    """
    And I remember as "PartnerBusinessModel" following value:
    """
    "PartnerBusiness"
    """


  Scenario: create a business record and assign a partner tag to it
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "partner-tags",
          {}
         ],
        "result": {}
      }
      """

    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
    """
    {
      "name": "{{assignBusinessTagEvent}}",
      "payload": {
        "businessId": "{{nonExistingBusiness}}",
        "tagName": "santander"
      }
    }
    """
    And I process messages from RabbitMQ "async_events_auth_micro" channel

    Then model "{{PartnerBusinessModel}}" with id "{{nonExistingBusiness}}" should contain json:
    """
    {
      "partnerTags": ["santander"]
    }
    """


  Scenario: assign a partner tag to a business
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "partner-tags",
          {}
         ],
        "result": {}
      }
      """

    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
    """
    {
      "name": "{{assignBusinessTagEvent}}",
      "payload": {
        "businessId": "{{businessWithoutTags}}",
        "tagName": "santander"
      }
    }
    """
    And I process messages from RabbitMQ "async_events_auth_micro" channel

    Then model "{{PartnerBusinessModel}}" with id "{{businessWithoutTags}}" should contain json:
    """
    {
      "partnerTags": ["santander"]
    }
    """


  Scenario: remove a partner tag from a business
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "partner-tags",
          {}
         ],
        "result": {}
      }
      """

    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
    """
    {
      "name": "{{removeBusinessTagEvent}}",
      "payload": {
        "businessId": "{{businessWithSantanderTag}}",
        "tagName": "santander"
      }
    }
    """
    And I process messages from RabbitMQ "async_events_auth_micro" channel

    Then model "{{PartnerBusinessModel}}" with id "{{businessWithSantanderTag}}" should not contain json:
    """
    {
      "partnerTags": ["santander"]
    }
    """
