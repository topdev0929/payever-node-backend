Feature: User media features
  Background:
    Given I use DB fixture "tasks"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "userMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

# todo: waiting move this feature to different pods
#  Scenario: Generate random video
#    Given I get file "features/data/generate-random-video.request.json" content and remember as "request" with placeholders
#    Given I get file "features/data/generate-random-video.response.json" content and remember as "response" with placeholders
#    When I send a POST request to "/api/{{businessId}}/video/generate/random" with json:
#      """
#      {{request}}
#      """
#    Then print last response
#    Then the response status code should be 201
#    And the response should contain json:
#      """
#      {{response}}
#      """
#
#  Scenario: Duplicate Generate random video
#    Given I get file "features/data/duplicate-generate-random-video.request.json" content and remember as "request" with placeholders
#    When I send a POST request to "/api/{{businessId}}/video/generate/random" with json:
#      """
#      {{request}}
#      """
#    Then print last response
#    Then the response status code should be 409
#    And the response should contain json:
#      """
#      {
#        "statusCode": 409,
#        "error": "Conflict"
#      }
#      """
#
#  Scenario: Generate video by tag
#    Given I get file "features/data/generate-video-by-tag.request.json" content and remember as "request" with placeholders
#    Given I get file "features/data/generate-video-by-tag.response.json" content and remember as "response" with placeholders
#    When I send a POST request to "/api/{{businessId}}/video/generate/tag" with json:
#      """
#      {{request}}
#      """
#    Then print last response
#    Then the response status code should be 201
#    And the response should contain json:
#      """
#      {{response}}
#      """
#
#  Scenario: Duplicate Generate video by tag
#    Given I get file "features/data/duplicate-generate-video-by-tag.request.json" content and remember as "request" with placeholders
#    When I send a POST request to "/api/{{businessId}}/video/generate/tag" with json:
#      """
#      {{request}}
#      """
#    Then print last response
#    Then the response status code should be 409
#    And the response should contain json:
#      """
#      {
#        "statusCode": 409,
#        "error": "Conflict"
#      }
#      """
