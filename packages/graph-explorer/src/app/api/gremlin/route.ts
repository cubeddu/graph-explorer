
import { NextResponse } from "next/server";
import { getSummaryApi } from "../../actions/summaryApi/getSummaryAPI";

export async function GET(request: Request) {
    const graphDBUrl = request.headers.get('graph-db-connection-url');
    console.log("🚀 ~ GET ~ graphDBUrl:", graphDBUrl)
    const res = await getSummaryApi({ url: graphDBUrl, slug: 'pg', path: "statistics/summary?mode=detailed" });
    const data = await res.json()
    if (!res.ok) {
        return NextResponse.json({ error: "Error fetching summary" });
    }
    console.log("res: ", data);

    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const graphDBUrl = request.headers.get('graph-db-connection-url');
    console.log("🚀 ~ POST ~ request.headers:", request.headers)
    const test = request.headers.get('query');
    const rawUrl = `${graphDBUrl}/gremlin`;

    console.log("🚀 ~ POST ~ requestOptions.request.body:", test)
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ gremlin: test }),
    };


    const res = await fetch(rawUrl, requestOptions)
    const data = await res.json()
    console.log("🚀 ~ POST ~ data:", data)

    return NextResponse.json(data)
}
