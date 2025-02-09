Feature: Admin appointment
  Background: constants
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "appointmentId" following value:
      """
        "11111111-1111-1111-1111-111111111111"
      """  
    Given I remember as "anotherAppointmentId" following value:
      """
        "22222222-2222-2222-2222-222222222222"
      """        
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
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "appointments-folder",
          {}
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "appointments-folder",
          {}
         ],
        "result": {}
      }
      """

    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "appointments-folder",
          {}
         ],
        "result": {}
      }
      """      

  Scenario: Create new appointment
    Given I use DB fixture "admin-appointment"
    When I send a POST request to "/api/admin/appointments" with json:
      """
      {
        "contacts": [],
        "products": [
          "63720e1a-ff68-47e5-a2c7-0229dd4e467c",
          "1e101a76-a162-4181-9594-1fa073cd5f32"
        ],
        "allDay": true,
        "repeat": true,
        "date": "08/12/2021",
        "time": "13:00",
        "location": "Berlin",
        "note": "why not",
        "businessId": "{{businessId}}"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "contacts": [],
        "products": [
          "63720e1a-ff68-47e5-a2c7-0229dd4e467c",
          "1e101a76-a162-4181-9594-1fa073cd5f32"
        ],
        "allDay": true,
        "repeat": true,
        "date": "08/12/2021",
        "time": "13:00",
        "location": "Berlin",
        "note": "why not",
        "_id": "*"
      }
      """
    And store a response as "response"
    And model "Appointment" with id "{{response._id}}" should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "contacts": [],
        "products": [
          "63720e1a-ff68-47e5-a2c7-0229dd4e467c",
          "1e101a76-a162-4181-9594-1fa073cd5f32"
        ],
        "allDay": true,
        "repeat": true,
        "time": "13:00",
        "location": "Berlin",
        "note": "why not"
      }
      """

  Scenario: Update appointment
    Given I use DB fixture "admin-appointment"
    When I send a PUT request to "/api/admin/appointments/{{appointmentId}}" with json:
      """
      {
        "contacts": [],
        "products": [
          "p1",
          "p2"
        ],
        "allDay": true,
        "repeat": true,
        "date": "09/12/2021",
        "time": "13:10",
        "location": "LA",
        "note": "sample note",
        "businessId": "{{businessId}}"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "contacts": [],
        "products": [
          "p1",
          "p2"
        ],
        "allDay": true,
        "repeat": true,
        "date": "09/12/2021",
        "time": "13:10",
        "location": "LA",
        "note": "sample note",
        "businessId": "{{businessId}}"
      }
    """
    And store a response as "response"
    And model "Appointment" with id "{{appointmentId}}" should contain json:
      """
      {
        "contacts": [],
        "products": [
          "p1",
          "p2"
        ],
        "allDay": true,
        "repeat": true,
        "date": "09/12/2021",
        "time": "13:10",
        "location": "LA",
        "note": "sample note",
        "businessId": "{{businessId}}"
      }
      """

  Scenario: get appointment by id 
    Given I use DB fixture "admin-appointment"
    When I send a GET request to "/api/admin/appointments/{{appointmentId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "_id": "{{appointmentId}}",
        "note":"*"        
      }
    """

  Scenario: get appointments list
    Given I use DB fixture "admin-appointment"
    When I send a GET request to "/api/admin/appointments?businessIds={{businessId}}&limit=1"
    Then print last response
    And the response status code should be 200
    And the response should contain json:


      """
      {
        "documents": [
          {
            "contacts": [],
            "products": [
              "p1",
              "p2"
            ],
            "_id": "*",
            "allDay": true,
            "repeat": true,
            "date": "*",
            "time": "*",
            "location": "*",
            "note": "*",
            "businessId": "{{businessId}}"
          }
        ]
      }
      """

  Scenario: delete appointment
    Given I use DB fixture "admin-appointment"
    When I send a DELETE request to "/api/admin/appointments/{{appointmentId}}"
    Then print last response
    And the response status code should be 200
    And model "Appointment" with id "{{appointmentId}}" should not contain json:
      """
      {
        "business": "{{businessId}}"
      }
      """
