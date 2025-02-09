@validate-settings
Feature: Validate settings
  Background:
    Given I remember as "businessId" following value:
    """
      "97356abe-5bf8-11eb-ae93-0242ac130002"
    """
    Given I authenticate as a user with the following data:
    """
    {
      "id": "{{businessId}}",
      "email": "test@payever.de",
      "roles": [
        {
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }
      ]
    }
    """

  Scenario: Update settings with cron interval
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/api-keys-invalid" with json:
    """
    {
      "updateInterval": "every-5-minutes",
      "sendingMethod": "send-by-cron-interval",
      "repeatFrequencyInterval": 0
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "updateInterval": "every-5-minutes",
      "_id": "*",
      "businessId": "{{businessId}}",
      "createdAt": "*",
      "type": "api-keys-invalid",
      "updatedAt": "*",
      "__v": 0
    }
    """

  Scenario: Update settings with after interval
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "isEnabled": true,
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": 0,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 8,
          "endMinutes": 0,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 180
        },
        {
          "startDayOfWeek": 1,
          "startHour": 8,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 20,
          "endMinutes": 0,
          "repeatFrequencyInterval": 30,
          "sendEmailAfterInterval": 30
        },
        {
          "startDayOfWeek": 1,
          "startHour": 20,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 23,
          "endMinutes": 59,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 180
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "businessId": "{{businessId}}",
      "integration": "paypal",
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "_id": "*",
          "startDayOfWeek": 1,
          "startHour": 0,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 8,
          "endMinutes": 0,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 180
        },
        {
          "_id": "*",
          "startDayOfWeek": 1,
          "startHour": 8,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 20,
          "endMinutes": 0,
          "repeatFrequencyInterval": 30,
          "sendEmailAfterInterval": 30
        },
        {
          "_id": "*",
          "startDayOfWeek": 1,
          "startHour": 20,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 23,
          "endMinutes": 59,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 180
        }
      ],
      "type": "last-transaction-time",
      "_id": "*",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: Update with wrong settings startHour < 0 and endHour > 23
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": -1,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 24,
          "endMinutes": 59,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 180
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "children": [
             {
               "children": [
                 {
                   "constraints": {
                     "min": "startHour must not be less than 0"
                   }
                 },
                 {
                   "constraints": {
                     "max": "endHour must not be greater than 23"
                   }
                 }
               ]
             }
           ]
         }
       ]
     }
    """
  Scenario: Update with wrong settings repeatFrequencyInterval < 0
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": 0,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 24,
          "endMinutes": 0,
          "repeatFrequencyInterval": -1,
          "sendEmailAfterInterval": 180
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "children": [
             {
               "children": [
                 {
                   "constraints": {
                     "min": "repeatFrequencyInterval must not be less than 0"
                   }
                 }
               ]
             }
           ]
         }
       ]
     }
    """
  Scenario: Update with wrong settings repeatFrequencyInterval > 60
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": 0,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 23,
          "endMinutes": 0,
          "repeatFrequencyInterval": 61,
          "sendEmailAfterInterval": 180
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "children": [
             {
               "children": [
                 {
                   "constraints": {
                     "max": "repeatFrequencyInterval must not be greater than 60"
                   }
                 }
               ]
             }
           ]
         }
       ]
     }
    """
  Scenario: Update with wrong settings sendEmailAfterInterval < 0
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": 0,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 23,
          "endMinutes": 0,
          "repeatFrequencyInterval": 30,
          "sendEmailAfterInterval": -2
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "children": [
             {
               "children": [
                 {
                   "constraints": {
                     "min": "sendEmailAfterInterval must not be less than 0"
                   }
                 }
               ]
             }
           ]
         }
       ]
     }
    """
  Scenario: Update with wrong settings sendEmailAfterInterval > 720
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": 0,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 23,
          "endMinutes": 0,
          "repeatFrequencyInterval": 30,
          "sendEmailAfterInterval": 721
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "children": [
             {
               "children": [
                 {
                   "constraints": {
                     "max": "sendEmailAfterInterval must not be greater than 720"
                   }
                 }
               ]
             }
           ]
         }
       ]
     }
    """
  Scenario: Update with wrong settings endDayOfWeek > 6
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": -1,
          "startHour": 0,
          "startMinutes": 0,
          "endDayOfWeek": 8,
          "endHour": 23,
          "endMinutes": 0,
          "repeatFrequencyInterval": 30,
          "sendEmailAfterInterval": 60
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "children": [
             {
               "children": [
                 {
                   "constraints": {
                     "min": "startDayOfWeek must not be less than 1"
                   }
                 },
                 {
                   "constraints": {
                     "max":  "endDayOfWeek must not be greater than 7"
                   }
                 }
               ]
             }
           ]
         }
       ]
     }
    """

  Scenario: Update with wrong settings startMinutes endMinutes > 59
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": 0,
          "startMinutes": -1,
          "endDayOfWeek": 6,
          "endHour": 23,
          "endMinutes": 60,
          "repeatFrequencyInterval": 30,
          "sendEmailAfterInterval": 60
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "children": [
             {
               "children": [
                 {
                   "constraints": {
                     "min": "startMinutes must not be less than 0"
                   }
                 },
                 {
                   "constraints": {
                     "max": "endMinutes must not be greater than 59"
                   }
                 }
               ]
             }
           ]
         }
       ]
     }
    """
  Scenario: Update with wrong settings sending method doesnt related to error notification type cron interval
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-cron-interval",
      "timeFrames": []
    }
    """
    Then print last response
    And the response status code should be 400

  Scenario: Update with wrong settings sending method doesnt related to error notification type after interval
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/payment-notification-failed/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": []
    }
    """
    Then print last response
    And the response status code should be 400

  Scenario: Update with wrong settings cron interval doesnt have an option updateInterval
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/payment-notification-failed/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-cron-interval"
    }
    """
    Then print last response
    And the response status code should be 400

  Scenario: Update with wrong settings start time should not be greater then end time
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": 9,
          "startMinutes": 5,
          "endDayOfWeek": 1,
          "endHour": 3,
          "endMinutes": 7,
          "repeatFrequencyInterval": 10,
          "sendEmailAfterInterval": 60
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "constraints": {
             "customValidation": "Start time must be before end time, and both times must be on the same day"
           }
         }
       ]
     }
    """

  Scenario: Update with overlapped time frames variant 1
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": 8,
          "startMinutes": 0,
          "endDayOfWeek": 5,
          "endHour": 22,
          "endMinutes": 0,
          "repeatFrequencyInterval": 30,
          "sendEmailAfterInterval": 60
        },
        {
          "startDayOfWeek": 1,
          "startHour": 6,
          "startMinutes": 0,
          "endDayOfWeek": 5,
          "endHour": 10,
          "endMinutes": 0,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 60
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "constraints": {
             "customValidation": "Some of time frame overlaps other one. Time frames shouldn't be overlapped"
           }
         }
       ]
     }
    """

  Scenario: Update with overlapped time frames variant 2
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": 8,
          "startMinutes": 0,
          "endDayOfWeek": 5,
          "endHour": 22,
          "endMinutes": 0,
          "repeatFrequencyInterval": 30,
          "sendEmailAfterInterval": 60
        },
        {
          "startDayOfWeek": 1,
          "startHour": 6,
          "startMinutes": 0,
          "endDayOfWeek": 5,
          "endHour": 23,
          "endMinutes": 0,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 60
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
       "message": [
         {
           "constraints": {
             "customValidation": "Some of time frame overlaps other one. Time frames shouldn't be overlapped"
           }
         }
       ]
     }
    """

  Scenario: Update with overlapped time frames with different week days
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": 8,
          "startMinutes": 0,
          "endDayOfWeek": 5,
          "endHour": 22,
          "endMinutes": 0,
          "repeatFrequencyInterval": 30,
          "sendEmailAfterInterval": 60
        },
        {
          "startDayOfWeek": 6,
          "startHour": 6,
          "startMinutes": 0,
          "endDayOfWeek": 7,
          "endHour": 23,
          "endMinutes": 0,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 60
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
       "isEnabled": false,
       "businessId": "{{businessId}}",
       "integration": "paypal",
       "type": "last-transaction-time",
       "sendingMethod": "send-by-after-interval",
       "timeFrames": [
         {
           "_id": "*",
           "startDayOfWeek": 1,
           "startHour": 8,
           "startMinutes": 0,
           "endDayOfWeek": 5,
           "endHour": 22,
           "endMinutes": 0,
           "repeatFrequencyInterval": 30,
           "sendEmailAfterInterval": 60
         },
         {
           "_id": "*",
           "startDayOfWeek": 6,
           "startHour": 6,
           "startMinutes": 0,
           "endDayOfWeek": 7,
           "endHour": 23,
           "endMinutes": 0,
           "repeatFrequencyInterval": 60,
           "sendEmailAfterInterval": 60
         }
       ],
       "_id": "*",
       "createdAt": "*",
       "updatedAt": "*",
       "__v": 0
     }
    """

  Scenario: Update with wrong settings - empty status condition
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
      """
      {
        "sendingMethod": "send-by-after-interval",
        "timeFrames": [
          {
            "startDayOfWeek": 1,
            "startHour": 1,
            "startMinutes": 0,
            "endDayOfWeek": 6,
            "endHour": 23,
            "endMinutes": 59,
            "repeatFrequencyInterval": 60,
            "sendEmailAfterInterval": 180,
            "statusCondition": {}
          }
        ]
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "statusCode": 400,
        "message": [
          {
            "target": {
              "sendingMethod": "send-by-after-interval",
              "timeFrames": [
                {
                  "startDayOfWeek": 1,
                  "startHour": 1,
                  "startMinutes": 0,
                  "endDayOfWeek": 6,
                  "endHour": 23,
                  "endMinutes": 59,
                  "repeatFrequencyInterval": 60,
                  "sendEmailAfterInterval": 180,
                  "statusCondition": {}
                }
              ]
            },
            "value": [
              {
                "startDayOfWeek": 1,
                "startHour": 1,
                "startMinutes": 0,
                "endDayOfWeek": 6,
                "endHour": 23,
                "endMinutes": 59,
                "repeatFrequencyInterval": 60,
                "sendEmailAfterInterval": 180,
                "statusCondition": {}
              }
            ],
            "property": "timeFrames",
            "children": [
              {
                "target": [
                  {
                    "startDayOfWeek": 1,
                    "startHour": 1,
                    "startMinutes": 0,
                    "endDayOfWeek": 6,
                    "endHour": 23,
                    "endMinutes": 59,
                    "repeatFrequencyInterval": 60,
                    "sendEmailAfterInterval": 180,
                    "statusCondition": {}
                  }
                ],
                "value": {
                  "startDayOfWeek": 1,
                  "startHour": 1,
                  "startMinutes": 0,
                  "endDayOfWeek": 6,
                  "endHour": 23,
                  "endMinutes": 59,
                  "repeatFrequencyInterval": 60,
                  "sendEmailAfterInterval": 180,
                  "statusCondition": {}
                },
                "property": "0",
                "children": [
                  {
                    "target": {
                      "startDayOfWeek": 1,
                      "startHour": 1,
                      "startMinutes": 0,
                      "endDayOfWeek": 6,
                      "endHour": 23,
                      "endMinutes": 59,
                      "repeatFrequencyInterval": 60,
                      "sendEmailAfterInterval": 180,
                      "statusCondition": {}
                    },
                    "value": {},
                    "property": "statusCondition",
                    "children": [
                      {
                        "target": {},
                        "property": "status",
                        "children": [],
                        "constraints": {
                          "isDefined": "status should not be null or undefined",
                          "isEnum": "status must be one of the following values: STATUS_NEW, STATUS_IN_PROCESS, STATUS_ACCEPTED, STATUS_PAID, STATUS_DECLINED, STATUS_REFUNDED, STATUS_FAILED, STATUS_CANCELLED"
                        }
                      },
                      {
                        "target": {},
                        "property": "percent",
                        "children": [],
                        "constraints": {
                          "max": "percent must not be greater than 100",
                          "min": "percent must not be less than 1",
                          "isInt": "percent must be an integer number"
                        }
                      },
                      {
                        "target": {},
                        "property": "value",
                        "children": [],
                        "constraints": {
                          "min": "value must not be less than 1",
                          "isInt": "value must be an integer number"
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "error": "Bad Request"
      }
      """

  Scenario: Update settings with after interval covering till end of day
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/last-transaction-time/integration/paypal" with json:
    """
    {
      "isEnabled": true,
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "startDayOfWeek": 1,
          "startHour": 7,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 0,
          "endMinutes": 0,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 180
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "businessId": "{{businessId}}",
      "integration": "paypal",
      "sendingMethod": "send-by-after-interval",
      "timeFrames": [
        {
          "_id": "*",
          "startDayOfWeek": 1,
          "startHour": 7,
          "startMinutes": 0,
          "endDayOfWeek": 6,
          "endHour": 0,
          "endMinutes": 0,
          "repeatFrequencyInterval": 60,
          "sendEmailAfterInterval": 180
        }
      ],
      "type": "last-transaction-time",
      "_id": "*",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

