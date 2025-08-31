export async function GET() {
  return new Response('// legacy workbox noop', {
    status: 200,
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

export const dynamic = 'force-dynamic'

