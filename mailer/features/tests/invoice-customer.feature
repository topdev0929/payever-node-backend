@customer-invoice-email
Feature: Customer invoice mails
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send an invoice mail
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
        {
          "name": "payever.event.invoice.email",
          "payload": {
            "cc": [],
            "invoice": {
              "businessId": "614cb154-0323-4df0-be89-85376b9de666",
              "currency": "EUR",
              "customer": {
                "billingAddress": {
                  "isDefault": false,
                  "firstName": "Dinom",
                  "lastName": "Roman",
                  "city": "Hamburg",
                  "countryCode": "DE",
                  "phone": "01522113356",
                  "streetName": "Feldstraße",
                  "streetNumber": "344",
                  "zipCode": "31311"
                },
                "shippingAddress": {
                  "isDefault": false,
                  "firstName": "Alena",
                  "lastName": "Roman",
                  "city": "Bochum",
                  "countryCode": "DE",
                  "phone": "01522113356",
                  "streetName": "FeldsieperStraße",
                  "streetNumber": "555",
                  "zipCode": "44809"
                },
                "businessId": "614cb154-0323-4df0-be89-85376b9de666",
                "email": "test@test.com",
                "name": "Dinom Roman",
                "id": null
              },
              "deliveryFee": 0,
              "dueDate": "2019-08-10T00:00:00.000Z",
              "invoiceId": "d5325245-5f1c-47b8-a9ab-925569a33584",
              "invoiceItems": [
                {
                  "description": "item_description1",
                  "price": 19.9,
                  "quantity": 2,
                  "thumbnail": "https://openbank-wc.demo.payever.org/wp-content/uploads/2019/01/album-1.jpg",
                  "title": "Langenscheidt Wörterbuch Englisch",
                  "unit": "EACH",
                  "vatRate": 7,
                  "amount": 39.8,
                  "id": null
                },
                {
                  "description": "item_description2",
                  "price": 12.9,
                  "quantity": 1,
                  "thumbnail": "https://openbank-wc.demo.payever.org/wp-content/uploads/2019/01/beanie-2.jpg",
                  "title": "BlueRay „The Breakfast Club“",
                  "unit": "EACH",
                  "vatRate": 19,
                  "amount": 12.9,
                  "id": null
                },
                {
                  "description": "item_description3",
                  "price": 17.9,
                  "quantity": 1,
                  "thumbnail": "https://openbank-wc.demo.payever.org/wp-content/uploads/2019/01/beanie-with-logo-1.jpg",
                  "title": "BlueRay „Inception“",
                  "unit": "EACH",
                  "vatRate": 19,
                  "amount": 17.9,
                  "id": null
                }
              ],
              "issueDate": "2019-07-11T00:00:00.000Z",
              "paymentInfo": {
                "description": "",
                "values": [
                  {
                    "title": "Verwendungszweck"
                  },
                  {
                    "title": "Empfänger"
                  },
                  {
                    "title": "IBAN"
                  },
                  {
                    "title": "BIC"
                  },
                  {
                    "title": "Zahlungsziel",
                    "value": "10 Aug 2019, 03:00"
                  }
                ]
              },
              "paymentMethod": "santander_invoice_de",
              "reference": "123",
              "subtotal": 70.6,
              "total": 73.55,
              "transactionId": "96211c90-e563-4809-9091-a58b129428f0",
              "vatAmount": 7.84
            },
            "template_name": "order-invoice-template-customer",
            "to": "test@test.com"
          }
        }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Invoice",
      "html": "*<body>\n\n<table cellpadding=\"4\" style=\"width:100%;\">\n  <tbody>\n  <tr>\n    <td align=\"center\">\n\n\n      <table class=\"table\" style=\"width:1000px\">\n        <thead>\n        <tr>\n          <th align=\"left\" class=\"mail-title\">RECHNUNG</th>\n          <th align=\"right\">\n                        <img\n              src=\"https://payevertesting.blob.core.windows.net/images/undefined\"\n              class=\"logo\"\n            />\n                      </th>\n        </tr>\n        </thead>\n      </table>\n\n    </td>\n  </tr>\n  <tr>\n    <td align=\"center\">\n\n      <table class=\"table data-table\" style=\"width:1000px\">\n        <tbody>\n        <tr style=\"height:20px\" >\n          <td style=\"width:50%\">\n            <p class=\"title\">Bestellnummer</p>\n            <p class=\"value\">96211c90-e563-4809-9091-a58b129428f0</p>\n          </td>\n          <td style=\"width:50%\">\n                        <p class=\"title\">Rechnungsnumber</p>\n            <p class=\"value\">d5325245-5f1c-47b8-a9ab-925569a33584</p>\n                      </td>\n        </tr>\n\n        <tr style=\"height:20px\" >\n          <td style=\"width:50%\">\n            <p class=\"title\">Bestelldatum</p>\n            <p class=\"value\">*</p>\n            <p class=\"title\">Rechnungsdatum</p>\n            <p class=\"value\">*</p>\n          </td>\n          <td style=\"width:50%\">\n            <p class=\"title\">Rechnungsadresse</p>\n                          <p class=\"value\">Alena Roman\n                              </p>\n              <p class=\"value\">FeldsieperStraße 555</p>\n              <p class=\"value\">44809 Bochum</p>\n              <p class=\"value\">DE</p>\n                      </td>\n        </tr>\n\n\n        <tr style=\"height:20px\" >\n          <td style=\"width:50%\">\n            <p class=\"title\">Zahlung</p>\n            <p class=\"value\">\n              €73.55 Santander DE Invoice\n            </p>\n            <table class=\"detail-table\" style=\"width:435px\">\n              <tbody>\n                            <tr>\n                <td>Verwendungszweck:</td>\n                <td></td>\n              </tr>\n                            <tr>\n                <td>Empfänger:</td>\n                <td></td>\n              </tr>\n                            <tr>\n                <td>IBAN:</td>\n                <td></td>\n              </tr>\n                            <tr>\n                <td>BIC:</td>\n                <td></td>\n              </tr>\n                            <tr>\n                <td>Zahlungsziel:</td>\n                <td> 10 Aug 2019, 03:00 </td>\n              </tr>\n                            </tbody>\n            </table>\n            <p class=\"value\"></p>\n\n          </td>\n          <td style=\"width:50%\">\n            <p class=\"title\">Lieferadresse</p>\n                          <p class=\"value\">Dinom Roman\n                              </p>\n              <p class=\"value\">Feldstraße 344</p>\n              <p class=\"value\">31311 Hamburg</p>\n              <p class=\"value\">DE</p>\n                      </td>\n        </tr>\n\n        </tbody>\n      </table>\n\n    </td>\n  </tr>\n  <tr>\n    <td align=\"center\">\n\n      <table class=\"table product-table\" style=\"margin-top:30px\">\n        <tbody>\n        <tr>\n          <td colspan=\"2\" class=\"product-table-left-title\">Artikel</td>\n          <td class=\"product-table-middle-title\">Mwst</td>\n          <td class=\"product-table-middle-title\">Einzelpreis</td>\n          <td class=\"product-table-middle-title\">Anzahl</td>\n          <td class=\"product-table-right-title\">Gesamrtpreis</td>\n        </tr>\n                <!-- ITEM START -->\n        <tr>\n          <td style=\"text-align: center\">\n                        <img\n              border=\"0\"\n              src=\"https://openbank-wc.demo.payever.org/wp-content/uploads/2019/01/album-1.jpg\"\n              width=\"100\"\n              style=\"max-width:100px\"\n            />\n                      </td>\n          <td style=\"padding-left:0;\">\n            <p class=\"value\">Langenscheidt Wörterbuch Englisch</p>\n          </td>\n          <td>\n            <p class=\"value-right\">7%</p>\n          </td>\n          <td>\n            <p class=\"value-right\">€19.90</p>\n          </td>\n          <td>\n            <p class=\"value-right\">2</p>\n          </td>\n          <td>\n            <p class=\"value-right\">€39.80</p>\n          </td>\n        </tr>\n        <!-- ITEM END -->\n                <!-- ITEM START -->\n        <tr>\n          <td style=\"text-align: center\">\n                        <img\n              border=\"0\"\n              src=\"https://openbank-wc.demo.payever.org/wp-content/uploads/2019/01/beanie-2.jpg\"\n              width=\"100\"\n              style=\"max-width:100px\"\n            />\n                      </td>\n          <td style=\"padding-left:0;\">\n            <p class=\"value\">BlueRay „The Breakfast Club“</p>\n          </td>\n          <td>\n            <p class=\"value-right\">19%</p>\n          </td>\n          <td>\n            <p class=\"value-right\">€12.90</p>\n          </td>\n          <td>\n            <p class=\"value-right\">1</p>\n          </td>\n          <td>\n            <p class=\"value-right\">€12.90</p>\n          </td>\n        </tr>\n        <!-- ITEM END -->\n                <!-- ITEM START -->\n        <tr>\n          <td style=\"text-align: center\">\n                        <img\n              border=\"0\"\n              src=\"https://openbank-wc.demo.payever.org/wp-content/uploads/2019/01/beanie-with-logo-1.jpg\"\n              width=\"100\"\n              style=\"max-width:100px\"\n            />\n                      </td>\n          <td style=\"padding-left:0;\">\n            <p class=\"value\">BlueRay „Inception“</p>\n          </td>\n          <td>\n            <p class=\"value-right\">19%</p>\n          </td>\n          <td>\n            <p class=\"value-right\">€17.90</p>\n          </td>\n          <td>\n            <p class=\"value-right\">1</p>\n          </td>\n          <td>\n            <p class=\"value-right\">€17.90</p>\n          </td>\n        </tr>\n        <!-- ITEM END -->\n                </tbody>\n      </table>\n\n    </td>\n  </tr>\n  <tr>\n    <td align=\"center\">\n\n      <table class=\"table total-table-wrapper\">\n        <tbody>\n        <tr align=\"right\">\n          <td>\n            <table class=\"total-table\">\n              <tbody>\n              <tr>\n                <td>\n                  <p class=\"total-table-title\">Zwischensumme</p>\n                </td>\n                <td>\n                  <p class=\"value-right\">€70.60</p>\n                </td>\n              </tr>\n              <tr>\n                <td>\n                  <p class=\"total-table-title\">Versandkosten</p>\n                </td>\n                <td>\n                  <p class=\"value-right\">€0.00</p>\n                </td>\n              </tr>\n              <tr>\n                <td>\n                  <p class=\"total-table-title\">Mehrwertsteuer</p>\n                </td>\n                <td>\n                  <p class=\"value-right\">€7.84</p>\n                </td>\n              </tr>\n              <tr>\n                <td>\n                  <p class=\"total-table-title\">Gesamtbetrag</p>\n                </td>\n                <td>\n                  <p class=\"value-right\" style=\"font-weight:500;\">€73.55</p>\n                </td>\n              </tr>\n              </tbody>\n            </table>\n          </td>\n        </tr>\n        </tbody>\n      </table>\n\n    </td>\n  </tr>\n  <tr>\n    <td align=\"center\">\n\n      <table cellpadding=\"4\" style=\"width:800px;margin-bottom:50px\">\n        <tbody>\n        <tr>\n          <td align=\"center\">\n            <table class=\"table\">\n              <tbody>\n              <tr align=\"center\">Sofern nicht gesondert angegeben, entspricht das Leistungs- bzw. Lieferdatum dem Rechnungsdatum.  Sollten  Sie  noch  nicht  bezahlt  haben,  finden  Sie  oben  im  Abschnitt  Zahlung  die  Überweisungsdaten  und  einen Verwendungszweck, den Sie bitte bei Ihrer Überweisung immer mit angeben. Sollten sich in diesem Abschnitt keine Überweisungsdaten bzw. Anweisungen zur Zahlung befinden, wurde der Betrag bereits in Gänze bezahlt.</tr>\n              <tr align=\"center\">\n                <td>\n                  <p class=\"bottom-description\">\n                    Test Business\n                                        * LEGAL_FORM_AG\n                                                                                     * Marthastraße 31\n                                                                   * 90482\n                                                                   * Nürnberg\n                                                                   * DE\n                                                                   * 12341234\n                                                            </p>\n                </td>\n              </tr>\n              <tr align=\"center\">\n                <td align=\"center\" class=\"border-none\">\n                  <a href=\"https://getpayever.com/\" target=\"_blank\" rel=\"noopener noreferrer\">*"
    }
    """
