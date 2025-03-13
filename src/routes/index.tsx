import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
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
                <p>Check the full list <Link class="underline" href="/ebsi-schema/">here</Link>.</p>
            </section>

            <section class="my-4">
                <h2 class="text-2xl font-semibold">JWK Generator</h2>
                <p>The JWK generator does NOT transfer any data or keys from the client.</p>
                <div class="pt-2">
                    <JwkGenerator />
                </div>
            </section>
        </>
    )
})
