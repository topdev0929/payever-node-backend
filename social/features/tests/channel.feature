Feature: Channel Rules
  Background:
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["post-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I remember as "businessId" following value:
      """
        "dac8cff5-dfc5-4461-b0e3-b25839527304"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: get channel rules
    Given I use DB fixture "channels"
    When I send a GET request to "/business/{{businessId}}/channel-rules"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
       [
        {
          "channelSet": {
            "_id": "*",
            "businessId": "dac8cff5-dfc5-4461-b0e3-b25839527304",
            "type": "facebook"
          },
          "rules":[ {
            "extensionsSupported": "",
            "integrationName": "facebook",
            "_id": "dac8cff5-dfc5-4461-b0e3-b25839527305",
            "message": "title is required",
            "property": "title",
            "type": "required"
          }]
        }
      ]
    """
