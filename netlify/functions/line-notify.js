const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'JSON.stringify({ error: "Method Not Allowed" })' };
    }

    try {
        const { name, phone, message } = JSON.parse(event.body);
        const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        const userId = process.env.USER_ID;

        if (!accessToken || !userId) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Missing LINE_CHANNEL_ACCESS_TOKEN or USER_ID in Netlify environment variables.' })
            };
        }

        const msgContent = `📣 มีลูกค้าใหม่ติดต่อจาก TeeNe.me!
👤 ชื่อ: ${name}
📞 เบอร์โทร: ${phone}
📝 รายละเอียด: ${message}`;

        await axios.post('https://api.line.me/v2/bot/message/push', {
            to: userId,
            messages: [
                {
                    type: 'text',
                    text: msgContent
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'success' })
        };
    } catch (error) {
        console.error('LINE API Error:', error.response ? error.response.data : error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
