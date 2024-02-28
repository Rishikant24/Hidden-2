import OpenAI from 'openai';

/**
 * Class representing a response handler for GPT-3.5 and GPT-4 models.
 */
export class GPTResponse {
  private openai: OpenAI;

  constructor(openAIApiKey: string) {
    this.openai = new OpenAI({ apiKey: openAIApiKey });
  }

  // Chat completion for GPT3.5
  async getGptResponse(prompt: string): Promise<string | null> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-3.5-turbo',
    };
    try {
      const chatCompletion: OpenAI.Chat.ChatCompletion = await this.openai.chat.completions.create(params);
      return chatCompletion.choices[0].message.content;
    } catch (error) {
      console.log('GPT FAIL');
      console.error(error);
      return null;
    }
  }

  // Chat completion for GPT4
  async getGpt4Response(prompt: string): Promise<string | null> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-4-1106-preview',
    };
    try {
      const chatCompletion: OpenAI.Chat.ChatCompletion = await this.openai.chat.completions.create(params);
      return chatCompletion.choices[0].message.content;
    } catch (error) {
      console.log('GPT4 FAIL');
      console.error(error);
      return null;
    }
  }
}
