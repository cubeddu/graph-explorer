/**
 * Fetch all neighbors and their predicates, values, and classes
 * given a blank node sub-query.
 *
 * @see oneHopNeighborsTemplate
 */
const blankNodeOneHopNeighborsTemplate = (subQuery: string) => {
	return `
		SELECT ?bNode ?subject ?pred ?value ?subjectClass ?pToSubject ?pFromSubject
		WHERE {
			?subject a ?subjectClass;
					?pred ?value.
			FILTER(isLiteral(?value))

			{
				{ ?bNode ?pToSubject ?subject }
				UNION
				{ ?subject ?pFromSubject ?bNode }
				${subQuery}
			}
		}
  `;
};

export default blankNodeOneHopNeighborsTemplate;
