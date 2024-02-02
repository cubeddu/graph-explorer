"use client";

import CytoscapeGraph from "@/app/components/CitoGraph";
import GETable from "@/app/components/Table";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import CodeEditorDisplay from "./graph-explorer/CodeEditorDisplay";

export default function Form() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("layout", term);
    } else {
      params.delete("layout");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <input
      placeholder="test"
      onChange={(event) =>
        handleSearch(
          JSON.stringify([
            {
              id: "1",
              rowSpan: 5,
              columnSpan: 4,
              data: { title: "Graph View" },
            },
            {
              id: "2",
              rowSpan: 4,
              columnSpan: 4,
              data: { title: "Table View" },
            },
            {
              id: "3",
              rowSpan: 5,
              columnSpan: 4,
              data: {
                title: "Code Editor",
              },
            },
          ])
        )
      }
      defaultValue={searchParams.get("layout"?.toString()) || ""}
    />
  );
}
