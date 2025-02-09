Feature: Business bus messages
  Background:
    Given I use DB fixture "business-wallpapers"
    Given I remember as "businessId" following value:
      """
      "593d0945-5539-4922-892e-b355d1f73c53"
      """
    Given I remember as "businessIdTwo" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527304"
      """

  Scenario: Received business created method
    Given I mock RPC request "wallpapers.rpc.business-wallpaper.current-updated" to "wallpapers.rpc.business-wallpaper.current-updated" with:
      """
      {
        "requestPayload": { },
        "responsePayload": true
      }
      """
    When I publish in RabbitMQ channel "async_events_wallpapers_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
        "_id": "{{businessIdTwo}}",
          "name": "test",
          "companyDetails": {
            "product": "BUSINESS_PRODUCT_SERVICES",
            "industry": "BRANCHE_COACHING"
          },
          "companyAddress": {
            "country": "country",
            "city": "city"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_wallpapers_micro" channel
    When look for model "BusinessWallpapers" by following JSON and remember as "wallpaper":
      """
      {
        "businessId": "{{businessIdTwo}}"
      }
      """
    Then stored value "wallpaper" should contain json:
      """
      {
        "businessId": "{{businessIdTwo}}"
      }
      """

  Scenario: Received business export method
    Given I mock RPC request "wallpapers.rpc.business-wallpaper.current-updated" to "wallpapers.rpc.business-wallpaper.current-updated" with:
      """
      {
        "requestPayload": { },
        "responsePayload": true
      }
      """
    When I publish in RabbitMQ channel "async_events_wallpapers_micro" message with json:
      """
      {
        "name": "users.event.business.export",
        "payload": {
          "_id": "{{businessIdTwo}}",
          "name": "test",
          "companyDetails": {
            "product": "BUSINESS_PRODUCT_SERVICES",
            "industry": "BRANCHE_COACHING"
          },
          "companyAddress": {
            "country": "country",
            "city": "city"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_wallpapers_micro" channel
    When look for model "BusinessWallpapers" by following JSON and remember as "wallpaper":
      """
      {
        "businessId": "{{businessIdTwo}}"
      }
      """
    Then stored value "wallpaper" should contain json:
      """
      {
        "businessId": "{{businessIdTwo}}"
      }
      """

  Scenario: Received business update
    When I publish in RabbitMQ channel "async_events_wallpapers_micro" message with json:
      """
      {
        "name": "users.event.business.updated",
        "payload": {
          "_id": "{{businessId}}",
          "name": "test",
          "companyDetails": {
            "product": "593d0945-5539-4922-892e-b355d1f73c52",
            "industry": "593d0945-5539-4922-892e-b355d1f73c52"
          },
          "companyAddress": {
            "country": "country",
            "city": "city"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_wallpapers_micro" channel
    Then model "BusinessWallpapers" with id "5c8bce42-c03b-41a5-8c15-936a74d2a461" should contain json:
      """
      {
        "_id": "5c8bce42-c03b-41a5-8c15-936a74d2a461",
        "businessId": "{{businessId}}"
      }
      """


  Scenario: Setup wallpaper
    When I publish in RabbitMQ channel "async_events_wallpapers_micro" message with json:
      """
      {
        "name": "onboarding.event.setup.wallpaper",
        "payload": {
          "businessId": "{{businessId}}",
          "data": {
            "name": "test",
            "wallpaper": "new-wallpaper",
            "theme": "dark"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_wallpapers_micro" channel
    Then I look for model "BusinessWallpapers" by following JSON and remember as "savedUser":
      """
      {
        "businessId": "{{businessId}}"
      }
      """
    And stored value "savedUser" should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "myWallpapers": [
           {
            "name": "test",
            "wallpaper": "new-wallpaper",
            "theme": "dark"
           }
        ]
      }
      """

  Scenario: Received business removed
    When I publish in RabbitMQ channel "async_events_wallpapers_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{businessId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_wallpapers_micro" channel
    Then model "BusinessWallpapers" with id "{{businessId}}" should not contain json:
      """
      {
        "_id": "{{businessId}}"
      }
      """
