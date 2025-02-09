Feature: Search and Filters for Products GraphQL API
Description: The purpose of this feature is to test Products GraphQL API serach and filters

  Background: DB has a known set of data to perform search on it
    Given I use DB fixture "graphql/get-products/get-products-background"
    Given I remember as "businessId" following value:
    """
      "21f4947e-929a-11e9-bb05-7200004fe4c0"
    """

  Scenario: Get products Filters by business
    When I send a GraphQL query to "/products":
    """
    {
      getFilterByBusiness(businessId: "21f4947e-929a-11e9-bb05-7200004fe4c0") {
        attributes {
            type
            defaultValue {
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
            options{
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
        }
        categories {
            type
            defaultValue {
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
            options {
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
        }
        price {
              type
            defaultValue {
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
            options {
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
        }
        type {
              type
            defaultValue {
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
            options {
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
        }
        variants {
              type
            defaultValue {
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
            options {
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
        }
        brands {
              type
            defaultValue {
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
            options {
                title
                value {
                    field
                    fieldCondition
                    fieldType
                    value
                }
            }
        }
        condition {
          type
          defaultValue {
              title
              value {
                  field
                  fieldCondition
                  fieldType
                  value
              }
          }
          options {
              title
              value {
                  field
                  fieldCondition
                  fieldType
                  value
              }
          }
        }
      }
    }
    """
    Then print last response
    Then the response should contain json:
    """
    {
      "data": {
        "getFilterByBusiness": {
          "attributes": {
            "type": "select",
            "defaultValue": {
              "title": "unknown",
              "value": {
                "field": "",
                "fieldCondition": "is",
                "fieldType": "string",
                "value": ""
              }
            },
            "options": []
          },
          "categories": {
            "type": "select",
            "defaultValue": {
              "title": "unknown",
              "value": {
                "field": "",
                "fieldCondition": "is",
                "fieldType": "string",
                "value": ""
              }
            },
            "options": []
          },
          "price": {
            "type": "select",
            "defaultValue": {
              "title": "unknown",
              "value": {
                "field": "",
                "fieldCondition": "is",
                "fieldType": "string",
                "value": ""
              }
            },
            "options": [
              {
                "title": "0 To 2",
                "value": {
                  "field": "price",
                  "fieldCondition": "range",
                  "fieldType": "nested",
                  "value": "0|2"
                }
              },
              {
                "title": "2 To 4",
                "value": {
                  "field": "price",
                  "fieldCondition": "range",
                  "fieldType": "nested",
                  "value": "2|4"
                }
              },
              {
                "title": "4 To 6",
                "value": {
                  "field": "price",
                  "fieldCondition": "range",
                  "fieldType": "nested",
                  "value": "4|6"
                }
              },
              {
                "title": "6 To 8",
                "value": {
                  "field": "price",
                  "fieldCondition": "range",
                  "fieldType": "nested",
                  "value": "6|8"
                }
              },
              {
                "title": "8 To 10",
                "value": {
                  "field": "price",
                  "fieldCondition": "range",
                  "fieldType": "nested",
                  "value": "8|10"
                }
              },
              {
                "title": "10 To 12",
                "value": {
                  "field": "price",
                  "fieldCondition": "range",
                  "fieldType": "nested",
                  "value": "10|12"
                }
              },
              {
                "title": "12 To 14",
                "value": {
                  "field": "price",
                  "fieldCondition": "range",
                  "fieldType": "nested",
                  "value": "12|14"
                }
              }
            ]
          },
          "type": {
            "type": "select",
            "defaultValue": {
              "title": "unknown",
              "value": {
                "field": "",
                "fieldCondition": "is",
                "fieldType": "string",
                "value": ""
              }
            },
            "options": [
              {
                "title": "digital",
                "value": {
                  "field": "type",
                  "fieldCondition": "is",
                  "fieldType": "object",
                  "value": "digital"
                }
              }
            ]
          },
          "variants": {
            "type": "select",
            "defaultValue": {
              "title": "unknown",
              "value": {
                "field": "",
                "fieldCondition": "is",
                "fieldType": "string",
                "value": ""
              }
            },
            "options": [
              {
                "title": "Color Brown",
                "value": {
                  "field": "variants_options_value",
                  "fieldCondition": "is",
                  "fieldType": "object",
                  "value": "Brown"
                }
              },
              {
                "title": "Color White",
                "value": {
                  "field": "variants_options_value",
                  "fieldCondition": "is",
                  "fieldType": "object",
                  "value": "White"
                }
              }
            ]
          },
          "brands": {
            "type": "select",
            "defaultValue": {
              "title": "unknown",
              "value": {
                "field": "",
                "fieldCondition": "is",
                "fieldType": "string",
                "value": ""
              }
            },
            "options": []
          },
          "condition": {
            "type": "select",
            "defaultValue": {
              "title": "unknown",
              "value": {
                "field": "",
                "fieldCondition": "is",
                "fieldType": "string",
                "value": ""
              }
            },
            "options": []
          }
        }
      }
    }
    """
  