Feature: Create appointments type by business
  Background:
    Given I remember as "appointmentTypeId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    Given I remember as "appointmentTypeId2" following value:
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

  Scenario: Create appointment type
    Given I use DB fixture "appointment-type"
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        createAppointmentType(
          businessId: "{{businessId}}",
          data: {
              dateRange: 123,
              duration: 1,
              eventLink: "1234",
              indefinitelyRange: true,
              isDefault: true,
              isTimeAfter: false,
              isTimeBefore: false,
              name: "test",
              schedule: "working_hours",
              timeBefore: 23,
              timeAfter: 45,
              type: "one_on_one",
              unit: "hour"
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
          "createAppointmentType": {
            "_id": "*",
            "isDefault": true
          }
        }
      }
      """
    And model "AppointmentType" found by following JSON should not exist:
      """
      {
        "_id": "{{appointmentTypeId2}}",
        "isDefault": true
      }
      """

  Scenario: Create appointment type by anonymous
    Given I am not authenticated
    When I send a GraphQL query to "/appointments":
      """
      mutation {
        createAppointmentType(
          businessId: "{{anotherBusinessId}}"
          data: {
            dateRange: 123,
            duration: 1,
            eventLink: "1234",
            indefinitelyRange: true,
            isDefault: true,
            isTimeAfter: false,
            isTimeBefore: false,
            name: "test",
            schedule: "working_hours",
            timeBefore: 23,
            timeAfter: 45,
            type: "one_on_one",
            unit: "hour"
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
             "createAppointmentType"
           ]
         }
        ]
      }
      """