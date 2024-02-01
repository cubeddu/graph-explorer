'use server';
import { getLogger } from "../../utils/pino";
import { SummaryApiResponse, schema } from "./schema";
const logger = getLogger("getSummaryAPi");

export async function getSummaryApi() {
    const url = 'https://nep-export-test-1.cluster-cjiepzx2kerx.us-west-2.neptune.amazonaws.com:8182/pg/statistics/summary?mode=detailed'
    const slug = 'pg' || 'rdf';
    const path = 'statistics/summary?mode=detailed';
    const urlToFetch = `${url}/${slug}/${path}`;
    logger.debug({ href: urlToFetch }, "DEBUG getSummaryApi: urlToFetch");

    const response = await fetch("https://nep-export-test-1.cluster-cjiepzx2kerx.us-west-2.neptune.amazonaws.com:8182/rdf/statistics/summary?mode=detailed", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        logger.error({ status: response.status, statusText: response.statusText }, "DEBUG getSummaryApi: response");
        return undefined;
    }

    const result = await response.json();
    const parsedPayload = schema.safeParse(result);
    console.log("🚀 ~ getSummaryApi ~ parsedPayload:", parsedPayload)
    if (!parsedPayload.success) {
        // Handle validation errors
        logger.error({ errors: parsedPayload.error.flatten().fieldErrors }, "DEBUG getSummaryApi: parsedPayload.error");
        return undefined;

    }
    // Access parsed data safely
    const summaryApi: SummaryApiResponse['payload']['graphSummary'] =
        parsedPayload.data.payload.graphSummary;
    logger.debug({ summaryApi }, "DEBUG getSummaryApi: result");
    // return summaryApi;
    return parsedPayload.data.payload.graphSummary;
}