Feature: Products GraphQL API
  Scenario: Get recommendations. Without using the tagFilter which filters data by tag
    Given I use DB fixture "graphql/get-recommendations/get-recommendations"
    When I send a GraphQL query to "/products":
      """
      {
      getRecommendations(businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0", tagFilter: "", paginationLimit: 10) {
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
          "getRecommendations": [
               {
                 "tag": "byCategory",
                 "recommendations": [
                   {
                     "id": "5fcf3218c4597aa78cbf2d95",
                     "name": "Baby"
                   }
                 ]
               },
               {
                 "tag": "byFolder",
                 "recommendations": [
                   {
                     "id": "cc5701a5-6927-4202-866f-123aa6414c9d",
                     "name": "/Folder 1"
                   }
                 ]
               },
               {
                 "tag": "IndividualProduct",
                 "recommendations": [
                   {
                     "id": "a482bf57-1aec-4304-8751-4ce5cea603a2",
                     "name": "Pepper"
                   },
                   {
                     "id": "a482bf57-1aec-4304-8751-4ce5cea603a1",
                     "name": "Salt"
                   },
                   {
                     "id": "a482bf57-1aec-4304-8751-4ce5cea603a3",
                     "name": "Sugar"
                   }
                 ]
               }
             ]
        }
      }
      """
  Scenario: Get recommendations. tagFilter is byCategory. Should return array with categories
    Given I use DB fixture "graphql/get-recommendations/get-recommendations"
    When I send a GraphQL query to "/products":
      """
      {
      getRecommendations(businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0", tagFilter: "byCategory", paginationLimit: 10) {
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
          "getRecommendations": [
               {
                 "tag": "byCategory",
                 "recommendations": [
                   {
                     "id": "5fcf3218c4597aa78cbf2d95",
                     "name": "Baby"
                   }
                 ]
               }
             ]
        }
      }
      """
  Scenario: Get recommendations. tagFilter is byCollection. Should return array with collections
    Given I use DB fixture "graphql/get-recommendations/get-recommendations"
    When I send a GraphQL query to "/products":
      """
      {
      getRecommendations(businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0", tagFilter: "byCollection", paginationLimit: 10) {
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
          "getRecommendations": [
               {
                 "tag": "byFolder",
                 "recommendations": [{
                    "id": "cc5701a5-6927-4202-866f-123aa6414c9d",
                    "name": "/Folder 1"
                  }]
               }
             ]
        }
      }
      """
  Scenario: Get recommendations. tagFilter is IndividualProduct. Should return array with products
    Given I use DB fixture "graphql/get-recommendations/get-recommendations"
    When I send a GraphQL query to "/products":
      """
      {
      getRecommendations(businessUuid: "21f4947e-929a-11e9-bb05-7200004fe4c0", tagFilter: "IndividualProduct", paginationLimit: 10) {
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
          "getRecommendations": [
               {
                 "tag": "IndividualProduct",
                 "recommendations": [
                   {
                     "id": "a482bf57-1aec-4304-8751-4ce5cea603a2",
                     "name": "Pepper"
                   },
                   {
                     "id": "a482bf57-1aec-4304-8751-4ce5cea603a1",
                     "name": "Salt"
                   },
                   {
                     "id": "a482bf57-1aec-4304-8751-4ce5cea603a3",
                     "name": "Sugar"
                   }
                 ]
               }
             ]
        }
      }
      """