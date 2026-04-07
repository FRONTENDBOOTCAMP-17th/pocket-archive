export default async (request) => {
  const url = new URL(request.url);
  const targetUrl = `https://api.fullstackfamily.com${url.pathname}${url.search}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  const token = request.headers.get('Authorization');
  if (token) headers['Authorization'] = token;

  const init = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl, init);
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const config = {
  path: '/api/*',
};
