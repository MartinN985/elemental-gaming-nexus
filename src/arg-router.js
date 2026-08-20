import { onRequestPost as claimPost } from "../functions/api/arg/claim.js";
import { onRequestPost as codePost } from "../functions/api/arg/code.js";
import { onRequestGet as stateGet } from "../functions/api/arg/state.js";
import { onRequestGet as statsGet } from "../functions/api/arg/stats.js";
import { onRequestPost as adminPhasePost } from "../functions/api/arg/admin-phase.js";
import { onRequestGet as tokenGet } from "../functions/i/[token].js";
import { onRequestGet as specialGet } from "../functions/y/special/[number].js";
import { onRequestGet as fileGet } from "../functions/y/file/[slug].js";
import { onRequestGet as globalGet } from "../functions/y/global/[slug].js";

function pagesContext(request, env, ctx, params = {}) {
  return {
    request,
    env,
    params,
    waitUntil: (promise) => ctx.waitUntil(promise),
    next: async () => new Response("Not Found", { status: 404 }),
    data: {}
  };
}

function match(pathname, pattern) {
  const keys = [];
  const regex = new RegExp(
    `^${pattern
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_, key) => {
        keys.push(key);
        return "([^/]+)";
      })}$`
  );
  const hit = pathname.match(regex);
  if (!hit) return null;
  const params = {};
  keys.forEach((key, index) => {
    params[key] = decodeURIComponent(hit[index + 1]);
  });
  return params;
}

export async function handleArgRequest(request, env, ctx) {
  if (!env.ARG_DB) return null;

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();
  const contextFor = (params) => pagesContext(request, env, ctx, params);

  if (method === "POST" && path === "/api/arg/claim") {
    return claimPost(contextFor());
  }
  if (method === "POST" && path === "/api/arg/code") {
    return codePost(contextFor());
  }
  if (method === "GET" && path === "/api/arg/state") {
    return stateGet(contextFor());
  }
  if (method === "GET" && path === "/api/arg/stats") {
    return statsGet(contextFor());
  }
  if (method === "POST" && path === "/api/arg/admin-phase") {
    return adminPhasePost(contextFor());
  }

  const tokenParams = match(path, "/i/:token");
  if (method === "GET" && tokenParams) {
    return tokenGet(contextFor(tokenParams));
  }

  // QR generators that cannot encode path tokens: /i/?ribboncode=XXXXX
  if (method === "GET" && path === "/i") {
    const fromQuery =
      url.searchParams.get("ribboncode") ||
      url.searchParams.get("token") ||
      "";
    return tokenGet(contextFor({ token: fromQuery }));
  }

  const specialParams = match(path, "/y/special/:number");
  if (method === "GET" && specialParams) {
    return specialGet(contextFor(specialParams));
  }

  const fileParams = match(path, "/y/file/:slug");
  if (method === "GET" && fileParams) {
    return fileGet(contextFor(fileParams));
  }

  const globalParams = match(path, "/y/global/:slug");
  if (method === "GET" && globalParams) {
    return globalGet(contextFor(globalParams));
  }

  return null;
}
