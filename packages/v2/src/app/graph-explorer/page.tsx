"use client";
import * as React from "react";
import Modal from "@cloudscape-design/components/modal";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Board from "@cloudscape-design/board-components/board";
import BoardItem from "@cloudscape-design/board-components/board-item";
import {
  Alert,
  AppLayout,
  Badge,
  BreadcrumbGroup,
  Cards,
  Checkbox,
  CodeEditor,
  CollectionPreferences,
  ColumnLayout,
  Container,
  ContentLayout,
  ExpandableSection,
  Header,
  Icon,
  Link,
  Pagination,
  ProgressBar,
  RadioGroup,
  Select,
  Table,
  TextFilter,
  Textarea,
  Tiles,
  TopNavigation,
} from "@cloudscape-design/components";
import TopBarWithLogo from "@/workspaces/common/TopBarWithLogo";
import GraphExplorerIcon from "@/components/icons/GraphExplorerIcon";
import { ExplorerIcon, IconButton } from "@/components";
import {
  applyMode,
  applyDensity,
  Density,
  Mode,
} from "@cloudscape-design/global-styles";
import CytoscapeGraph from "@/components/CitoGraph";
import GETable from "@/components/Table";
import ClientTest from "../ClientTest";
import CodeEditorDisplay from "./CodeEditorDisplay";
import { StoreContext } from "../StoreProvider";
import { atomWithToggleAndStorage } from "../state/atomWithToggleAndStorage";
import { atom, useAtom, useAtomValue } from "jotai";

export default function Page() {
  const { isDarkMode: isDark } = React.useContext(StoreContext);
  const [selectedItems, setSelectedItems] = React.useState([
    { name: "Item 2" },
  ]);

  const [items, setItems] = React.useState([
    {
      id: "1",
      rowSpan: 5,
      columnSpan: 4,
      data: { title: "Graph View", content: <CytoscapeGraph /> },
    },
    {
      id: "2",
      rowSpan: 4,
      columnSpan: 4,
      data: { title: "Table View", content: <GETable /> },
    },
    {
      id: "3",
      rowSpan: 5,
      columnSpan: 4,
      data: {
        title: "Code Editor",
        content: <CodeEditorDisplay />,
      },
    },
  ]);

  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    console.log("isDark", isDark);
    applyMode(isDark ? Mode.Dark : Mode.Light);
    applyDensity(Density.Comfortable);
  }, [isDark]);

  return (
    <Container fitHeight>
      <ColumnLayout>
        <ClientTest />
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
