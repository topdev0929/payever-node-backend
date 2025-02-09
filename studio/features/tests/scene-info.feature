Feature: User media features
  Background:
    Given I use DB fixture "scene.info"
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
          "name": "admin",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

# todo: waiting move this feature to different pods
#  Scenario: Update scene info
#    Given I get file "features/data/scene-info-update.response.json" content and remember as "response" with placeholders
#    When I send a POST request to "/api/scene/5341a61a-29f0-460d-8538-bf99e7261bec" with json:
#      """
#      {
#        "tags": [
#          "people"
#        ],
#        "name": ""
#      }
#      """
#    Then print last response
#    Then the response status code should be 201
#    And the response should contain json:
#      """
#      {{response}}
#      """
#
#  Scenario: Get scene info
#    Given I get file "features/data/scene-info-list.response.json" content and remember as "response" with placeholders
#    When I send a GET request to "/api/scene/video?video=http://localhost:2020/video/input1.mp4&page=1&limit=3"
#    Then print last response
#    Then the response status code should be 200
#    And the response should contain json:
#      """
#      {{response}}
#      """
#
#  Scenario: Get scene info
#    Given I get file "features/data/scene-info-detail.response.json" content and remember as "response" with placeholders
#    When I send a GET request to "/api/scene/5341a61a-29f0-460d-8538-bf99e7261bec"
#    Then print last response
#    Then the response status code should be 200
#    And the response should contain json:
#      """
#      {{response}}
#      """
#
#  Scenario: Delete scene info
#    When I send a DELETE request to "/api/scene/5341a61a-29f0-460d-8538-bf99e7261bec"
#    Then print last response
#    Then the response status code should be 200
