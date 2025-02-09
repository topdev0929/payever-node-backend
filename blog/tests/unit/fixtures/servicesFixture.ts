export class servicesFixture {
  public static getBlogService(): any {
    return {
      findOneById: (): void => {
        '';
      },
      updateCommentsCount: (): void => {
        '';
      },
    };
  }
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
  public static getBlogRabbitEventsProducer(): any {
    return {
      setDefaultBlogEvent: (): void => {
        '';
      },
      blogCreated: (): void => {
        '';
      },
      blogRemoved: (): void => {
        '';
      },
      blogUpdated: (): void => {
        '';
      },
    };
  }
  public static getCommentRabbitEventsProducer(): any {
    return {
      setDefaultBlogEvent: (): void => {
        '';
      },
      commentCreated: (): void => {
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
  public static getApplicationThemeService(): any {
    return {
      removeByBlogId: (): void => {
        '';
      },
      updateByCondition: (): void => {
        '';
      },
    };
  }
  public static getCompiledThemeService(): any {
    return {
      findById: (): void => {
        '';
      },
      removeByBlogId: (): void => {
        '';
      },
      create: (): void => {
        '';
      },
    };
  }
  public static getBlogPageService(): any {
    return {
      removeByCompiledTheme: (): void => {
        '';
      },
      create: (): void => {
        '';
      },
    };
  }
  public static getBlogAccessConfigService(): any {
    return {
      createOrUpdate: (): void => {
        '';
      },
    };
  }
}
