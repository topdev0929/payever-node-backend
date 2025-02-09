Feature: Business steps. Create shop steps
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "stepId1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    Given I remember as "stepId2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
      """

  Scenario: Create shop steps when business being created
    Given I use DB fixture "stepper/create-shop-business-steps"
    When I publish in RabbitMQ channel "async_events_commerceos_micro" message with json:
      """
      {
          "name": "users.event.business.created",
          "payload": {
            "_id": "{{businessId}}"
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_commerceos_micro" channel
    And look for model "BusinessStep" by following JSON and remember as "businessStep1":
    """
      {
        "businessId": "{{businessId}}",
        "step": "{{stepId1}}"
      }
    """
    And look for model "BusinessStep" by following JSON and remember as "businessStep2":
    """
      {
        "businessId": "{{businessId}}",
        "step": "{{stepId2}}"
      }
    """
    And model "BusinessStep" with id "{{businessStep1._id}}" should contain json:
    """
      {
        "isActive": true
      }
    """
    And model "BusinessStep" with id "{{businessStep2._id}}" should contain json:
    """
      {
        "isActive": false
      }
    """
