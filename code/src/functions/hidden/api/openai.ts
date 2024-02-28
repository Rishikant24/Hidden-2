import OpenAI from 'openai';

export class GPTResponse {

  private openai: OpenAI;

  // Constructor to initialize SDK instances
  constructor(openAIApiKey: string) {
    this.openai = new OpenAI({apiKey: openAIApiKey});
  }

  // Chat completion.
  async getGptResponse(prompt: string): Promise<string | null> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-3.5-turbo',
    };
    try{
      const chatCompletion: OpenAI.Chat.ChatCompletion = await this.openai.chat.completions.create(params);
      //console.log(chatCompletion.choices[0]);
      console.log("GPT3.5 Successful");
      return chatCompletion.choices[0].message.content;
    }
    catch (error) {
      console.log("GPT FAIL")
      console.error(error);
      return null;
    }
  }

  async getGpt4Response(prompt: string): Promise<string | null> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-4-1106-preview',
    };
    try{
      const chatCompletion: OpenAI.Chat.ChatCompletion = await this.openai.chat.completions.create(params);
      //console.log(chatCompletion.choices[0]);
      console.log("GPT4 Successful");
      return chatCompletion.choices[0].message.content;
    }
    catch (error) {
      console.log("GPT4 FAIL")
      console.error(error);
      return null;
    }
  }
}