export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  id: string;
}

export interface Chat {
  messages: ChatMessage[];
  title: string;
  id: string;
}
