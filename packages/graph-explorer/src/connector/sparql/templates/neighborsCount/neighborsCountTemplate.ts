import { SPARQLNeighborsCountRequest } from "../../types";

/**
 * Count neighbors by class which are related with the given subject URI.
 *
 * @example
 * resourceURI = "http://kelvinlawrence.net/air-routes/resource/2018"
 * limit = 10
 *
 * SELECT ?class (COUNT(?class) AS ?count) {
 *   SELECT DISTINCT ?subject ?class {
 *     ?subject a ?class .
 *     { ?subject ?p <http://kelvinlawrence.net/air-routes/resource/2018> }
 *     UNION
 *     { <http://kelvinlawrence.net/air-routes/resource/2018> ?p ?subject }
 *   }
 *   LIMIT 10
 * }
 * GROUP BY ?class
 */
const neighborsCountTemplate = ({
  resourceURI,
  limit = 0,
}: SPARQLNeighborsCountRequest) => {
  return `
    SELECT ?class (COUNT(DISTINCT ?subject) AS ?count)
    WHERE {
      ?subject a ?class .
      {
        { ?subject ?p <${resourceURI}> }
        UNION
        { <${resourceURI}> ?p ?subject }
      }
    }
    GROUP BY ?class
    ${limit > 0 ? `LIMIT ${limit}` : ""}
  `;
};

export default neighborsCountTemplate;
