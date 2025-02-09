export enum RpcRabbitEventsEnum {
  AuthRpcCreateUser = 'auth.rpc.user.create',
  AuthRpcAssignAbsolutePermissions = 'auth.rpc.user.assign-absolute-permissions',
  AuthRpcResetPasswrod = 'auth.rpc.user.reset-password',

  AuthRpcGetClients = 'auth.rpc.oauth.clients',
  AuthRpcCreateClient = 'auth.rpc.oauth.create-client',

  CommerceOSRpcInstallOnboardingApps = 'apps.rpc.apps.install-onboarding-apps',

  ConnectRpcInstallIntegration = 'connect.rpc.integration-subscriptions.install',
  ConnectRpcUninstallIntegration = 'connect.rpc.integration-subscriptions.uninstall',

  ThirdPartyPaymentsRpcIntegrationAction = 'third-party-payments.rpc.integration-action.action',
  ThirdPartyPaymentsRpcIntegrationForm = 'third-party-payments.rpc.integration-action.form',

  UsersRpcCreateBusiness = 'users.rpc.business.create',
  UsersRpcDeleteBusiness = 'users.rpc.business.delete',
}
