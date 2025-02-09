Feature: Elastic search
  Background: constants
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "test@payever.de",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """

  Scenario: Index appointments in db
    Given I use DB fixture "example-fields"
    Given I use DB fixture "appointments"
    Given I mock Elasticsearch method "isIndexExists" with:
      """
      {
        "arguments": [
          "appointments"
        ],
        "result": null
      }
      """
    Given I mock Elasticsearch method "createIndex" with:
      """
      {
        "arguments": [
          "appointments"
        ],
        "result": null
      }
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "appointments"
        ]
      }
      """

  Scenario: Find appointment in elastic
    Given I mock Elasticsearch method "isIndexExists" with:
      """
      {
        "arguments": [
          "appointments"
        ],
        "result": true
      }
      """
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "appointments"
        ],
        "result": {
          "body": {
            "took": 12,
            "timed_out": false,
            "_shards": {
              "total": 1,
              "successful": 1,
              "skipped": 0,
              "failed": 0
            },
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 3.4657357,
              "hits": [
                {
                  "_index": "appointments",
                  "_type": "appointment",
                  "_id": "41e9c7c9-7947-4224-8cb7-ee2605025e16",
                  "_score": 3.4657357,
                  "_source": {
                    "groupsId": [],
                    "businessId": "bc647b61-6039-4f73-a60c-974cc6d70773",
                    "type": "person",
                    "createdAt": "2021-05-20T08:09:30.536Z",
                    "updatedAt": "2021-05-20T08:09:30.536Z",
                    "__v": 0,
                    "mongoId": "41e9c7c9-7947-4224-8cb7-ee2605025e16",
                    "image": "Profile image",
                    "email": "email@email.com",
                    "fullName": "Profile full name"
                  }
                }
              ]
            }
          }
        }
      }
      """
    Given I remember as "filterString" following value:
    """
      "{\"must\": [{\"wildcard\": {\"fullName\": { \"value\": \"*Pr*\"}}}]}"
    """
    When I send a GET request to "/api/es/list/bc647b61-6039-4f73-a60c-974cc6d70773?filters={{filterString}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "collection": [
          {
            "groupsId": [],
            "businessId": "bc647b61-6039-4f73-a60c-974cc6d70773",
            "type": "person",
            "createdAt": "2021-05-20T08:09:30.536Z",
            "updatedAt": "2021-05-20T08:09:30.536Z",
            "__v": 0,
            "mongoId": "41e9c7c9-7947-4224-8cb7-ee2605025e16",
            "image": "Profile image",
            "email": "email@email.com",
            "fullName": "Profile full name"
          }
        ],
        "filters": {
          "must": [
            {
              "wildcard": {
                "fullName": {
                  "value": "*Pr*"
                }
              }
            }
          ]
        }
      }
      """
