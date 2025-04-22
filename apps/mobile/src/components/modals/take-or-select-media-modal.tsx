import { TouchableOpacity, View } from "react-native";
import { ModalProps } from "react-native-modalfy";
import { AppText } from "../ui/app-text";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { useCameraPermissions } from "expo-camera";
import { CameraIcon, MediaLibraryIcon } from "../ui/expo-icon";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

type Props = ModalProps<"TakeOrSelectMediaModal">;

const pickerOptions = {
  mediaTypes: ["images"] as ImagePicker.MediaType[],
  allowsEditing: false,
  allowsMultipleSelection: false,
  selectionLimit: 1,
  quality: 0.8,
};

export const TakeOrSelectMediaModal = ({
  modal: { getParam, closeModal },
}: Props) => {
  const { t } = useTranslation();
  const onComplete = getParam("onComplete");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [libraryPermission, requestLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  return (
    <View
      className="bg-slate-400 dark:bg-slate-800 gap-y-12 rounded-xl py-6 overflow-hidden px-3 border-0"
      style={{
        width: SCREEN_WIDTH * 0.93,
        maxWidth: 400,
      }}
    >
      <View className="flex-row items-center gap-x-4">
        <CameraIcon />
        {cameraPermission?.status !== "granted" ? (
          <PermissionRequest
            title={t("camera_permission_required_title")}
            description={t("camera_permission_required_description")}
            onPress={() => {
              requestCameraPermission();
            }}
          />
        ) : (
          <TouchableOpacity
            testID="take-photo-button"
            onPress={async () => {
              const result = await ImagePicker.launchCameraAsync(pickerOptions);

              if (result.assets?.[0]) {
                onComplete(result.assets[0] as ImagePicker.ImagePickerAsset);
                closeModal();
              }
            }}
          >
            <View className="flex-row items-center gap-x-4">
              <AppText className="text-xl">{t("take_photo")}</AppText>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row items-center gap-x-4">
        <MediaLibraryIcon />
        {libraryPermission?.status !== "granted" ? (
          <PermissionRequest
            title={t("library_permission_required_title")}
            description={t("library_permission_required_description")}
            onPress={() => {
              requestLibraryPermission();
            }}
          />
        ) : (
          <TouchableOpacity
            testID="select-from-library-button"
            onPress={() => {
              ImagePicker.launchImageLibraryAsync(pickerOptions).then(
                (result) => {
                  if (result.assets?.[0]) {
                    onComplete(
                      result.assets[0] as ImagePicker.ImagePickerAsset
                    );
                    closeModal();
                  }
                }
              );
            }}
          >
            <View className="flex-row items-center gap-x-4">
              <AppText className="text-xl">{t("select_from_library")}</AppText>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const PermissionRequest = ({
  title,
  description,
  onPress,
}: {
  title: string;
  description: string;
  onPress: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 flex-row items-center gap-x-1">
      <View className="flex-1 gap-y-1 mr-auto">
        <AppText className="text-lg font-semibold">{title}</AppText>
        <AppText className="text-lg">{description}</AppText>
      </View>
      <TouchableOpacity
        testID="request-library-permission-button"
        onPress={() => {
          onPress();
        }}
        className="border-2 border-slate-500 dark:border-slate-300 rounded-3xl px-3 py-2"
      >
        <AppText className="">{t("allow")}</AppText>
      </TouchableOpacity>
    </View>
  );
};
