@settings-management
Feature: Settings management controller
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

  Scenario: Get default setting item related to business
    When I send a GET request to "/api/business/{{businessId}}/settings/type/api-keys-invalid"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "businessId": "{{businessId}}",
      "type": "api-keys-invalid",
      "updateInterval": "every-5-minutes",
      "sendingMethod": "send-by-cron-interval"
    }
    """

  Scenario: Get default setting item related to integrations
    When I send a GET request to "/api/business/{{businessId}}/settings/type/psp-api-failed/integration/santander_factoring_de"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "businessId": "{{businessId}}",
      "type": "psp-api-failed",
      "updateInterval": "every-5-minutes",
      "sendingMethod": "send-by-cron-interval"
    }
    """

  Scenario: Get stored setting related to business
    Given I use DB fixture "settings/api-key-update-5m"
    When I send a GET request to "/api/business/{{businessId}}/settings/type/api-keys-invalid"
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

  Scenario: Get default settings for business
    When I send a GET request to "/api/business/{{businessId}}/settings"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "businessId": "97356abe-5bf8-11eb-ae93-0242ac130002",
        "isEnabled": false,
        "repeatFrequencyInterval": 0,
        "sendingMethod": "send-by-cron-interval",
        "type": "api-keys-invalid",
        "updateInterval": "every-5-minutes"
      },
      {
        "businessId": "97356abe-5bf8-11eb-ae93-0242ac130002",
        "isEnabled": false,
        "repeatFrequencyInterval": 5,
        "sendingMethod": "send-by-cron-interval",
        "type": "payment-notification-failed",
        "updateInterval": "every-hour"
      },
      {
        "businessId": "97356abe-5bf8-11eb-ae93-0242ac130002",
        "isEnabled": false,
        "repeatFrequencyInterval": 0,
        "sendingMethod": "send-by-cron-interval",
        "type": "psp-api-failed",
        "updateInterval": "every-5-minutes"
      },
      {
        "businessId": "97356abe-5bf8-11eb-ae93-0242ac130002",
        "isEnabled": false,
        "integration": "santander_installment",
        "repeatFrequencyInterval": 0,
        "sendingMethod": "send-by-cron-interval",
        "type": "payment-option-credentials-invalid",
        "updateInterval": "every-5-minutes"
      },
      {
        "businessId": "97356abe-5bf8-11eb-ae93-0242ac130002",
        "isEnabled": false,
        "integration": "santander_installment",
        "sendingMethod": "send-by-after-interval",
        "timeFrames": [
          {
            "startDayOfWeek": 1,
            "startHour": 9,
            "startMinutes": 0,
            "endDayOfWeek": 5,
            "endHour": 18,
            "endMinutes": 0,
            "sendEmailAfterInterval": 60,
            "repeatFrequencyInterval": 0
          }
        ],
        "type": "last-transaction-time"
      }
    ]
    """

  Scenario: Get stored and default settings for business
    Given I use DB fixture "settings/update-interval-different"
    When I send a GET request to "/api/business/{{businessId}}/settings"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "isEnabled": true,
        "repeatFrequencyInterval": 0,
        "updateInterval": "never",
        "_id": "*",
        "businessId": "97356abe-5bf8-11eb-ae93-0242ac130002",
        "createdAt": "*",
        "sendingMethod": "send-by-cron-interval",
        "type": "api-keys-invalid",
        "updatedAt": "*",
        "timeFrames": [],
        "__v": 0
      },
      {
        "isEnabled": true,
        "repeatFrequencyInterval": 0,
        "updateInterval": "every-5-minutes",
        "_id": "*",
        "businessId": "97356abe-5bf8-11eb-ae93-0242ac130002",
        "createdAt": "*",
        "sendingMethod": "send-by-cron-interval",
        "type": "payment-notification-failed",
        "updatedAt": "*",
        "timeFrames": [],
        "__v": 0
      },
      {
        "isEnabled": true,
        "repeatFrequencyInterval": 0,
        "updateInterval": "every-hour",
        "_id": "*",
        "businessId": "97356abe-5bf8-11eb-ae93-0242ac130002",
        "createdAt": "*",
        "sendingMethod": "send-by-cron-interval",
        "type": "psp-api-failed",
        "updatedAt": "*",
        "timeFrames": [],
        "__v": 0
      },
      {
        "businessId": "97356abe-5bf8-11eb-ae93-0242ac130002",
        "isEnabled": false,
        "integration": "santander_installment",
        "repeatFrequencyInterval": 0,
        "sendingMethod": "send-by-cron-interval",
        "type": "payment-option-credentials-invalid",
        "updateInterval": "every-5-minutes"
      },
      {
        "businessId": "97356abe-5bf8-11eb-ae93-0242ac130002",
        "isEnabled": false,
        "integration": "santander_installment",
        "sendingMethod": "send-by-after-interval",
        "timeFrames": [
          {
            "startDayOfWeek": 1,
            "startHour": 9,
            "startMinutes": 0,
            "endDayOfWeek": 5,
            "endHour": 18,
            "endMinutes": 0,
            "sendEmailAfterInterval": 60,
            "repeatFrequencyInterval": 0
          }
        ],
        "type": "last-transaction-time"
      }
    ]
    """

  Scenario: Store new updateInterval related to business
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

  Scenario: Update updateInterval related to business
    Given I use DB fixture "settings/update-interval-different"
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/api-keys-invalid" with json:
    """
    {
      "updateInterval": "every-hour",
      "sendingMethod": "send-by-cron-interval",
      "repeatFrequencyInterval": 0
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "updateInterval": "every-hour",
      "_id": "*",
      "businessId": "{{businessId}}",
      "createdAt": "*",
      "type": "api-keys-invalid",
      "updatedAt": "*",
      "__v": 0
    }
    """

  Scenario: Store new updateInterval related to integration
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/payment-notification-failed/integration/santander_factoring_de" with json:
    """
    {
      "updateInterval": "every-hour",
      "sendingMethod": "send-by-cron-interval",
      "repeatFrequencyInterval": 0
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "updateInterval": "every-hour",
      "_id": "*",
      "businessId": "{{businessId}}",
      "createdAt": "*",
      "type": "payment-notification-failed",
      "updatedAt": "*",
      "__v": 0
    }
    """

  Scenario: Update updateInterval related to integration
    Given I use DB fixture "settings/update-interval-different"
    When I send a PATCH request to "/api/business/{{businessId}}/settings/type/payment-notification-failed/integration/santander_factoring_de" with json:
    """
    {
      "updateInterval": "every-hour",
      "sendingMethod": "send-by-cron-interval",
      "repeatFrequencyInterval": 0
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "updateInterval": "every-hour",
      "_id": "*",
      "businessId": "{{businessId}}",
      "createdAt": "*",
      "type": "payment-notification-failed",
      "updatedAt": "*",
      "__v": 0
    }
    """
  Scenario: Bundle update settings
    When I send a PATCH request to "/api/business/{{businessId}}/settings" with json:
    """
      [
        {
          "isEnabled": true,
          "type": "api-keys-invalid",
          "updateInterval": "every-hour",
          "sendingMethod": "send-by-cron-interval",
          "repeatFrequencyInterval": 60
        },
        {
          "isEnabled": true,
          "type": "payment-notification-failed",
          "integration": "santander_factoring_de",
          "updateInterval": "every-hour",
          "sendingMethod": "send-by-cron-interval",
          "repeatFrequencyInterval": 30
        },
        {
          "isEnabled": true,
          "type": "payment-notification-failed",
          "integration": "paypal",
          "updateInterval": "every-5-minutes",
          "sendingMethod": "send-by-cron-interval",
          "repeatFrequencyInterval": 10
        },
        {
          "isEnabled": true,
          "type": "last-transaction-time",
          "integration": "paypal",
          "sendingMethod": "send-by-after-interval",
          "timeFrames": [
            {
              "startDayOfWeek": 1,
              "startHour": 8,
              "startMinutes": 0,
              "endDayOfWeek": 5,
              "endHour": 20,
              "endMinutes": 30,
              "repeatFrequencyInterval": 10,
              "sendEmailAfterInterval": 60
            },
            {
              "startDayOfWeek": 6,
              "startHour": 8,
              "startMinutes": 0,
              "endDayOfWeek": 6,
              "endHour": 20,
              "endMinutes": 30,
              "repeatFrequencyInterval": 30,
              "sendEmailAfterInterval": 180
            },
            {
              "startDayOfWeek": 1,
              "startHour": 8,
              "startMinutes": 0,
              "endDayOfWeek": 1,
              "endHour": 20,
              "endMinutes": 30,
              "repeatFrequencyInterval": 30,
              "sendEmailAfterInterval": 180
            }
          ]
        }

      ]
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
       {
         "isEnabled": true,
         "repeatFrequencyInterval": 60,
         "updateInterval": "every-hour",
         "businessId": "{{businessId}}",
         "sendingMethod": "send-by-cron-interval",
         "type": "api-keys-invalid",
         "_id": "*",
         "createdAt": "*",
         "updatedAt": "*",
         "__v": 0
       },
       {
         "isEnabled": true,
         "repeatFrequencyInterval": 30,
         "updateInterval": "every-hour",
         "businessId": "{{businessId}}",
         "integration": "santander_factoring_de",
         "sendingMethod": "send-by-cron-interval",
         "type": "payment-notification-failed",
         "_id": "*",
         "createdAt": "*",
         "updatedAt": "*",
         "__v": 0
       },
       {
         "isEnabled": true,
         "repeatFrequencyInterval": 10,
         "updateInterval": "every-5-minutes",
         "_id": "*",
         "businessId": "{{businessId}}",
         "integration": "paypal",
         "sendingMethod": "send-by-cron-interval",
         "type": "payment-notification-failed",
         "createdAt": "*",
         "updatedAt": "*",
         "__v": 0
       },
       {
         "isEnabled": true,
         "businessId": "{{businessId}}",
         "integration": "paypal",
         "sendingMethod": "send-by-after-interval",
         "timeFrames": [
           {
             "_id": "*",
             "startDayOfWeek": 1,
             "startHour": 8,
             "startMinutes": 0,
             "endDayOfWeek": 5,
             "endHour": 20,
             "endMinutes": 30,
             "repeatFrequencyInterval": 10,
             "sendEmailAfterInterval": 60
           },
           {
             "_id": "*",
             "startDayOfWeek": 6,
             "startHour": 8,
             "startMinutes": 0,
             "endDayOfWeek": 6,
             "endHour": 20,
             "endMinutes": 30,
             "repeatFrequencyInterval": 30,
             "sendEmailAfterInterval": 180
           },
           {
             "_id": "*",
             "startDayOfWeek": 1,
             "startHour": 8,
             "startMinutes": 0,
             "endDayOfWeek": 1,
             "endHour": 20,
             "endMinutes": 30,
             "repeatFrequencyInterval": 30,
             "sendEmailAfterInterval": 180
           }
         ],
         "type": "last-transaction-time",
         "_id": "*",
         "createdAt": "*",
         "updatedAt": "*",
         "__v": 0
       }
    ]
    """
