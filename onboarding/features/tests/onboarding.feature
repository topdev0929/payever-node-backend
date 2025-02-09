Feature: Onboarding
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I load constants from "src/onboarding/enums/rabbit-binding.enum.ts"

  Scenario: Upload csv
    Given I setup user agent with value "cucumber-mocked-http-client"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "merchant@example.com",
        "id": "9a08b4bf-1068-4b5c-9428-e5233bbcafae",
        "roles": [
          {
            "name": "merchant",
            "permissions": []
          }
        ]
      }
      """
    Given I get file "features/fixtures/task.json" content and remember as "taskJson"
    And I mock an axios request with parameters:
      """
      {
        "request": { 
          "method": "POST", 
          "url": "*/api/organizations/token",
          "body": "{\"scopes\":[\"connect\",\"settings\",\"checkout\",\"pos\",\"commerceos\"]}",
          "headers": {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json;charset=utf-8"
          }
        },
        "response": { "status": 200, "body": {"accessToken": "-new-token-value"} }
      }
      """
    When I attach the file "bulk-upload.payload.csv" to "file"
    And I send a POST request to "/api/setup/bulk/upload" with form data:
      | dry-run | true |
    Then print last response
    Then response status code should be 200
    Then look for model "BulkImport" by following JSON and remember as "bulkImport":
      """
      {}
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [{
        "name": "{{RabbitBinding.OnboardingProcessBulkImport}}",
        "payload": {
          "_id": "{{bulkImport._id}}"
        }
      }]
      """

  Scenario: Process task
    Given I use DB fixture "task"
    And I mock RPC request "third-party-payments.rpc.integration-action.action" to "third-party-payments.rpc.integration-action.action" with:
      """
      {
        "requestPayload": "*",
        "responsePayload": [
          {
            "form": {
              "actionContext": { }
            }
          }
        ]
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": { "method": "GET", "url": "https://i.pinimg.com/originals/20/79/03/2079033abc8314be554f9d24f562a199.jpg" },
        "response": { "status": 200, "body": "-binary-image-file-" }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": { "method": "POST", "url": "*media*/api/image/business/{{BUSINESS_ID}}/wallpapers" },
        "response": { "status": 200, "body": { "blobName": "wallpaper-1.png" } }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": { "method": "GET", "url": "http://logos.net/mylogo1.png" },
        "response": { "status": 200, "body": "-binary-image-file-" }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": { "method": "POST", "url": "*media*/api/image/business/{{BUSINESS_ID}}/images" },
        "response": { "status": 200, "body": { "blobName": "logo-1.png" } }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": { "method": "GET", "url": "http://logos.net/mylogo1.png" },
        "response": { "status": 200, "body": "-binary-image-file-" }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": { "method": "POST", "url": "*media*/api/image/business/{{BUSINESS_ID}}/images" },
        "response": { "status": 200, "body": { "blobName": "logo-2.png" } }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": { "method": "POST", "url": "*/api/instruction" },
        "response": { "status": 201, "body": "*" }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": { "method": "GET", "url": "*api/onboarding/cached/business" },
        "response": { 
          "status": 200, 
          "body": { 
            "afterRegistration": [
              {
                "payload": { "apps": [{"code": "pos" }]}
              }
            ]
          } 
        }
      }
      """

    When I publish in RabbitMQ channel "async_events_onboarding_created_micro" message with json:
      """
      {
        "name": "{{RabbitBinding.OnboardingTaskCreated}}",
        "payload": {
          "_id": "{{TASK_ID}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_onboarding_created_micro" channel
    Then axios mocks should be called
    And I look for model "Task" with id "{{TASK_ID}}" and remember as "task"
    And print storage key "task"
    And stored value "task" should contain json:
      """
      {
        "status": "finished"
      }
      """

  Scenario: Create onbroading task
    Given I set header "User-Agent" with value "curl/7.64.1"
    When I send a POST request to "/api/setup" with json:
      """
      {
        "business":
        {
          "name": "microsoft",
          "logo": "http://logos.net/mylogo1.png",
          "companyAddress":
          {
            "country": "CA",
            "city": "Ottawa",
            "street": "123 Fake Street",
            "zipCode": "a1b2c3"
          },
          "companyDetails":
          {
            "phone": "154987711",
            "industry": "IT",
            "product": "windows"
          },
          "bankAccount":
          {
            "country": "CA",
            "city": "Ottawa",
            "bankName": "white-bank",
            "bankCode": "55123311",
            "swift": "55123312",
            "routingNumber": "55123313",
            "accountNumber": "55123314",
            "owner": "king",
            "bic": "44123312",
            "iban": "551233125"
          },
          "taxes":
          {
            "companyRegisterNumber": "55123316",
            "taxId": "55123317",
            "taxNumber": "55123318",
            "turnoverTaxAct": true
          },
          "contactEmails":
          [
            "microsoft-employee1@example.com"
          ],
          "defaultLanguage": "en",
          "currentWallpaper":
          {
            "theme": "dark",
            "wallpaper": "https://i.pinimg.com/originals/20/79/03/2079033abc8314be554f9d24f562a199.jpg"
          }
        },
        "wallpaper": false,
        "pos": false
      }
      """
    Then print last response
    Then response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "onboarding.event.task.created",
          "payload":
          {
            "_id": "*"
          }
        }
      ]
      """
