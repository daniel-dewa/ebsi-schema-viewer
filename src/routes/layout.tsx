import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div class="min-h-screen bg-gray-100">
      <header class="bg-blue-600 text-white p-4 shadow-md">
        <a href="/" class="text-3xl font-bold">EBSI Utils</a>
      </header>
      <main class="container mx-auto p-4">
        <Slot />
      </main>
    </div>
  );
});
