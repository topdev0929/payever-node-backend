import { MainPanelView } from '../views/main-panel.view';
import { ApiProperty } from '@nestjs/swagger';

export class SettingsFormReponseDto {
  @ApiProperty({ required: true })
  public form: MainPanelView;
}
