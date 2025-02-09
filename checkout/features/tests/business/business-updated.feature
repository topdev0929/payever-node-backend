@business-updated
Feature: Business API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "businessOldName" following value:
      """
      "Old Business Name"
      """
    Given I remember as "businessOldCurrency" following value:
      """
      "EUR"
      """
    Given I remember as "businessNewName" following value:
      """
      "New Business Name"
      """
    Given I remember as "businessNewCurrency" following value:
      """
      "USD"
      """

  Scenario: Updating name and currency of existing business
    Given I use DB fixture "business/business-bus-message/business.updated/existing-business"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "users.event.business.updated",
        "payload": {
          "_id": "{{businessId}}",
          "name": "{{businessNewName}}",
          "currency": "{{businessNewCurrency}}",
          "businessDetail": {
            "_id": "3cbe9998-e5b0-4355-bba9-02350d9337d7",
            "companyAddress": {
              "_id": "9016d8fb-6587-4990-ab8a-0b61dd44599f",
              "country": "GB",
              "updatedAt": "2022-10-04T14:17:26.866Z",
              "createdAt": "2022-10-04T14:17:26.866Z"
            }
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then I look for model "Business" by following JSON and remember as "business":
      """
      {
        "_id": "{{businessId}}"
      }
      """
    Then print storage key "business"
    And stored value "business" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "applicationSubscriptions": [],
        "channelSets": [],
        "checkouts": [],
        "currency": "USD",
        "name": "New Business Name"
      }
      """
    Then I look for model "BusinessDetails" by following JSON and remember as "businessDetail":
      """
      {}
      """
    Then print storage key "businessDetail"
    And stored value "businessDetail" should contain json:
      """
      {
        "_id": "3cbe9998-e5b0-4355-bba9-02350d9337d7",
        "companyAddress": {
          "country": "GB"
        }
      }
      """
