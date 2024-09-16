import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import crypto from 'crypto';

// Configura la función para manejar el webhook
export const action: ActionFunction = async ({ request }) => {
  const secret = process.env.TOKEN_WEBHOOK_SHOPIFY; // Asegúrate de tener la clave secreta de tu webhook en tus variables de entorno
  const body = await request.text();
  const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');

  // Verifica la firma HMAC
  const hash = crypto
    .createHmac('sha256', secret!)
    .update(body, 'utf8')
    .digest('base64');

  if (hash !== hmacHeader) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parseamos el cuerpo de la solicitud como JSON
  const orderData = JSON.parse(body);

  // Lógica para añadir la etiqueta al pedido
const orderId = orderData.id;
const lineItemsInfo = Array.isArray(orderData.line_items) ? orderData.line_items : [];

console.log("------ order id----------", orderId);

const fechaDeEntrega = lineItemsInfo.find((item: any) => item.properties && item.properties.length > 0)?.properties[0].value;

console.log("------ fechaDeEntrega----------", fechaDeEntrega);


  // Llamar a la API de Shopify para actualizar el pedido con la nueva etiqueta
  const shopifyResponse = await fetch(`https://976f80.myshopify.com/admin/api/2023-07/orders/${orderId}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN || '',
    },
    body: JSON.stringify({
      order: {
        id: orderId,
        tags: `${fechaDeEntrega}`, // Añade la nueva etiqueta
      },
    }),
  });

  console.log("------ shopifyResponse----------", shopifyResponse);



  if (!shopifyResponse.ok) {
    return json({ error: 'Error updating order tags' }, { status: 500 });
  }

  return json({ success: true });
};

