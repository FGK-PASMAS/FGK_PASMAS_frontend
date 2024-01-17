import 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        prev?: RouteRecordName,
        next?: RouteRecordName,
    }
}
