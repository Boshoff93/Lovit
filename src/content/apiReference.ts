import document from "./openapi.json";

export const apiDocument: any = document;
export const apiBase = "https://api.agentgruvi.com";
export type ApiOperation = {
  id: string;
  method: string;
  path: string;
  group: string;
  definition: any;
};
export const apiGroups: string[] = apiDocument.tags.map((tag: any) => tag.name);
export const apiOperations: ApiOperation[] = Object.entries(
  apiDocument.paths,
).flatMap(([path, methods]) =>
  Object.entries(methods as Record<string, any>)
    .filter(([method]) =>
      ["get", "post", "put", "patch", "delete"].includes(method),
    )
    .map(([method, definition]) => ({
      id: definition.operationId,
      method: method.toUpperCase(),
      path,
      group: definition.tags[0],
      definition,
    })),
);
export function resolveSchema(value: any): any {
  if (!value) return {};
  if (value.$ref)
    return resolveSchema(
      value.$ref
        .split("/")
        .slice(1)
        .reduce((node: any, key: string) => node?.[key], apiDocument),
    );
  return value;
}
export function schemaType(value: any): string {
  const schema = resolveSchema(value);
  if (schema.type === "array") return `${schemaType(schema.items)}[]`;
  return (
    schema.type ||
    (schema.properties
      ? "object"
      : schema.oneOf
        ? "one of several types"
        : "value")
  );
}
function exampleValue(value: any, name = "", depth = 0): any {
  const schema = resolveSchema(value);
  if (name === "tiktokSettings")
    return { postMode: "draft", privacyLevel: "SELF_ONLY" };
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;
  if (schema.enum) return schema.enum[0];
  if (depth > 4) return {};
  if (schema.type === "array")
    return [exampleValue(schema.items, name, depth + 1)];
  if (schema.properties)
    return Object.fromEntries(
      Object.entries(schema.properties)
        .slice(0, 12)
        .map(([key, field]) => [key, exampleValue(field, key, depth + 1)]),
    );
  if (schema.type === "boolean") return false;
  if (["integer", "number"].includes(schema.type))
    return name === "fileSize" ? 1024 : schema.minimum || 1;
  if (schema.format === "date-time") return "2026-12-01T09:00:00Z";
  if (schema.format === "uri") return "https://your-domain.example/media.jpg";
  const values: Record<string, string> = {
    requestId: "campaign-post-001",
    videoId: "your-video-id",
    carouselId: "your-carousel-id",
    title: "A closer look",
    description: "The details behind our next release.",
    caption: "The details behind our next release.",
    accountId: "your-connected-account-id",
    fileType: "video/mp4",
    imageKeys: "your-uploaded-image-key",
    platform: "instagram",
  };
  return values[name] || `your-${name || "value"}`;
}
export function operationBody(operation: ApiOperation): any | undefined {
  const content =
    operation.definition.requestBody?.content?.["application/json"];
  if (!content) return undefined;
  if (operation.id === "bulkScheduleVideos")
    return {
      requestId: "campaign-batch-001",
      posts: [
        {
          videoId: "your-video-id",
          title: "A closer look",
          description: "The details behind our next release.",
          platforms: [
            { platform: "instagram", accountId: "your-connected-account-id" },
          ],
          scheduledTime: "2026-12-01T09:00:00Z",
        },
      ],
    };
  if (operation.id === "schedulePost" || operation.id === "scheduleCarousel")
    return {
      requestId:
        operation.id === "schedulePost"
          ? "campaign-post-001"
          : "carousel-schedule-001",
      ...(operation.id === "schedulePost" ? { videoId: "your-video-id" } : {}),
      title: "A closer look",
      description: "The details behind our next release.",
      platforms: [
        { platform: "instagram", accountId: "your-connected-account-id" },
      ],
      scheduledTime: "2026-12-01T09:00:00Z",
    };
  if (operation.id === "createCarouselUpload")
    return { fileType: "image/jpeg", fileSize: 1024 };
  if (operation.id === "createCarousel")
    return {
      title: "The story in pictures",
      caption: "A closer look, frame by frame.",
      imageKeys: [
        "your-first-uploaded-image-key",
        "your-second-uploaded-image-key",
      ],
    };
  if (operation.id === "publishCarousel")
    return {
      platform: "instagram",
      accountId: "your-connected-account-id",
      requestId: "carousel-instagram-001",
      caption: "A closer look, frame by frame.",
    };
  return content.example || exampleValue(content.schema);
}
export type ExampleLanguage = "Shell" | "JavaScript" | "Python";
export function requestExample(
  operation: ApiOperation,
  language: ExampleLanguage,
): string {
  const query = (operation.definition.parameters || [])
    .filter(
      (p: any) => p.in === "query" && (p.required || p.name === "accountId"),
    )
    .map((p: any) => `${p.name}=your-${p.name}`);
  const url =
    apiBase +
    operation.path.replace(/\{(\w+)\}/g, (_match, name) => `your-${name}`) +
    (query.length ? "?" + query.join("&") : "");
  const body = operationBody(operation);
  const secured =
    (operation.definition.security || apiDocument.security || []).length > 0;
  if (language === "JavaScript")
    return `const response = await fetch(${JSON.stringify(url)}, {\n  method: '${operation.method}',\n  headers: {${secured ? "\n    Authorization: `Bearer ${process.env.GRUVI_API_KEY}`," : ""}${body ? "\n    'Content-Type': 'application/json'," : ""}\n  },${body ? "\n  body: JSON.stringify(" + JSON.stringify(body, null, 2).replace(/\n/g, "\n  ") + ")," : ""}\n});\nconst result = await response.json();\nif (!response.ok) throw new Error(result.error || 'Request failed');\nconsole.log(result);`;
  if (language === "Python")
    return `import json\nimport os\nfrom urllib.request import Request, urlopen\n\n${body ? "payload = json.loads(" + JSON.stringify(JSON.stringify(body)) + ")\n" : ""}request = Request(\n    ${JSON.stringify(url)},\n    method='${operation.method}',${body ? "\n    data=json.dumps(payload).encode()," : ""}\n    headers={${secured ? '\n        "Authorization": "Bearer " + os.environ["GRUVI_API_KEY"],' : ""}${body ? '\n        "Content-Type": "application/json",' : ""}\n    },\n)\nwith urlopen(request, timeout=60) as response:\n    print(json.load(response))`;
  const lines = [
    `curl --fail-with-body --request ${operation.method} '${url}'`,
  ];
  if (secured) lines.push('  --header "Authorization: Bearer $GRUVI_API_KEY"');
  if (body)
    lines.push(
      "  --header 'Content-Type: application/json'",
      "  --data '" + JSON.stringify(body, null, 2) + "'",
    );
  return lines.join(" \\\n");
}
export const analyticsCoverage = [
  ["TikTok", "Views, likes, comments and shares", "Summary and trends"],
  ["YouTube", "Video performance and engagement", "Summary and trends"],
  ["Instagram", "Views, reach, interactions and recent-post counts", "Account insights · Meta permission required"],
  [
    "Facebook",
    "Content views, interactions and recent-post counts",
    "Account insights · Meta permission required",
  ],
  ["X", "Available post public metrics", "Recent-post summary · beta"],
];
