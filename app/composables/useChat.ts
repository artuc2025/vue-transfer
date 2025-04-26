import type { Chat, ChatMessage } from "~/types";
import { MOCK_CHAT } from "./mockData";

export default function useChat() {
  const chat = ref<Chat>(MOCK_CHAT);
  const messages = computed(() => chat.value.messages);

  function createMessage(message: string, role: ChatMessage["role"]) {
    const id = messages.value.length.toString();
    return {
      id,
      role,
      content: message,
    };
  }

  function sendMessage(message: string) {
    messages.value.push(createMessage(message, "user"));
    setTimeout(() => {
      messages.value.push(
        createMessage(`This is a response to: ${message}`, "assistant")
      );
    }, 1000);
  }

  return {
    chat,
    messages,
    sendMessage,
  };
}
