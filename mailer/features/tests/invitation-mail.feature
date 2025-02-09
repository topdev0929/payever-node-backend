@staff-invitation
Feature: Send staff invitation
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send a staff invitation mail en
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "614cb154-0323-4df0-be89-85376b9de666",
          "subject": "",
          "templateName": "staff_invitation_new",
          "to": "arwfpst@qwfp.com",
          "variables": {
            "staff_invitation": {
              "link": "link"
            }
          }
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "You’ve been invited to payever",
      "html": "*<p>The business Test Business invites you to join their payever company account.</p>\n          <p>To get access, please click the link below and assign a password. </p>\n          <p> <a class=\"button-black-rounded\"style=\"text-decoration: none;display: inline-block;padding: 8px 8px;border-radius: 6px;color: #0084ffff;border: 1px solid #0084ffff;\" href=\"link\" target=\"_blank\">Activate access now</a></p>\n          <p> Afterwards you can log in again any time using your email-address and the password you assigned. </p>\n          <p>Please understand that it is up to your company account's admin to decide which areas you can access and which permissions you have, therefore you may not have acess to all area or you may be unabled to complete certain actions. If in doubt, please contact your admin Test.  </p>*"
    }
    """
    And a mail with the following data should not be sent:
    """
    {
      "from": "bill@gates.com"
    }
    """

  Scenario: Send a staff invitation mail de
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "b3d5f17b-1bda-47cf-a752-7dc3fe0f6f0b",
          "locale": "de",
          "subject": "",
          "templateName": "staff_invitation_new",
          "to": "arwfpst@qwfp.com",
          "variables": {
            "staff_invitation": {
              "link": "link"
            }
          }
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Sie wurden zu payever eingeladen",
      "html": "*<p> Die Organisation boehm Reichenbach lädt Sie ein, ihrem Unternehmens-Account bei payever beizutreten.</p>\n          <p>Um Zugang zu erhalten, klicken Sie auf den untenstehend Link und legen Sie dort Ihr persönliches Passwort fest. Mit diesem Passwort und Ihrer Email-Adresse können Sie sich später jederzeit wieder einloggen! </p>\n  <p> <a class=\"button-black-rounded\"style=\"text-decoration: none;display: inline-block;padding: 8px 8px;border-radius: 6px;color: #0084ffff;border: 1px solid #0084ffff;\" href=\"link\" target=\"_blank\">Jetzt Zugang aktivieren</a></p>     </p>\n          <p>Bitte beachten Sie, dass der Admin der Organisation entscheidet, welche Zugangsrechte zu welchen Bereichen Sie erhalten. Daher sehen Sie in Ihrem Account ggf. nicht alle Inhalte oder können bestimmt Aktionen nicht durchführen.  Im Zweifelsfall kontaktieren Sie daher bitte zunächst Ihren Admin Test.</p>*"
    }
    """
