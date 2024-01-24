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
  CollectionPreferences,
  Container,
  ContentLayout,
  Header,
  Link,
  Pagination,
  Select,
  Table,
  TextFilter,
} from "@cloudscape-design/components";

export default function Page() {
  const [selectedItems, setSelectedItems] = React.useState([]);
  return (
    <ContentLayout>
      <Container
        fitHeight
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
            <Button href="/">Back to all Data</Button>
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
                <Button href="/graph-explorer">Send to Explorer</Button>
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
              name: "Comment 1",
              alt: "-",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
              type: "2A",
              size: "Large",
            },
            {
              name: "Comment 2",
              alt: "Sixth",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              type: "1A",
              size: "Small",
            },
            {
              name: "Comment 3",
              alt: "First",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              type: "1A",
              size: "Small",
            },
            {
              name: "Comment 4",
              alt: "First",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              type: "1A",
              size: "Small",
            },
            {
              name: "Comment 5",
              alt: "First",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              type: "1A",
              size: "Small",
            },
            {
              name: "Comment 6",
              alt: "First",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
          pagination={<Pagination currentPageIndex={1} pagesCount={25} />}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={{
                pageSize: 25,
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
