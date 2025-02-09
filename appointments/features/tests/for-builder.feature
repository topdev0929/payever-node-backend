Feature: Elastic search
  Background: constants
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "test@payever.de",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """

  Scenario: Create appointment using Integration
    Given I use DB fixture "example-fields"
    Given I use DB fixture "appointments"
    When I send a POST request to "/api/appointment/builder" with json:
      """
      {
          "data": {
              "date": "12.12.2022",
              "contact": {
                  "email": "asd@er.ru",
                  "firstName": "123123",
                  "lastName": "123123",
                  "mobilePhone": "3232"
              },
              "time": "12:23"
          },
          "businessId": "02b11d33-25f2-4e6c-bfc3-e487a264b19f"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "contacts": [],
        "products": [],
        "allDay": false,
        "repeat": false,
        "date": "12.12.2022",
        "time": "12:23",
        "businessId": "02b11d33-25f2-4e6c-bfc3-e487a264b19f",
        "_id": "*"
      }
      """

  Scenario: Get Appointment
    Given I use DB fixture "example-fields"
    Given I use DB fixture "appointments"
    When I send a GET request to "/api/appointment/builder/business/{{businessId}}/integration"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "defaultValues": [],
          "_id": "*",
          "name": "firstName",
          "title": "First Name",
          "type": "text",
          "__v": 0
        },
        {
          "defaultValues": [],
          "_id": "*",
          "name": "lastName",
          "title": "Last Name",
          "type": "text",
          "__v": 0
        },
        {
          "defaultValues": [],
          "_id": "*",
          "name": "email",
          "title": "email",
          "type": "text",
          "__v": 0
        },
        {
          "defaultValues": [],
          "_id": "*",
          "name": "imageUrl",
          "title": "Image",
          "type": "text",
          "__v": 0
        },
        {
          "defaultValues": [],
          "_id": "*",
          "name": "mobilePhone",
          "title": "Mobile Phone",
          "type": "text",
          "__v": 0
        },
        {
          "defaultValues": [],
          "_id": "*",
          "name": "street",
          "title": "street",
          "type": "text",
          "__v": 0
        },
        {
          "defaultValues": [],
          "_id": "*",
          "name": "city",
          "title": "city",
          "type": "text",
          "__v": 0
        },
        {
          "defaultValues": [],
          "_id": "*",
          "name": "state",
          "title": "state",
          "type": "text",
          "__v": 0
        },
        {
          "defaultValues": [],
          "_id": "*",
          "name": "zip",
          "title": "zip",
          "type": "text",
          "__v": 0
        },
        {
          "defaultValues": [],
          "_id": "*",
          "name": "country",
          "title": "country",
          "type": "text",
          "__v": 0
        }
      ]
      """
