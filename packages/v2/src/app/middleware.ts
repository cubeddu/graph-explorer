import { NextResponse } from "next/server";

export function middleware(request: { headers?: any; connection?: any; }) {
  const { connection } = request;
  console.log("🚀 ~ middleware ~ connection:", connection)

  // Set headers conditionally based on connection properties
  request.headers.set(
    "graph-db-connection-url",
    (connection?.proxyConnection && connection.graphDbUrl) || ""
  );
  request.headers.set(
    "aws-neptune-region",
    (connection?.awsAuthEnabled && connection.graphDbRegion) || ""
  );

  return NextResponse.next();
}

export const config = {
  matcher: '*' as const,
}