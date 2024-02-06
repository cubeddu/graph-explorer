"use client";

import { createContext, PropsWithChildren, useEffect, useState } from "react";
import LoggerConnector from "../../connector/LoggerConnector";
import useConfiguration from "../ConfigurationProvider/useConfiguration";
import type { ConnectorContextProps } from "./types";
import useOpenCypher from "../../connector/openCypher/useOpenCypher";
import useSPARQL from "../../connector/sparql/useSPARQL";
import useGremlin from "../../connector/gremlin/useGremlin";
import { defaultLogger } from "@/app/utils/pino";

export const ConnectorContext = createContext<ConnectorContextProps>({});

const ConnectorProvider = ({ children }: PropsWithChildren<any>) => {
  const config = useConfiguration();
  const [engineType, setEngineType] = useState("gremlin");
  const [blankNodes] = useState(new Map<string, any>());
  const [getByExplorerEngineType] = useState({
    gremlin: useGremlin(config?.connection),
    // OC: useOpenCypher(config?.connection),
    // SPARQL: useSPARQL(config?.connection, blankNodes),
  }) as const;
  const [connector, setConnector] = useState<ConnectorContextProps>({
    explorer: undefined,
    logger: undefined,
  });
  const connecting = config && config.connection;

  useEffect(() => {
    if (!connecting) {
      return;
    }
    const explorer = getByExplorerEngineType[
      engineType
    ] as ConnectorContextProps["explorer"];
    const logger = defaultLogger;

    setConnector({ explorer, logger });

    return () => {
      const explorer = null;
      const logger = null;
    };
  }, [connecting, engineType, getByExplorerEngineType]);

  console.log("🚀 ~ ConnectorProvider ~ connector:", connector);

  return (
    <ConnectorContext.Provider value={connector}>
      {children}
    </ConnectorContext.Provider>
  );
};

export default ConnectorProvider;
