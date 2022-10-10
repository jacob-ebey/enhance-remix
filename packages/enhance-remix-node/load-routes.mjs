import * as fs from "fs";
import * as path from "path";

import { DefaultRoot } from "enhance-remix";
import { invariant } from "@remix-run/router";

/**
 * Load the routes for the app.
 * @param {string} rootDir
 * @param {string} appDir
 * @param {string} routesDir
 * @returns {import("@remix-run/router").AgnosticDataRouteObject[]}
 */
export default async function loadRoutes(
  rootDir = process.cwd(),
  appDir = "app",
  routesDir = "routes"
) {
  // 1. Load the root route from the appDir if it exists, otherwise provide the DefaultShell component as a default

  appDir = path.resolve(rootDir, appDir);
  routesDir = path.resolve(appDir, routesDir);

  let rootRouteModule = null;
  let rootRouteFile = resolveRouteFile(path.resolve(appDir, "root"));
  if (rootRouteFile) {
    rootRouteModule = await import(rootRouteFile);
  } else {
    rootRouteModule = { default: DefaultRoot };
  }
  invariant(
    rootRouteModule && rootRouteModule.default,
    `${path.relative(
      rootDir,
      rootRouteFile
    )} route does not provide a default export`
  );

  // 2. Load the routes from appDir+routesDir

  /** @type {import("@remix-run/router").AgnosticDataRouteObject[]} */
  let routes = [];
  if (fs.existsSync(routesDir)) {
    let routeFiles = fs.readdirSync(routesDir);
    for (let file of routeFiles) {
      let routeFile = path.resolve(routesDir, file);
      let stat = fs.statSync(routeFile);
      if (
        !stat.isFile() &&
        !routeFileExtensions.some((ext) => routeFile.endsWith(ext))
      ) {
        continue;
      }

      let routeModule = await import(routeFile);
      let routeId = createRouteId(appDir, routeFile);
      if (routeModule.default) {
        routeModule.default._routeId = routeId;
      }

      routes.push({
        id: routeId,
        action: rootRouteModule.action,
        handle: rootRouteModule.handle,
        hasErrorBoundary: !!rootRouteModule.ErrorBoundary,
        loader: routeModule.loader,
        element: routeModule.default,
        ...createRoutePathInfo(routesDir, routeFile),
      });
    }
  }
  routes = routes.sort(byLongestFirst);

  // 3. Combine and sort the routes by id

  let rootRouteId = createRouteId(appDir, rootRouteFile);
  if (rootRouteModule.default) {
    rootRouteModule.default._routeId = rootRouteId;
  }
  let rootRoute = {
    id: rootRouteId,
    action: rootRouteModule.action,
    handle: rootRouteModule.handle,
    hasErrorBoundary: !!rootRouteModule.ErrorBoundary,
    loader: rootRouteModule.loader,
    element: rootRouteModule.default,
    children: [],
  };
  let finalRoutes = [rootRoute];

  for (let route of routes) {
    let parentRoute = findParentRoute(routes, route);
    if (parentRoute) {
      parentRoute.children = parentRoute.children || [];
      route.path = route.path
        ? route.path.slice(parentRoute.path.length + 1)
        : undefined;
      parentRoute.children.push(route);
    } else if (route.element) {
      rootRoute.children.push(route);
    } else {
      finalRoutes.push(route);
    }
  }

  return finalRoutes;
}

function byLongestFirst(a, b) {
  return b.id.length - a.id.length;
}

function findParentRoute(routes, route) {
  let parentRoute = routes.find((r) => route.id.startsWith(r.id + "."));
  return parentRoute;
}

function createRoutePathInfo(routesDir, routeFile) {
  // 1. path segments are separated by .
  // 2. if the segment starts with _ the segment is discarded
  // 3. if the segment ends with _ the trailing _ is removed
  // 4. if the last segment is index, the segment is discarded
  // 5. replace $ with :
  // 6. replace only $ with *

  let segments = path
    .relative(routesDir, routeFile)
    .replace(/\\/g, "/")
    .replace(/\.m?js$/, "")
    .split(".");
  let pathSegments = [];
  for (let segment of segments) {
    if (segment.startsWith("_")) continue;
    if (segment.endsWith("_")) segment = segment.slice(0, -1);
    segment = segment.replace(/^\$/, ":");
    segment = segment.replace(/^\$$/, "*");
    pathSegments.push(segment);
  }
  let index = undefined;
  if (pathSegments[pathSegments.length - 1] === "index") {
    pathSegments.pop();
    index = true;
  }

  return { path: pathSegments.join("/") || undefined, index };
}

function createRouteId(appDir, routeFile) {
  let id = path.relative(appDir, routeFile);
  id = id.replace(/\\/g, "/");
  id = id.replace(/\.m?js$/, "");
  return id;
}

const routeFileExtensions = [".mjs", ".js"];
function resolveRouteFile(basePath) {
  for (const ext of routeFileExtensions) {
    const file = basePath + ext;
    let stat = fs.existsSync(file) && fs.statSync(file);
    if (stat && stat.isFile()) {
      return file;
    }
  }
  return null;
}
