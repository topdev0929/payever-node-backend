Feature: Create appointments by business
  Background:
    Given I use DB fixture "folder"
    Given I remember as "contactId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "anotherBusinessId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "test@payever.de",
        "roles": [
          {
            "name": "merchant",
            "permissions": [{"businessId": "{{businessId}}", "acls": []}]
          }
        ]
      }
      """
    Given I remember as "emailFieldId" following value:
      """
      "4f0883c5-782c-4aee-bc78-aa816b0a147c"
      """
    Given I remember as "firstNameFieldId" following value:
      """
      "d9aab937-ad45-4815-9a4b-63f39ec12b53"
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": ["appointments-folder"]
      }
      """
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": ["appointments-folder"]
      }
      """

  Scenario: Create appointment
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        createAppointment(
          businessId: "{{businessId}}"
          targetFolderId: "folder-1"
          data: {
            allDay: true,
            repeat: false
            date: "-date-value-"
            time: "-time-value-"
            fields: [],
            contacts: ["730627cd-ad29-4f5a-ac2a-57dae66f4bcf"]
          }
        ) {
          _id
        }
      }
      """
    Then print last response
    And the response status code should be 200
    And store a response as "response"
    And response should contain json:
      """
      {
        "data": {
          "createAppointment": {
            "_id": "*"
          }
        }
      }
      """
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [{
        "name": "appointments.event.appointment.created",
        "payload": {
          "appType": "appointments",
          "business": {
            "id": "{{businessId}}"
          },
          "appointment": {
            "contacts": ["730627cd-ad29-4f5a-ac2a-57dae66f4bcf"],
            "_id": "{{response.data.createAppointment._id}}"
          },
          "id": "{{response.data.createAppointment._id}}"
        }
      }]
      """

  Scenario: Create appointment by anonymous
    Given I am not authenticated
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        createAppointment(
          businessId: "{{anotherBusinessId}}"
          targetFolderId: "folder-1"
          data: {
            allDay: true,
            repeat: false
            date: "-date-value-"
            time: "-time-value-"
            fields: []
          }
        ) {
          _id
        }
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "errors": [
         {
           "message": "app.employee-permission.insufficient.error",
           "path": [
             "createAppointment"
           ]
         }
        ]
      }
      """
