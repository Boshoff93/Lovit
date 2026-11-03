const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const schema = JSON.parse(read("src/content/openapi.json"));
const posts = JSON.parse(read("src/content/blog.json"));
const manifest = JSON.parse(read("build/_public/manifest.json"));
const routes = new Set(Object.keys(manifest));
const ids = new Set();
let operationCount = 0;
for (const [url, methods] of Object.entries(schema.paths))
  for (const [method, operation] of Object.entries(methods)) {
    assert(
      operation.operationId && !ids.has(operation.operationId),
      "Operation identity must be unique: " + method + url,
    );
    ids.add(operation.operationId);
    operationCount++;
    assert(operation.tags?.length, "Endpoint group missing: " + url);
    for (const match of url.matchAll(/\{(\w+)\}/g))
      assert(
        operation.parameters.some(
          (parameter) =>
            parameter.name === match[1] &&
            parameter.in === "path" &&
            parameter.required,
        ),
        "Required path field missing: " + url,
      );
  }
function checkRefs(value) {
  if (!value || typeof value !== "object") return;
  if (value.$ref)
    assert(
      value.$ref
        .split("/")
        .slice(1)
        .reduce((node, key) => node?.[key], schema),
      "Broken OpenAPI reference: " + value.$ref,
    );
  for (const nested of Object.values(value)) checkRefs(nested);
}
checkRefs(schema);
assert.deepEqual(
  schema,
  JSON.parse(read("public/openapi.json")),
  "Downloadable schema drifted from rendered reference",
);
const htmlPages = new Map(
  Object.entries(manifest).map(([url, file]) => [url, read("build" + file)]),
);
const titles = new Set();
for (const [url, html] of htmlPages) {
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title && !titles.has(title), "Unique title missing: " + url);
  titles.add(title);
  assert(
    html.includes('href="https://agentgruvi.com' + url + '"'),
    "Canonical missing: " + url,
  );
  assert(html.includes("<h1"), "Server-rendered content missing: " + url);
  for (const match of html.matchAll(/href="(\/[^"?]*)"/g)) {
    const href = match[1].replace(/&amp;/g, "&");
    const [targetPath, fragment] = href.split("#");
    if (fragment && htmlPages.has(targetPath))
      assert(
        htmlPages
          .get(targetPath)
          .includes('id="' + decodeURIComponent(fragment) + '"'),
        "Broken content anchor: " + url + " -> " + href,
      );
    if (targetPath.startsWith("/blog/") && !targetPath.endsWith(".xml"))
      assert(routes.has(targetPath), "Broken article link: " + href);
  }
}
const apiHtml = htmlPages.get("/docs/api-reference");
for (const id of ids)
  assert(
    apiHtml.includes('id="' + id + '"'),
    "Endpoint missing from server HTML: " + id,
  );
const artworkPaths = new Set();
for (const post of posts) {
  const html = htmlPages.get("/blog/" + post.slug);
  assert(html, "Article not rendered: " + post.slug);
  assert(
    post.artwork?.alt && !artworkPaths.has(post.artwork.src),
    "Each guide needs distinct described artwork: " + post.slug,
  );
  artworkPaths.add(post.artwork.src);
  for (const file of [
    post.artwork.src,
    post.artwork.card,
    post.artwork.social,
  ]) {
    assert(
      fs.statSync(path.join(root, "public", file)).size > 0,
      "Artwork file missing: " + file,
    );
  }
  assert(
    html.includes('src="' + post.artwork.src + '"'),
    "Article hero missing: " + post.slug,
  );
  assert(
    html.includes(
      'property="og:image" content="https://agentgruvi.com' +
        post.artwork.social +
        '"',
    ),
    "Article share artwork missing: " + post.slug,
  );
  const structured = JSON.parse(
    html.match(
      /<script id="gruvi-page-schema" type="application\/ld\+json">(.*?)<\/script>/s,
    )[1],
  );
  assert(
    structured["@graph"].some(
      (item) =>
        item["@type"] === "BlogPosting" &&
        item.datePublished &&
        item.author?.name,
    ),
    "Article metadata missing",
  );
  const words = post.sections
    .flatMap((section) => section.paragraphs)
    .join(" ")
    .split(/\s+/).length;
  assert(words >= 350, "Guide lacks substantive body content: " + post.slug);
  assert(
    read("public/docs/for-agents/guides/" + post.slug + ".md").includes(
      post.sections[0].paragraphs[0],
    ),
  );
}
assert(read("public/blog/rss.xml").includes(posts[0].slug));
assert(
  !read("public/llms-full.txt").includes(
    "does not advertise text-only posts or image carousels",
  ),
);
console.log(
  `Verified ${routes.size} rendered pages, ${operationCount} API operations, ${posts.length} articles, internal anchors, schema references and agent guides.`,
);
