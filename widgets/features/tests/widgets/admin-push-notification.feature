Feature: Admin Push Notification
  Background:
    Given I remember as "adminId" following value:
      """
      "8a13bd00-90f1-11e9-9f67-7200004fe4c0"
      """
    Given I remember as "instanceId" following value:
      """
      "2e037919-ca8f-4dc5-9a4f-f70070c4c8e5"
      """
    Given I generate an access token using the following data and remember it as "token_for_admin":
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """

  Scenario: Get list of push notifications
    Given I use DB fixture "widgets/push-notification"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I send a GET request to "/admin/push-notification/list"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "822ba24b-77da-4c7d-aed3-010b252f79b3",
          "message": "Message 1"
        },
        {
          "_id": "2e037919-ca8f-4dc5-9a4f-f70070c4c8e5",
          "message": "Message 2"
        },
        {
          "_id": "09d2afec-cda9-4110-888c-73d722a1988e",
          "message": "Message 3"
        }
      ]
      """



  Scenario: Get one push notification instance
    Given I use DB fixture "widgets/push-notification"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I send a GET request to "/admin/push-notification/{{instanceId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "2e037919-ca8f-4dc5-9a4f-f70070c4c8e5",
        "message": "Message 2"
      }
      """


  Scenario: Create an push notification instance
    Given I use DB fixture "widgets/push-notification"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I send a POST request to "/admin/push-notification" with json:
      """
      {
        "message": "Something has been written here"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "message": "Something has been written here"
      }
      """



  Scenario: Update a push notification
    Given I use DB fixture "widgets/push-notification"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I send a PATCH request to "/admin/push-notification/{{instanceId}}" with json:
      """
      {
        "message": "New message is here"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "message": "New message is here"
      }
      """


  Scenario: Delete a push notification
    Given I use DB fixture "widgets/push-notification"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I send a DELETE request to "/admin/push-notification/{{instanceId}}"
    Then print last response
    And the response status code should be 200
    When I send a DELETE request to "/admin/push-notification/{{instanceId}}"
    And the response status code should be 404
    When I send a GET request to "/admin/push-notification/{{instanceId}}"
    And the response status code should be 404



  Scenario: Delete a push notification without admin permission
    Given I use DB fixture "widgets/push-notification"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "merchant" }]
      }
      """
    When I send a DELETE request to "/admin/push-notification/{{instanceId}}"
    Then the response status code should be 403



  Scenario: Send a push notification
    Given I use DB fixture "widgets/push-notification"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{adminId}}",
        "roles": [{ "name": "admin" }]
      }
      """
    When I am watching for socket-io event "push-notifications"
    Given I connect to socket.io namespace "ws" with following query
      """
      {
        "token": "{{token_for_admin}}"
      }
      """
    And I wait 100 ms while socket-io event is processed
    When I send a POST request to "/admin/push-notification/push/{{instanceId}}"
    Then print last response
    And the response status code should be 201
