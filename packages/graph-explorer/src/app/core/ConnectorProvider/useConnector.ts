import { useContext } from "react";
import { ConnectorContext } from "./ConnectorProvider";

const useConnector = () => {
  const context = useContext(ConnectorContext);
  console.log("🚀 ~ useConnector ~ context:", context)

  if (!context) {
    throw new Error("Cannot useConnector outside ConnectorProvider");
  }

  return context;
};

export default useConnector;
