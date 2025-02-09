@update-business
Feature: Update business
  Background:
    Given I use DB fixture "channels"
    Given I use DB fixture "channel-set"
    Given I remember as "businessId" following value:
      """
      "2f06da8f-7240-43f0-a078-622730304fcc"
      """

  Scenario: On new business event created
    When I publish in RabbitMQ channel "async_events_channels_micro" message with json:
      """
      {
        "name":"users.event.business.created",
        "uuid":"7ee31df2-e6eb-4467-8e8d-522988f426b8",
        "version":0,
        "encryption":"none",
        "createdAt":"2019-08-28T12:32:26+00:00",
        "metadata":{
          "locale":"de",
          "client_ip":"176.198.69.86"
        },
        "payload":{
          "_id":"{{businessId}}",
          "name":"example business",
          "currency":"EUR",
          "companyAddress": {
            "country": "DE"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_channels_micro" channel
    Then I look for model "Business" by following JSON and remember as "newBusiness":
    """
    {
      "_id": "{{businessId}}"
    }
    """
    Then print storage key "newBusiness"
    Then model "Business" with id "{{businessId}}" should contain json:
      """
      {
         "_id": "{{businessId}}",
         "channelSets": [
           "4ac27113-de3b-42d2-a2e7-26a4943cb00a",
           "7e3441f7-eef7-4e8a-a2ac-968ea334f776"
         ]
       }
      """

