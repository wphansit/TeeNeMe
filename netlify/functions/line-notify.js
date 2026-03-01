const axios = require('axios');

exports.handler = async (event) => {
    console.log('--- Incoming Request ---');
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }

    try {
        const { name, phone, message } = JSON.parse(event.body);
        const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        const userId = process.env.USER_ID;

        // Debug Logs (Will show up in Netlify Function Logs)
        console.log('Sending to User ID:', userId ? `${userId.substring(0, 10)}...` : 'MISSING');
        console.log('Access Token exists:', !!accessToken);

        if (!accessToken || !userId) {
            console.error('Error: Missing Env Variables');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Missing LINE_CHANNEL_ACCESS_TOKEN or USER_ID in Netlify.' })
            };
        }

        const msgContent = `📣 มีลูกค้าใหม่ติดต่อจาก TeeNe.me!
👤 ชื่อ: ${name}
📞 เบอร์โทร: ${phone}
📝 รายละเอียด: ${message}`;

        const response = await axios.post('https://api.line.me/v2/bot/message/push', {
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

        console.log('LINE API Success:', response.data);

        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'success' })
        };
    } catch (error) {
        const errorData = error.response ? error.response.data : error.message;
        console.error('LINE API ERROR DETAILS:', JSON.stringify(errorData));

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'LINE API Error',
                details: errorData
            })
        };
    }
};
