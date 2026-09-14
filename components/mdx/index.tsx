import { Metrics } from "./Metrics";
import { Callout } from "./Callout";
import { Diagram } from "./Diagram";
import { Flow } from "./Flow";
import { Detail, Pane } from "./Detail";

// ═══════════════════════════════════════════════════════════════
// Anything listed here can be used inside an .mdx file without
// importing it. Add a component, register it here, and every
// write-up can use it.
// ═══════════════════════════════════════════════════════════════

export const mdxComponents = {
  Metrics,
  Callout,
  Diagram,
  Flow,
  Detail,
  Pane,
};
