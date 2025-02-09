Feature: Products GraphQL API
  Scenario: Get recommendations. Without using the tagFilter which filters data by tag
    Given I use DB fixture "graphql/get-recommendations/get-product-recommendations"
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
    When I send a GraphQL query to "/products":
      """
      {
      getProductRecommendations(id: "d38fffda-ccc1-4708-a06d-d57127f37b1f") {
        tag recommendations {
            id
            name
        }
      }
      }
      """
    Then print last response
    Then the response should contain json:
      """
      {
        "data": {
          "getProductRecommendations":  {
               "tag": "byCategory",
               "recommendations": [
                 {
                   "id": "e563339f-0b4c-4aef-92e7-203b9761981c",
                   "name": "Arts & Crafts"
                 },
                 {
                   "id": "a482bf57-1aec-4304-8751-4ce5cea603a4",
                   "name": "Baby"
                 }
               ]
             }
        }
      }
      """