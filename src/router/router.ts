import "vue-router";
import type { RouteGuard } from ".";

declare module "vue-router" {
    interface RouteMeta {
        auth: boolean,
        guard?: RouteGuard,
    }
}
