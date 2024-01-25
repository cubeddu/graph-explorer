import { getSummaryApi } from "./actions/summaryApi/getSummaryAPI";
import DisplayConnections from "./display";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
// { params, searchParams }: Props // if need server to read params from url
export default async function Page({ params, searchParams }: Props) {
  const test = await getSummaryApi();
  console.log("🚀 ~ Page ~ test:", test);
  return (
    <>
      <DisplayConnections />
    </>
  );
}
