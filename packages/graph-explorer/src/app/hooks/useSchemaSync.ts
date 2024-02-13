import { useCallback, useRef } from "react";
import { useNotification } from "../components/NotificationProvider";
import type { SchemaResponse } from "../connector/useGEFetchTypes";
import useConfiguration from "../core/ConfigurationProvider/useConfiguration";
import useConnector from "../core/ConnectorProvider/useConnector";
import usePrefixesUpdater from "./usePrefixesUpdater";
import useUpdateSchema from "./useUpdateSchema";
import { useRecoilValue } from "recoil";
import { mergedConfigurationSelector } from "../core/StateProvider/configuration";
import toast from "react-hot-toast";

const useSchemaSync = (onSyncChange?: (isSyncing: boolean) => void) => {
  const config = useRecoilValue(mergedConfigurationSelector);
  const connector = useConnector();

  const updatePrefixes = usePrefixesUpdater();
  const { enqueueNotification, clearNotification } = useNotification();
  const notificationId = useRef<string | null>(null);

  const updateSchemaState = useUpdateSchema();
  return useCallback(
    async () => {
      if (!config) {
        return;
      }

      onSyncChange?.(true);
      let schema: SchemaResponse | null = null;
      try {
        toast("Updating the Database schema");

        schema = await connector.explorer.fetchSchema();
      } catch (e) {

      }

      if (!schema?.vertices.length) {
        notificationId.current && clearNotification(notificationId.current);
        enqueueNotification({
          title: config.displayLabel || config.id,
          message: "This connection has no data available",
          type: "info",
          stackable: true,
        });
        connector.logger?.info(
          `[${config.displayLabel || config.id
          }] This connection has no data available: ${JSON.stringify(
            config.connection
          )}`
        );
      }

      updateSchemaState(config.id, schema);
      onSyncChange?.(false);

      notificationId.current && clearNotification(notificationId.current);
      enqueueNotification({
        title: config.displayLabel || config.id,
        message: "Connection successfully synchronized",
        type: "success",
        stackable: true,
      });
      connector.logger?.info(
        `[${config.displayLabel || config.id
        }] Connection successfully synchronized: ${JSON.stringify(
          config.connection
        )}`
      );

      const ids = schema.vertices.flatMap(v => [
        v.type,
        ...v.attributes.map(attr => attr.name),
      ]);
      ids.push(...schema.edges.map(e => e.type));
      updatePrefixes(ids);
    },
    [
      clearNotification,
      enqueueNotification,
      onSyncChange,
      updatePrefixes,
      updateSchemaState,
    ]
  );
};

export default useSchemaSync;
