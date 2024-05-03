import TelegramBot from 'node-telegram-bot-api';
import chat from '.';

const token: any = process.env.TELEGRAM || "";
const bot = new TelegramBot(token, { polling: true });

const commands = [
    { command: 'start', description: 'Start the bot' },
    { command: 'chat', description: 'Chat with the Jupiter bot' },
    { command: 'stopchat', description: 'Exits chat JUP Bot chat mode' },
  ];

  bot.on('callback_query', async (callbackQuery: any) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    // Handle different button callbacks
    switch (data) {
      case 'chat':
        // Inform user they can start chatting and set the user's state to chat mode
        await bot.sendMessage(chatId, "You're now in chat mode. Ask me anything!");

        // Add a message listener specifically for this chat session
        const chatListener = async (msg: any) => {
            if (msg.chat.id === chatId) {
                await chat(chatId, bot, msg.text); // Use the Cohere's chat function
            }
        };

        // Listen to every text message from the user
        bot.on('message', chatListener);

        // To remove the listener and stop chat mode, you can use a command like /stopchat
        bot.onText(/\/stopchat/, (msg) => {
            if (msg.chat.id === chatId) {
                bot.removeListener('message', chatListener); // Remove the chat listener
                bot.sendMessage(chatId, "You've exited chat mode.");
            }
        });

        break;

      default:
        // Handle unknown button clicks
        await bot.sendMessage(chatId, 'Unknown command! Use /start to chat.');
        break;
    }
});

  
  // Set the commands
  bot.setMyCommands(commands)
    .then(() => {
      console.log('Commands have been set successfully.');
    })
    .catch((error) => {
      console.error('Error setting commands:', error.message);
    });

    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        console.log(chatId)
        bot.sendMessage(chatId, '*Hello! Welcome to the Jupiter AI chat bot.*\nAn Q&A bot to ask your questions on all things Jupiter.\n\n', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Chat-Mode', callback_data: 'chat' },
              { text: 'How much is $JUP', callback_data: 'get_markets' },
            ],
            [
              { text: 'How much is a Token?', callback_data: 'get_token_price' },
              { text: 'Token update', callback_data: 'susbscribe_to_token' },
            ],
          ],
        },
        });
      
        });

 export default bot;