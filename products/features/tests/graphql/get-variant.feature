Feature: variant feature

  Scenario: Get Variant
    Given I use DB fixture "graphql/variant/variant"
    And I send a GraphQL query to "/products":
      """
      query {
      getVariant(id: "85f873e0-6f78-467c-bd88-1b27e2519843") {
      _id
      }
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "data": {
          "getVariant": {
            "_id": "85f873e0-6f78-467c-bd88-1b27e2519843"
          }
        }
      }
      """
