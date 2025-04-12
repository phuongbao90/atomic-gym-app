import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { use$ } from "@legendapp/state/react";
import { appStore$ } from "../../stores/app-store";

export const ExpoIcon = ({
  name,
  color,
  library,
  ...props
}: {
  name: keyof typeof Feather.glyphMap;
  color?: string;
  library: "entypo" | "fontAwesome6" | "materialIcons" | "feather";
} & IconProps<string>) => {
  const theme = use$(appStore$.theme);

  switch (library) {
    case "entypo":
      return (
        <Entypo
          name={name as keyof typeof Entypo.glyphMap}
          color={color ?? (theme === "dark" ? "white" : "black")}
          {...props}
        />
      );
    case "fontAwesome6":
      return (
        <FontAwesome6
          name={name as keyof typeof FontAwesome6.glyphMap}
          color={color ?? (theme === "dark" ? "white" : "black")}
          {...props}
        />
      );
    case "materialIcons":
      return (
        <MaterialIcons
          name={name as keyof typeof MaterialIcons.glyphMap}
          color={color ?? (theme === "dark" ? "white" : "black")}
          {...props}
        />
      );
    case "feather":
      return (
        <Feather
          name={name as keyof typeof Feather.glyphMap}
          color={color ?? (theme === "dark" ? "white" : "black")}
          {...props}
        />
      );
  }
};
