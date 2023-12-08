/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import LoggerConnector from "../../connector/LoggerConnector";
import useConfiguration from "../ConfigurationProvider/useConfiguration";
import type { ConnectorContextProps } from "./types";
import useOpenCypher from "../../connector/openCypher/useOpenCypher";
import useSPARQL from "../../connector/sparql/useSPARQL";
import useGremlin from "../../connector/gremlin/useGremlin";

export const ConnectorContext = createContext<ConnectorContextProps>({});
function useExplorer(connecting: Connecting, queryEngine: string) {
  const sparql = useSPARQL(connecting);
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
    if (config?.connection?.url) {
      const explorer = useExplorer(
        connecting!,
        config?.connection?.queryEngine
      );
      const logger = new LoggerConnector(config?.connection?.url, {
        enable: import.meta.env.PROD,
      });

      setConnector({ explorer, logger });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We Only Want
  }, [config?.connection?.url, config?.connection?.queryEngine]);
  return (
    <ConnectorContext.Provider value={connector}>
      {children}
    </ConnectorContext.Provider>
  );
};

export default ConnectorProvider;
