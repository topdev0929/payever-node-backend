export enum RabbitBinding {
  OnboardingTaskCreated = 'onboarding.event.task.created',
  OnboardingTaskProcessed = 'onboarding.event.task.processed',
  OnboardingGenerateTaskReport = 'onboarding.event.generate.task-report',
  OnboardingProcessBulkImport = 'onboarding.event.process.bulk-import',

  OnboardingSetupBusiness = 'onboarding.event.setup.business',
  OnboardingSetupApps = 'onboarding.event.setup.apps',
  OnboardingSetupWallpaper = 'onboarding.event.setup.wallpaper',
  OnboardingSetupToggleInstall = 'onboarding.event.toggle-install',
  OnboardingSetupCheckout = 'onboarding.event.setup.checkout',
  OnboardingSetupPos = 'onboarding.event.setup.pos',
  OnboardingSetupConnect = 'onboarding.event.setup.connect',
  OnboardingSetupQr = 'onboarding.event.setup.qr',
  OnboardingSetupDevicePayments = 'onboarding.event.setup.device-payments',

  ThirdPartyCommunicationPendingIntegrationAction = 'third-party-communications.pending-integration-action.action',
  ThirdPartyPaymentsPendingIntegrationAction = 'third-party-payments.pending-integration-action.action',
  RpcThirdPartyPaymentsIntegrationAction = 'third-party-payments.rpc.integration-action.action',
}
