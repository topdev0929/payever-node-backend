Feature: Business bus

  Scenario: On business created event
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I publish in RabbitMQ channel "async_events_commerceos_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "3f19f5c3-d786-4cf9-b712-7806b820d9ec"
        }
      }
      """
    When I process messages from RabbitMQ "async_events_commerceos_micro" channel
    And look for model "Business" by following JSON and remember as "business":
      """
      {
        "_id": "3f19f5c3-d786-4cf9-b712-7806b820d9ec"
      }
      """
    And print storage key "business"
    Then model "Business" with id "3f19f5c3-d786-4cf9-b712-7806b820d9ec" should contain json:
      """
      {
        "installedApps": [
          {
            "app": "37370e19-1ab0-4a22-83ed-2f2a090f485d"
          },
          {
            "app": "44f60143-2aee-40fb-87ad-074dd133e048"
          }
        ]
      }
      """

  Scenario: On business updated event
    Given I use DB fixture "business"
    And I publish in RabbitMQ channel "async_events_commerceos_micro" message with json:
      """
      {
        "name": "users.event.business.updated",
        "payload": {
          "_id": "0526bc80-d7ec-486b-a347-23c0ff231303",
          "themeSettings": {
            "theme": "light"
          }
        }
      }
      """
    And look for model "Business" by following JSON and remember as "business":
      """
      {
        "_id": "0526bc80-d7ec-486b-a347-23c0ff231303"
      }
      """
    When I process messages from RabbitMQ "async_events_commerceos_micro" channel
    And print storage key "business"
    Then model "Business" with id "0526bc80-d7ec-486b-a347-23c0ff231303" should contain json:
      """
      {
        "_id": "0526bc80-d7ec-486b-a347-23c0ff231303",
        "themeSettings": {
          "theme": "light"
        }
      }
      """

  Scenario: On business removed event
    Given I use DB fixture "business"
    And I publish in RabbitMQ channel "async_events_commerceos_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "0526bc80-d7ec-486b-a347-23c0ff231303"
        }
      }
      """
    When I process messages from RabbitMQ "async_events_commerceos_micro" channel
    Then model "Business" found by following JSON should not exist:
      """
      {
        "_id": "0526bc80-d7ec-486b-a347-23c0ff231303"
      }
      """

  Scenario: On business export event
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I publish in RabbitMQ channel "async_events_commerceos_micro" message with json:
      """
      {
        "name": "users.event.business.export",
        "payload": {
          "_id": "3f19f5c3-d786-4cf9-b712-7806b820d9ec"
        }
      }
      """
    When I process messages from RabbitMQ "async_events_commerceos_micro" channel
    And look for model "Business" by following JSON and remember as "business":
      """
      {
        "_id": "3f19f5c3-d786-4cf9-b712-7806b820d9ec"
      }
      """
    And print storage key "business"
    Then model "Business" with id "3f19f5c3-d786-4cf9-b712-7806b820d9ec" should contain json:
      """
      {
        "installedApps": [
          {
            "app": "37370e19-1ab0-4a22-83ed-2f2a090f485d"
          },
          {
            "app": "44f60143-2aee-40fb-87ad-074dd133e048"
          }
        ]
      }
      """
