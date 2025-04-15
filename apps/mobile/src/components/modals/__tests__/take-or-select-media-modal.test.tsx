import { ModalProps } from "react-native-modalfy";
import { customRenderUI } from "../../../utils/test-utils";
import { TakeOrSelectMediaModal } from "../take-or-select-media-modal";
import { ImagePickerAsset } from "expo-image-picker";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";

const mockCameraResult: ImagePicker.ImagePickerResult = {
  assets: [
    {
      assetId: null,
      base64: null,
      duration: null,
      exif: null,
      fileName: "12105459-70f0-4359-8345-63dec614cd57.jpeg",
      fileSize: 64044,
      height: 1920,
      mimeType: "image/jpeg",
      type: "image",
      uri: "file:///data/user/0/com.phuongbao90.gymapp.stag/cache/ImagePicker/88193002-1ae1-458b-abc7-04ba34a5b757.jpeg",
      width: 1440,
    },
  ],
  canceled: false,
};

type Props = ModalProps<"TakeOrSelectMediaModal">;

const mockPickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: false,
  allowsMultipleSelection: false,
  selectionLimit: 1,
  quality: 0.8,
};

jest.mock("expo-camera", () => {
  const mockUseCameraPermissions = jest.fn();
  return {
    useCameraPermissions: mockUseCameraPermissions,
  };
});

jest.mock("expo-image-picker", () => {
  const mockUseMediaLibraryPermissions = jest.fn();

  return {
    launchCameraAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    requestCameraPermissionsAsync: jest.fn(),
    requestMediaLibraryPermissionsAsync: jest.fn(),
    MediaTypeOptions: {
      Images: "images",
    },
    useMediaLibraryPermissions: mockUseMediaLibraryPermissions,
  };
});

describe("TakeOrSelectMediaModal", () => {
  const mockUseCameraPermissions = require("expo-camera").useCameraPermissions;

  const mockUseMediaLibraryPermissions =
    require("expo-image-picker").useMediaLibraryPermissions;

  it("should render if permissions are granted", async () => {
    mockUseCameraPermissions.mockReturnValue([
      {
        granted: true,
        status: "granted",
        expires: "never",
        canAskAgain: true,
      },
      jest.fn(),
    ]);

    mockUseMediaLibraryPermissions.mockReturnValue([
      {
        granted: true,
        status: "granted",
        expires: "never",
        canAskAgain: true,
      },
      jest.fn(),
    ]);

    customRenderUI(
      //@ts-ignore
      <TakeOrSelectMediaModal
        modal={
          {
            getParam: (paramName: string) => {
              if (paramName === "onComplete") {
                return (_media: ImagePickerAsset | undefined) => {};
              }
              return undefined;
            },
            closeModal: () => {},
          } as Props["modal"]
        }
      />
    );

    expect(screen.getByText(/chụp ảnh/i)).toBeOnTheScreen();
    expect(screen.getByText(/chọn từ thư viện/i)).toBeOnTheScreen();

    /**
     * mocking the camera result
     */

    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue(
      mockCameraResult
    );

    const takePhotoButton = screen.getByTestId("take-photo-button");
    await act(async () => {
      fireEvent.press(takePhotoButton);
    });

    await waitFor(() => {
      expect(ImagePicker.launchCameraAsync).toHaveBeenCalledWith(
        mockPickerOptions
      );
    });

    /**
     * mocking the library result
     */

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(
      mockCameraResult
    );

    const selectFromLibraryButton = screen.getByTestId(
      "select-from-library-button"
    );
    await act(async () => {
      fireEvent.press(selectFromLibraryButton);
    });

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith(
        mockPickerOptions
      );
    });
  });

  it("should render messages if permissions are denied", async () => {
    const mockRequestCameraPermission = jest.fn();
    const mockRequestMediaLibraryPermission = jest.fn();
    mockUseCameraPermissions.mockReturnValue([
      {
        granted: false,
        status: "denied",
        expires: "never",
        canAskAgain: true,
      },
      mockRequestCameraPermission,
    ]);

    mockUseMediaLibraryPermissions.mockReturnValue([
      {
        granted: false,
        status: "denied",
        expires: "never",
        canAskAgain: true,
      },
      mockRequestMediaLibraryPermission,
    ]);

    customRenderUI(
      //@ts-ignore
      <TakeOrSelectMediaModal
        modal={
          {
            getParam: (paramName: string) => {
              if (paramName === "onComplete") {
                return (_media: ImagePickerAsset | undefined) => {};
              }
              return undefined;
            },
            closeModal: () => {},
          } as Props["modal"]
        }
      />
    );

    expect(screen.getByText(/bật quyền truy cập camera/i)).toBeOnTheScreen();
    expect(screen.getByText(/bật quyền truy cập thư viện/i)).toBeOnTheScreen();
    const cameraPermissionButton = screen.getByText(
      /bật quyền truy cập camera/i
    );
    await act(async () => {
      fireEvent.press(cameraPermissionButton);
    });

    await waitFor(() => {
      expect(mockRequestCameraPermission).toHaveBeenCalled();
    });

    const libraryPermissionButton = screen.getByText(
      /bật quyền truy cập thư viện/i
    );
    await act(async () => {
      fireEvent.press(libraryPermissionButton);
    });

    await waitFor(() => {
      expect(mockRequestMediaLibraryPermission).toHaveBeenCalled();
    });
  });
});
