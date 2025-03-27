import { $, component$, isBrowser, useSignal, useTask$ } from "@builder.io/qwik";
import * as jose from 'jose';

type JwkType = 'A256KW' | 'A256GCMKW' | 'A128GCM' | 'A192GCM' | 'A256GCM';

async function generateJwk(type: JwkType) {
    const keySecret = await jose.generateSecret(type, { extractable: true });
    return {
        jwk: JSON.stringify(await jose.exportJWK(keySecret)),
    };
}

export const JwkGenerator = component$(() => {
    const inType = useSignal<JwkType>('A256KW');
    const outJwk = useSignal<string>();
    const counter = useSignal(0);

    useTask$(async ({ track }) => {
        track(() => counter.value);
        const type = track(() => inType.value);

        if (isBrowser) {
            const ret = await generateJwk(type);
            outJwk.value = ret.jwk;
        }
    });

    const copyToClipboard = $(() => {
        if (outJwk.value) {
            navigator.clipboard.writeText(outJwk.value);
            alert('Copied to clipboard!');
        }
    });

    return (
        <div class="p-6 max-w-2xl bg-white rounded-xl shadow-md space-y-4">
            <form class="space-y-4">
                <label for="jwkType" class="block text-sm font-medium text-gray-700">Select JWK Type:</label>
                <select
                    id="jwkType"
                    value={inType.value}
                    onChange$={(e) => inType.value = (e.target as HTMLSelectElement).value as JwkType}
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="A256KW">A256KW</option>
                    <option value="A256GCMKW">A256GCMKW</option>
                    <option value="A128GCM">A128GCM</option>
                    <option value="A192GCM">A192GCM</option>
                    <option value="A256GCM">A256GCM</option>
                </select>
                <div class="flex space-x-2">
                    <button
                        type="button"
                        onClick$={() => counter.value = counter.value + 1}
                        class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Generate
                    </button>
                    <button
                        type="button"
                        onClick$={copyToClipboard}
                        class="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Copy
                    </button>
                </div>
            </form>
            <div class="space-y-2">
                <label for="outputJwk" class="block text-sm font-medium text-gray-700">Generated JWK:</label>
                <textarea
                    id="outputJwk"
                    value={outJwk.value}
                    readOnly
                    rows={10}
                    cols={50}
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
            </div>
        </div>
    );
});
