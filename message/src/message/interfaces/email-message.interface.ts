export interface EmailMessageInterface {
  business: {
    id: string;
  };
  email: EmailMessageContentInterface ;
}

export interface EmailMessageResInterface {
  business: {
    id: string;
  };
  email: EmailResultInterface;
}

export interface EmailMessageContentInterface {
  to: {
    address: string;
    name: string;
  };
  replayTo: string;
  messageId: string;
  from: {
    address: string;
    name: string;
  };
  date: string;
  subject: string;
  attachments: any[];
  content: string;
  contentAsHtml: string;
}

export interface EmailResultInterface {
  accepted: string[];
  rejected: string[];
  ehlo: string[];
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: {
      from: string;
      to: string[];
  };
  messageId: string;
  chatMessageId?: string;
}
