import {
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { use$ } from "@legendapp/state/react";
import { appStore$ } from "../../stores/app-store";
import { useTranslation } from "react-i18next";
import { ExpoIcon } from "../../components/ui/expo-icon";
import { AppText } from "../../components/ui/app-text";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { ImageBackground } from "expo-image";
import { colors } from "../../styles/themes";
import { Dropdown } from "react-native-element-dropdown";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import TwColors from "tailwindcss/colors";
import { MuscleGroup, useCreateExercise } from "app";
import { SelectMuscleGroupSheet } from "../../components/bottom-sheets/select-muscle-group";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useModal } from "react-native-modalfy";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { toast } from "sonner-native";
import { delay } from "lodash";
import { usePreventRepeatPress } from "../../hooks/use-prevent-repeat-press";
import {
  CreateExerciseFormValues,
  useCreateExerciseForm,
} from "../../hooks/use-create-exercise-form";

export const CreateExerciseScreen = () => {
  const form = useCreateExerciseForm();
  const { t } = useTranslation();
  const createExerciseMutation = useCreateExercise();
  const router = useRouter();

  const onSubmit = (values: any) => {
    const { name, description, category, primaryMuscleId, imageUrl } = values;

    createExerciseMutation.mutate(
      {
        name,
        description,
        category,
        primaryMuscleIds: [primaryMuscleId],
        images: imageUrl ? [imageUrl] : [],
      },
      {
        onSuccess: () => {
          toast.success(t("create_exercise_success"));
          delay(() => {
            router.back();
          }, 1000);
        },
      }
    );
  };

  return (
    <AppScreen name="create-exercise-screen">
      <Header handleSubmit={form.handleSubmit(onSubmit)} />
      <KeyboardAwareScrollView ScrollViewComponent={ScrollView}>
        <CreateExerciseForm form={form} />
      </KeyboardAwareScrollView>
    </AppScreen>
  );
};

