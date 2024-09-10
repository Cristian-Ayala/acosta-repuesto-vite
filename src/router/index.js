import { createRouter, createWebHistory } from "vue-router";
import { jwtDecode } from "jwt-decode";
import routes from "./routes";

function isTokenExpired(token) {
  const decoded = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  if (decoded.exp && decoded.exp < currentTime) {
    return true; // Token is expired
  }
  return false; // Token is valid
}

function isAuthenticated() {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined") return false; // No token found

  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    return false; // Token is expired
  }

  return true; // Token is valid
}
const router = createRouter({
  history: createWebHistory(),
  // base: process.env.BASE_URL,
  routes,
  linkActiveClass: "active-link",
  linkExactActiveClass: "exact-active-link",
});

router.beforeEach((to, from, next) => {
  if (to.meta.allowAnonymous) return next(); // Allow navigation for routes with allowAnonymous
  if (!isAuthenticated()) return next({ name: "Login" });
  return next(); // Allow navigation
});

router.onError((error, to) => {
  if (
    error.message.includes("Failed to fetch dynamically imported module") ||
    error.message.includes("Importing a module script failed")
  ) {
    if (!to?.fullPath) {
      window.location.reload();
    } else {
      window.location = to.fullPath;
    }
  }
});

export default router;
