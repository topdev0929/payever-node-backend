import {
  InfoBoxSettingsInterface,
  AccordionPanelInterface,
  PeListInterface,
  AccordionPanelsFactory,
  PeListCellFactory,
  LinkTargetTypesEnum,
  InfoBoxSettingsFactory,
} from '@pe/third-party-forms-sdk';
import { PluginFileModel, PluginModel } from '../models';

export class PluginForm {
  public static render(
    plugin: PluginModel,
    channel: string,
  ): InfoBoxSettingsInterface {
    const panels: AccordionPanelInterface[] = [];
    const data: PeListInterface = plugin.pluginFiles.map(
      (file: PluginFileModel) => ([
        PeListCellFactory.createCellValue(`Plugin(${file.version})`),
        PeListCellFactory.createCellLink(
          file.filename,
          'tpm.forms.plugins.download',
          LinkTargetTypesEnum.blank,
        ),
      ]),
    );

    data.push([
      PeListCellFactory.createCellValue(`tpm.forms.plugins.instruction`),
      PeListCellFactory.createCellLink(
        plugin.documentation,
        'tpm.forms.plugins.download',
        LinkTargetTypesEnum.blank,
      ),
    ]);

    const accordionPanel: AccordionPanelInterface = AccordionPanelsFactory.createSimpleInformationPanel(
      'tpm.forms.plugins.downloads',
      data,
    );
    
    panels.push(accordionPanel);

    return InfoBoxSettingsFactory.createAccordionInfoBox(`${channel} integration`, panels, { }, [], true);
  }
}
