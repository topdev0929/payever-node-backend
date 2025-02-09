export class AppNameConverter {
  public static toNotificationsAppName(appName: string): string {
    if (appName === 'shop') {
      return 'shops';
    }

    return appName;
  }
}
