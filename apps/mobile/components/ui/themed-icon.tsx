import { useColorScheme } from "nativewind";

export const ThemedIcon = ({
  render,
}: {
  render: (props: { color: string }) => React.ReactNode;
}) => {
  const theme = useColorScheme();
  return render({
    color: theme.colorScheme === "dark" ? "white" : "black",
  });
};
