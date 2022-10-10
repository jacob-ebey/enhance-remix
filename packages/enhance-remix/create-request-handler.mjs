import enhance from "@enhance/ssr";
import { unstable_createStaticHandler as createStaticHandler } from "@remix-run/router";

/**
 *
 * @param {import("@remix-run/router").AgnosticDataRouteObject[]} routes
 * @returns {import("enhance-remix").RequestHandler}
 */
export default function createRequestHandler(routes) {
  return async (request) => {
    let staticHandler = createStaticHandler(routes);
    let context = await staticHandler.query(request);

    if (context instanceof Response) {
      return context;
    }

    if (context.matches[0].route.id == "__shim-404-route__") {
      return new Response("Not Found", { status: 404 });
    }

    let elements = {};
    for (let i = 0; i < context.matches.length; i++) {
      let match = context.matches[i];
      elements[`route-${i}`] = match.route.element;
    }

    let html = enhance({
      elements,
    });

    let body = html([
      context.matches.reduceRight((acc, match, index) => {
        return `<route-${index}>${acc}</route-${index}>`;
      }, ""),
    ]);

    // TODO: Render using enhance-ssr
    return new Response(`<!DOCTYPE html>${body}`, {
      status: context.statusCode,
      headers: {
        "Content-Type": "text/html",
      },
    });
  };
}
