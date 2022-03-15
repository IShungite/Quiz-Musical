// lib/session.js
export async function getAuthSession(ctx) {
  return ctx.req.session.get("user");
}
