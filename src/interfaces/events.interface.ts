/**
 * Container events
 */
export type CONTAINER_EVENTS = [
  'bound',
  'unbound',
  'resolved',
  'missing',
  'queued',
  'cleared',
  'instance',
];

/**
 * Container event
 */
export type ContainerEvent = CONTAINER_EVENTS[number];
