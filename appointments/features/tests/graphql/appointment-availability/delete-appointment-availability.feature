Feature: Delete appointment availability by business
  Background:
    Given I remember as "appointmentAvailabilityId" following value:
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

  Scenario: Delete appointment availability
    Given I use DB fixture "appointment-availability"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        deleteAppointmentAvailability(businessId: "{{businessId}}", id: "{{appointmentAvailabilityId}}")
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "deleteAppointmentAvailability": ["{{appointmentAvailabilityId}}"]
        }
      }
      """
    Then model "Appointment" found by following JSON should not exist:
      """
      {
        "_id": "{{appointmentAvailabilityId}}"
      }
      """

  Scenario: Delete appointment availability of another business
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
    Given I use DB fixture "appointment-availability"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        deleteAppointmentAvailability(businessId: "{{businessId}}", id: "{{appointmentAvailabilityId}}")
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
              "deleteAppointmentAvailability"
            ]
          }
        ]
      }
      """

  Scenario: Delete appointment availability by anonymous
    Given I am not authenticated
    Given I use DB fixture "appointment-availability"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
          deleteAppointmentAvailability(businessId: "{{businessId}}", id: "{{appointmentAvailabilityId}}")
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
           "deleteAppointmentAvailability"
         ]
       }
      ]
    }
    """

  Scenario: Delete appointment availability by token without merchant role
    Given I use DB fixture "appointment-availability"
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
        deleteAppointmentAvailability(businessId: "{{businessId}}", id: "{{appointmentAvailabilityId}}")
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
             "deleteAppointmentAvailability"
           ]
         }
        ]
      }
      """
