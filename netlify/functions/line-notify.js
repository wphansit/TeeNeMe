const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { name, phone, message } = JSON.parse(event.body);
        const token = process.env.LINE_NOTIFY_TOKEN;

        if (!token) {
            return { statusCode: 500, body: 'Missing LINE_NOTIFY_TOKEN' };
        }

        const msg = `
📣 มีลูกค้าใหม่ติดต่อจาก TeeNe.me!
👤 ชื่อ: ${name}
📞 เบอร์โทร: ${phone}
📝 รายละเอียด: ${message}
    `;

        await axios.post('https://notify-api.line.me/api/notify',
            new URLSearchParams({ message: msg }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'success' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
