import { ApplicationThemePublishedDto } from '../../../src/templating/dto'
import { ApplicationTypesEnum } from '../../../src/templating/enums'

export class applicationThemeFixture {
  
  public static getApplicationThemeDTO(): ApplicationThemePublishedDto {
    return {
      id: 'applicationThemeId',
      isDeployed: true,
      application: {
        id: 'applicationId',
        type: ApplicationTypesEnum.Blog
      },
      theme: {
        id: 'themeId'
      },
      compiled: {
        theme: 'compiledTheme',
        themePages: [
          {
            _id: '1'
          },
          {
            _id: '2'
          }
        ]
      }
    }
  }
}
