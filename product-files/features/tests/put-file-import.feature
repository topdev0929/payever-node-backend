Feature: Put file import
  Background:
    Given I use DB fixture "put-file-import"
    Given I remember as "businessId" following value:
      """
      "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
      """
    Given I remember as "fileUrl" following value:
      """
      "https://test.com/some.xml"
      """    
  
  Scenario: Access check
    Given I authenticate as a user with the following data:
      """
      {
        "roles": [
          {
            "name": "unknown"
          }
        ]
      }
      """
    When I send a PUT request to "/synchronization-tasks/business/{{businessId}}/file-import" with json:
      """
      {
        "fileUrl": "{{fileUrl}}"
      }
      """
    Then print last response
    Then the response status code should be 403

  Scenario: Put file import
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a PUT request to "/synchronization-tasks/business/{{businessId}}/file-import" with json:
      """
      {
        "fileUrl": "{{fileUrl}}"
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "fileImport": {
          "fileUrl": "{{fileUrl}}"
        }
      }
      """

    Then print RabbitMQ exchange "async_events" message list
    Then RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "product-files.event.import.requested",
          "payload": {
            "businessId": "{{businessId}}",
            "fileImport": {
              "fileUrl": "{{fileUrl}}"
            }
          }
        }
      ]
      """
