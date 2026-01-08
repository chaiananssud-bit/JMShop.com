export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // .env.local ထဲက Token များကို လှမ်းခေါ်သုံးခြင်း
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const myChatId = process.env.TELEGRAM_CHAT_ID;

    // Token မရှိပါက Error ပြရန်
    if (!botToken || !myChatId) {
        return res.status(500).json({ error: "Environment variables missing" });
    }

    try {
        const body = req.body;
        // Data ကို လက်ခံပြီး JSON format သို့ ပြောင်းလဲခြင်း
        const dataRaw = typeof body === 'string' ? JSON.parse(body).data : body.data;
        const parsedData = JSON.parse(dataRaw);
        
        const { id, server, item, price } = parsedData;

        const orderTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Yang Yangon' });
        const orderId = "ORD" + Math.floor(Date.now() / 1000);

        const message = `
🚀 **New Order Received!**
--------------------------
💎 **Product:** ${item}
🆔 **Order ID:** ${orderId}
✅ **Status:** Success (Pending Payment)
⏰ **Order time:** ${orderTime}
👤 **UID:** ${id}
🌐 **Server ID:** ${server}
💰 **Value:** ${price}
--------------------------
*ကျေးဇူးပြု၍ ငွေလွှဲပြေစာ စစ်ဆေးပေးပါ*
        `;

        // Telegram Bot API သို့ စာပို့ခြင်း
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: myChatId,
                text: message,
                parse_mode: "Markdown"
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            const errorData = await response.json();
            return res.status(500).json({ error: errorData.description });
        }
    } catch (error) {
        console.error("Error details:", error);
        return res.status(500).json({ error: error.message });
    }
}