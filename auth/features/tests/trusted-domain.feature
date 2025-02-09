@trusted-domain
Feature: Trusted domain
  Background:
    Given I use DB fixture "trusted-domain"
    And I remember as "BUSINESS_1_ID" following value:
      """
      "f2441a44-e7d3-4bf2-8246-03395f0df178"
      """
    And I authenticate as a user with the following data:
    """
    {
      "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
      "email": "merchant@example.com",
      "roles": [
      {
        "name": "user",
        "permissions": []
      },
      {
        "name": "merchant",
        "permissions": [{"businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac", "acls": []}]
      }]
    }
    """

  Scenario: Add domain
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.trusted-domain.added",
        "payload": {
          "businessId": "{{BUSINESS_1_ID}}",
          "domain": "shop.com"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then look for model "TrustedDomain" by following JSON and remember as "domain":
      """
      {
        "businessId": "{{BUSINESS_1_ID}}",
        "domain": "shop.com"
      }
      """
    Then stored value "domain" should contain json:
      """
      {
        "domain": "shop.com",
        "businessId": "{{BUSINESS_1_ID}}"
      }
      """
  
  Scenario: Delete domain
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.trusted-domain.deleted",
        "payload": {
          "businessId": "{{BUSINESS_1_ID}}",
          "domain": "domain.com"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    And model "TrustedDomain" found by following JSON should not exist:
      """
      {
        "businessId": "{{BUSINESS_1_ID}}"
      }
      """
