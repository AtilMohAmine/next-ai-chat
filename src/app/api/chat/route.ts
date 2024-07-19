import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  createStreamDataTransformer
} from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';

export const dynamic = 'force-dynamic'

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.

Current conversation:
{chat_history}

user: {input}
assistant:`;


export async function POST(req: Request) {
  try {
      const { messages } = await req.json();

      const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

      const currentMessageContent = messages.at(-1).content;

      const prompt = PromptTemplate.fromTemplate(TEMPLATE);

      const model = new ChatOpenAI({
          apiKey: process.env.OPENAI_API_KEY!,
          model: 'gpt-3.5-turbo',
          temperature: 0.8,
      });

      const parser = new HttpResponseOutputParser();

      const chain = prompt.pipe(model).pipe(parser);

      const stream = await chain.stream({
          chat_history: formattedPreviousMessages.join('\n'),
          input: currentMessageContent,
      });

      return new StreamingTextResponse(
          stream.pipeThrough(createStreamDataTransformer()),
      );
  } catch (e: any) {
      return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}