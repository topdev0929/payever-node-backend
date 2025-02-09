Feature: Video Controller
  Background:
    Given I load constants from "src/async-encoder/enum/rmq-events.enum.ts"
    Given I load constants from "src/media/enums/business-event.enum.ts"
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "videoId" following value:
      """
      "b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1"
      """

  Scenario: Video uploading works fine
    Given I use DB fixture "exist-business"
    Given I attach the file "test.mp4" to "file"
    When I send a POST request to "/api/video/business/{{businessId}}/cdn/social" with form data:
    |||

    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "blobName":"*",
        "brightnessGradation":"*",
        "preview": "*_preview",
        "thumbnail":"*-thumbnail"
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [{
        "name": "media.event.media.media-compression-requested",
        "payload": {
          "container": "cdn",
          "filename": "social/*-test.mp4"
        }
      }]
      """

  Scenario: Video deleting works fine
    Given I use DB fixture "exist-business"
    Given I attach the file "test.mp4" to "file"
    When I send a DELETE request to "/api/video/business/{{businessId}}/cdn/social/test" with form data:
    |||

    Then print last response
    And the response status code should be 204

  Scenario: Encode video file with queue
    When I publish in RabbitMQ channel "async_events_media_encoder_micro" message with json:
      """
      {
        "name": "media.event.media.media-compression-requested",
        "payload": {
          "container": "cdn",
          "filename": "social/2b120298-759a-4248-a631-43bca4e6098e-test.mp4"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_media_encoder_micro" channel
