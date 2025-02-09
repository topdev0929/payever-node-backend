@archive-transactions
Feature: Archive transactions

  Background:
    Given I remember as "businessId" following value:
    """
    "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
    """
    Given I remember as "userId" following value:
    """
    "a4e4c682-8b89-46fa-ba05-2b3c48a2003b"
    """
    Given I remember as "transactionId" following value:
    """
    "ad738281-f9f0-4db7-a4f6-670b0dff5327"
    """
    Given I remember as "archivedTransactionId" following value:
    """
    "16dd795c-3ead-48fd-9423-0479297a887c"
    """

  Scenario: Archive transaction
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@email.com",
      "roles": [
        {
          "name": "merchant",
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
    And I mock Elasticsearch method "singleIndex" with:
    """
    {
      "arguments": [
        "folder_transactions",
        {
          "serviceEntityId": "{{transactionId}}"
        }
       ],
      "result": {}
    }
    """
    And I mock Elasticsearch method "search" with:
    """
    {
      "arguments": [
        "folder_transactions",
        {
        }
       ],
      "result": {
        "body": {
          "hits": {
            "hits": [
              {
                "_source": {
                  "_id": "{{transactionId}}",
                  "mongoId": "{{transactionId}}",
                  "parentFolderId": "79b8cba1-76e9-43d7-964e-399ac6ae6bde",
                  "scope": "business",
                  "serviceEntityId": "{{transactionId}}"
                }
              }
            ]
          }
        }
      }
    }
    """
    And I use DB fixture "archived-transactions/folders"
    And I use DB fixture "archived-transactions/transactions"
    When I send a POST request to "/api/business/{{businessId}}/transaction/{{transactionId}}/archive"
    Then print last response
    Then the response status code should be 200
    And look for model "FolderItemLocation" by following JSON and remember as "transaction":
    """
    {
      "itemId": "{{transactionId}}"
    }
    """
    And stored value "transaction" should contain json:
    """
    {
      "folderId": "9d10611a-f4f7-497d-a677-96812183f942",
      "itemId": "{{transactionId}}"
    }
    """

  Scenario: Remove business
    Given I use DB fixture "business-events"
    And I use DB fixture "archived-transactions/transactions"
    Given I publish in RabbitMQ channel "async_events_transactions_micro" message with json:
      """
      {
        "name":"users.event.business.removed",
        "uuid":"7ee31df2-e6eb-4467-8e8d-522988f426b8",
        "version":0,
        "encryption":"none",
        "createdAt":"2019-08-28T12:32:26+00:00",
        "metadata": {
          "locale":"de",
          "client_ip":"176.198.69.86"
        },
        "payload": {
          "_id": "{{businessId}}",
          "owner": "{{userId}}",
          "userAccount": {
            "email": "test@payever.com"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_transactions_micro" channel
    And look for model "ArchivedTransaction" by following JSON and remember as "transaction":
    """
    {
      "businessId": "{{businessId}}"
    }
    """
    And print storage key "transaction"
    And stored value "transaction" should contain json:
    """
    {
      "data": {
        "uuid": "{{transactionId}}",
        "_id": "*",
        "total": 50,
        "type": "payex_creditcard"
      },
      "encryptedData": "*"
    }
    """
    And model "Business" with id "{{businessId}}" should not exist

  Scenario: Download archived transactions
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@email.com",
      "roles": [
        {
          "name": "merchant",
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
    And I use DB fixture "archived-transactions/archived-transactions"
    When I send a GET request to "/api/business/{{businessId}}/download-archived-transactions"
    Then print last response
    Then the response status code should be 200
    And the response header "content-type" should have value "application/octet-stream"
    And the response header "content-disposition" should have value "attachment;filename=transactions-*.xlsx"
    And the response header "content-transfer-encoding" should have value "binary"
