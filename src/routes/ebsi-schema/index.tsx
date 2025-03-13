import { component$, useComputed$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { SchemaItem } from "~/components/SchemaItem";
// import { writeFile, readFile } from "node:fs/promises";
import _ from "lodash";

const EBSI_SCHEMA_API_URL = 'https://api-conformance.ebsi.eu/trusted-schemas-registry/v3/schemas'

const schemaListCache = {
  totalCount: 0,
  allMetadata: new Array<{ "href": string, "schemaId": string }>(),
  allData: new Array<{ "schemaId": string, title: string, description: string, type: string, obj: any }>()
};
export const useSchemaList = routeLoader$(async () => {
  // try {
  //   const fileCache = await readFile("./cache.json", { encoding: 'utf8' });
  //   console.log("CACHE HIT!")
  //   return JSON.parse(fileCache) as typeof schemaListCache;
  // } catch { /* EMPTY */ }

  // Fetch count
  const url = new URL(EBSI_SCHEMA_API_URL);
  url.searchParams.append('page[size]', '1');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Schema request failed: ${res.statusText}`);
  schemaListCache.totalCount = (await res.json())["total"] as number;

  // Fetch all
  for (let n = 0; n < schemaListCache.totalCount; n += 10) {
    const url = new URL(EBSI_SCHEMA_API_URL);
    url.searchParams.append('page[size]', '' + 10);
    url.searchParams.append('page[after]', '' + (1 + Math.floor(n / 10)));

    await sleepMs(100);
    const res = await fetch(url).then(res => res.json());

    const page = res["items"];
    schemaListCache.allMetadata.push(...page);
  }

  // Fetch all (FULL DATA)
  for (const schemaMetadata of schemaListCache.allMetadata) {
    await sleepMs(20);
    const res = await fetch(EBSI_SCHEMA_API_URL + '/' + schemaMetadata.schemaId);
    const body = await res.json();

    if (!res.ok) throw new Error(`Schema request failed: ${res.statusText} ${body}`);
    if (typeof body["$schema"] !== 'string') throw new Error("Wrong return data: '$schema' not defined");

    schemaListCache.allData.push({ schemaId: schemaMetadata.schemaId, ...body, obj: body });
  }

  // Save to cache
  // await writeFile("./cache.json", JSON.stringify(schemaListCache));

  console.log("CACHE MISS!")
  return schemaListCache;
});

export default component$(() => {
  const data = useSchemaList();
  const schemaData = useComputed$(() => {
    return _.sortBy(data.value.allData, 'title')
  })

  useVisibleTask$(({ track }) => {
    const schemaData2 = track(() => schemaData.value);

    console.log(schemaData);
  })

  return (
    <div class="py-2 px-3">
      <h1 class="text-3xl font-bold">EBSI Schema viewer</h1>

      <p>Total count: {data.value.totalCount}</p>
      <p>Actual count: {data.value.allMetadata.length}</p>
      <p>Actual data count: {data.value.allData.length}</p>

      <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {schemaData.value.map(schema => (
          <SchemaItem data={schema} key={schema.schemaId} />
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};

const sleepMs = (ms: number) => new Promise((res) => setTimeout(res, ms));
