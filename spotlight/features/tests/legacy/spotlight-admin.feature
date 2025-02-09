Feature: Transaction export for business
  Background:
    Given I remember as "businessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "admin",
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

  Scenario: Search everything for business with admin role
    Given I use DB fixture "business"
    And I get file "features/fixtures/json/elastic-blogs-list.json" content and remember as "elasticBlogsListJson"
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "billing-subscriptions",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "company^1",
                        "customerEmail^1",
                        "customerName^1",
                        "reference^1",
                        "transactionUuid^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "blogs",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "title^1",
                        "content^1",
                        "author^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "checkouts",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "name^1",
                        "settings.keyword^1",
                        "settings.message^1",
                        "settings.phoneNumber^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "contacts",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "fullName^1",
                        "email^1",
                        "customerName^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "dashboards",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "userAccount.name^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "integrations",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "name^1",
                        "reviews.title^1",
                        "reviews.text^1",
                        "reviews.reviews.title^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "invoices",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "reference^1",
                        "notes^1",
                        "transactionId^1",
                        "customer.contactId^1",
                        "customer.email^1",
                        "customer.name^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "messages",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "content^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "products",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "barcode^1",
                        "title^1",
                        "description^1",
                        "sku^1",
                        "images^1",
                        "collections^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "shipping-orders",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "label^1",
                        "shipmentNumber^1",
                        "shippingAddress.name^1",
                        "shippingAddress.phone^1",
                        "shippingAddress.zipCode^1",
                        "trackingId^1",
                        "transactionId^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "shops",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "name^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "sites",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "name^1",
                        "domain.name^1",
                        "accessConfig.internalDomain^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "terminals",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "logo^1",
                        "message^1",
                        "name^1",
                        "phoneNumber^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "transactions",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "original_id^1",
                        "customer_name^1",
                        "merchant_name^1",
                        "reference^1",
                        "payment_details.finance_id^1",
                        "payment_details.application_no^1",
                        "customer_email^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "users",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "fields": [
                        "userAccount.email^1",
                        "userAccount.firstName^1",
                        "userAccount.lastName^1",
                        "userAccount.logo^1",
                        "userAccount.phone^1",
                        "userAccount.shippingAddresses.zipCode^1"
                      ],
                      "query": "*hello*"
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        ],
        "result": {{elasticBlogsListJson}}
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/spotlight?query=hello"
    Then print last response
    And the response status code should be 200
