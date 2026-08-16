import { ProjectComponentCatalog, ReusableEntity } from './cataloger.js';

export interface SemanticMatch {
  requestedName: string;
  matchedEntity: ReusableEntity;
  similarityScore: number;
  reason: string;
}

// Synonym groupings for common software concepts
const SYNONYM_GROUPS: string[][] = [
  ['get', 'fetch', 'load', 'find', 'retrieve', 'query', 'read'],
  ['save', 'persist', 'store', 'insert', 'write'],
  ['update', 'modify', 'edit', 'patch', 'mutate'],
  ['remove', 'delete', 'destroy', 'erase', 'drop'],
  ['modal', 'dialog', 'popup', 'sheet', 'drawer'],
  ['toast', 'notification', 'alert', 'snackbar', 'banner'],
  ['button', 'btn', 'action-btn', 'cta'],
  ['input', 'textfield', 'field', 'textbox'],
  ['dropdown', 'select', 'combobox', 'menu-select'],
  ['table', 'datagrid', 'data-table', 'grid'],
  ['user', 'account', 'profile', 'member'],
  ['auth', 'authentication', 'login', 'session', 'signin'],
  ['format', 'parse', 'transform', 'convert'],
  ['client', 'api', 'http', 'requester', 'fetcher'],
];

export function findPotentialDuplicates(
  requestedName: string,
  catalog: ProjectComponentCatalog
): SemanticMatch[] {
  const matches: SemanticMatch[] = [];
  const normalizedRequested = requestedName.toLowerCase().replace(/[^a-z0-9]/g, '');

  const allEntities: ReusableEntity[] = [
    ...catalog.components,
    ...catalog.hooks,
    ...catalog.utilities,
    ...catalog.services,
    ...catalog.types,
  ];

  for (const entity of allEntities) {
    const normalizedEntity = entity.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Exact match
    if (normalizedEntity === normalizedRequested) {
      matches.push({
        requestedName,
        matchedEntity: entity,
        similarityScore: 1.0,
        reason: `Exact match found for "${entity.name}" in ${entity.filePath}:${entity.line}`,
      });
      continue;
    }

    // Substring or prefix/suffix match (e.g. UserModal vs Dialog)
    if (normalizedEntity.includes(normalizedRequested) || normalizedRequested.includes(normalizedEntity)) {
      matches.push({
        requestedName,
        matchedEntity: entity,
        similarityScore: 0.8,
        reason: `Partial name match between "${requestedName}" and existing "${entity.name}" in ${entity.filePath}:${entity.line}`,
      });
      continue;
    }

    // Synonym group match
    for (const group of SYNONYM_GROUPS) {
      const requestedHasWord = group.some((word) => normalizedRequested.includes(word));
      const entityHasWord = group.some((word) => normalizedEntity.includes(word));

      if (requestedHasWord && entityHasWord) {
        // Check if the remaining parts of the words also match (e.g. getUser vs fetchUser)
        matches.push({
          requestedName,
          matchedEntity: entity,
          similarityScore: 0.75,
          reason: `Semantic synonym match (synonym group [${group.slice(0, 3).join(', ')}...]) with "${entity.name}" in ${entity.filePath}:${entity.line}`,
        });
        break;
      }
    }
  }

  // Sort by highest similarity score
  return matches.sort((a, b) => b.similarityScore - a.similarityScore);
}
