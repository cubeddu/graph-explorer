"use client";

import { createContext, PropsWithChildren, useEffect, useState } from "react";
import LoggerConnector from "../../connector/LoggerConnector";
import useConfiguration from "../ConfigurationProvider/useConfiguration";
import type { ConnectorContextProps } from "./types";
import useOpenCypher from "../../connector/openCypher/useOpenCypher";
import useSPARQL from "../../connector/sparql/useSPARQL";
import useGremlin from "../../connector/gremlin/useGremlin";

export const ConnectorContext = createContext<ConnectorContextProps>({});
function useExplorer(connecting: Connecting, queryEngine: string) {
  const [blankNodes] = useState(new Map<string, any>());
  const sparql = useSPARQL(connecting, blankNodes);
  const openCypher = useOpenCypher(connecting);
  const gremlin = useGremlin(connecting);

  switch (queryEngine) {
    case "sparql":
      return sparql;
    case "openCypher":
      return openCypher;
    default:
      return gremlin;
  }
}

const ConnectorProvider = ({ children }: PropsWithChildren<any>) => {
  const config = useConfiguration();

  const [connector, setConnector] = useState<ConnectorContextProps>({
    explorer: undefined,
    logger: undefined,
  });
  const connecting = config && config.connection;

  useEffect(() => {
    if (!connecting) {
      return;
    }

    const explorer = useExplorer(connecting, connecting.queryEngine);
    const logger = new LoggerConnector(connecting);

    setConnector({ explorer, logger });
  }, [connecting]);
  return (
    <ConnectorContext.Provider value={connector}>
      {children}
    </ConnectorContext.Provider>
  );
};

export default ConnectorProvider;
