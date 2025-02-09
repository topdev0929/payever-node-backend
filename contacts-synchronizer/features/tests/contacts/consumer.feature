Feature: Contacts app consumer
  Background: I remember
    Given I remember as "businessId" following value:
      """
      "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
      """
    Given I remember as "taskId" following value:
      """
      "c72ea71f-1c09-4a4a-915a-145d99186f81"
      """
    Given I remember as "taskItemId" following value:
      """
      "49213568-2301-45c1-9a23-ef828f1e7986"
      """
    Given I remember as "contactId" following value:
      """
      "e0fc6b1d-ada0-4d63-b592-761fd0908132"
      """

  Scenario: Received synchronization contact
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/integrations"
    Given I use DB fixture "partial/synchronizations"
    Given I use DB fixture "partial/synchronizations-tasks"
    Given I use DB fixture "partial/synchronizations-tasks-items"
    When I publish in RabbitMQ channel "async_events_synchronizer_micro" message with json:
      """
      {
        "name": "contacts.event.contact-synchronization.created",
        "payload": {
          "contact": {
            "_id": "{{contactId}}",
            "businessId": "{{businessId}}"
          },
          "fields": [],
          "synchronization": {
            "taskId": "{{taskId}}",
            "taskItemId": "{{taskItemId}}"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And I look for model "SynchronizationTask" with id "{{taskId}}" and remember as "task"
    And print storage key "task"
    And stored value "task" should contain json:
      """
      {
        "itemsSynced": 1
      }
      """
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
         {
           "name": "payever.event.business.email",
           "payload": {
             "businessId": "{{businessId}}",
             "templateName": "contacts-import-successful",
             "variables": {
               "errorsList": []
             }
           }
         }
      ]
      """
