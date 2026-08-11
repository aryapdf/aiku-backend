import { messageRepository } from '../repositories'
import type { SendMessageInput } from '../types'

export const chatService = {
  async sendMessage(input: SendMessageInput & { userId: string }) {
    // Save user message
    const userMsg = await messageRepository.create(input.conversationId, 'user', input.content)

    // Simulate AI response
    const aiContent = `Echo: ${input.content}`
    const aiMsg = await messageRepository.create(input.conversationId, 'assistant', aiContent)

    return { userMessage: userMsg, assistantMessage: aiMsg }
  },

  async *streamMessage(input: SendMessageInput & { userId: string }) {
    // Save user message
    await messageRepository.create(input.conversationId, 'user', input.content)

    yield { type: 'message_start' as const, conversationId: input.conversationId }

    // Simulated streaming
    const words = `This is a simulated response to: "${input.content}"`.split(' ')
    for (const word of words) {
      yield {
        type: 'content_block_delta' as const,
        delta: { type: 'text_delta' as const, text: word + ' ' },
      }
    }

    const aiMsg = await messageRepository.create(
      input.conversationId,
      'assistant',
      `This is a simulated response to: "${input.content}"`,
    )

    yield { type: 'message_stop' as const, messageId: aiMsg.id }
  },

  async getMessages(conversationId: string) {
    return messageRepository.findByConversationId(conversationId)
  },
}
