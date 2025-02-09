Feature: Delete appointments type by business
  Background:
    Given I remember as "appointmentTypeId" following value:
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

  Scenario: Delete appointment type
    Given I use DB fixture "appointment-type"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        deleteAppointmentType(businessId: "{{businessId}}", id: "{{appointmentTypeId}}")
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "deleteAppointmentType": ["{{appointmentTypeId}}"]
        }
      }
      """
    Then model "Appointment" found by following JSON should not exist:
      """
      {
        "_id": "{{appointmentTypeId}}"
      }
      """

  Scenario: Delete appointment type of another business
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
    Given I use DB fixture "appointment-type"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        deleteAppointmentType(businessId: "{{businessId}}", id: "{{appointmentTypeId}}")
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
              "deleteAppointmentType"
            ]
          }
        ]
      }
      """

  Scenario: Delete appointment type by anonymous
    Given I am not authenticated
    Given I use DB fixture "appointment-type"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
          deleteAppointmentType(businessId: "{{businessId}}", id: "{{appointmentTypeId}}")
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
           "deleteAppointmentType"
         ]
       }
      ]
    }
    """

  Scenario: Delete appointment type by token without merchant role
    Given I use DB fixture "appointment-type"
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
        deleteAppointmentType(businessId: "{{businessId}}", id: "{{appointmentTypeId}}")
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
             "deleteAppointmentType"
           ]
         }
        ]
      }
      """
