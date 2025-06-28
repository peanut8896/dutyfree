const express = require('express');
const { Client } = require('@notionhq/client');
const app = express();
const port = process.env.PORT || 3000;

const notion = new Client({
  auth: 'ntn_B98978608819parlF4Igb7SyOmJYSP1HakINvlEgwwq9Yl'
});
const databaseId = '21f24df55f11802fa88dc94410f7198a'?

const items = [
  {
    item: 'Mediheal Mask',
    quantity: 3,
    unitPrice: 1000,
    date: '2025-06-27'
  },
  {
    item: 'Lion Patch',
    quantity: 2,
    unitPrice: 1200,
    date: '2025-06-27'
  }
];

app.get('/donki-sync', async (req, res) => {
  try {
    for (const i of items) {
      const subtotal = i.quantity * i.unitPrice;
      const tax = Math.round(subtotal * 0.1);
      const total = subtotal + tax;

      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          'Item': { title: [{ text: { content: i.item } }] },
          'Quantity': { number: i.quantity },
          'Unit Price ¥': { number: i.unitPrice },
          'Subtotal ¥': { number: subtotal },
          'Tax ¥': { number: tax },
          'Total ¥': { number: total },
          'Purchased At': { date: { start: i.date } }
        }
      });
    }

    res.send('✅ Notion 기록 완료!');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ 오류 발생');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
