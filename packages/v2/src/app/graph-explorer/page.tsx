"use client";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Board from "@cloudscape-design/board-components/board";
import BoardItem from "@cloudscape-design/board-components/board-item";
import { ColumnLayout, Container, Header } from "@cloudscape-design/components";
import {
  applyMode,
  applyDensity,
  Density,
  Mode,
} from "@cloudscape-design/global-styles";
import ClientTest from "../ClientTest";
import CodeEditorDisplay from "./CodeEditorDisplay";
import { StoreContext } from "../StoreProvider";
import GraphExplorer from "@/app/workspaces/GraphExplorer";
import EntitiesTabular from "@/app/modules/EntitiesTabular/EntitiesTabular";
import GraphViewer from "@/app/modules/GraphViewer";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const { isDarkMode: isDark } = useContext(StoreContext);
  const [selectedItems, setSelectedItems] = useState([{ name: "Item 2" }]);
  const [customizeNodeType, setCustomizeNodeType] = useState<
    string | undefined
  >();
  const [customizeEdgeType, setCustomizeEdgeType] = useState<
    string | undefined
  >();

  const [items, setItems] = useState([
    {
      id: "1",
      rowSpan: 5,
      columnSpan: 4,
      data: {
        title: "Graph View",
        content: (
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
        ),
      },
    },
    {
      id: "2",
      rowSpan: 4,
      columnSpan: 4,
      data: {
        title: "Table View",
        content: (
          <div style={{ width: "100%", height: "100%", flexGrow: 1 }}>
            <EntitiesTabular />
          </div>
        ),
      },
    },
  ]);

  return <GraphExplorer />;
}
