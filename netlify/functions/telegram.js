const fetch = require('node-fetch');

exports.handler = async (event) => {
  const TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    let text = `<b>Новая заявка с сайта ratiolegis.ru!</b>\n\n`;
    text += `<b>Дело:</b> ${data.case_number || 'Не указано'}\n`;
    text += `<b>Контакт:</b> ${data.contact_info || 'Не указано'}\n`;
    if (data.message) { text += `<b>Сообщение:</b> ${data.message}\n`; }
    
    const API_URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, parse_mode: 'html', text: text }),
    });

    if (!response.ok) { throw new Error(`Telegram API error: ${response.statusText}`); }
    return { statusCode: 200, body: JSON.stringify({ message: 'Message sent successfully' }) };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send message' }) };
  }
};