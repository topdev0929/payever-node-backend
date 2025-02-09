Feature: Handle widget bus message events
Background:
    Given I remember as "businessId" following value:
    """
    "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"
    """
    Given I remember as "widgetId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe0"
    """
    Given I use DB fixture "business/existing-widgets"

  Scenario:  widget install event handle
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "apps.rpc.readonly.widgets-install-app",
      "payload": {
        "code": "pos",
        "businessId": "{{businessId}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "WidgetInstallation" by following JSON and remember as "data":
    """
    {
      "installed": "true"
    }
    """
    And print storage key "data"
    And stored value "data" should contain json:
    """
    {
      "installed": true,
      "widget": "358ada94-6559-4f92-9cdc-077ea46bc3d7"
    }
    """

  Scenario:  widget install event handle - rpc
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "apps.rpc.readonly.widgets-install-onboarding-apps",
      "payload": {
        "apps": ["pos"],
        "businessId": "{{businessId}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "WidgetInstallation" by following JSON and remember as "data":
    """
    {
      "installed": "true"
    }
    """
    And print storage key "data"
    And stored value "data" should contain json:
    """
    {
      "installed": true,
      "widget": "358ada94-6559-4f92-9cdc-077ea46bc3d7"
    }
    """

  Scenario:  widget install event handle - non-rpc
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "apps.readonly.widgets-install-onboarding-apps",
      "payload": {
        "apps": ["pos"],
        "businessId": "{{businessId}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "WidgetInstallation" by following JSON and remember as "data":
    """
    {
      "installed": "true"
    }
    """
    And print storage key "data"
    And stored value "data" should contain json:
    """
    {
      "installed": true,
      "widget": "358ada94-6559-4f92-9cdc-077ea46bc3d7"
    }
    """

  Scenario: widget uninstall event handle
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "apps.rpc.readonly.widgets-uninstall-app",
      "payload": {
        "code": "pos",
        "businessId": "{{businessId}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "WidgetInstallation" by following JSON and remember as "data":
    """
    {
      "installed": false
    }
    """
    And print storage key "data"
    And stored value "data" should contain json:
    """
    {
      "installed": false,
      "widget": "*"
    }
    """

  Scenario:  app install event handle
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "app-registry.event.application.installed",
      "payload": {
        "apps": ["pos"],
        "businessId": "{{businessId}}"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "WidgetInstallation" by following JSON and remember as "data":
    """
    {
      "installed": "true"
    }
    """
    And print storage key "data"
