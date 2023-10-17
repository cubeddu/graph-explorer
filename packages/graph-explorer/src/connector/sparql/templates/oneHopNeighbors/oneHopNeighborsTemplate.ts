import { SPARQLNeighborsRequest } from "../../types";
import { getFilters, getLimit, getSubjectClasses } from "./helpers";

/**
 * Fetch all neighbors and their predicates, values, and classes.
 *
 * @example
 * resourceURI = "http://www.example.com/soccer/resource#EPL"
 * subjectClasses = [
 *   "http://www.example.com/soccer/ontology/Team",
 * ]
 * filterCriteria = [
 *   { predicate: "http://www.example.com/soccer/ontology/teamName", object: "Arsenal" },
 *   { predicate: "http://www.example.com/soccer/ontology/nickname", object: "Gunners" },
 * ]
 * limit = 2
 * offset = 0
 *
 * SELECT ?subject ?pred ?value ?subjectClass ?pToSubject ?pFromSubject {
 *   ?subject a     ?subjectClass;
 *            ?pred ?value {
 *     SELECT DISTINCT ?subject ?pToSubject ?pFromSubject {
 *       BIND(<http://www.example.com/soccer/resource#EPL> AS ?argument)
 *       VALUES ?subjectClass {
 *         <http://www.example.com/soccer/ontology/Team>
 *       }
 *       {
 *         ?argument ?pToSubject ?subject.
 *         ?subject a            ?subjectClass;
 *                  ?sPred       ?sValue .
 *         FILTER (
 *           (?sPred=<http://www.example.com/soccer/ontology/teamName> && regex(str(?sValue), "Arsenal", "i")) ||
 *           (?sPred=<http://www.example.com/soccer/ontology/nickname> && regex(str(?sValue), "Gunners", "i"))
 *         )
 *       }
 *       UNION
 *       {
 *         ?subject ?pFromSubject ?argument;
 *                  a             ?subjectClass;
 *                  ?sPred        ?sValue .
 *        FILTER (
 *           (?sPred=<http://www.example.com/soccer/ontology/teamName> && regex(str(?sValue), "Arsenal", "i")) ||
 *           (?sPred=<http://www.example.com/soccer/ontology/nickname> && regex(str(?sValue), "Gunners", "i"))
 *         )
 *       }
 *     }
 *     LIMIT 2
 *     OFFSET 0
 *   }
 *   FILTER(isLiteral(?value))
 * }
 */
const oneHopNeighborsTemplate = ({
  resourceURI,
  subjectClasses = [],
  filterCriteria = [],
  limit = 0,
  offset = 0,
}: SPARQLNeighborsRequest): string => {
  console.log("🚀 ~ file: oneHopNeighborsTemplate.ts:60 ~ oneHopNeighborsTemplate:", oneHopNeighborsTemplate)

  return `
     SELECT ?subject ?pred ?value ?subjectClass ?pToSubject ?pFromSubject
      WHERE {
        BIND(<${resourceURI}> AS ?argument)

        ?subject ?pred ?value.
        FILTER(isLiteral(?value))

        {
          ?argument ?pToSubject ?subject.
          ?subject a ?subjectClass;
                  ?sPred ?sValue.
          ${getSubjectClasses(subjectClasses)}
          ${getFilters(filterCriteria)}
        }
        UNION
        {
          ?subject ?pFromSubject ?argument.
          ?subject a ?subjectClass;
                  ?sPred ?sValue.
          ${getSubjectClasses(subjectClasses)}
          ${getFilters(filterCriteria)}
        }
      }
      ${getLimit(limit, offset)}
  `;
};

export default oneHopNeighborsTemplate;
