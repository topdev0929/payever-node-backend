Feature: Products GraphQL API
  Scenario: Get channelset
    Given I use DB fixture "graphql/get-channel-set/existing-channel-set"
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "products",
          { }
         ],
        "result": {}
      }
      """
    When I send a GraphQL query to "/channelset":
      """
      {
        getChannelSetByBusiness(businessId: "a803d4c3-c447-4aab-a8c7-c7f184a8e77f") {
          id
          name
          type
          active
          enabledByDefault
          customPolicy
          policyEnabled
          originalId
        }
      }
      """
    Then print last response
    Then the response should contain json:
      """
        {
          "data": {
            "getChannelSetByBusiness": [
              {
                "id": "a888336c-fe1f-439c-b13c-f351db6bbc2e",
                "name": "link name",
                "type": "link",
                "active": true,
                "enabledByDefault": false,
                "customPolicy": false,
                "policyEnabled": true,
                "originalId": "9c355907-c644-4737-9dd1-693d717a1c18"
              },
              {
                "id": "f351db6b-439c-b13c-fe1f-a888336cbc2e",
                "name": "shop name",
                "type": "shop",
                "active": true,
                "enabledByDefault": true,
                "customPolicy": true,
                "policyEnabled": true
              },
              {
                "id": "8d49b19f-4aab-a8c7-c447-a803d4c3bc2e",
                "name": "pos name",
                "type": "pos",
                "active": true,
                "enabledByDefault": true,
                "customPolicy": false,
                "policyEnabled": true
              }
            ]
          }
        }
      """
