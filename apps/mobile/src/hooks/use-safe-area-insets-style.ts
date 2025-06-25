import { Edge, useSafeAreaInsets } from "react-native-safe-area-context";

export type ExtendedEdge = Edge | "start" | "end";

const propertySuffixMap = {
  top: "Top",
  bottom: "Bottom",
  left: "Start",
  right: "End",
  start: "Start",
  end: "End",
};

const edgeInsetMap: Record<string, Edge> = {
  start: "left",
  end: "right",
};

export type SafeAreaInsetsStyle<
  Property extends "padding" | "margin" = "padding",
  Edges extends Array<ExtendedEdge> = Array<ExtendedEdge>,
> = {
  // This creates a dynamic type like { paddingTop: number, marginEnd: number, ... }
  [K in Edges[number] as `${Property}${Capitalize<K>}`]: number;
};
export function useSafeAreaInsetsStyle<
  Property extends "padding" | "margin" = "padding",
  Edges extends Array<ExtendedEdge> = [],
>(
  safeAreaEdges: Edges = [] as unknown as Edges,
  property: Property = "padding" as Property
): SafeAreaInsetsStyle<Property, Edges> {
  const insets = useSafeAreaInsets();

  return safeAreaEdges.reduce(
    (acc, edge) => {
      // Determine the correct key for the insets object ('left', 'right', 'top', etc.)
      const insetKey = edgeInsetMap[edge] ?? edge;

      // Determine the correct suffix for the style property ('Top', 'Bottom', 'Start', etc.)
      const styleSuffix = propertySuffixMap[edge];

      // Construct the final style property name, e.g., "paddingTop" or "marginEnd"
      const styleProperty = `${property}${styleSuffix}`;

      // **CHANGE**: Directly mutate the accumulator instead of creating a new object.
      acc[styleProperty] = insets[insetKey];

      // Return the mutated accumulator for the next iteration.
      return acc;
    },
    {} as Record<string, number>
  ) as SafeAreaInsetsStyle<Property, Edges>; // Final cast to the precise generic type.
}
