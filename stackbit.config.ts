// stackbit.config.ts
import { defineStackbitConfig, SiteMapEntry } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  // Your site's metadata
  site: {
    title: "H&C Cleaning Website",
    // ... other metadata
  },

  // Content source: files under /content
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content/pages"],
      models: [
        {
          name: "Page",
          type: "page",                // marks this as a page model
          urlPath: "/{slug}",         // URL derived from `slug` field
          filePath: "content/pages/{slug}.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "slug",  type: "string", required: true },
            { name: "content", type: "markdown", required: true }
          ]
        },
        {
          name: "BlogPost",
          type: "page",
          urlPath: "/blog/{slug}",
          filePath: "content/blog/{slug}.md",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "slug",  type: "string", required: true },
            { name: "date",  type: "date", required: true },
            { name: "excerpt", type: "string" },
            { name: "body",  type: "markdown", required: true }
          ]
        }
      ],
    })
  ],

  // Optional: customize sitemap for the Visual Editor
  siteMap: ({ documents, models }) => {
    // filter models of type 'page'
    const pageModels = models.filter((m) => m.type === "page");

    return documents
      .filter((doc) => pageModels.some((m) => m.name === doc.modelName))
      .map((doc) => {
        const urlPath = (() => {
          switch (doc.modelName) {
            case "Page":
              return `/${doc.data.slug}`;
            case "BlogPost":
              return `/blog/${doc.data.slug}`;
            default:
              return `/`;
          }
        })();

        return {
          stableId: doc.id,
          urlPath,
          isHomePage: doc.data.slug === "index" || doc.data.slug === "home",
          document: doc
        } as SiteMapEntry;
      });
  }
});
