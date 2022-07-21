declare module 'assertthat-bdd' {
    export type Parameters = {
      accessKey: string;
      secretKey: string;
      jiraServerUrl?: string;
      projectId: string;
      mode?: string;
      tags?: string;
      outputFolder?: string;
      jql?: string;
      numbered?: boolean;
      proxyURI?: string;
    };
  
    export function downloadFeatures(
      options: Parameters,
      callback: Function,
    ): void;

    export function uploadReports(
      options: Parameters,
      callback: Function,
    ): void;
  }
  