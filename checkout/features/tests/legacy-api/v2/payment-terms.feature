Feature: Payment terms v2
  Background:
    Given I remember as "connectionId" following value:
      """
      "4ca57652-6881-4b54-9c11-ce00c79fcb45"
      """
    Given I remember as "mappedConnectionId" following value:
      """
      "c6cb3529-9984-47bf-80f2-b9c8bb19d3a3"
      """
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://payevertesting.azureedge.net/translations/*",
        "headers": {
          "Accept": "application/json, text/plain, */*"
        }
      },
      "response": {
        "status": 200,
        "body": "{\"santander-de-invoice.inquiry.form.advertising_accepted.text\":\"Legal text translated text\",\"santander-de-invoice.inquiry.form.conditions_accepted.label\":\"Accept conditions text\"}"
      }
    }
    """

  Scenario: Get remote terms
    And I use DB fixture "connection/checkout-connection/get-terms/zinia-bnpl"
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/{{connectionId}}/action/get-terms",
        "body": "{}"
      },
      "response": {
        "status": 201,
        "body": {
           "consents":[
              {
                 "documentId":"product_offerings",
                 "title":"Unsere Produkte und Dienstleistungen",
                 "text":"Wenn du dieses Kästchen ankreuzt, stimmst du zu, dass ZINIA als Datenverantwortlicher dir Marketingmitteilungen per SMS, Instant Messaging-Apps, E-Mail, Web-Push- und Pop-up-Nachrichten oder auf anderen elektronischen oder telematischen Wegen über unsere Produkte und Dienstleistungen sendet, von denen wir glauben, dass sie dich, basierend auf deinem kommerziellen Profil, das gemäß unseren internen Risikokriterien und der Konsultation externer Quellen erstellt wurde, <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">interessieren werden</a>. Du kannst deine Rechte in Bezug auf deine personenbezogenen Daten ausüben und diese Einwilligung widerrufen, indem du eine E-Mail an <a href = \"datenschutz.de@zinia.com\">datenschutz.de@zinia.com</a> sendest. Weitere Informationen findest du hier in unserer <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutz-Richtlinie</a>.",
                 "sortOrder":2,
                 "required":true
              }
           ],
           "terms":[
              {
                 "documentId":"terms_linkup_general",
                 "title":"Allgemeine Geschäftsbedingungen",
                 "text":"Ich akzeptiere die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/TermsAndConditions.pdf\">allgemeinen Geschäftsbedingungen</a> (welche die geltenden Mahngebühren im Falle eines Zahlungsverzugs angeben) und die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutzrichtlinie</a> von Zinia.",
                 "sortOrder":1,
                 "required":true
              }
           ],
           "policies":[
              {
                 "documentId":"privacy_linkup",
                 "title":"Datenschutzrichtlinie",
                 "text":"Ich habe die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutzbestimmungen</a>  gelesen und stimme diesen ausdrücklich zu. ",
                 "sortOrder":1,
                 "required":true
              }
           ]
        }
      }
    }
    """
    When I send a POST request to "/api/v2/payment/{{connectionId}}/terms" with json:
    """
    {}
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
       "call":{
          "status":"success",
          "type":"terms",
          "id":"*",
          "created_at":"*"
       },
       "result":{
          "consents": [
             {
               "documentId": "product_offerings",
               "title": "Unsere Produkte und Dienstleistungen",
               "text": "Wenn du dieses Kästchen ankreuzt, stimmst du zu, dass ZINIA als Datenverantwortlicher dir Marketingmitteilungen per SMS, Instant Messaging-Apps, E-Mail, Web-Push- und Pop-up-Nachrichten oder auf anderen elektronischen oder telematischen Wegen über unsere Produkte und Dienstleistungen sendet, von denen wir glauben, dass sie dich, basierend auf deinem kommerziellen Profil, das gemäß unseren internen Risikokriterien und der Konsultation externer Quellen erstellt wurde, <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">interessieren werden</a>. Du kannst deine Rechte in Bezug auf deine personenbezogenen Daten ausüben und diese Einwilligung widerrufen, indem du eine E-Mail an <a href = \"datenschutz.de@zinia.com\">datenschutz.de@zinia.com</a> sendest. Weitere Informationen findest du hier in unserer <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutz-Richtlinie</a>.",
               "sortOrder": 2,
               "required": true
             }
          ],
          "terms": [
             {
               "documentId": "terms_linkup_general",
               "title": "Allgemeine Geschäftsbedingungen",
               "text": "Ich akzeptiere die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/TermsAndConditions.pdf\">allgemeinen Geschäftsbedingungen</a> (welche die geltenden Mahngebühren im Falle eines Zahlungsverzugs angeben) und die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutzrichtlinie</a> von Zinia.",
               "sortOrder": 1,
               "required": true
             }
          ],
          "policies": [
             {
               "documentId": "privacy_linkup",
               "title": "Datenschutzrichtlinie",
               "text": "Ich habe die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutzbestimmungen</a>  gelesen und stimme diesen ausdrücklich zu. ",
               "sortOrder": 1,
               "required": true
             }
          ]
       }
    }
    """

  Scenario: Get remote terms for mapped connection
    And I use DB fixture "connection/checkout-connection/get-terms/zinia-de-bnpl"
    And I use DB fixture "legacy-api/migration-mapping"
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/{{connectionId}}/action/get-terms",
        "body": "{}"
      },
      "response": {
        "status": 201,
        "body": {
           "consents":[
              {
                 "documentId":"product_offerings",
                 "title":"Unsere Produkte und Dienstleistungen",
                 "text":"Wenn du dieses Kästchen ankreuzt, stimmst du zu, dass ZINIA als Datenverantwortlicher dir Marketingmitteilungen per SMS, Instant Messaging-Apps, E-Mail, Web-Push- und Pop-up-Nachrichten oder auf anderen elektronischen oder telematischen Wegen über unsere Produkte und Dienstleistungen sendet, von denen wir glauben, dass sie dich, basierend auf deinem kommerziellen Profil, das gemäß unseren internen Risikokriterien und der Konsultation externer Quellen erstellt wurde, <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">interessieren werden</a>. Du kannst deine Rechte in Bezug auf deine personenbezogenen Daten ausüben und diese Einwilligung widerrufen, indem du eine E-Mail an <a href = \"datenschutz.de@zinia.com\">datenschutz.de@zinia.com</a> sendest. Weitere Informationen findest du hier in unserer <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutz-Richtlinie</a>.",
                 "sortOrder":2,
                 "required":true
              }
           ],
           "terms":[
              {
                 "documentId":"terms_linkup_general",
                 "title":"Allgemeine Geschäftsbedingungen",
                 "text":"Ich akzeptiere die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/TermsAndConditions.pdf\">allgemeinen Geschäftsbedingungen</a> (welche die geltenden Mahngebühren im Falle eines Zahlungsverzugs angeben) und die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutzrichtlinie</a> von Zinia.",
                 "sortOrder":1,
                 "required":true
              }
           ],
           "policies":[
              {
                 "documentId":"privacy_linkup",
                 "title":"Datenschutzrichtlinie",
                 "text":"Ich habe die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutzbestimmungen</a>  gelesen und stimme diesen ausdrücklich zu. ",
                 "sortOrder":1,
                 "required":true
              }
           ]
        }
      }
    }
    """
    When I send a POST request to "/api/v2/payment/{{mappedConnectionId}}/terms" with json:
    """
    {}
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
       "call":{
          "status":"success",
          "type":"terms",
          "id":"*",
          "created_at":"*"
       },
       "result":{
          "consents": [
             {
               "documentId": "product_offerings",
               "title": "Unsere Produkte und Dienstleistungen",
               "text": "Wenn du dieses Kästchen ankreuzt, stimmst du zu, dass ZINIA als Datenverantwortlicher dir Marketingmitteilungen per SMS, Instant Messaging-Apps, E-Mail, Web-Push- und Pop-up-Nachrichten oder auf anderen elektronischen oder telematischen Wegen über unsere Produkte und Dienstleistungen sendet, von denen wir glauben, dass sie dich, basierend auf deinem kommerziellen Profil, das gemäß unseren internen Risikokriterien und der Konsultation externer Quellen erstellt wurde, <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">interessieren werden</a>. Du kannst deine Rechte in Bezug auf deine personenbezogenen Daten ausüben und diese Einwilligung widerrufen, indem du eine E-Mail an <a href = \"datenschutz.de@zinia.com\">datenschutz.de@zinia.com</a> sendest. Weitere Informationen findest du hier in unserer <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutz-Richtlinie</a>.",
               "sortOrder": 2,
               "required": true
             }
          ],
          "terms": [
             {
               "documentId": "terms_linkup_general",
               "title": "Allgemeine Geschäftsbedingungen",
               "text": "Ich akzeptiere die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/TermsAndConditions.pdf\">allgemeinen Geschäftsbedingungen</a> (welche die geltenden Mahngebühren im Falle eines Zahlungsverzugs angeben) und die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutzrichtlinie</a> von Zinia.",
               "sortOrder": 1,
               "required": true
             }
          ],
          "policies": [
             {
               "documentId": "privacy_linkup",
               "title": "Datenschutzrichtlinie",
               "text": "Ich habe die <a href=\"https://www.ocu.cf.zinia.com/assets/de/documents/legal/Privacy-Policy.pdf\">Datenschutzbestimmungen</a>  gelesen und stimme diesen ausdrücklich zu. ",
               "sortOrder": 1,
               "required": true
             }
          ]
       }
    }
    """
