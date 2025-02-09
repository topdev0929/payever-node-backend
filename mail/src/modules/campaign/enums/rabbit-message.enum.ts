export enum RabbitMessage {
  CampaignCreated = 'marketing.event.campaign.created',
  ApplicationCreated = 'event.application.created',
  CampaignCreationDone = 'marketing.event.campaign-creation.done',
  CampaignRemoved = 'marketing.event.campaign.removed',
  ApplicationRemoved = 'event.application.removed',
  CampaignCronAdd = 'marketing.event.cron.add',
  CampaignSend = 'marketing.event.campaign.send',
}
