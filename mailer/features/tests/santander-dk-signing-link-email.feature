@santander-dk
Feature: Santander DK signing link eails
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send signing link in da locale
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.payment.email",
        "payload": {
          "cc": [],
          "customer": {
            "email": "mailer@mail.com",
            "name": "Marius Gudynas"
          },
          "business": {
            "company_name": "Denmark",
            "id": "c49b75b2-f0a2-4f0c-abcf-ad43a90ba2c1",
            "slug": "c49b75b2-f0a2-4f0c-abcf-ad43a90ba2c1",
            "uuid": "c49b75b2-f0a2-4f0c-abcf-ad43a90ba2c1",
            "companyAddress": {
              "country": "DK"
            },
            "name": "Denmark",
            "companyDetails": {},
            "contactDetails": {},
            "user_full_name": "Dmytro Romanenko"
          },
          "payment": {
            "delivery_fee": 0,
            "payment_fee": 0,
            "id": "088e18fb-5fa3-4658-a68f-16b095de0888",
            "uuid": "088e18fb-5fa3-4658-a68f-16b095de0888",
            "amount": 10000,
            "address": {
              "city": "Hamburg",
              "country": "DK",
              "country_name": "DK",
              "email": "mailer@mail.com",
              "first_name": "STUB",
              "last_name": "ACCEPTED",
              "phone": null,
              "salutation": "SALUTATION_MR",
              "street": "Straßburger 5",
              "zip_code": "22049"
            },
            "channel": "link",
            "channel_set_id": "dda0557d-9fa6-48d3-b2d5-53827cbd1648",
            "created_at": "2022-12-02T08:05:28+00:00",
            "currency": "SEK",
            "customer_email": "mailer@mail.com",
            "customer_name": "Marius Gudynas",
            "down_payment": 0,
            "payment_type": "santander_pos_installment_dk",
            "reference": "TEST",
            "shipping_address": null,
            "specific_status": "SIGNED",
            "status": "STATUS_ACCEPTED",
            "total": 10000,
            "updated_at": "2022-12-02T08:05:28+00:00",
            "business": {
              "company_name": "Denmark",
              "id": "c49b75b2-f0a2-4f0c-abcf-ad43a90ba2c1",
              "slug": "c49b75b2-f0a2-4f0c-abcf-ad43a90ba2c1",
              "uuid": "c49b75b2-f0a2-4f0c-abcf-ad43a90ba2c1",
              "companyAddress": {
                "country": "DK"
              },
              "name": "Denmark",
              "companyDetails": {},
              "contactDetails": {},
              "user_full_name": "Dmytro Romanenko"
            }
          },
          "payment_details": {
            "application_number": "stub_application_number",
            "marketing_consent": false,
            "debtor_id": "stub_debtor_id",
            "product_id": "2",
            "wants_safe_insurance": false,
            "frontend_success_url": null,
            "frontend_failure_url": null,
            "was_cpr_processed": true,
            "was_tax_processed": false,
            "document_id": 0
          },
          "payment_items": [],
          "template_name": "santander_dk_payment_send_signing_link",
          "to": "mailer@mail.com",
          "variables": {
            "applicationNumber": "stub_application_number",
            "signingLink": "https://preprod.santanderconsumer.dk/_Layouts/15/SCBDK.Cards.Branding/ContinueFlow.aspx?applicationId=stub_application_number"
          },
          "merchant": {
            "name": "Dmytro Romanenko",
            "email": ""
          },
          "locale": "da",
          "applicationNumber": "stub_application_number",
          "signingLink": "https://preprod.santanderconsumer.dk/_Layouts/15/SCBDK.Cards.Branding/ContinueFlow.aspx?applicationId=stub_application_number"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Din anmodning om afdragslån stub_application_number",
      "html":"*<p>Kære STUB ACCEPTED,</p>\n<p>Din låneansøgning er godkendt og lånekontrakten er nu klar til at blive underskrevet!</p>\n<p>Klik på linket nedenfor for at underskrive din kontrakt digitalt:</p>\n<table class=\"body-buttons-table\" style=\"margin-top: 0px; margin-bottom: 20px\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" valign=\"top\" width=\"30%\">\n  <tbody>\n  <tr align=\"left\">\n    <td align=\"center\" class=\"border-none body-button\">\n      <a class=\"body-button-bordered\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://preprod.santanderconsumer.dk/_Layouts/15/SCBDK.Cards.Branding/ContinueFlow.aspx?applicationId=stub_application_number\">Link</a>\n    </td>\n  </tr>\n  </tbody>\n</table>\n<p>Hvis du allerede har underskrevet kontrakten, bedes du ignorere denne besked.</p>*"
    }
    """
