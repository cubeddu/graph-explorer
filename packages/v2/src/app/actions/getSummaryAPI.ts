'use server'
export async function getSummaryApi() {
    const url = 'https://cole-snb-10-rdf-export-test-cluster.cluster-cjiepzx2kerx.us-west-2.neptune.amazonaws.com:8182'
    const slugType = 'rdf' || 'pg';
    const path = 'statistics/summary?mode=detailed';
    const urlToFetch = `${url}/${slugType}/${path}`;
    console.log('[getSummaryApi]: debugging before fetch', urlToFetch); // when debug mode on

    const response = await fetch(urlToFetch, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const result = await response.json();
    return result;
}
