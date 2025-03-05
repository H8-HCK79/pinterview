export {};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GsiClientConfig) => void;
          renderButton: (
            element: HTMLElement | null,
            options: GsiButtonConfig
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export interface GsiClientConfig {
  client_id: string;
  callback: (response: CredentialResponse) => void;
}

export interface CredentialResponse {
  credential: string; // The JWT token returned by Google
  select_by?: "auto" | "user" | "btn" | "btn_confirm" | "btn_add_session";
}

export interface GsiButtonConfig {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "small" | "medium" | "large";
}
