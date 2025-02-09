Feature: Publish theme for application
  Background:
    And I remember as "applicationId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "channelSetId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    And I remember as "pageId1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "pageId2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
      """

  Scenario: Published theme for application
    Given I use DB fixture "blog/application-exists"
    Given I mock "post" method of ingress client with parameters:
      """
      {
        "kind": "Ingress",
        "apiVersion": "networking.k8s.io/v1",
        "metadata": {
          "name": "*",
          "namespace": "*",
          "labels": "*",
          "annotations": "*"
        }
      }
      """
    When I publish in RabbitMQ channel "async_events_blog_micro" message with json:
      """
      {
        "name": "builder-blog.event.theme.published",
        "payload": {
          "application": {
            "id": "{{applicationId}}",
            "type": "blog"
          },
          "compiled": {
            "theme": {
              "data": {
                "frontPageId": "123"
              },
              "routing": [
                {
                  "routeId": "nike-main-page-route",
                  "url": "/",
                  "pageId": "{{pageId1}}"
                },
                {
                  "routeId": "nike-about-page-route",
                  "url": "/about",
                  "pageId": "{{pageId2}}"
                }
              ],
              "context": {
                "#logo": {
                  "service": "company",
                  "method": "getLogo",
                  "params": []
                }
              },
              "createdAt": "*"
            }
          },
          "wsKey": "key"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_blog_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "blog.event.theme.published",
          "payload": {
            "wsKey": "key"
          }
        }
      ]
      """
