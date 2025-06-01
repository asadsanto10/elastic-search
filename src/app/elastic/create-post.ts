import { IndexResponse } from "@elastic/elasticsearch/lib/api/types";
import { esClient } from "./es-client";

export const createPost = async (
  indexName: string,
  payload: any
): Promise<IndexResponse> => {
  const result = await esClient.index({
    index: indexName,
    document: payload,
  });

  return result;
};
