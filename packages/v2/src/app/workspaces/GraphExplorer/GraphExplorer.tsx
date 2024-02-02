"use client";
import { cx } from "@emotion/css";
import debounce from "lodash/debounce";
import { Resizable } from "re-resizable";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  Button,
  EdgeIcon,
  IconButton,
  NamespaceIcon,
  PanelEmptyState,
} from "../../components";
import {
  DatabaseIcon,
  DetailsIcon,
  EmptyWidgetIcon,
  ExpandGraphIcon,
  FilterIcon,
  GraphIcon,
} from "../../components/icons";
import GridIcon from "../../components/icons/GridIcon";
import Workspace from "../../components/Workspace";
import {
  useConfiguration,
  useWithTheme,
  withClassNamePrefix,
} from "../../core";
import { edgesSelectedIdsAtom } from "../../core/StateProvider/edges";
import { nodesSelectedIdsAtom } from "../../core/StateProvider/nodes";
import { userLayoutAtom } from "../../core/StateProvider/userPreferences";
import { usePrevious } from "../../hooks";
import useTranslations from "../../hooks/useTranslations";
import EdgesStyling from "../../modules/EdgesStyling/EdgesStyling";
import EntitiesFilter from "../../modules/EntitiesFilter";
import EntitiesTabular from "../../modules/EntitiesTabular/EntitiesTabular";
import EntityDetails from "../../modules/EntityDetails";
import GraphViewer from "../../modules/GraphViewer";
import KeywordSearch from "../../modules/KeywordSearch/KeywordSearch";
import Namespaces from "../../modules/Namespaces/Namespaces";
import NodeExpand from "../../modules/NodeExpand";
import NodesStyling from "../../modules/NodesStyling/NodesStyling";
import TopBarWithLogo from "../common/TopBarWithLogo";
import defaultStyles from "./GraphExplorer.styles";
import Link from "next/link";

export type GraphViewProps = {
  classNamePrefix?: string;
};

const RESIZE_ENABLE_TOP = {
  top: true,
  right: false,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

const GraphExplorer = ({ classNamePrefix = "ft" }: GraphViewProps) => {
  const styleWithTheme = useWithTheme();
  const pfx = withClassNamePrefix(classNamePrefix);
  const config = useConfiguration();
  const t = useTranslations();
  const hasNamespaces = config?.connection?.queryEngine === "sparql";
  const [userLayout, setUserLayout] = useRecoilState(userLayoutAtom);

  const nodesSelectedIds = useRecoilValue(nodesSelectedIdsAtom);
  const edgesSelectedIds = useRecoilValue(edgesSelectedIdsAtom);
  const nodeOrEdgeSelected =
    nodesSelectedIds.size + edgesSelectedIds.size === 1;

  const closeSidebar = useCallback(() => {
    setUserLayout((prev) => ({
      ...prev,
      activeSidebarItem: null,
    }));
  }, [setUserLayout]);

  const toggleSidebar = useCallback(
    (item: string) => () => {
      setUserLayout((prev) => {
        if (prev.activeSidebarItem === item) {
          return {
            ...prev,
            activeSidebarItem: null,
          };
        }

        return {
          ...prev,
          activeSidebarItem: item,
        };
      });
    },
    [setUserLayout]
  );

  const toggleView = useCallback(
    (item: string) => () => {
      setUserLayout((prev) => {
        const toggles = new Set(prev.activeToggles);
        if (toggles.has(item)) {
          toggles.delete(item);
        } else {
          toggles.add(item);
        }

        return {
          ...prev,
          activeToggles: toggles,
        };
      });
    },
    [setUserLayout]
  );

  const onTableViewResizeStop = useCallback(
    (_e: unknown, _dir: unknown, _ref: unknown, delta: { height: number }) => {
      setUserLayout((prev) => {
        return {
          ...prev,
          tableView: {
            ...(prev.tableView || {}),
            height: (prev.tableView?.height ?? 300) + delta.height,
          },
        };
      });
    },
    [setUserLayout]
  );

  const toggles = userLayout.activeToggles;
  const [customizeNodeType, setCustomizeNodeType] = useState<
    string | undefined
  >();
  const [customizeEdgeType, setCustomizeEdgeType] = useState<
    string | undefined
  >();

  const prevActiveSidebarItem = usePrevious(userLayout.activeSidebarItem);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceAutoOpenDetails = useCallback(
    debounce((nodeOrEdgeSelected: boolean) => {
      if (!nodeOrEdgeSelected) {
        return;
      }

      if (
        userLayout.detailsAutoOpenOnSelection === false ||
        userLayout.activeSidebarItem !== null
      ) {
        return;
      }

      if (prevActiveSidebarItem != null) {
        return;
      }

      setUserLayout((prevState) => ({
        ...prevState,
        activeSidebarItem: "details",
      }));
    }, 400),
    [
      setUserLayout,
      prevActiveSidebarItem,
      userLayout.activeSidebarItem,
      userLayout.detailsAutoOpenOnSelection,
    ]
  );

  useEffect(() => {
    debounceAutoOpenDetails(nodeOrEdgeSelected);
  }, [debounceAutoOpenDetails, nodeOrEdgeSelected]);

  return (
    <Workspace.Content>
      {toggles.size === 0 && (
        <div style={{ width: "100%", flexGrow: 1 }}>
          <PanelEmptyState
            icon={<EmptyWidgetIcon />}
            title={"No active views"}
            subtitle={"Use toggles in the top-right corner to show/hide views"}
          />
        </div>
      )}
      {toggles.size === 0 && (
        <div style={{ width: "100%", flexGrow: 1 }}>
          <PanelEmptyState
            icon={<EmptyWidgetIcon />}
            title={"No active views"}
            subtitle={"Use toggles in the top-right corner to show/hide views"}
          />
        </div>
      )}
      {toggles.has("graph-viewer") && (
        <div
          style={{
            width: "100%",
            flexGrow: 1,
            position: "relative",
          }}
        >
          <GraphViewer
            onNodeCustomize={setCustomizeNodeType}
            onEdgeCustomize={setCustomizeEdgeType}
          />
        </div>
      )}
      {toggles.has("table-view") && (
        <Resizable
          enable={RESIZE_ENABLE_TOP}
          size={{
            width: "100%",
            height: !toggles.has("graph-viewer")
              ? "100%"
              : userLayout.tableView?.height || 300,
          }}
          minHeight={300}
          onResizeStop={onTableViewResizeStop}
        >
          <div style={{ width: "100%", height: "100%", flexGrow: 1 }}>
            <EntitiesTabular />
          </div>
        </Resizable>
      )}
    </Workspace.Content>
  );
};

export default GraphExplorer;
