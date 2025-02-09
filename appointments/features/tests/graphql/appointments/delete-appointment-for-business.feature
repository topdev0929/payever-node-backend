Feature: Delete appointments by business
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
            "permissions": [{"businessId": "{{businessId}}", "acls": []}]
          }
        ]
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": ["appointments"]
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": ["appointments-folder"]
      }
      """

  Scenario: Delete appointment
    Given I use DB fixture "update-appointments"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        deleteAppointment(businessId: "{{businessId}}", id: "{{appointmentId}}")
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "deleteAppointment": ["{{appointmentId}}"]
        }
      }
      """
    Then model "Appointment" found by following JSON should not exist:
      """
      {
        "_id": "{{appointmentId}}"
      }
      """

  Scenario: Delete appointment of another business
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
        deleteAppointment(businessId: "{{businessId}}", id: "{{appointmentId}}")
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
              "deleteAppointment"
            ]
          }
        ]
      }
      """

  Scenario: Delete appointment by anonymous
    Given I am not authenticated
    Given I use DB fixture "update-appointments"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
          deleteAppointment(businessId: "{{businessId}}", id: "{{appointmentId}}")
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
           "deleteAppointment"
         ]
       }
      ]
    }
    """

  Scenario: Delete appointment by token without merchant role
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
        deleteAppointment(businessId: "{{businessId}}", id: "{{appointmentId}}")
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
             "deleteAppointment"
           ]
         }
        ]
      }
      """
