import { FlatList, FlatListProps } from "react-native";

export const AppFlatList = (props: FlatListProps<any>) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      {...props}
      style={[{ flex: 1 }, props.style]}
    />
  );
};
