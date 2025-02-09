Feature: Filtration attributes. Get available attributes
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "categoryTitle" following value:
      """
      "categoryTitle"
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
         ],
        "result": {}
      }
      """

  Scenario: Sending request without any filters
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "products",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "match_phrase": {
                      "businessId": "{{businessId}}"
                    }
                  }
                ],
                "must_not": []
              }
            },
            "aggs": {
              "attributes": {
                "nested": {
                  "path": "attributes"
                },
                "aggs": {
                  "attributeName": {
                    "terms": {
                      "field": "attributes.name"
                    },
                    "aggs": {
                      "attributeValue": {
                        "terms": {
                          "field": "attributes.value"
                        }
                      }
                    }
                  }
                }
              }
            }
          }

        ],
        "result": {
          "body": {
            "hits": {
              "hits": []
            },
            "aggregations": {
              "attributes": {
                "attributeName": {
                  "buckets": [
                    {
                      "key": "color",
                      "attributeValue": {
                        "buckets": [
                          {
                            "key": "red"
                          },
                          {
                            "key": "green"
                          }
                        ]
                      }
                    },
                    {
                      "key": "size",
                      "attributeValue": {
                        "buckets": [
                          {
                            "key": "small"
                          }
                        ]
                      }
                    },
                    {
                      "key": "type",
                      "attributeValue": {
                        "buckets": [
                          {
                            "key": "eu"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
      """
    When I send a POST request to "/{{businessId}}/filter-attributes" with json:
      """
       []
      """

    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       [
        {
          "name": "color",
          "values": ["red", "green"]
        },
        {
          "name": "size",
          "values": ["small"]
        },
        {
          "name": "type",
          "values": ["eu"]
        }
      ]
      """

  Scenario: Sending request with filters
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "products",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "nested": {
                      "path": "attributes",
                      "query": {
                        "bool": {
                          "must": [
                            {
                              "match_phrase": {
                                "attributes.name": "size"
                              }
                            },
                            {
                              "match_phrase": {
                                "attributes.value": "small"
                              }
                            }
                          ],
                          "must_not": []
                        }
                      }
                    }
                  },
                  {
                    "nested": {
                      "path": "categories",
                      "query": {
                        "bool": {
                          "must": [
                            {
                              "match_phrase": {
                                "categories.title": "{{categoryTitle}}"
                              }
                            }
                          ],
                          "must_not": []
                        }
                      }
                    }
                  },
                  {
                    "match_phrase": {
                      "businessId": "{{businessId}}"
                    }
                  }
                ],
                "must_not": []
              }
            },
            "aggs": {
              "attributes": {
                "nested": {
                  "path": "attributes"
                },
                "aggs": {
                  "attributeName": {
                    "terms": {
                      "field": "attributes.name"
                    },
                    "aggs": {
                      "attributeValue": {
                        "terms": {
                          "field": "attributes.value"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ],
        "result": {
          "body": {
            "hits": {
              "hits": []
            },
            "aggregations": {
              "attributes": {
                "attributeName": {
                  "buckets": [
                    {
                      "key": "color",
                      "attributeValue": {
                        "buckets": [
                          {
                            "key": "red"
                          },
                          {
                            "key": "green"
                          }
                        ]
                      }
                    },
                    {
                      "key": "size",
                      "attributeValue": {
                        "buckets": [
                          {
                            "key": "small"
                          }
                        ]
                      }
                    },
                    {
                      "key": "type",
                      "attributeValue": {
                        "buckets": [
                          {
                            "key": "eu"
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
      """
    When I send a POST request to "/{{businessId}}/filter-attributes" with json:
      """
       [
        {
          "fieldType": "nested",
          "fieldCondition": "is",
          "field": "attributes",
          "filters": [
            {
              "field": "name",
              "fieldType": "string",
              "fieldCondition": "is",
              "value": "size"
            },
            {
              "field": "value",
              "fieldType": "string",
              "fieldCondition": "is",
              "value": "small"
            }
          ]
        },
        {
          "fieldType": "nested",
          "fieldCondition": "is",
          "field": "categories",
          "filters": [
            {
              "field": "title",
              "fieldType": "string",
              "fieldCondition": "is",
              "value": "{{categoryTitle}}"
            }
          ]
        }
      ]
      """

    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       [
        {
          "name": "color",
          "values": ["red", "green"]
        },
        {
          "name": "size",
          "values": ["small"]
        },
        {
          "name": "type",
          "values": ["eu"]
        }
      ]
      """
