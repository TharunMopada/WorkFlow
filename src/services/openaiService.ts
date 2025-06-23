import { Configuration, OpenAIApi } from 'openai';

const getOpenAIApi = (apiKey: string) => {
  const configuration = new Configuration({ apiKey });
  return new OpenAIApi(configuration);
};

export const askOpenAI = async ({
  apiKey,
  prompt,
  context,
  model = 'gpt-3.5-turbo',
  temperature = 0.7,
  maxTokens = 1000,
}: {
  apiKey: string;
  prompt: string;
  context?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}) => {
  const openai = getOpenAIApi(apiKey);
  const messages = [
    context ? { role: 'system', content: context } : null,
    { role: 'user', content: prompt },
  ].filter(Boolean);

  const response = await openai.createChatCompletion({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return response.data.choices[0]?.message?.content || '';
}; 