export enum TerminalRabbitEventNamesEnum {
  terminalCreated = 'pos.event.terminal.created',
  terminalUpdated = 'pos.event.terminal.updated',
  terminalRemoved = 'pos.event.terminal.removed',
  terminalExport = 'pos.event.terminal.export',
  terminalDefaultThemeRequested = 'pos.event.terminal.default-theme-requested',
  domainUpdated = 'pos.event.domain.updated',

  setDefaultTerminal = 'pos.event.terminal.set_default',
  exportTerminalChannelSet = 'channels.event.channel-set.exported',

  channelName = 'async_events_pos_micro',
}
