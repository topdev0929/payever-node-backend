Feature: Rabbit events handling - update group
  Scenario: handle "users group updated" event
    Given I use DB fixture "users"
    And I remember as "merchantId" following value:
      """
      "09d1fdca-f692-4609-bc2d-b3103a24c30a"
      """
    And I remember as "businessId" following value:
      """
      "74b58859-3a62-4b63-83d6-cc492b2c8e29"
      """
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.group.updated",
        "payload": {
            "businessId": "{{businessId}}",
            "dto": {
              "acls": [
                  {
                    "microservice": "site",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                  },
                  {
                    "microservice": "message",
                    "create": true,
                    "read": true,
                    "update": true,
                    "delete": true
                  },
                  {
                    "microservice": "checkout",
                    "create": false,
                    "read": false,
                    "update": false,
                    "delete": false
                  },
                  {
                    "microservice": "connect",
                    "create": false,
                    "read": false,
                    "update": false,
                    "delete": false
                  }
                ]
            },
            "originalGroup": {
              "employees": [ "{{merchantId}}" ],
              "_id": "74b58859-3a62-4b63-83d6-cc492b2c8e50",
              "businessId": "{{businessId}}",
              "name": "test 1",
              "__v": 0
            },
        "userId": "{{merchantId}}"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_auth_micro" channel
    Then look for model "Permission" by following JSON and remember as "permissionData":
      """
      {
        "userId": "{{merchantId}}",
        "businessId": "{{businessId}}"
      }
      """
    Then print storage key "permissionData"
    Then stored value "permissionData" should contain json:
      """
      {
        "_id": "*",
        "userId": "{{merchantId}}",
        "businessId": "{{businessId}}",
        "role": "merchant",
        "acls": [
          {
            "create": true,
            "delete": true,
            "microservice": "site",
            "read": true,
            "update": true
          },
          {
            "microservice": "message",
            "create": true,
            "read": true,
            "update": true,
            "delete": true
          }
        ]
      }
      """
