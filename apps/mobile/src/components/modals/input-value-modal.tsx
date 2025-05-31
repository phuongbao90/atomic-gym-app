import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { Pressable, TextInput, View } from "react-native";
import { ModalProps } from "react-native-modalfy";
import { AppText } from "../ui/app-text";
import { useTranslation } from "react-i18next";
import {
  ChevronDownIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "../ui/expo-icon";
import { AppTouchable } from "../ui/app-touchable";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import dayjs from "dayjs";
import { useAppSelector } from "../../stores/redux-store";
import { useHoldAction } from "../../hooks/use-hold-action";

type Props = ModalProps<"InputValueModal">;

// const MappingTitle = {
//   weight: "weight",
//   height: "height",
//   bmi: "BMI",
//   bodyFat: "body fat",
//   muscleMass: "muscle mass",
//   water: "water",
// };
// const MappingUnit = {
//   weight: "kg",
//   height: "cm",
//   bmi: "kg/m2",
//   bodyFat: "%",
//   muscleMass: "kg",
//   water: "%",
// };

export const InputValueModal = ({ modal: { getParam, closeModal } }: Props) => {
  const label = getParam("label");
  const unit = getParam("unit");
  const initialValue = getParam("initialValue");
  const onConfirm = getParam("onConfirm");
  const allowDatePicker = getParam("allowDatePicker", true);
  console.log("🚀 ~ InputValueModal ~ allowDatePicker:", allowDatePicker);
  const { t } = useTranslation();
  const language = useAppSelector((s) => s.app.language);
  const [date, setDate] = useState<Date>(dayjs().toDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [value, setValue] = useState<number>(Number(initialValue) || 80);

  const { start: startIncreaseValue, stop: stopIncreaseValue } = useHoldAction(
    () => {
      handleChangeValue("increase");
    },
    { delay: 300, interval: 300 }
  );
  const { start: startDecreaseValue, stop: stopDecreaseValue } = useHoldAction(
    () => {
      handleChangeValue("decrease");
    },
    { delay: 300, interval: 300 }
  );

  function handleChangeValue(type: "increase" | "decrease") {
    if (type === "increase") {
      setValue((prev) => Number((prev + 0.1)?.toFixed(1)));
    } else {
      setValue((prev) => (prev > 0 ? Number((prev - 0.1)?.toFixed(1)) : 0));
    }
  }

  return (
    <View
      className="bg-slate-400 dark:bg-slate-800 gap-y-12 rounded-xl py-6 overflow-hidden px-6 border-0"
      style={{
        width: SCREEN_WIDTH * 0.8,
        maxWidth: 400,
      }}
    >
      <AppText className="text-2xl font-bold">
        {label}
        <AppText className="text-2xl text-gray-500"> ({unit})</AppText>
      </AppText>

      <View className="flex-row justify-between items-center mx-2">
        <Pressable
          hitSlop={10}
          onPressIn={() => startDecreaseValue()}
          onPressOut={() => stopDecreaseValue()}
        >
          <MinusCircleIcon />
        </Pressable>

        <TextInput
          className="text-4xl font-bold text-white"
          value={value.toString()}
          //@ts-expect-error
          onChangeText={(text) => setValue(text)}
          keyboardType="numeric"
          maxLength={5}
          style={{}}
        />

        <Pressable
          hitSlop={10}
          onPressIn={() => startIncreaseValue()}
          onPressOut={() => stopIncreaseValue()}
        >
          <PlusCircleIcon />
        </Pressable>
      </View>

      {allowDatePicker && (
        <AppTouchable onPress={() => setShowDatePicker(true)}>
          <AppText className="text-sm absolute -top-3 left-3 z-50">
            {t("date")}
          </AppText>
          <View className="border border-gray-600 rounded-md px-3 py-5 flex-row items-center justify-between">
            <AppText className="text-lg">
              {dayjs(date).format("DD MMM YYYY")}
            </AppText>
            <ChevronDownIcon />
          </View>
        </AppTouchable>
      )}

      <View className="flex-row gap-x-12 justify-end">
        <AppTouchable
          testID="confirm-modal-cancel-button"
          onPress={() => closeModal()}
        >
          <AppText>{t("cancel")}</AppText>
        </AppTouchable>
        <AppTouchable
          testID="confirm-modal-confirm-button"
          onPress={() => {
            onConfirm?.(dayjs(date).format("YYYY-MM-DD"), value);
            closeModal();
          }}
        >
          <AppText className="dark:text-primary text-primaryDarken font-bold">
            {t("save")}
          </AppText>
        </AppTouchable>
      </View>
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={date}
          maximumDate={dayjs().toDate()}
          onChange={(_event, date) => {
            setDate(date || dayjs().toDate());
            setShowDatePicker(false);
          }}
          firstDayOfWeek={1}
          locale={language === "vi" ? "vi-VN" : "en-US"}
        />
      )}
    </View>
  );
};
