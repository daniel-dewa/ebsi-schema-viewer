import { $, component$, NoSerialize, noSerialize, useComputed$, useSignal, useTask$ } from "@builder.io/qwik";
import * as multibase from "multibase"; // For Multibase decoding
import * as fflate from 'fflate';
import BitSet from "bitset"; // For BitSet decoding
import { ToggleSwitch } from "../toggle-switch/toggle-switch";
import { BITSTRING_SAMPLE } from "./bitstring-consts";

export const BitStringDebugger = component$(() => {
  const inputString = useSignal<string>("");
  const errorMessage = useSignal<string | null>(null);
  const bitset = useSignal<NoSerialize<BitSet> | null>(null);
  const bitsetCount = useComputed$<number | null>(() => bitset.value?.cardinality() || null);
  const bitsetRevoced = useComputed$<number[] | null>(() => bitset.value?.toArray() || null);
  const bitsetLength = useSignal<number | null>(null);
  const counter = useSignal(0);
  const autoCounter = useSignal(false);

  const decodeAndLoadBitset = $(async (s: string) => {

    // Multibase decode the input string
    const multibaseDecoded = wrapErr("Failed to decode multibase64", () => multibase.decode(s));
    const bitsetArray: Uint8Array = wrapErr("Failed to unzip", () => fflate.gunzipSync(multibaseDecoded));
    const bitsetObj = wrapErr("Failed to create bitset", () => new BitSet(bitsetArray));
    bitset.value = noSerialize(bitsetObj);
    bitsetLength.value = bitsetArray.length;
  });

  useTask$(async ({ track }) => {
    track(() => counter.value);
    if (!inputString.value) {
      bitset.value = null;
      errorMessage.value = null;
      return;
    }

    try {
      errorMessage.value = "decoding..."; // Reset error message

      // Multibase decode the input string
      await decodeAndLoadBitset(inputString.value);
      errorMessage.value = null; // Reset error message
    } catch (error) {
      console.error(error);
      bitset.value = null;
      errorMessage.value = `${error}`;
    }
  });

  useTask$(({ track }) => {
    track(() => autoCounter.value);
    track(() => inputString.value);
    if (!autoCounter.value) return;

    counter.value = counter.value + 1;
  });

  return (
    <div class="p-6 max-w-2xl bg-white rounded-xl shadow-md space-y-4">
      <form class="space-y-4">
        <div class="block text-sm font-medium text-gray-700">
          Enter Compressed Bitstring:
        </div>
        <textarea
          value={inputString.value}
          onInput$={(e) => (inputString.value = (e.target as HTMLTextAreaElement).value)}
          rows={5}
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
        <div class="flex flex-row gap-4">
          <button
            type="button"
            onClick$={() => { inputString.value = BITSTRING_SAMPLE }}
            class="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Load sample
          </button>
          <button
            type="button"
            disabled={autoCounter.value}
            onClick$={() => counter.value = counter.value + 1}
            class={"px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 " + (autoCounter.value && "bg-blue-300 hover:bg-blue-300")}
          >
            Decode
          </button>
          <ToggleSwitch value={false} onToggle$={() => autoCounter.value = !autoCounter.value}>Auto Decode</ToggleSwitch>
        </div>
      </form>
      {errorMessage.value && (
        <pre class="text-red-600 text-sm">
          {errorMessage.value}
        </pre>
      )}
      {bitset.value && (
        <div class="space-y-4">
          <div>
            <div class="text-lg font-medium text-gray-700">Length:</div>
            <div class="mt-2 p-2 border border-gray-300 rounded-md bg-gray-50">
              {bitsetLength.value}
            </div>
          </div>
          <div>
            <div class="text-lg font-medium text-gray-700">Indices of "1" Values ({bitsetCount.value}):</div>
            <div class="mt-2 p-2 border border-gray-300 rounded-md bg-gray-50">
              {JSON.stringify(bitsetRevoced.value)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const wrapErr = (msg: string, f: CallableFunction) => {
  try {
    return f();
  } catch (err) {
    throw new Error(`${msg}: ${err}`, { cause: err })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const wrapErrAsync = async (msg: string, f: CallableFunction) => {
  try {
    return await f();
  } catch (err) {
    throw new Error(`${msg}: ${err}`, { cause: err })
  }
}
