"use client";
import React from "react";
import { Provider, createStore } from "jotai";
import {
  AppLayout,
  Box,
  Button,
  ContentLayout,
  Header,
  HelpPanel,
  Icon,
  Link,
  SpaceBetween,
  TopNavigation,
} from "@cloudscape-design/components";
import { ExplorerIcon } from "@/components";

export default function Providers({ children }: { children: React.ReactNode }) {
  const myStore = createStore();
  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            info={
              <Link>
                <Box variant="small">Version</Box> 2.0.0
              </Link>
            }
            actions={
              <Button
                iconAlign="right"
                variant="primary"
                href="/graph-explorer"
              >
                {/* <ExplorerIcon width={30} height={30} /> */}
                Open Graph Explorer
              </Button>
            }
          >
            Graph Explorer
          </Header>
        </SpaceBetween>
      }
    >
      <Provider store={myStore}>{children}</Provider>
    </ContentLayout>
  );
}
