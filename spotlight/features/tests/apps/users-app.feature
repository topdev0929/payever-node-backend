Feature: User
  Background:
    Given I remember as "businessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "spotlight",
          {}
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "spotlight",
          {}
         ],
        "result": {}
      }
      """

  Scenario: CRUD Users
    Given I use DB fixture "business"
    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "users.event.user.created",
          "payload": {
            "_id": "test-1",
            "userAccount": {
              "email": "test@gmail.com",
              "firstName": "test",
              "lastName": "test",
              "logo": "logo"
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "_id": "test-1",
        "title": "test test",
        "icon": "logo"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "users.event.user.export",
          "payload": {
            "_id": "test-2",
            "userAccount": {
              "email": "test@gmail.com",
              "firstName": "test",
              "lastName": "test",
              "logo": "logo"
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-2" should contain json:
      """
      {
        "_id": "test-2",
        "title": "test test",
        "icon": "logo"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "users.event.user_account.updated",
          "payload": {
            "_id": "test-2",
            "firstName": "test-1",
            "lastName": "test"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-2" should contain json:
      """
      {
        "title": "test test"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
        "name": "users.event.user.removed",
        "payload": {
          "_id": "test-1"
        }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should not exist

  Scenario: CRUD Employees
    Given I use DB fixture "business"
    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "users.event.employee.created",
          "payload": {
            "employee": {
              "id": "test-1",
              "email": "test@gmail.com",
              "first_name": "test",
              "last_name": "test",
              "logo": "logo"
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "_id": "test-1",
        "title": "test test",
        "icon": "logo"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "users.event.employee.created.custom.access",
          "payload": {
            "employee": {
              "id": "test-1",
              "email": "test@gmail.com",
              "first_name": "test",
              "last_name": "test",
              "logo": "logo"
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "_id": "test-1",
        "title": "test test",
        "icon": "logo"
      }
      """


    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "users.event.employee.updated",
          "payload": {
            "employee": {
              "id": "test-2",
              "email": "test@gmail.com",
              "first_name": "test",
              "last_name": "test",
              "logo": "logo"
            },
            "dto": {
              "email": "test@gmail.com",
              "first_name": "test",
              "last_name": "test",
              "logo": "logo"
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-2" should contain json:
      """
      {
        "title": "test test"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "users.event.employee.updated.custom.access",
          "payload": {
            "employee": {
              "id": "test-2",
              "email": "test@gmail.com",
              "first_name": "test",
              "last_name": "test",
              "logo": "logo"
            },
            "dto": {
              "email": "test@gmail.com",
              "first_name": "test",
              "last_name": "test",
              "logo": "logo"
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-2" should contain json:
      """
      {
        "title": "test test"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
        "name": "users.event.employee.removed",
          "payload": {
            "employee": {
              "id": "test-1"
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should not exist

