
import { NextResponse } from "next/server";
import { getSummaryApi } from "../../actions/summaryApi/getSummaryAPI";

export async function GET(request: Request) {
    const graphDBUrl = request.headers.get('graph-db-connection-url');
    console.log("🚀 ~ GET ~ graphDBUrl:", graphDBUrl)
    const res = await getSummaryApi({ url: graphDBUrl, slug: 'pg', path: "statistics/summary?mode=detailed" });
    if (!res) {
        return NextResponse.json({ error: "Error fetching summary" });
    }
    console.log("res: ", res);

    return NextResponse.json(res)
}
