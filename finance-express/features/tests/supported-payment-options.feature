@supported-payment-options
Feature: Supported payment options
  Background:
  Scenario: Get supported payment options
    When I send a GET request to "/api/supported-payment-options"
    Then print last response
    And the response should contain json:
    """
    [
      "santander_installment",
      "santander_factoring_de",
      "santander_installment_dk",
      "santander_installment_no",
      "santander_installment_se",
      "santander_installment_uk",
      "santander_installment_at",
      "santander_installment_nl"
    ]
    """
