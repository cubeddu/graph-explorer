import DisplayConnections from "./display";

export default function Page() {
  // when connection is set to active then we can proceed to call getSummaryApi and the rest of the api calls
  // const summary = getSummaryApi();
  // console.log("🚀 ~ file: page.tsx:7 ~ Page ~ summary:", summary);
  // if (summary) call the rest of the api calls using the summary data
  // else build schema and call the rest of the api calls
  return <DisplayConnections />;
}
