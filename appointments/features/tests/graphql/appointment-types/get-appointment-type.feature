Feature: Get appointments type by business
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

  Scenario: Get default appointment
    Given I use DB fixture "appointment-type"
    When I send a GraphQL query to "/appointments":
      """
      query {
        getDefaultAppointmentType (
          businessId: "{{businessId}}"
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
          "getDefaultAppointmentType": {
            "_id": "{{appointmentTypeId2}}",
            "isDefault": true
          }
        }
      }
      """

    Scenario: Get appointment
    Given I use DB fixture "appointment-type"
    When I send a GraphQL query to "/appointments":
      """
      query {
        appointmentType (
          businessId: "{{businessId}}"
          id: "{{appointmentTypeId}}"
        )
        {
          _id
          name
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
          "appointmentType": {
            "_id": "11111111-1111-1111-1111-111111111111",
            "name": "test",
            "isDefault": false
          }
        }
      }
      """

  Scenario: Get appointments
    Given I use DB fixture "appointment-type"
    When I send a GraphQL query to "/appointments":
      """
      query {
        appointmentTypes (
          businessId: "{{businessId}}",
          listQuery: {
            page: 1,
            limit: 2,
            direction: "desc",
            orderBy: "name"
          }
        )
        {
          collection {
            _id
          }
          pagination_data {
            page
            total
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
          "appointmentTypes": {
            "collection": [
              { "_id": "*" },
              { "_id": "*" }
            ],
            "pagination_data": {
              "page": 1,
              "total": 2
            }
          }
        }
      }
      """