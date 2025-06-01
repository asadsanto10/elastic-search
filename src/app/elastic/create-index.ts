import { IndicesCreateResponse } from "@elastic/elasticsearch/lib/api/types";
import { esClient } from "./es-client";

export const createEsIndex = async (
  indexName: string
): Promise<IndicesCreateResponse | null> => {
  try {
    const exists = await esClient.indices.exists({ index: indexName });

    if (exists) {
      console.log(`Index ${indexName} already exists`);
      return null;
    }

    const result = await esClient.indices.create({
      index: indexName,
    });

    return result;
  } catch (error) {
    // console.log(error);
    return null;
  }
};
