/**
 * Common Types
 */
export * from './common';

/**
 * Entity Types
 */
export * from './user';
export * from './project';
export * from './issue';
export * from './sprint';
export * from './team';
export * from './activity';

/**
 * GraphQL Types
 */
export * from './inputs';
export * from './responses';

// Type-check during development
declare global {
  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>;
  };
}

// Ensure this is treated as a module
export {};