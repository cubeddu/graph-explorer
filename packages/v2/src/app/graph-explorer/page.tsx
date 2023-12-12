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

export default function Page() {
  const [visible, setVisible] = React.useState(false);
  const [readOnlyWithErrors, setReadOnlyWithErrors] = React.useState(false);
  const [ace, setAce] = React.useState(undefined);
  const [codeEditorLoading, setCodeEditorLoading] = React.useState(true);
  const [codeEditorValue, setCodeEditorValue] = React.useState(
    false ? "{ invalidJson }" : ""
  );
  const [codeEditorPreferences, setCodeEditorPreferences] =
    React.useState(undefined);
  const [isDark, setThemeMode] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([
    { name: "Item 2" },
  ]);

  const onCodeEditorChange = (e: {
    detail: { value: React.SetStateAction<string> };
  }) => {
    !readOnlyWithErrors && setCodeEditorValue(e.detail.value);
  };

  const onCodeEditorPreferencesChange = (e: {
    detail: React.SetStateAction<undefined>;
  }) => {
    !readOnlyWithErrors && setCodeEditorPreferences(e.detail);
  };

  React.useEffect(() => {
    console.log("isDark", isDark);
    applyMode(isDark ? Mode.Dark : Mode.Light);
    applyDensity(Density.Comfortable);
  }, [isDark]);

  React.useEffect(() => {
    setCodeEditorLoading(true);
    import("ace-builds").then((ace) => {
      ace.config.set("basePath", "./libs/ace/");
      setAce(ace as any);
      setCodeEditorLoading(false);
    });
  }, []);

  return (
    <ContentLayout
      header={
        <TopNavigation
          identity={{
            href: "#",
            title: "Graph Explorer",
          }}
          utilities={[
            {
              type: "button",
              text: "Connections",
              href: "/connections",
            },
            {
              type: "button",
              text: "Data Explorer",
              href: "/data-explorer/connect",
            },
            {
              type: "button",
              text: "Graph Explorer",
              href: "/graph-explorer",
            },
          ]}
        />
      }
    >
      <ColumnLayout>
        <Container
          header={
            <Header variant="h2">
              <SpaceBetween direction="horizontal" size="l">
                Available connections{" "}
                <Button onClick={() => setThemeMode(!isDark)}>
                  <Icon name="upload" />
                </Button>
                <Button onClick={() => setVisible(true)}>
                  <Icon name="add-plus" />
                </Button>
              </SpaceBetween>
            </Header>
          }
        >
          <SpaceBetween size="m">
            <Board
              renderItem={(item) => (
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
                  <SpaceBetween size="m">
                    <div>
                      <Badge color="blue">{item.data.label}</Badge>
                    </div>
                    <div>{item.data.url}</div>
                  </SpaceBetween>
                  {item.data.content}
                </BoardItem>
              )}
              onItemsChange={(event) => setItems(event.detail.items)}
              items={[
                {
                  id: "1",
                  rowSpan: 1,
                  columnSpan: 1,
                  data: {
                    title: "connection1",
                    url: "http://localhost:8182",
                    label: "Gremlin - (PG)",
                  },
                },
                {
                  id: "2",
                  rowSpan: 1,
                  columnSpan: 1,
                  data: {
                    title: "connection 2",
                    url: "http://localhost:8182",
                    label: "OpenCypher - (PG)",
                  },
                },
                {
                  id: "3",
                  rowSpan: 1,
                  columnSpan: 3,
                  data: {
                    title: "Connection 3",
                    url: "https://neptune.aws.com/8182",
                    label: "SPARQL - (RDF)",
                  },
                },
              ]}
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
          </SpaceBetween>
        </Container>
      </ColumnLayout>
    </ContentLayout>
  );
}
