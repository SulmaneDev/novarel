import type { Abstract } from "./abstract.interface.js";
import type { Concrete } from "./concrete.interface.js";

/**
 * Binding interface that represents a binding.
 */
export type BindingInterface = Map<Abstract<unknown>, Concrete<unknown>>;