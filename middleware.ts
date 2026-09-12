import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default intlMiddleware;

export const config = {
  // Runs on every route except: /api/*, /admin/* (unlocalized, single-
  // language admin tool), Next internals, and static files.
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
