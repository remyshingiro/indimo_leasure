import { formatRWFSimple } from './currency';
import { WHATSAPP_PHONE } from './constants'; // 🚀 Import from constants

export const sendOrderToWhatsApp = (order) => {
  if (!order) return;

  const itemSummary = order.items.map(item => 
    `• ${item.quantity}x ${item.name} ${item.selectedSize ? `(${item.selectedSize})` : ''} - ${formatRWFSimple(item.price * item.quantity)}`
  ).join('\n');

  const message = 
`🏊 *NEW ORDER - KIGALI SWIM SHOP* 🏊
----------------------------------
👤 *Customer:* ${order.customer.fullName}
📞 *Phone:* ${order.customer.phone}
📍 *Address:* ${order.customer.address} (${order.deliveryZone})
💳 *Method:* ${order.paymentMethod.toUpperCase()}
🆔 *Ref:* ${order.transactionId}
----------------------------------
📦 *Items:*
${itemSummary}

🚚 *Delivery:* ${formatRWFSimple(order.deliveryFee)}
💰 *TOTAL TO PAY: ${formatRWFSimple(order.total)}*
----------------------------------
_Please confirm receipt of this order._`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`, '_blank');
};