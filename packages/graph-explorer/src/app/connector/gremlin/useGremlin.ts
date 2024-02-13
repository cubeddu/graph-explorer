import { useCallback, useMemo } from "react";
import { ConnectionConfig, useConfiguration } from "../../core";
import fetchNeighbors from "./queries/fetchNeighbors";
import fetchNeighborsCount from "./queries/fetchNeighborsCount";
import fetchSchema from "./queries/fetchSchema";
import fetchVertexTypeCounts from "./queries/fetchVertexTypeCounts";
import keywordSearch from "./queries/keywordSearch";
import useGEFetch from "../useGEFetch";
import { GraphSummary } from "./types";
const useGremlin = () => {

  const _rawIdTypeMap = useMemo(() => {
    return new Map<string, "string" | "number">();
  }, []);

  const _gremlinFetch = useCallback((options) => {
    return async (queryTemplate: string) => {
      console.log("🚀 ~ return ~ queryTemplate:", queryTemplate)
      const body = JSON.stringify({ query: queryTemplate });
      return fetch(`api/gremlin`, {
        method: "POST",
        headers: {
          'graph-db-connection-url': 'https://cole-snb-10-rdf-export-test-cluster.cluster-cjiepzx2kerx.us-west-2.neptune.amazonaws.com:8182',
          'Content-Type': 'application/json',
          'query': queryTemplate,
        },
      });

    };
  }, []);

  const fetchSchemaFunc = useCallback(async (options) => {
    const ops = { ...options, disableCache: true };
    let summary;
    try {
      const response = await fetch('api/gremlin', {
        method: "GET",
        headers: {
          'graph-db-connection-url': 'https://cole-snb-10-rdf-export-test-cluster.cluster-cjiepzx2kerx.us-west-2.neptune.amazonaws.com:8182',
        },
        ...ops
      });
      summary = await response.payload.graphSummary as GraphSummary || undefined;
    } catch (e) {

      console.error("[Summary API]", e);
    }
    return fetchSchema(_gremlinFetch(ops), summary);
  }, [_gremlinFetch]);

  const fetchVertexCountsByType = useCallback((req, options) => {
    return fetchVertexTypeCounts(_gremlinFetch(options), req);
  }, [_gremlinFetch]);

  const fetchNeighborsFunc = useCallback((req, options) => {
    return fetchNeighbors(_gremlinFetch(options), req, _rawIdTypeMap);
  }, [_gremlinFetch, _rawIdTypeMap]);

  const fetchNeighborsCountFunc = useCallback((req, options) => {
    return fetchNeighborsCount(_gremlinFetch(options), req, _rawIdTypeMap);
  }, [_gremlinFetch, _rawIdTypeMap]);

  const keywordSearchFunc = useCallback((req, options) => {
    return keywordSearch(_gremlinFetch(options), req, _rawIdTypeMap);
  }, [_gremlinFetch, _rawIdTypeMap]);

  return {
    fetchSchema: fetchSchemaFunc,
    fetchVertexCountsByType,
    fetchNeighbors: fetchNeighborsFunc,
    fetchNeighborsCount: fetchNeighborsCountFunc,
    keywordSearch: keywordSearchFunc,
  };
};

export default useGremlin;