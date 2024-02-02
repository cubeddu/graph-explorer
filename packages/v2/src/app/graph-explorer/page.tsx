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
    // {
    //   id: "3",
    //   rowSpan: 5,
    //   columnSpan: 4,
    //   data: {
    //     title: "Code Editor",
    //     content: <CodeEditorDisplay />,
    //   },
    // },
  ]);

  return (
    <Container fitHeight>
      <ColumnLayout>
        <SpaceBetween size="m">
          <div>
            <Board
              empty={<div>Empty</div>}
              renderItem={(item: {
                data: { title: string; content: string };
              }) => (
                <BoardItem
                  header={<Header>{item.data.title}</Header>}
                  i18nStrings={{
                    dragHandleAriaLabel: "Drag handle",
                    dragHandleAriaDescription:
                      "Use Space or Enter to activate drag, arrow keys to move, Space or Enter to submit, or Escape to discard.",
                    resizeHandleAriaLabel: "Resize handle",
                    resizeHandleAriaDescription:
                      "Use Space or Enter to activate resize, arrow keys to move, Space or Enter to submit, or Escape to discard.",
                  }}
                >
                  {item.data.content}
                </BoardItem>
              )}
              onItemsChange={(event) => setItems(event.detail.items)}
              items={items}
              i18nStrings={(() => {
                function createAnnouncement(
                  operationAnnouncement,
                  conflicts,
                  disturbed
                ) {
                  const conflictsAnnouncement =
                    conflicts.length > 0
                      ? `Conflicts with ${conflicts
                          .map((c) => c.data.title)
                          .join(", ")}.`
                      : "";
                  const disturbedAnnouncement =
                    disturbed.length > 0
                      ? `Disturbed ${disturbed.length} items.`
                      : "";
                  return [
                    operationAnnouncement,
                    conflictsAnnouncement,
                    disturbedAnnouncement,
                  ]
                    .filter(Boolean)
                    .join(" ");
                }
                return {
                  liveAnnouncementDndStarted: (operationType) =>
                    operationType === "resize" ? "Resizing" : "Dragging",
                  liveAnnouncementDndItemReordered: (operation) => {
                    const columns = `column ${operation.placement.x + 1}`;
                    const rows = `row ${operation.placement.y + 1}`;
                    return createAnnouncement(
                      `Item moved to ${
                        operation.direction === "horizontal" ? columns : rows
                      }.`,
                      operation.conflicts,
                      operation.disturbed
                    );
                  },
                  liveAnnouncementDndItemResized: (operation) => {
                    const columnsConstraint = operation.isMinimalColumnsReached
                      ? " (minimal)"
                      : "";
                    const rowsConstraint = operation.isMinimalRowsReached
                      ? " (minimal)"
                      : "";
                    const sizeAnnouncement =
                      operation.direction === "horizontal"
                        ? `columns ${operation.placement.width}${columnsConstraint}`
                        : `rows ${operation.placement.height}${rowsConstraint}`;
                    return createAnnouncement(
                      `Item resized to ${sizeAnnouncement}.`,
                      operation.conflicts,
                      operation.disturbed
                    );
                  },
                  liveAnnouncementDndItemInserted: (operation) => {
                    const columns = `column ${operation.placement.x + 1}`;
                    const rows = `row ${operation.placement.y + 1}`;
                    return createAnnouncement(
                      `Item inserted to ${columns}, ${rows}.`,
                      operation.conflicts,
                      operation.disturbed
                    );
                  },
                  liveAnnouncementDndCommitted: (operationType) =>
                    `${operationType} committed`,
                  liveAnnouncementDndDiscarded: (operationType) =>
                    `${operationType} discarded`,
                  liveAnnouncementItemRemoved: (op) =>
                    createAnnouncement(
                      `Removed item ${op.item.data.title}.`,
                      [],
                      op.disturbed
                    ),
                  navigationAriaLabel: "Board navigation",
                  navigationAriaDescription:
                    "Click on non-empty item to move focus over",
                  navigationItemAriaLabel: (item) =>
                    item ? item.data.title : "Empty",
                };
              })()}
            />
          </div>
        </SpaceBetween>
      </ColumnLayout>
    </Container>
  );
}
