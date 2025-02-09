Feature: Rabbit events controller
  Background:
    Given I remember as "businessId" following value:
      """
      "32061e24-2ce2-45b0-a431-da36457a0887"
      """

  Scenario: Shop created event
    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "shops.event.shop.created",
      "payload": {
        "id": "7530200a-5201-4664-aeff-fad31cf820c4",
        "name": "Test Application",
        "business": {
          "id": "10fb30fd-d2ea-481b-85de-e253807a10f5"
        },
        "channelSet": {
          "id": "bebbfa02-799d-40d7-ba49-4f33ec9cd7df"
        }
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And I look for model "Business" by following JSON and remember as "business":
    """
    {
      "defaultApplications": [
        {
          "_id": "7530200a-5201-4664-aeff-fad31cf820c4",
          "type": "shop"
        }
      ]
    }
    """
    And stored value "business" should contain json:
    """
    {
      "businessId": "10fb30fd-d2ea-481b-85de-e253807a10f5"
    }
    """
    And I look for model "Application" by following JSON and remember as "application":
    """
    {
      "applicationId": "7530200a-5201-4664-aeff-fad31cf820c4"
    }
    """
    And stored value "application" should contain json:
    """
    {
      "name": "Test Application",
      "businessId": "10fb30fd-d2ea-481b-85de-e253807a10f5",
      "channelSetId": "bebbfa02-799d-40d7-ba49-4f33ec9cd7df"
    }
    """

  Scenario: Shop export event
    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "shops.event.shop.export",
      "payload": {
        "id": "7530200a-5201-4664-aeff-fad31cf820c4",
        "name": "Test Application",
        "business": {
          "id": "10fb30fd-d2ea-481b-85de-e253807a10f5"
        },
        "channelSet": {
          "id": "bebbfa02-799d-40d7-ba49-4f33ec9cd7df"
        }
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And I look for model "Business" by following JSON and remember as "business":
    """
    {
      "defaultApplications": [
        {
          "_id": "7530200a-5201-4664-aeff-fad31cf820c4",
          "type": "shop"
        }
      ]
    }
    """
    And stored value "business" should contain json:
    """
    {
      "businessId": "10fb30fd-d2ea-481b-85de-e253807a10f5"
    }
    """
    And I look for model "Application" by following JSON and remember as "application":
    """
    {
      "applicationId": "7530200a-5201-4664-aeff-fad31cf820c4"
    }
    """
    And stored value "application" should contain json:
    """
    {
      "name": "Test Application",
      "businessId": "10fb30fd-d2ea-481b-85de-e253807a10f5",
      "channelSetId": "bebbfa02-799d-40d7-ba49-4f33ec9cd7df"
    }
    """

  Scenario: Shop updated event
    Given I use DB fixture "applications"
    And I look for model "Application" by following JSON and remember as "application":
    """
    {
      "applicationId": "c26f4496-c5dd-482c-9380-5d6bc1ecb989"
    }
    """
    And stored value "application" should contain json:
    """
    {
      "applicationId": "c26f4496-c5dd-482c-9380-5d6bc1ecb989"
    }
    """

    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "shops.event.shop.updated",
      "payload": {
        "id": "c26f4496-c5dd-482c-9380-5d6bc1ecb989",
        "name": "Test Application",
        "business": {
          "id": "10fb30fd-d2ea-481b-85de-e253807a10f5"
        },
        "channelSet": {
          "id": "bebbfa02-799d-40d7-ba49-4f33ec9cd7df"
        }
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And I look for model "Application" by following JSON and remember as "application":
    """
    {
      "applicationId": "c26f4496-c5dd-482c-9380-5d6bc1ecb989"
    }
    """
    And stored value "application" should contain json:
    """
    {
      "name": "Test Application",
      "businessId": "10fb30fd-d2ea-481b-85de-e253807a10f5",
      "channelSetId": "bebbfa02-799d-40d7-ba49-4f33ec9cd7df"
    }
    """

  Scenario: Shop removed event
    Given I use DB fixture "applications"
    And I look for model "Application" by following JSON and remember as "application":
    """
    {
      "applicationId": "c26f4496-c5dd-482c-9380-5d6bc1ecb989"
    }
    """
    And stored value "application" should contain json:
    """
    {
      "applicationId": "c26f4496-c5dd-482c-9380-5d6bc1ecb989"
    }
    """

    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "shops.event.shop.removed",
      "payload": {
        "id": "c26f4496-c5dd-482c-9380-5d6bc1ecb989"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And model "Application" found by following JSON should not exist:
    """
    {
      "applicationId": "c26f4496-c5dd-482c-9380-5d6bc1ecb989"
    }
    """

  Scenario: Default application set event
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://third-party.*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/communications/twilio/inbound/configure"
      },
      "response": {
        "status": 200,
        "body": "{\"phone\": \"+79528224321\"}"
      }
    }
    """
    And I use DB fixture "businesses"
    And I use DB fixture "checkouts"
    And I use DB fixture "applications"

    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "shops.event.shop.live-toggled",
      "payload": {
        "businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac",
        "live": true,
        "shopId": "5573df24-390c-4ca5-9867-996951bd8ae7"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And I look for model "Business" by following JSON and remember as "business":
    """
    {
      "businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac"
    }
    """
    And stored value "business" should contain json:
    """
    {
      "defaultApplications": [
        {
          "_id": "5573df24-390c-4ca5-9867-996951bd8ae7",
          "type": "shop"
        }
      ]
    }
    """
