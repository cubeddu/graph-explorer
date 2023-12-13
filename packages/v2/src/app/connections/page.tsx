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
  Toggle,
  TopNavigation,
} from "@cloudscape-design/components";
import TopBarWithLogo from "@/workspaces/common/TopBarWithLogo";
import GraphExplorerIcon from "@/components/icons/GraphExplorerIcon";

import {
  applyMode,
  applyDensity,
  Density,
  Mode,
} from "@cloudscape-design/global-styles";
import AvailableConnections from "@/modules/AvailableConnections";
import Switch from "@/components/Switch";

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

  const [checked, setChecked] = React.useState(false);

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
            <Header
              variant="h2"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button>Action</Button>
                  <Button>Another action</Button>
                </SpaceBetween>
              }
            >
              Available connections
            </Header>
          }
        >
          <SpaceBetween size="m">
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Badge color="blue">Gremlin - (PG)</Badge>
              <div />
              <Toggle
                onChange={({ detail }) => setChecked(detail.checked)}
                checked={checked}
              >
                {checked ? "Active" : "Inactive"}
              </Toggle>
            </div>
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
