import { useCallback, useMemo } from "react";
import { ConnectionConfig } from "../../core";
import fetchNeighbors from "./queries/fetchNeighbors";
import fetchNeighborsCount from "./queries/fetchNeighborsCount";
import fetchSchema from "./queries/fetchSchema";
import fetchVertexTypeCounts from "./queries/fetchVertexTypeCounts";
import keywordSearch from "./queries/keywordSearch";
import useGEFetch from "../useGEFetch";
import { GraphSummary } from "./types";

const useGremlin = (connection: ConnectionConfig) => {
  const _rawIdTypeMap = useMemo(() => {
    return new Map<string, "string" | "number">();
  }, []);

  const gremlinFetch = async (endpoint: string, options: OptionsType, method: string = "POST", body?: any) => {
    const requestOpts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      ...options,
    };
    return await graphExploreFetch(`${endpoint}`, requestOpts);
  };

  const _gremlinFetch = useCallback((options) => {
    return async (queryTemplate: string) => {
      const body = JSON.stringify({ gremlin: queryTemplate });
      return graphExploreFetch(`api/gremlin`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body,
        disableCache: options?.disableCache,
      });

    };
  }, [useGEFetch]);

  const fetchSchema = useCallback(async (options) => {
    const ops = { ...options, disableCache: true };
    let summary;
    try {
      const response = await graphExploreFetch(`api/pg/summary`, {
        method: "GET",
        ...ops
      });
      summary = response.payload.graphSummary as GraphSummary;
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
    fetchSchema,
    fetchVertexCountsByType,
    fetchNeighbors: fetchNeighborsFunc,
    fetchNeighborsCount: fetchNeighborsCountFunc,
    keywordSearch: keywordSearchFunc,
  };
};

export default useGremlin;
