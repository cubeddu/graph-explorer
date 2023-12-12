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
      <Container
        id="cache-behavior-panel"
        className="custom-screenshot-hide"
        header={<Header variant="h2">Schema</Header>}
      >
        <SpaceBetween size="l">
          <CodeEditor
            ace={ace}
            value={codeEditorValue}
            language="json"
            onChange={onCodeEditorChange}
            preferences={codeEditorPreferences}
            loading={codeEditorLoading}
          />
        </SpaceBetween>
      </Container>
      <Container
        header={
          <Header
            variant="h1"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Select
                  selectedOption={{
                    label: "Resource URI",
                    value: "1",
                    iconName: "settings",
                    description: "This is a description",
                  }}
                  onChange={({ detail }) => console.log(detail.selectedOption)}
                  options={[
                    { label: "Resource URI", value: "1" },
                    { label: "Class", value: "2" },
                    { label: "nep:code", value: "3" },
                    { label: "nep:type", value: "4" },
                    { label: "nep:desc", value: "5" },
                  ]}
                />
                <Select
                  selectedOption={{
                    label: "Class",
                    value: "1",
                    iconName: "settings",
                    description: "This is a description",
                  }}
                  onChange={({ detail }) => console.log(detail.selectedOption)}
                  options={[
                    { label: "Resource URI", value: "1" },
                    { label: "Class", value: "2" },
                    { label: "nep:code", value: "3" },
                    { label: "nep:type", value: "4" },
                    { label: "nep:desc", value: "5" },
                  ]}
                />
              </SpaceBetween>
            }
          >
            <Button href="/connections">Back to all Data</Button>
          </Header>
        }
      >
        <Table
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
              header: "Resource URI",
              cell: (item) => <Link href="#">{item.name}</Link>,
              sortingField: "name",
              isRowHeader: true,
            },
            {
              id: "value",
              header: "nep:type",
              cell: (item) => item.alt,
              sortingField: "alt",
            },
            {
              id: "type",
              header: "nep:code",
              cell: (item) => item.type,
            },
            {
              id: "description",
              header: "nep:desc",
              cell: (item) => item.description,
            },
            {
              id: "sendToGE",
              header: "",
              cell: (item) => (
                <Button>
                  <Icon name="insert-row" /> Send to Explorer
                </Button>
              ),
            },
          ]}
          columnDisplay={[
            { id: "variable", visible: true },
            { id: "value", visible: true },
            { id: "type", visible: true },
            { id: "description", visible: true },
            { id: "sendToGE", visible: true },
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
            {
              name: "Item 1",
              alt: "First",
              description: "This is the first item",
              type: "1A",
              size: "Small",
            },
            {
              name: "Item 22",
              alt: "Secondd",
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
            {
              name: "Item 1",
              alt: "First",
              description: "This is the first item",
              type: "1A",
              size: "Small",
            },
            {
              name: "Item 24",
              alt: "Secondd",
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
              nep:Country
            </Header>
          }
          pagination={<Pagination currentPageIndex={3} pagesCount={20} />}
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
                    label: "Resource URI",
                    alwaysVisible: true,
                  },
                  { id: "value", label: "nep:type" },
                  { id: "type", label: "nep:code" },
                  { id: "description", label: "nep:desc" },
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
        />
      </Container>
    </ContentLayout>
  );
}
