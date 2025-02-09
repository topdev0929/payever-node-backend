export class servicesFixture {
  public static getChannelService(): any {
    return {
      findOneByType: (): void => {
        '';
      },
      create: (): void => {
        '';
      },
    };
  }
  public static getAbstractChannelSetService(): any {
    return {
      create: (): void => {
        '';
      },
    };
  }
  public static getChannelEventMessagesProducer(): any {
    return {
      sendChannelSetNamedByApplication: (): void => {
        '';
      },
    };
  }
  public static getTerminalRabbitEventsProducer(): any {
    return {
      setDefaultTerminalEvent: (): void => {
        '';
      },
    };
  }
  public static getEventDispatcher(): any {
    return {
      dispatch: (): void => {
        '';
      },
    };
  }
  public static getTerminalAccessConfigService(): any {
    return {
      createOrUpdate: (): void => {
        '';
      },
    };
  }
}
