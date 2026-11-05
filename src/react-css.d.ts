import "react";

// Lets a style object set CSS custom properties, e.g. style={{ "--i": 2 }}.
// React's style type only knows normal properties like "color".
declare module "react" {
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined;
  }
}
