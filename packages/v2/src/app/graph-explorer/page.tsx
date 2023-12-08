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
    <AppLayout
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
    />
  );
}
