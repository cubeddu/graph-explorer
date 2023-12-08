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
      <ColumnLayout columns={2}>
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
        <Container header={<Header variant="h2">Connection</Header>}>
          <ProgressBar
            value={36}
            additionalInfo="fetching schema information"
            label="Syncronizing"
          />
        </Container>
        <div>
          <h3></h3>
        </div>
      </ColumnLayout>
      {/* <Container
          id="cache-behavior-panel"
          className="custom-screenshot-hide"
          header={<Header variant="h2">Cache behavior settings</Header>}
        >
          <SpaceBetween size="l">
            <FormField
              label="Create policy"
              description="Create a policy for your cache behavior settings."
              stretch={true}
            >
              <CodeEditor
                ace={ace}
                value={codeEditorValue}
                language="caca"
                onChange={onCodeEditorChange}
                preferences={codeEditorPreferences}
                onPreferencesChange={onCodeEditorPreferencesChange}
                loading={codeEditorLoading}
              />
            </FormField>
          </SpaceBetween>
        </Container> */}
      {/* <Table
          onSelectionChange={({ detail }) =>
            setSelectedItems(detail.selectedItems)
          }
          selectedItems={selectedItems}
          ariaLabels={{
            selectionGroupLabel: "Items selection",
            allItemsSelectionLabel: ({ selectedItems }) =>
              `${selectedItems.length} ${
                selectedItems.length === 1 ? "item" : "items"
              } selected`,
            itemSelectionLabel: ({ selectedItems }, item) => item.name,
          }}
          columnDefinitions={[
            {
              id: "variable",
              header: "Variable name",
              cell: (item) => <Link href="#">{item.name}</Link>,
              sortingField: "name",
              isRowHeader: true,
            },
            {
              id: "value",
              header: "Text value",
              cell: (item) => item.alt,
              sortingField: "alt",
            },
            {
              id: "type",
              header: "Type",
              cell: (item) => item.type,
            },
            {
              id: "description",
              header: "Description",
              cell: (item) => item.description,
            },
          ]}
          columnDisplay={[
            { id: "variable", visible: true },
            { id: "value", visible: true },
            { id: "type", visible: true },
            { id: "description", visible: true },
          ]}
          items={[
            {
              name: "Item 1",
              alt: "First",
              description: "This is the first item",
              type: "1A",
              size: "Small",
            },
            {
              name: "Item 2",
              alt: "Second",
              description: "This is the second item",
              type: "1B",
              size: "Large",
            },
            {
              name: "Item 3",
              alt: "Third",
              description: "-",
              type: "1A",
              size: "Large",
            },
            {
              name: "Item 4",
              alt: "Fourth",
              description: "This is the fourth item",
              type: "2A",
              size: "Small",
            },
            {
              name: "Item 5",
              alt: "-",
              description: "This is the fifth item with a longer description",
              type: "2A",
              size: "Large",
            },
            {
              name: "Item 6",
              alt: "Sixth",
              description: "This is the sixth item",
              type: "1A",
              size: "Small",
            },
          ]}
          loadingText="Loading resources"
          selectionType="multi"
          trackBy="name"
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No resources</b>
                <Button>Create resource</Button>
              </SpaceBetween>
            </Box>
          }
          filter={
            <TextFilter
              filteringPlaceholder="Find resources"
              filteringText=""
            />
          }
          header={
            <Header
              counter={
                selectedItems.length
                  ? "(" + selectedItems.length + "/10)"
                  : "(10)"
              }
            >
              Table with common features
            </Header>
          }
          pagination={<Pagination currentPageIndex={1} pagesCount={2} />}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={{
                pageSize: 10,
                contentDisplay: [
                  { id: "variable", visible: true },
                  { id: "value", visible: true },
                  { id: "type", visible: true },
                  { id: "description", visible: true },
                ],
              }}
              pageSizePreference={{
                title: "Page size",
                options: [
                  { value: 10, label: "10 resources" },
                  { value: 20, label: "20 resources" },
                ],
              }}
              wrapLinesPreference={{}}
              stripedRowsPreference={{}}
              contentDensityPreference={{}}
              contentDisplayPreference={{
                options: [
                  {
                    id: "variable",
                    label: "Variable name",
                    alwaysVisible: true,
                  },
                  { id: "value", label: "Text value" },
                  { id: "type", label: "Type" },
                  { id: "description", label: "Description" },
                ],
              }}
              stickyColumnsPreference={{
                firstColumns: {
                  title: "Stick first column(s)",
                  description:
                    "Keep the first column(s) visible while horizontally scrolling the table content.",
                  options: [
                    { label: "None", value: 0 },
                    { label: "First column", value: 1 },
                    { label: "First two columns", value: 2 },
                  ],
                },
                lastColumns: {
                  title: "Stick last column",
                  description:
                    "Keep the last column visible while horizontally scrolling the table content.",
                  options: [
                    { label: "None", value: 0 },
                    { label: "Last column", value: 1 },
                  ],
                },
              }}
            />
          }
        /> */}
      <Modal
        onDismiss={() => setVisible(false)}
        visible={visible}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setVisible(false)} variant="link">
                Cancel
              </Button>
              <Button variant="primary">Add Connection</Button>
            </SpaceBetween>
          </Box>
        }
        header="Add New Connection"
      >
        <SpaceBetween direction="vertical" size="m">
          <FormField stretch={true} label="Name">
            <Input value="Connection" />
          </FormField>
          <FormField stretch={true} label="Neptune Endpoint">
            <Textarea
              onChange={({ detail }) => console.log(detail.value)}
              value={""}
              placeholder="https://neptune.aws.com:8182"
            />
          </FormField>
          <FormField stretch={true} label="Graph Type">
            <Tiles
              onChange={({ detail }) => console.log(detail.value)}
              value={"item1"}
              items={[
                {
                  label: "Gremlin - (PG)",
                  value: "item1",
                  description: "This is a description for item 1",
                },
                {
                  label: "OpenCypher - (PG)",
                  value: "item2",
                  description: "This is a description for item 2",
                },
                {
                  label: "SPARQL - (RDF)",
                  value: "item3",
                  description: "This is a description for item 3",
                },
              ]}
            />
          </FormField>

          {/* <FormField stretch={true}>
          <Checkbox
            onChange={({ detail }) => console.log(detail.checked)}
            checked={false}
          >
            Using Proxy-Server
          </Checkbox>
        </FormField> */}
          {/* <FormField stretch={true}>
          <Checkbox
            onChange={({ detail }) => console.log(detail.checked)}
            checked={false}
          >
            Enable Cache
          </Checkbox>
        </FormField> */}
          <ExpandableSection headerText="Additional Settings">
            After you enable your S3 bucket for static website hosting, web
            browsers can access your content through the Amazon S3 website
            endpoint for the bucket.
          </ExpandableSection>
          <FormField stretch={true}>
            <Checkbox
              onChange={({ detail }) => console.log(detail.checked)}
              checked={false}
            >
              Enable Fetch Timeout
            </Checkbox>
          </FormField>
        </SpaceBetween>
      </Modal>
    </ContentLayout>
  );
}