export const CreateExerciseForm = ({
  form,
}: {
  form: UseFormReturn<CreateExerciseFormValues, any, CreateExerciseFormValues>;
}) => {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const theme = use$(appStore$.theme);

  const [isFocus, setIsFocus] = useState(false);
  // const [categoryValue, setCategoryValue] = useState("WEIGHT");
  const [primaryMuscle, setPrimaryMuscle] = useState<null | MuscleGroup>(null);
  const modalRef = useRef<BottomSheetModal>(null);

  function handleOpenMediaModal() {
    openModal("TakeOrSelectMediaModal", {
      onComplete: (media) => {
        console.log("onComplete =======> ", media);

        form.setValue("imageUrl", media);
      },
    });
  }

  const exerciseCategories = [
    {
      label: t("weight_category"),
      value: "WEIGHT",
      itemTestIDField: "weight_test_id",
    },
    {
      label: t("free_weight"),
      value: "FREE_WEIGHT",
      itemTestIDField: "free_weight_test_id",
    },
    { label: t("cardio"), value: "CARDIO", itemTestIDField: "cardio_test_id" },
  ] as const;
  const categoryValue = form.watch("category");
  const selectedCategory = useMemo(() => {
    return exerciseCategories.find(
      (category) => category.value === categoryValue
    );
  }, [categoryValue, exerciseCategories]);

  return (
    <>
      <Controller
        control={form.control}
        name="imageUrl"
        rules={{}}
        render={({ field: { onChange, onBlur, value } }) => {
          // console.log(" image vale ======> ", value);

          return value ? (
            <ImageBackground
              source={value}
              style={{
                width: "100%",
                aspectRatio: 1.3,
              }}
              testID="exercise-image"
            >
              <TouchableOpacity
                className="absolute bottom-6 right-6 z-50 p-2 rounded-full bg-white/50 justify-center items-center"
                onPress={() => handleOpenMediaModal()}
                testID="change-image-button"
              >
                <ExpoIcon library="materialIcons" name="cached" size={32} />
              </TouchableOpacity>
            </ImageBackground>
          ) : (
            <TouchableOpacity
              testID="select-image-button"
              onPress={() => handleOpenMediaModal()}
              className="w-full aspect-video rounded-md border border-slate-700 dark:border-slate-500 justify-center items-center"
            >
              <ExpoIcon library="feather" name="camera" size={24} />
            </TouchableOpacity>
          );
        }}
      />
      <View className="px-4 py-8 gap-y-6">
        <Controller
          control={form.control}
          name="name"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                placeholder={`${t("exercise_name")} *`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className="border border-slate-700 dark:border-slate-500 rounded-md p-3 text-black dark:text-white text-xl"
                placeholderTextColor={colors.text.light.inactive}
              />
              {form.formState.errors.name && (
                <AppText className="text-red-500 text-sm">
                  {t("required")}
                </AppText>
              )}
            </>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          rules={{
            required: false,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={t("exercise_description")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              className="border border-slate-700 dark:border-slate-500 rounded-md p-3 text-black dark:text-white text-xl"
              placeholderTextColor={colors.text.light.inactive}
            />
          )}
        />

        <Controller
          control={form.control}
          name="category"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => {
            return (
              <Dropdown
                testID="select-category-dropdown"
                //@ts-expect-error
                data={exerciseCategories}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={
                  selectedCategory?.label || `${t("exercise_category")}`
                }
                // value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  form.setValue("category", item.value);
                  // setCategoryValue(item.value);
                  setIsFocus(false);
                }}
                renderLeftIcon={() => (
                  <ExpoIcon
                    color={
                      theme === "light"
                        ? colors.text.light.inactive
                        : colors.text.dark.inactive
                    }
                    library="materialIcons"
                    name="category"
                    size={20}
                  />
                )}
                // styles
                itemTextStyle={{
                  color:
                    theme === "light"
                      ? colors.text.light.inactive
                      : colors.text.dark.inactive,
                }}
                style={[
                  styles.dropdown,
                  {
                    borderColor:
                      theme === "light"
                        ? TwColors.slate[700]
                        : TwColors.slate[500],
                  },
                ]}
                containerStyle={{
                  borderWidth: 0,
                }}
                placeholderStyle={{
                  fontSize: 16,
                  color:
                    theme === "light"
                      ? colors.text.light.inactive
                      : colors.text.dark.inactive,
                }}
                selectedTextStyle={styles.dropdownSelectedTextStyle}
                iconStyle={styles.dropdownIconStyle}
                itemContainerStyle={{
                  backgroundColor: theme === "light" ? "white" : "#10172a",
                }}
              />
            );
          }}
        />

        <Controller
          control={form.control}
          name="primaryMuscleId"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TouchableOpacity
                testID="primary-muscle-button"
                onPress={() => modalRef.current?.present()}
                className="w-full rounded-md border border-slate-700 dark:border-slate-500 p-3"
              >
                <AppText className="text-xl text-slate-700 dark:text-slate-500">
                  {primaryMuscle?.translations?.[0]?.name ||
                    `${t("exercise_primary_muscle")}`}
                </AppText>
              </TouchableOpacity>
              {form.formState.errors.primaryMuscleId && (
                <AppText className="text-red-500 text-sm">
                  {t("required")}
                </AppText>
              )}
            </View>
          )}
        />
      </View>
      <SelectMuscleGroupSheet
        modalRef={modalRef}
        setSelectedMuscleGroup={(muscleGroup) => {
          if (typeof muscleGroup?.id === "number") {
            form.setValue("primaryMuscleId", muscleGroup.id as number);
            setPrimaryMuscle(muscleGroup);
          }
        }}
      />
    </>
  );
};

const Header = ({
  handleSubmit,
}: {
  handleSubmit: () => void;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();

  return (
    <View className="flex-row items-end gap-x-6 px-4 py-4">
      <TouchableOpacity
        hitSlop={10}
        onPress={() =>
          debouncedPress(() => {
            router.back();
          })
        }
        testID="back-button"
      >
        <ExpoIcon library="feather" name="x" size={30} />
      </TouchableOpacity>
      <AppText className="text-2xl font-bold">{t("create_exercise")}</AppText>
      <TouchableOpacity
        testID="save-button"
        onPress={() => {
          debouncedPress(() => {
            handleSubmit();
          });
        }}
        className="ml-auto"
      >
        <ExpoIcon library="feather" name="check" size={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 8,
  },

  dropdownSelectedTextStyle: {
    fontSize: 16,
    color: "white",
  },
  dropdownIconStyle: {
    width: 20,
    height: 20,
  },

  inputStyle: {},
});
