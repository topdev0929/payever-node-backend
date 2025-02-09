Feature: If contact was imported successfully or with fail, synchronization task item for this contact should be marked as processed and if no unprocessed items remains task should be marked as successful
  Background:
    Given I remember as "synchronizationTaskId" following value:
      """
      "c72ea71f-1c09-4a4a-915a-145d99186f81"
      """
    Given I remember as "taskItemId" following value:
      """
      "49213568-2301-45c1-9a23-ef828f1e7986"
      """

  Scenario: Task has only one unprocessed contact item, receiving failure message
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/integrations"
    Given I use DB fixture "partial/synchronizations"
    Given I use DB fixture "partial/synchronizations-tasks"
    Given I use DB fixture "partial/synchronizations-tasks-items"
    And I remember as "itemEmail" following value:
      """
      "Test_EMAIL"
      """
    When I publish in RabbitMQ channel "async_events_synchronizer_micro" message with json:
      """
      {
        "name": "contacts.event.contact-synchronization.failed",
        "payload": {
          "contact": {
            "email": "{{itemEmail}}"
          },
          "synchronization": {
            "taskId": "{{synchronizationTaskId}}",
            "taskItemId": "{{taskItemId}}"
          },
          "errorMessage": "Some error, occurred during import"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_synchronizer_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "SynchronizationTask" with id "{{synchronizationTaskId}}" should contain json:
      """
        {
          "status": "success"
        }
      """
    And look for model "SynchronizationTaskItem" by following JSON and remember as "ItemContact":
      """
        {
          "_id": "{{taskItemId}}"
        }
      """
    And stored value "ItemContact" should contain json:
      """
      {
        "isProcessed": true
      }
      """
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
         {
           "name": "payever.event.business.email",
           "payload": {
             "businessId": "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1",
             "templateName": "contacts-import-successful",
             "variables": {
               "errorsList": [
                 {
                   "messages": [
                     "Some error, occurred during import"
                   ],
                   "email": "Test_EMAIL"
                 }
               ]
             }
           }
         }
      ]
      """
