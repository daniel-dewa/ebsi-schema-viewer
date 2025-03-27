import { component$ } from "@builder.io/qwik";
import { BitStringDebugger } from "~/components/bitstring/bitstring";
import { JwkGenerator } from "~/components/jwk/jwk";

export default component$(() => {

  return (
    <>
      <section class="my-4">
        <h1 class="text-3xl font-bold">Index page</h1>
        <p>This page contains usefull utils in working with EBSI and related standards. This page is NOT affiliated with EBSI, the EC or the EU in any way.</p>
      </section>

      <section class="my-4">
        <h2 class="text-2xl font-semibold">
          List of all EBSI Schemas
        </h2>
        <p>Check the full list <a class="underline" href="/ebsi-schema/">here</a>.</p>
      </section>

      <section class="my-4">
        <h2 class="text-2xl font-semibold">JWK Generator</h2>
        <p>The JWK generator does NOT transfer any data or keys to the server.</p>
        <div class="pt-2">
          <JwkGenerator />
        </div>
      </section>

      <section class="my-4">
        <h2 class="text-2xl font-semibold">Bitstring decoder</h2>
        <p>The decoder does NOT transfer any data or keys to the server.</p>
        <div class="pt-2">
          <BitStringDebugger />
        </div>
      </section>
    </>
  )
})
