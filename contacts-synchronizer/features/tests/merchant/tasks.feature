Feature: Tasks
  Background:
    Given I remember as "businessId" following value:
      """
      "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
      """
    Given I remember as "fileUrl" following value:
      """
      "http://localhost:8080/static/file-for-success-import.csv"
      """
    Given I remember as "userId" following value:
      """
      "60bbc2de-3ff6-4568-b918-a0a5412c4602"
      """
    Given I remember as "taskId" following value:
      """
      "c72ea71f-1c09-4a4a-915a-145d99186f81"
      """
    Given I remember as "foreignBusinessId" following value:
      """
      "42436c17-926c-44d7-adb4-edd5b9f5da09"
      """
    Given I remember as "foreignTaskId" following value:
      """
      "b5a2bd9c-8dcc-4c22-81a8-538050aaff5c"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """

  Scenario: Get task by id
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/synchronizations-tasks"
    When I send a GET request to "/synchronization/business/{{businessId}}/tasks/{{taskId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{taskId}}",
        "businessId": "{{businessId}}",
        "direction": "inward",
        "errorsList": [],
        "itemsSynced": 0,
        "kind": "file-import",
        "status": "in_progress"
      }
      """
    And the response should not contain json:
      """
      {
        "events": []
      }
      """

  Scenario: Forbid to fetch foreign business task
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/synchronizations-tasks"
    When I send a GET request to "/synchronization/business/{{businessId}}/tasks/{{foreignTaskId}}"
    Then print last response
    And the response status code should be 404
  
  Scenario: Forbid to fetch foreign business task
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/synchronizations-tasks"
    When I send a GET request to "/synchronization/business/{{foreignBusinessId}}/tasks/{{foreignTaskId}}"
    Then print last response
    And the response status code should be 403

  Scenario: Find all tasks for business
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/synchronizations-tasks"
    When I send a GET request to "/synchronization/business/{{businessId}}/tasks"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{taskId}}",
        "businessId": "{{businessId}}",
        "direction": "inward",
        "errorsList": [],
        "itemsSynced": 0,
        "kind": "file-import",
        "status": "in_progress"
      }]
      """
    And the response should not contain json:
      """
      [{
        "_id": "{{foreignTaskId}}"
      }]
      """

  Scenario: Find tasks by filter
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/synchronizations-tasks"
    When I send a GET request to "/synchronization/business/{{businessId}}/tasks?direction=inward&status=in_progress&kind=file-import&kind=integration"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{taskId}}",
        "businessId": "{{businessId}}",
        "direction": "inward",
        "errorsList": [],
        "itemsSynced": 0,
        "kind": "file-import",
        "status": "in_progress"
      }]
      """
    And the response should not contain json:
      """
      [{
        "_id": "f0be42fa-296a-437a-9782-fcb67adf0e7f"
      }]
      """
    And the response should not contain json:
      """
      [{
        "_id": "{{foreignTaskId}}"
      }]
      """

  Scenario: Get task events
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/synchronizations-tasks"
    When I send a GET request to "/synchronization/business/{{businessId}}/tasks/{{taskId}}/events"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [{

        "itemId": "776c652c-826e-4559-b1b0-4fe80657a340",
        "message": "event1-message"
      }, {
        "itemId": "8e8feec5-f5bf-4d11-96dc-52fac239a33e",
        "message": "event2-message"
      }]
      """

  Scenario: Create new task
    Given I use DB fixture "partial/business"
    When I send a PUT request to "/synchronization/business/{{businessId}}/tasks" with json:
      """
      {
        "kind": "file-import",
        "fileImport": {
          "fileUrl": "{{fileUrl}}",
          "overwriteExisting": false
        }
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "direction": "inward",
        "errorsList": [],
        "events": [],
        "fileImportId": "*",
        "itemsSynced": 0,
        "kind": "file-import",
        "status": "in_queue"
      }
      """
    And I look for model "FileImport" by following JSON and remember as "fileImport":
      """
      {
        "fileUrl": "{{fileUrl}}",
        "overwriteExisting": false
      }
      """
    And print storage key "fileImport"
    And stored value "fileImport" should contain json:
      """
      {
        "_id": "*"
      }
      """
    And I look for model "SynchronizationTask" by following JSON and remember as "task":
      """
      {
        "businessId": "{{businessId}}",
        "kind": "file-import",
        "direction": "inward"
      }
      """
    And print storage key "task"
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [{
        "name": "contacts-synchronizer.event.file-import.triggered",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "fileImport": {
            "fileUrl": "{{fileUrl}}",
            "overwriteExisting": false
          },
          "synchronization": {
            "taskId": "{{task._id}}"
          }
        }
      }]
      """
