// RSC-safe JSON-LD emitter. `type="application/ld+json"` is non-executable
// data, so CSP `script-src` execution rules don't apply and no nonce is
// needed. Adding one causes a hydration mismatch in Next 16 because the
// nonce is stripped from the RSC payload but kept in the SSR HTML.
type JsonLd = object;

const escape = (s: string) => s.replace(/</g, "\\u003c");

export default function SchemaScript({ data }: { data: JsonLd | JsonLd[] }) {
  const json = escape(JSON.stringify(data));
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
