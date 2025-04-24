import { FlatList, FlatListProps } from "react-native";

export const AppFlatList = <T,>(props: FlatListProps<T>) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      {...props}
      style={[{ flex: 1 }, props.style]}
    />
  );
};
