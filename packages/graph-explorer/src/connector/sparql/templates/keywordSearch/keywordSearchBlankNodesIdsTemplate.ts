import { SPARQLKeywordSearchRequest } from "../../types";
import {
  getFilterObject,
  getFilterPredicates,
  getSubjectClasses,
} from "./helpers";

/**
 * This generates a template to get all blank nodes ids from
 * a generic keyword search request.
 *
 * @see keywordSearchTemplate
 */
const keywordSearchBlankNodesIdsTemplate = ({
  searchTerm,
  subjectClasses = [],
  predicates = [],
  limit = 100,
  offset = 0,
}: SPARQLKeywordSearchRequest): string => {
  return `
   SELECT DISTINCT ?bNode
    WHERE {
      ?bNode a ?class;
            ?predicate ?value.
      ${getFilterPredicates(predicates)}
      ${getSubjectClasses(subjectClasses)}
      ${getFilterObject(searchTerm)}
      
      FILTER(isLiteral(?value) && isBlank(?bNode))
    }
    ${limit > 0 ? `LIMIT ${limit} OFFSET ${offset}` : ""}
  `;
};

export default keywordSearchBlankNodesIdsTemplate;
