import { cx } from "class-variance-authority";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { AppText } from "./app-text";
import { Divider } from "./divider";

type Props = {
  label: string;
  subLabel?: string;
  Left?: ReactNode;
  Right?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  containerClassName?: string;
  labelContainerClassName?: string;
  labelClassName?: string;
  subLabelClassName?: string;
  rightContainerClassName?: string;
  leftContainerClassName?: string;
  withTopDivider?: boolean;
  withBottomDivider?: boolean;
  testID?: string;
};

export const ListItem = ({
  label,
  subLabel,
  Left,
  Right,
  onPress,
  disabled,
  containerClassName,
  labelContainerClassName,
  labelClassName,
  subLabelClassName,
  rightContainerClassName,
  leftContainerClassName,
  withTopDivider,
  withBottomDivider,
  testID,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      hitSlop={10}
    >
      {withTopDivider && <Divider />}
      <View className={`flex-row items-center ${containerClassName}`}>
        {!!Left && (
          <View className={cx("min-w-12", leftContainerClassName)}>{Left}</View>
        )}

        <View className={cx(labelContainerClassName, "flex-1")}>
          <AppText className={cx("text-lg", labelClassName)}>{label}</AppText>
          {!!subLabel && (
            <AppText intent="label" className={subLabelClassName}>
              {subLabel}
            </AppText>
          )}
        </View>
        {!!Right && (
          <View
            className={cx(
              "ml-4 min-w-10 items-center justify-center",
              rightContainerClassName
            )}
          >
            {Right}
          </View>
        )}
      </View>
      {withBottomDivider && <Divider />}
    </Pressable>
  );
};
