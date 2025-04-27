import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { useAppSelector } from "../../stores/redux-store";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Mapping = {
  entypo: Feather.glyphMap,
  fontAwesome6: FontAwesome6.glyphMap,
  materialIcons: MaterialIcons.glyphMap,
  feather: Feather.glyphMap,
  materialCommunityIcons: MaterialCommunityIcons.glyphMap,
} as const;

const ExpoIcon = ({
  name,
  library,
  ...props
}: {
  name: keyof (typeof Mapping)[keyof typeof Mapping]; // i want this to be dependent on the library

  library:
    | "entypo"
    | "fontAwesome6"
    | "materialIcons"
    | "feather"
    | "materialCommunityIcons";
} & IconProps<string>) => {
  const theme = useAppSelector((state) => state.app.theme);

  switch (library) {
    case "entypo":
      return (
        <Entypo
          name={name as keyof typeof Entypo.glyphMap}
          color={props.color ?? (theme === "dark" ? "white" : "black")}
          size={24}
          {...props}
        />
      );
    case "fontAwesome6":
      return (
        <FontAwesome6
          name={name as keyof typeof FontAwesome6.glyphMap}
          color={props.color ?? (theme === "dark" ? "white" : "black")}
          size={24}
          {...props}
        />
      );
    case "materialIcons":
      return (
        <MaterialIcons
          name={name as keyof typeof MaterialIcons.glyphMap}
          color={props.color ?? (theme === "dark" ? "white" : "black")}
          size={24}
          {...props}
        />
      );
    case "feather":
      return (
        <Feather
          name={name as keyof typeof Feather.glyphMap}
          color={props.color ?? (theme === "dark" ? "white" : "black")}
          size={24}
          {...props}
        />
      );

    case "materialCommunityIcons":
      return (
        <MaterialCommunityIcons
          name={name as keyof typeof MaterialCommunityIcons.glyphMap}
          color={props.color ?? (theme === "dark" ? "white" : "black")}
          size={24}
          {...props}
        />
      );
  }
};

export const DeleteIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="feather" name="trash" {...props} />;
};

export const VerticalDotsIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="feather" name="more-vertical" {...props} />;
};

export const DragIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialIcons" name="drag-indicator" {...props} />;
};

export const CameraIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="feather" name="camera" {...props} />;
};

export const MediaLibraryIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialIcons" name="photo-library" {...props} />;
};
export const CancelIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialCommunityIcons" name="cancel" {...props} />;
};
export const ReorderIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialIcons" name="reorder" {...props} />;
};
export const DuplicateIcon = (props: Omit<IconProps<string>, "name">) => {
  return (
    <ExpoIcon
      library="materialCommunityIcons"
      name="content-duplicate"
      {...props}
    />
  );
};

export const PlusIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialCommunityIcons" name="plus" {...props} />;
};

export const PlusCircleIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="feather" name="plus-circle" {...props} />;
};

export const MinusCircleIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="feather" name="minus-circle" {...props} />;
};

export const CheckIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialCommunityIcons" name="check" {...props} />;
};

export const XIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialCommunityIcons" name="close" {...props} />;
};

export const ChevronLeftIcon = (props: Omit<IconProps<string>, "name">) => {
  return (
    <ExpoIcon library="materialCommunityIcons" name="chevron-left" {...props} />
  );
};
export const ChevronDownIcon = (props: Omit<IconProps<string>, "name">) => {
  return (
    <ExpoIcon library="materialCommunityIcons" name="chevron-down" {...props} />
  );
};

export const LockIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="entypo" name="lock" {...props} />;
};

export const CalendarIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialIcons" name="calendar-month" {...props} />;
};

export const ChartIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialIcons" name="show-chart" {...props} />;
};

export const CrosshairsIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="fontAwesome6" name="crosshairs" {...props} />;
};

export const SearchIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="feather" name="search" {...props} />;
};

export const CategoryIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialIcons" name="category" {...props} />;
};

export const ChangeImageIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialIcons" name="cached" {...props} />;
};

export const EditIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialIcons" name="edit" {...props} />;
};

export const SettingsIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialIcons" name="settings" {...props} />;
};

export const DumbbellIcon = (props: Omit<IconProps<string>, "name">) => {
  return (
    <ExpoIcon library="materialCommunityIcons" name="dumbbell" {...props} />
  );
};

export const RunIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialCommunityIcons" name="run" {...props} />;
};

export const ReplaceIcon = (props: Omit<IconProps<string>, "name">) => {
  return (
    <ExpoIcon
      library="materialCommunityIcons"
      name="swap-horizontal"
      {...props}
    />
  );
};

export const ClockIcon = (props: Omit<IconProps<string>, "name">) => {
  return <ExpoIcon library="materialCommunityIcons" name="clock" {...props} />;
};
