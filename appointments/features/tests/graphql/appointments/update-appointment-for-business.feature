Feature: Update appointments by business
  Background:
    Given I remember as "appointmentId" following value:
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
            "permissions": [{"businessId": "{{businessId}}", "acls": [{
              "create": true,
              "delete": true,
              "microservice": "appointments",
              "read": true,
              "update": true
            }]}]
          }
        ]
      }
      """
    Given I remember as "emailFieldId" following value:
      """
      "4f0883c5-782c-4aee-bc78-aa816b0a147c"
      """
    Given I mock Elasticsearch method "isIndexExists" with:
      """
      {
        "arguments": ["appointments"],
        "result": true
      }
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": ["appointments"]
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": ["appointments"]
      }
      """
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": ["appointments-folder"]
      }
      """

  Scenario: Update appointment
    Given I use DB fixture "update-appointments"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        updateAppointment(
          businessId: "{{businessId}}"
          id: "{{appointmentId}}"
          data: {
            fields: [
              {
                value: "new@email.com"
                fieldId: "{{emailFieldId}}"
              }
            ]
          }
        )
        {
          _id
          fields {
            value
            field {
              _id
              name
            }
          }
        }
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "updateAppointment": {
            "_id": "11111111-1111-1111-1111-111111111111",
            "fields": [
              {
                "value": "new@email.com",
                "field": {
                  "_id": "4f0883c5-782c-4aee-bc78-aa816b0a147c",
                  "name": "email"
                }
              }
            ]
          }
        }
      }
      """
    And model "AppointmentField" found by following JSON should not exist:
      """
      {
        "value": "test-existing@email.com"
      }
      """

  Scenario: Update appointment of another business
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "test@payever.de",
        "roles": [
          {
            "name": "merchant",
            "permissions": [{"businessId": "{{anotherBusinessId}}", "acls": []}]
          }
        ]
      }
      """
    Given I use DB fixture "update-appointments"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        updateAppointment(
          businessId: "{{businessId}}"
          id: "{{appointmentId}}"
          data: {
            fields: [],
            allDay: true,
            repeat: false,
            date: "-date-value-"
            time: "-time-value-"
          }
        )
        {
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
             "updateAppointment"
           ]
         }
        ]
      }
      """

  Scenario: Update appointment by anonymous
    Given I am not authenticated
    Given I use DB fixture "update-appointments"
    When I send a GraphQL query to "/appointments":
     """
      mutation {
        updateAppointment(
          businessId: "{{businessId}}"
          id: "{{appointmentId}}"
          data: {
            fields: [],
            allDay: true,
            repeat: false,
            date: "-date-value-"
            time: "-time-value-"
          }
        )
        {
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
           "updateAppointment"
         ]
       }
      ]
    }
    """

  Scenario: Update appointment by token without merchant role
    Given I use DB fixture "update-appointments"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "test@payever.de",
        "roles": [
          {
            "name": "user",
            "permissions": [{"businessId": "{{businessId}}", "acls": []}]
          }
        ]
      }
      """
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        updateAppointment(
          businessId: "{{businessId}}"
          id: "{{appointmentId}}"
          data: {
            fields: [],
            allDay: true,
            repeat: false,
            date: "-date-value-"
            time: "-time-value-"
          }
        )
        {
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
             "updateAppointment"
           ]
         }
        ]
      }
      """
