import { component$ } from '@builder.io/qwik';

interface SchemaItemProps {
    schemaId: string;
    title: string;
    description: string;
    type: string;
    obj: any;
}

export const SchemaItem = component$<{ data: SchemaItemProps }>(({ data: { schemaId, title, description, type, obj } }) => {
    return (
        <div class="bg-white shadow-md rounded-lg p-4 mb-4">
            <h3 class="text-lg font-semibold">{title}</h3>
            <p class="text-sm text-gray-600">{description}</p>
            <div class="mt-2">
                <span class="text-xs font-bold text-gray-500">Schema ID:</span>
                <span class="text-xs text-gray-900 ml-1">{schemaId}</span>
            </div>
            <div class="mt-1">
                <span class="text-xs font-bold text-gray-500">Type:</span>
                <span class="text-xs text-gray-900 ml-1">{type}</span>
            </div>
            <div class="mt-1">
                <span class="text-xs font-bold text-gray-500">Object:</span>
                <details open={false}>
                    <summary>JSON SCHEMA</summary>
                    <pre class="text-xs bg-gray-100 p-1 rounded text-gray-900">{JSON.stringify(obj, null, 2)}</pre>
                </details>
            </div>
        </div>
    );
});
