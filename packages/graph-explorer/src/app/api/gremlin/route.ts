
import { NextResponse } from "next/server";
import { buffer } from 'micro';
import { getSummaryApi } from "../../actions/summaryApi/getSummaryAPI";

export async function GET(request: Request) {
    const graphDBUrl = request.headers.get('graph-db-connection-url');

    if (!graphDBUrl) {
        return NextResponse.json({ error: 'Missing graph-db-connection-url header' }, { status: 400 });
    }

    try {
        const res = await getSummaryApi({ url: graphDBUrl, slug: 'pg', path: "statistics/summary?mode=detailed" });
        return NextResponse.json(res);

    } catch (error) {
        console.error("Error in getSummaryApi:", error);
        return NextResponse.json({ error: 'An error occurred during data fetching' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const graphDBUrl = request.headers.get('graph-db-connection-url');

    // Parse the request body from the ReadableStream 
    const bufferData = await buffer(request);
    const body = bufferData.toString();

    try {
        const jsonData = JSON.parse(body);
        console.log("🚀 ~ POST ~ jsonData:", jsonData)

        const rawUrl = `${graphDBUrl}/gremlin`;
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gremlin: jsonData }),
        };

        const res = await fetch(rawUrl, requestOptions)
        const data = await res.json()

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error parsing JSON or fetching:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}