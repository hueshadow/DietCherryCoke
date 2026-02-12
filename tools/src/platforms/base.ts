export interface PublishResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface LinkStatus {
  url: string;
  alive: boolean;
  statusCode?: number;
  checkedAt: string;
}

export interface Draft {
  status: string;
  platform: string;
  source: string;
  targetUrl: string;
  language: string;
  anchors: { text: string; type: string; url: string }[];
  title: string;
  body: string;
  filePath: string;
}

export abstract class Platform {
  abstract name: string;
  abstract type: 'api' | 'playwright';

  abstract publish(draft: Draft): Promise<PublishResult>;
  abstract checkLink(url: string): Promise<LinkStatus>;

  protected now(): string {
    return new Date().toISOString();
  }
}
