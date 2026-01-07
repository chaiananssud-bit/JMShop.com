export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // Token အသစ်ကို ဤနေရာတွင် အစားထိုးထားသည်
    const botToken = "8483364999:AAGQQ5ClypqUqlDT4cNA895FbA3gp-pgd7M";
    const myChatId = "1820840235";

    try {
        const body = req.body;
        // Mini App ကနေ ပို့လိုက်တဲ့ data ကို လက်ခံခြင်း
        const dataRaw = typeof body === 'string' ? JSON.parse(body).data : body.data;
        const { id, server, item, price } = JSON.parse(dataRaw);

        const orderTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' });
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
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: myChatId,
                text: message,
                parse_mode: "Markdown"
            })
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
