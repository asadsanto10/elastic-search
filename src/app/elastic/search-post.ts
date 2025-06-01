import { esClient } from "./es-client";

export const searchPost = async (indexName: string, query: any) => {
  const result = await esClient.search({
    index: indexName,
    query: {
      // match: {
      //   ...query,
      // },
      multi_match: {
        query: "asdsa",
        fields: ["title", "body", "tags"],
        type: "best_fields",
        operator: "and",
      },
    },
  });

  return result;
};
