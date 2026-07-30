import { handleArgRequest } from "./arg-router.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.hostname === "elementalgamingnexus.com") {
      url.hostname = "www.elementalgamingnexus.com";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/go" || url.pathname === "/go/") {
      return Response.redirect(new URL("/listen/", url).toString(), 302);
    }

    const argResponse = await handleArgRequest(request, env, ctx);
    if (argResponse) return argResponse;

    return env.ASSETS.fetch(request);
  }
};
