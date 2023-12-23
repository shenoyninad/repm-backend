import { RequestMethod } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("config");

function getConfig() {
  return {
    db: config.get("db"),
    http: config.get("http"),
    routes: config.get("protectedRoutes"),
    allowedFileExtensions: config.get("allowedFileExtensions"),
  };
}

const buildGuardRoutes = () => {
  const routes = [];
  const protectedRoutes = getConfig().routes;
  protectedRoutes.forEach((route) => {
    const routeObject = {};
    routeObject["path"] = route.path;
    switch (route.method) {
      case "GET": {
        routeObject["method"] = RequestMethod.GET;
        break;
      }
      case "POST": {
        routeObject["method"] = RequestMethod.POST;
        break;
      }
      case "PUT": {
        routeObject["method"] = RequestMethod.PUT;
        break;
      }
      default: {
      }
    }
    routes.push(routeObject);
  });
  return routes;
};

export { getConfig, buildGuardRoutes };
