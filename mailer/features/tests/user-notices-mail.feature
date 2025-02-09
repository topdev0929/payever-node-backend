@user-notices-mails
Feature: User notices mails
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send a mail about new user registered
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "en",
          "params": {
            "user": {
              "email": "rob2@intveld.com",
              "firstName": "Rob",
              "isActive": false,
              "isVerified": false,
              "lastName": "Intveld",
              "logo": "78ca2e67-4660-408b-9bf7-0687e9940208",
              "roles": [],
              "secondFactorRequired": false
            },
            "userInfo": {
              "registrationOrigin": {
                "account": "merchant",
                "url": "https://commerceos.test.devpayever.com/entry/registration/business"
              }
            }
          },
          "subject": "New user registered",
          "to": "admin@email.com",
          "type": "admin_registration_notice"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "New user registered",
      "html":"*<table border=\"0\" cellpadding=\"5\">\n            <tr>\n            <th>First Name:</th>\n            <td>Rob</td>\n        </tr>\n                <tr>\n            <th>Last Name:</th>\n            <td>Intveld</td>\n        </tr>\n        <tr>\n        <th>Email:</th>\n        <td>rob2@intveld.com</td>\n    </tr>\n                                        <tr>\n                    <th>Registration account:</th>\n                    <td>merchant</td>\n                </tr>\n                                        <tr>\n                    <th>Registration URL:</th>\n                    <td><a href=\"https://commerceos.test.devpayever.com/entry/registration/business\">https://commerceos.test.devpayever.com/entry/registration/business</a></td>\n                </tr>\n                        </table>*"
    }
    """

  Scenario: Send a mail about new business registered en
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "en",
          "params": {
            "business": {
              "name": "Umbrella Inc.",
              "companyDetails": {
                "businessStatus": "REGISTERED_BUSINESS",
                "product": "BUSINESS_PRODUCT_GIDITAL_GOODS",
                "industry": "BRANCHE_SOFTWARE",
                "phone": "+49412331244",
                "status": "BUSINESS_STATUS_TURN_EXISTING",
                "salesRange": {
                  "min": 0,
                  "max": 5000
                }
              }
            },
            "trafficSource": {
              "campaign": "c1",
              "content": "c2",
              "medium": "m1",
              "source": "s1"
            },
            "user": {
              "userAccount": {
                "firstName": "Rob",
                "lastName": "Intveld",
                "email": "rob2@intveld.com",
                "registrationOrigin": {
                  "account": "merchant",
                  "url": "https://commerceos.test.devpayever.com/entry/registration/business"
                }
              }
            }
          },
          "subject": "New business registered",
          "to": "admin@email.com",
          "type": "admin_new_business_notice"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "New business registered",
      "html":"*<table border=\"0\" cellpadding=\"5\">\n    <tr>\n        <th>Business Name:</th>\n        <td>Umbrella Inc.</td>\n    </tr>\n        <tr><td colspan=\"2\"><hr></td></tr>\n                        <tr>\n                <th>First Name:</th>\n                <td>Rob</td>\n            </tr>\n                            <tr>\n                <th>Last Name:</th>\n                <td>Intveld</td>\n            </tr>\n                            <tr>\n                <th>Email:</th>\n                <td>rob2@intveld.com</td>\n            </tr>\n                    <tr><td colspan=\"2\"><hr></td></tr>\n                            <tr><td colspan=\"2\"><hr></td></tr>\n            <tr>\n                <th>Registration account:</th>\n                <td>merchant</td>\n            </tr>\n            <tr>\n                <th>Registration URL:</th>\n                <td><a href=\"https://commerceos.test.devpayever.com/entry/registration/business\">https://commerceos.test.devpayever.com/entry/registration/business</a></td>\n            </tr>\n                                    <tr>\n                <th>Source:</th>\n                <td>s1</td>\n            </tr>\n                            <tr>\n                <th>Medium:</th>\n                <td>m1</td>\n            </tr>\n                            <tr>\n                <th>Campaign:</th>\n                <td>c1</td>\n            </tr>\n                            <tr>\n                <th>Content:</th>\n                <td>c2</td>\n            </tr>\n            </table>*"
    }
    """
  Scenario: Send a mail about new business registered with max only value in sales range en
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "en",
          "params": {
            "business": {
              "name": "Umbrella Inc.",
              "companyDetails": {
                "businessStatus": "REGISTERED_BUSINESS",
                "product": "BUSINESS_PRODUCT_GIDITAL_GOODS",
                "industry": "BRANCHE_SOFTWARE",
                "phone": "+49412331244",
                "status": "BUSINESS_STATUS_TURN_EXISTING",
                "salesRange": {
                  "max": 5000
                }
              }
            },
            "trafficSource": {
              "campaign": "c1",
              "content": "c2",
              "medium": "m1",
              "source": "s1"
            },
            "user": {
              "userAccount": {
                "firstName": "Rob",
                "lastName": "Intveld",
                "email": "rob2@intveld.com",
                "registrationOrigin": {
                  "account": "merchant",
                  "url": "https://commerceos.test.devpayever.com/entry/registration/business"
                }
              }
            }
          },
          "subject": "New business registered",
          "to": "admin@email.com",
          "type": "admin_new_business_notice"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "New business registered",
      "html":"*<table border=\"0\" cellpadding=\"5\">\n    <tr>\n        <th>Business Name:</th>\n        <td>Umbrella Inc.</td>\n    </tr>\n        <tr><td colspan=\"2\"><hr></td></tr>\n                        <tr>\n                <th>First Name:</th>\n                <td>Rob</td>\n            </tr>\n                            <tr>\n                <th>Last Name:</th>\n                <td>Intveld</td>\n            </tr>\n                            <tr>\n                <th>Email:</th>\n                <td>rob2@intveld.com</td>\n            </tr>\n                    <tr><td colspan=\"2\"><hr></td></tr>\n                            <tr><td colspan=\"2\"><hr></td></tr>\n            <tr>\n                <th>Registration account:</th>\n                <td>merchant</td>\n            </tr>\n            <tr>\n                <th>Registration URL:</th>\n                <td><a href=\"https://commerceos.test.devpayever.com/entry/registration/business\">https://commerceos.test.devpayever.com/entry/registration/business</a></td>\n            </tr>\n                                    <tr>\n                <th>Source:</th>\n                <td>s1</td>\n            </tr>\n                            <tr>\n                <th>Medium:</th>\n                <td>m1</td>\n            </tr>\n                            <tr>\n                <th>Campaign:</th>\n                <td>c1</td>\n            </tr>\n                            <tr>\n                <th>Content:</th>\n                <td>c2</td>\n            </tr>\n            </table>*"
    }
    """
  Scenario: Send a mail about new business registered without sales range en
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "en",
          "params": {
            "business": {
              "name": "Umbrella Inc.",
              "companyDetails": {
                "businessStatus": "REGISTERED_BUSINESS",
                "product": "BUSINESS_PRODUCT_GIDITAL_GOODS",
                "industry": "BRANCHE_SOFTWARE",
                "phone": "+49412331244",
                "status": "BUSINESS_STATUS_TURN_EXISTING"
              }
            },
            "trafficSource": {
              "campaign": "c1",
              "content": "c2",
              "medium": "m1",
              "source": "s1"
            },
            "user": {
              "userAccount": {
                "firstName": "Rob",
                "lastName": "Intveld",
                "email": "rob2@intveld.com",
                "registrationOrigin": {
                  "account": "merchant",
                  "url": "https://commerceos.test.devpayever.com/entry/registration/business"
                }
              }
            }
          },
          "subject": "New business registered",
          "to": "admin@email.com",
          "type": "admin_new_business_notice"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "attachments": [],
      "subject": "New business registered",
      "html":"*<table border=\"0\" cellpadding=\"5\">\n    <tr>\n        <th>Business Name:</th>\n        <td>Umbrella Inc.</td>\n    </tr>\n        <tr><td colspan=\"2\"><hr></td></tr>\n                        <tr>\n                <th>First Name:</th>\n                <td>Rob</td>\n            </tr>\n                            <tr>\n                <th>Last Name:</th>\n                <td>Intveld</td>\n            </tr>\n                            <tr>\n                <th>Email:</th>\n                <td>rob2@intveld.com</td>\n            </tr>\n                    <tr><td colspan=\"2\"><hr></td></tr>\n                            <tr><td colspan=\"2\"><hr></td></tr>\n            <tr>\n                <th>Registration account:</th>\n                <td>merchant</td>\n            </tr>\n            <tr>\n                <th>Registration URL:</th>\n                <td><a href=\"https://commerceos.test.devpayever.com/entry/registration/business\">https://commerceos.test.devpayever.com/entry/registration/business</a></td>\n            </tr>\n                                    <tr>\n                <th>Source:</th>\n                <td>s1</td>\n            </tr>\n                            <tr>\n                <th>Medium:</th>\n                <td>m1</td>\n            </tr>\n                            <tr>\n                <th>Campaign:</th>\n                <td>c1</td>\n            </tr>\n                            <tr>\n                <th>Content:</th>\n                <td>c2</td>\n            </tr>\n            </table>*"
    }
    """
  Scenario: Send a mail with reset password link en
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "en",
          "params": {
            "locale": "en",
            "password_reset_url": "password_reset_url"
          },
          "subject": "Reset Password",
          "to": "admin@email.com",
          "type": "passwordReset"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Reset Password",
      "html":"*<p><b>Reset Your Password</b></p>\n<p>You are receiving this because you have requested a password reset  for your payever account. Please click on the following link, or paste this into your browser, to set a new password:</p>\n<p><a class=\"body-button-bordered\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"password_reset_url\">Reset Password</a></p>\n<p>If neither you nor any other authorized person in your organization have request a password reset, please ignore this email (your password will remain unchanged).</p>\n*"
    }
    """

  Scenario: Send a mail with reset password link de
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "de",
          "params": {
            "locale": "de",
            "password_reset_url": "password_reset_url"
          },
          "subject": "Reset Password",
          "to": "admin@email.com",
          "type": "passwordReset"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Reset Password",
      "html":"*<p><b>Passwort Zurücksetzen</b></p>\n<p>Sie erhalten diese Nachricht, weil Sie kürzlich das Zurücksetzen Ihres Passworts für Ihren payever Account angefordert haben. Bitte klicken Sie auf den untenstehenden Link, um ein neues Passwort zu vergeben.</p>\n<p><a class=\"body-button-bordered\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"password_reset_url\">Passwort Zurücksetzen</a></p>\n<p>Falls weder Sie noch sonst jemand in Ihrer Organisation einen Passwort-Reset angefragt haben, ignorieren Sie bitte diese Nachricht.</p>\n*"
    }
    """

  Scenario: Send a mail with password set link en
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "en",
          "params": {
            "locale": "en",
            "password_set_url": "password_set_url"
          },
          "subject": "payever account password set",
          "to": "admin@email.com",
          "type": "passwordSet"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "payever account password set",
      "html": "*<p><b>Set A New Password</b></p>\n<p>You are receiving this because you have registered in Payever. Please click on the following link, or paste this into your browser to complete the process (link is valid for 24 hours):</p>\n<p><a href=\"password_set_url\">password_set_url</a></p>\n<p>If you did not request this, please ignore this email.</p>*"
    }
    """

  Scenario: Send a mail with password set link en
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "en",
          "params": {
            "locale": "en",
            "verificationLink": "verificationLink"
          },
          "subject": "Welcome to payever - just one more step!",
          "to": "admin@email.com",
          "type": "registerConfirmation"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Welcome to payever - just one more step!",
      "html": "*<p>Welcome to payever!</p>\n<p>We&rsquo;re on a mission to make commerce simpler, more pleasant and more fun.</p>\n<p>To get started, we need to confirm your email address, so please click this link to finish creating your account:</p>\n<p><a href=\"verificationLink\">Confirm your email address</a></p>\n<p>We welcome your feedback, ideas and suggestions.\n  We really want to make your life easier, so if we&rsquo;re falling short or should be doing something different, we want to hear about it.\n  Send us an email at support@payever.de.</p>\n<p>Thanks!</p>*"
    }
    """

  Scenario: Send a mail with password set link local de without de template, en should be sent
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "de",
          "params": {
            "locale": "de",
            "verificationLink": "verificationLink"
          },
          "to": "admin@email.com",
          "type": "registerConfirmation"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Willkommen bei payever - bestätigen Sie Ihren Account!",
      "html": "*<p>Vielen Dank für Ihre Registrierung bei payever!</p>\n<p>Bitte bestätigen Sie Ihre Email-Adresse, indem Sie auf den folgenden Link klicken:</p>\n<p><a href=\"verificationLink\">Email-Adresse bestätigen</a></p>\n<p>Wenn Sie Fragen oder Anregungen haben, kontaktieren Sie uns gerne jederzeit unter support@payever.de.</p>\n<p>Vielen Dank!</p>*"
    }
    """
