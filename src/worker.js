export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "elementalgamingnexus.com") {
      url.hostname = "www.elementalgamingnexus.com";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/go" || url.pathname === "/go/") {
      return Response.redirect(new URL("/listen/", url).toString(), 302);
    }

    return env.ASSETS.fetch(request);
  }
};
