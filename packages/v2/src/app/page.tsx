import router from "next/router";
import { getSummaryApi } from "./actions/summaryApi/getSummaryAPI";
import DisplayConnections from "./display";
import ClientTest from "./ClientTest";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("🚀 ~ searchParams:", searchParams);
  console.log("🚀 ~ params:", params);
  // when connection is set to active then we can proceed to call getSummaryApi and the rest of the api calls
  const summary = await getSummaryApi();
  console.log("🚀 ~ file: page.tsx:7 ~ Page ~ summary:", summary);
  // if (summary) call the rest of the api calls using the summary data
  // else build schema and call the rest of the api calls
  return (
    <>
      <ClientTest />
      <DisplayConnections />
    </>
  );
}
