Feature: Update appointment availability by business
  Background:
    Given I remember as "appointmentAvailabilityId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    Given I remember as "appointmentAvailabilityId2" following value:
      """
      "11111111-1111-1111-1111-111111111112"
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

  Scenario: Update appointment availability
    Given I use DB fixture "appointment-availability"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        updateAppointmentAvailability(
          businessId: "{{businessId}}"
          id: "{{appointmentAvailabilityId}}"
          data: {
            timeZone: "Etc/GMT",
            isDefault: true
          }
        )
        {
          _id
          timeZone
          isDefault
        }
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "updateAppointmentAvailability": {
            "_id": "11111111-1111-1111-1111-111111111111",
            "timeZone": "Etc/GMT",
            "isDefault": true
          }
        }
      }
      """
    And model "AppointmentType" found by following JSON should not exist:
      """
      {
        "_id": "{{appointmentAvailabilityId2}}",
        "isDefault": true
      }
      """

  Scenario: Set appointment availability as default
    Given I use DB fixture "appointment-availability"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        setDefaultAppointmentAvailability (
          businessId: "{{businessId}}"
          id: "{{appointmentAvailabilityId}}"
        )
        {
          _id
          isDefault
        }
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "setDefaultAppointmentAvailability": {
            "_id": "11111111-1111-1111-1111-111111111111",
            "isDefault": true
          }
        }
      }
      """
    And model "AppointmentType" found by following JSON should not exist:
      """
      {
        "_id": "{{appointmentAvailabilityId2}}",
        "isDefault": true
      }
      """

  Scenario: Update appointment availability of another business
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
        updateAppointmentAvailability(
          businessId: "{{businessId}}"
          id: "{{appointmentAvailabilityId}}"
          data: {
            timeZone: "Etc/GMT"
          }
        )
        {
          _id
          timeZone
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
             "updateAppointmentAvailability"
           ]
         }
        ]
      }
      """

  Scenario: Update appointment availability by anonymous
    Given I am not authenticated
    Given I use DB fixture "appointment-availability"
    When I send a GraphQL query to "/appointments":
     """
      mutation {
        updateAppointmentAvailability(
          businessId: "{{businessId}}"
          id: "{{appointmentAvailabilityId}}"
          data: {
            timeZone: "Etc/GMT"
          }
        )
        {
          _id
          timeZone
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
           "updateAppointmentAvailability"
         ]
       }
      ]
    }
    """

  Scenario: Update appointment availability by token without merchant role
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
        updateAppointmentAvailability(
          businessId: "{{businessId}}"
          id: "{{appointmentAvailabilityId}}"
          data: {
            timeZone: "Etc/GMT"
          }
        )
        {
          _id
          timeZone
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
             "updateAppointmentAvailability"
           ]
         }
        ]
      }
      """
