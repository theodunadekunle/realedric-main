import { defineConfig, defineField, defineType } from "sanity";
import { structureTool } from "sanity/structure";

const albums = [
  ["weddings", "Weddings"],
  ["portraits", "Portraits"],
  ["events", "Events"],
  ["archive", "Archive"],
];

export default defineConfig({
  name: "realedric",
  title: "Realedric Photo Editor",
  projectId: "4tbr7wml",
  dataset: "production",
  plugins: [structureTool({
    structure: S => S.list().title("Photo albums").items(
      albums.map(([key, title]) => S.listItem().id(key).title(title).child(
        S.document().documentId(key).schemaType("photoAlbum").title(title)
      ))
    ),
  })],
  schema: {
    types: [defineType({
      name: "photoAlbum",
      title: "Photo album",
      type: "document",
      fields: [defineField({
        name: "photos",
        title: "Photos",
        description: "Drop photos here. Drag to reorder them, then choose Publish.",
        type: "array",
        of: [{
          type: "image",
          fields: [defineField({
            name: "alt",
            title: "Photo description",
            description: "Briefly describe what is in this photo.",
            type: "string",
            validation: rule => rule.required(),
          })],
        }],
      })],
    })],
  },
});
