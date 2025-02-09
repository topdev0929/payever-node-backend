Feature: Subscription media features
  Background:
    Given I use DB fixture "tasks"
    Given I remember as "subscriptionMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "admin",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

# todo: waiting move this feature to different pods
#  Scenario: Video generate frames / scene
#    Given I get file "features/data/admin-video-generate-frame.request.json" content and remember as "request" with placeholders
#    Given I get file "features/data/admin-video-generate-frame.response.json" content and remember as "response" with placeholders
#    When I send a POST request to "/api/video/generate/frames" with json:
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
# Scenario: Duplicate Video generate frames / scene
#    Given I get file "features/data/duplicate-video-generate-frame.request.json" content and remember as "request" with placeholders
#    When I send a POST request to "/api/video/generate/frames" with json:
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
