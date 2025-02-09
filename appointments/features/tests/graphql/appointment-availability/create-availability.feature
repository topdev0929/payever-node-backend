Feature: Create availability by business
  Background:
    Given I remember as "availabilityTypeId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    Given I remember as "availabilityTypeId2" following value:
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

  Scenario: Create appointment availability
    Given I use DB fixture "appointment-availability"
    And model "AppointmentAvailability" found by following JSON should exist:
      """
      {
        "_id": "{{availabilityTypeId2}}",
        "isDefault": true
      }
      """
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        createAppointmentAvailability(
          businessId: "{{businessId}}",
          data: {
            isDefault: true,
            timeZone: "Etc/GMT",
            name: "test",
            weekDayAvailability: [
              {
                  name: "monday",
                  isEnabled: true
              }
            ]
          }
        ) {
          _id
          isDefault
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
          "createAppointmentAvailability": {
            "_id": "*",
            "isDefault": true
          }
        }
      }
      """
    And model "AppointmentAvailability" found by following JSON should not exist:
      """
      {
        "_id": "{{availabilityTypeId2}}",
        "isDefault": true
      }
      """

  Scenario: Create appointment availability by anonymous
    Given I am not authenticated
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        createAppointmentAvailability(
          businessId: "{{anotherBusinessId}}"
          data: {
            isDefault: true,
            timeZone: "Etc/GMT",
            name: "test",
            weekDayAvailability: [
              {
                  name: "monday",
                  isEnabled: true
              }
            ]
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
             "createAppointmentAvailability"
           ]
         }
        ]
      }
      """