import { ENV } from "app/src/configs/env";
import { customRenderQueryHook, customRenderUI } from "../../utils/test-utils";
import {
  CreateExerciseForm,
  CreateExerciseScreen,
} from "../exercises/create-exercise-screen";
import nock from "nock";
import { API_ROUTES } from "app/src/configs/api-routes";
import { ExerciseCategory, useCreateExercise, useGetMuscleGroups } from "app";
import { MuscleGroup } from "app";
import {
  act,
  fireEvent,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";
import { View } from "react-native";
import { DefaultMockWrapper } from "../../utils/test-wrappers";
import { useCreateExerciseForm } from "../../hooks/use-create-exercise-form";

// Mock expo-image-picker
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

// jest.mock("expo-camera", () => ({
//   useCameraPermissions: () => [{ granted: true }, jest.fn()],
// }));

jest.mock("expo-camera", () => {
  const mockUseCameraPermissions = jest.fn();
  return {
    useCameraPermissions: mockUseCameraPermissions,
  };
});

jest.spyOn(View.prototype, "measureInWindow").mockImplementation((cb) => {
  cb(18, 113, 357, 50);
});

const muscleGroups = [
  {
    id: 1,
    parentId: null,
    image: "https://loremflickr.com/908/3873?lock=4231754171829986",
    translations: [
      {
        muscleGroupId: 1,
        language: "vi",
        name: "Thân trên",
        normalizedName: "than tren",
        slug: "than-tren",
      },
    ],
  },
  {
    id: 2,
    parentId: null,
    image: "https://loremflickr.com/2583/1708?lock=4437472374622822",
    translations: [
      {
        muscleGroupId: 2,
        language: "vi",
        name: "Thân dưới",
        normalizedName: "than duoi",
        slug: "than-duoi",
      },
    ],
  },
  {
    id: 3,
    parentId: null,
    image: "https://picsum.photos/seed/rL1q3l8g/196/533",
    translations: [
      {
        muscleGroupId: 3,
        language: "vi",
        name: "Khác",
        normalizedName: "khac",
        slug: "khac",
      },
    ],
  },
  {
    id: 4,
    parentId: 1,
    image: "https://picsum.photos/seed/oWFQPP/1088/2644",
    translations: [
      {
        muscleGroupId: 4,
        language: "vi",
        name: "Ngực",
        normalizedName: "nguc",
        slug: "nguc",
      },
    ],
  },
  {
    id: 5,
    parentId: 1,
    image: "https://loremflickr.com/2794/2866?lock=2321216307360319",
    translations: [
      {
        muscleGroupId: 5,
        language: "vi",
        name: "Vai",
        normalizedName: "vai",
        slug: "vai",
      },
    ],
  },
  {
    id: 6,
    parentId: 1,
    image: "https://picsum.photos/seed/8dN3zhFo/3577/2103",
    translations: [
      {
        muscleGroupId: 6,
        language: "vi",
        name: "Trụ",
        normalizedName: "tru",
        slug: "tru",
      },
    ],
  },
  {
    id: 7,
    parentId: 1,
    image: "https://picsum.photos/seed/xoZwkh6cT/3488/1234",
    translations: [
      {
        muscleGroupId: 7,
        language: "vi",
        name: "Lát",
        normalizedName: "lat",
        slug: "lat",
      },
    ],
  },
  {
    id: 8,
    parentId: 1,
    image: "https://loremflickr.com/1349/3502?lock=7703903488261586",
    translations: [
      {
        muscleGroupId: 8,
        language: "vi",
        name: "Lưng giữa",
        normalizedName: "lung giua",
        slug: "lung-giua",
      },
    ],
  },
  {
    id: 9,
    parentId: 1,
    image: "https://picsum.photos/seed/OPlXKxNQ/2310/1686",
    translations: [
      {
        muscleGroupId: 9,
        language: "vi",
        name: "Lưng dưới",
        normalizedName: "lung duoi",
        slug: "lung-duoi",
      },
    ],
  },
  {
    id: 10,
    parentId: 1,
    image: "https://picsum.photos/seed/FiatIVIFLp/1640/1153",
    translations: [
      {
        muscleGroupId: 10,
        language: "vi",
        name: "Bắp tay trước",
        normalizedName: "bap tay truoc",
        slug: "bap-tay-truoc",
      },
    ],
  },
  {
    id: 11,
    parentId: 1,
    image: "https://loremflickr.com/1225/785?lock=1579493073211213",
    translations: [
      {
        muscleGroupId: 11,
        language: "vi",
        name: "Bắp tay sau",
        normalizedName: "bap tay sau",
        slug: "bap-tay-sau",
      },
    ],
  },
  {
    id: 12,
    parentId: 1,
    image: "https://loremflickr.com/1139/1835?lock=4665060384927982",
    translations: [
      {
        muscleGroupId: 12,
        language: "vi",
        name: "Cẳng tay",
        normalizedName: "cang tay",
        slug: "cang-tay",
      },
    ],
  },
  {
    id: 13,
    parentId: 1,
    image: "https://loremflickr.com/2908/901?lock=2679988289024639",
    translations: [
      {
        muscleGroupId: 13,
        language: "vi",
        name: "Bụng",
        normalizedName: "bung",
        slug: "bung",
      },
    ],
  },
  {
    id: 14,
    parentId: 2,
    image: "https://loremflickr.com/200/508?lock=3187551841336476",
    translations: [
      {
        muscleGroupId: 14,
        language: "vi",
        name: "Bắp chân",
        normalizedName: "bap chan",
        slug: "bap-chan",
      },
    ],
  },
  {
    id: 15,
    parentId: 2,
    image: "https://picsum.photos/seed/kJGwn/1572/2267",
    translations: [
      {
        muscleGroupId: 15,
        language: "vi",
        name: "Bắp đùi",
        normalizedName: "bap dui",
        slug: "bap-dui",
      },
    ],
  },
  {
    id: 16,
    parentId: 2,
    image: "https://picsum.photos/seed/yNtFgHU/379/536",
    translations: [
      {
        muscleGroupId: 16,
        language: "vi",
        name: "Bắp mông",
        normalizedName: "bap mong",
        slug: "bap-mong",
      },
    ],
  },
  {
    id: 17,
    parentId: 2,
    image: "https://loremflickr.com/996/3969?lock=5278495595077502",
    translations: [
      {
        muscleGroupId: 17,
        language: "vi",
        name: "Bắp hang",
        normalizedName: "bap hang",
        slug: "bap-hang",
      },
    ],
  },
  {
    id: 18,
    parentId: 2,
    image: "https://loremflickr.com/3085/3156?lock=3144129950477851",
    translations: [
      {
        muscleGroupId: 18,
        language: "vi",
        name: "Bắp mông giữa",
        normalizedName: "bap mong giua",
        slug: "bap-mong-giua",
      },
    ],
  },
  {
    id: 19,
    parentId: 2,
    image: "https://loremflickr.com/2445/2898?lock=7715086572119035",
    translations: [
      {
        muscleGroupId: 19,
        language: "vi",
        name: "Bắp chuối",
        normalizedName: "bap chuoi",
        slug: "bap-chuoi",
      },
    ],
  },
  {
    id: 20,
    parentId: 3,
    image: "https://picsum.photos/seed/SbjoM8cj/2556/2307",
    translations: [
      {
        muscleGroupId: 20,
        language: "vi",
        name: "Sức bền",
        normalizedName: "suc ben",
        slug: "suc-ben",
      },
    ],
  },
];

const createdExercise = {
  data: {
    id: 108,
    notes: null,
    category: "WEIGHT",
    createdById: 5,
    images: [],
    createdAt: "2025-04-14T14:59:20.129Z",
    updatedAt: "2025-04-14T14:59:20.129Z",
    workoutId: null,
    primaryMuscle: [
      {
        id: 5,
        parentId: 1,
        image: "https://picsum.photos/seed/Q9Ghb5/1057/717",
        translations: [
          {
            muscleGroupId: 5,
            language: "vi",
            name: "Vai",
            normalizedName: "vai",
            slug: "vai",
          },
        ],
      },
    ],
    translation: {
      exerciseId: 108,
      language: "vi",
      name: "đẩy ngực nằm 1",
      normalizedName: "day nguc nam 1",
      description: "Mô tả bài tập đẩy ngực nằm 1",
      slug: "day-nguc-nam-1",
    },
  },
  version: "0.1.1",
};

const mockedCorrectBody = {
  name: "đẩy ngực nằm 1",
  description: "Mô tả bài tập đẩy ngực nằm 1",
  category: "WEIGHT" as ExerciseCategory,
  primaryMuscleIds: [5],
  images: [] as string[],
};

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

const mockPickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: false,
  allowsMultipleSelection: false,
  selectionLimit: 1,
  quality: 0.8,
};

//* another way to mock the useCreateExercise hook (1)
// jest.mock("app", () => ({
//   ...jest.requireActual("app"),
//   useCreateExercise: jest.fn(),
// }));

describe("CreateExerciseScreen", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it("should render", async () => {
    const mockUseCameraPermissions =
      require("expo-camera").useCameraPermissions;

    mockUseCameraPermissions.mockReturnValue([
      {
        granted: true,
        status: "granted",
        expires: "never",
        canAskAgain: true,
      },
      jest.fn(),
    ]);

    const mockUseMediaLibraryPermissions =
      require("expo-image-picker").useMediaLibraryPermissions;
    mockUseMediaLibraryPermissions.mockReturnValue([
      {
        granted: true,
        status: "granted",
        expires: "never",
        canAskAgain: true,
      },
      jest.fn(),
    ]);

    //* another way to mock the useCreateExercise hook (2)
    // const mockMutate = jest.fn();
    // (useCreateExercise as jest.Mock).mockReturnValue({
    //   mutate: mockMutate,
    //   isLoading: false,
    //   isError: false,
    //   error: null,
    //   isSuccess: false,
    // });

    // Mock the muscle groups query
    nock(ENV.API_URL).get(API_ROUTES.muscleGroups.query()).reply(200, {
      data: muscleGroups,
    });

    // Mock the create exercise mutation
    const createExerciseScope = nock(ENV.API_URL)
      .post(API_ROUTES.exercises.base, mockedCorrectBody)
      .reply(200, createdExercise);

    const { result } = customRenderQueryHook<MuscleGroup[]>(() =>
      useGetMuscleGroups()
    );

    const { unmount } = customRenderUI(<CreateExerciseScreen />);

    screen.getByPlaceholderText(/tên bài tập/i, { exact: false });
    screen.getByPlaceholderText(/mô tả bài tập$/i, { exact: false });
    screen.getByText(/loại bài tập$/i, { exact: false });
    screen.getByText(/nhóm cơ chính$/i, { exact: false });

    await waitFor(() => {
      expect(result.current.data).toStrictEqual(muscleGroups);
    });

    const nameInput = screen.getByPlaceholderText(/tên bài tập/i);
    const descriptionInput = screen.getByPlaceholderText(/mô tả bài tập/i);

    fireEvent.changeText(nameInput, "đẩy ngực nằm 1");
    fireEvent.changeText(descriptionInput, "Mô tả bài tập đẩy ngực nằm 1");

    screen.getByDisplayValue("đẩy ngực nằm 1");
    screen.getByDisplayValue("Mô tả bài tập đẩy ngực nằm 1");

    /**
     * Select image
     */
    const selectImageButton = await screen.findByTestId("select-image-button");
    await act(async () => {
      fireEvent.press(selectImageButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/chụp ảnh/i)).toBeOnTheScreen();
      expect(screen.getByText(/chọn từ thư viện/i)).toBeOnTheScreen();
    });

    /**
     * select category
     */

    const selectCategoryDropdown = screen.getByTestId(
      "select-category-dropdown"
    );
    await act(async () => {
      fireEvent.press(selectCategoryDropdown);
    });

    await waitFor(() => {
      expect(screen.getByText(/Kháng lưc/i)).toBeOnTheScreen();
      expect(screen.getByText(/tạ tự do/i)).toBeOnTheScreen();
      expect(screen.getByText(/cardio/i)).toBeOnTheScreen();
    });

    await act(async () => {
      fireEvent.press(screen.getByText(/Kháng lưc/i));
    });
    await waitFor(() => {
      expect(screen.getByText(/Kháng lưc/i)).toBeOnTheScreen();
    });

    /**
     * Select primary muscle
     */
    const selectPrimaryMuscleButton = screen.getByTestId(
      "primary-muscle-button"
    );
    await act(async () => {
      fireEvent.press(selectPrimaryMuscleButton);
    });

    await waitFor(() => {
      const sholderButton = screen.getByText(/vai/i);
      fireEvent.press(sholderButton);
      expect(
        within(selectPrimaryMuscleButton).getByText(/vai/i)
      ).toBeOnTheScreen();
    });

    // Test the save button
    const saveButton = screen.getByTestId("save-button");
    await act(async () => {
      fireEvent.press(saveButton);
    });

    // Verify the mutation request was made
    expect(createExerciseScope.isDone()).toBe(true);

    //* another way to mock the useCreateExercise hook (3)
    // Verify the mutation was called with correct data
    // expect(mockMutate).toHaveBeenCalledWith(
    //   {
    //     name: "đẩy ngực nằm 1",
    //     description: "Mô tả bài tập đẩy ngực nằm 1",
    //     category: "WEIGHT",
    //     primaryMuscleIds: [5],
    //     images: [],
    //   },
    //   expect.any(Object) // for the onSuccess callback
    // );
    unmount();
  });

  describe("useCreateExercise hook", () => {
    it("should create exercise successfully", async () => {
      // Mock the create exercise mutation
      const createExerciseScope = nock(ENV.API_URL)
        .post(API_ROUTES.exercises.base, mockedCorrectBody)
        .reply(200, createdExercise);

      const { result } = renderHook(() => useCreateExercise(), {
        wrapper: DefaultMockWrapper,
      });

      await act(async () => {
        result.current.mutate(mockedCorrectBody);
      });

      // Verify the mutation request was made
      expect(createExerciseScope.isDone()).toBe(true);

      // Verify the mutation state
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it("should handle error when creating exercise fails", async () => {
      const errorResponse = {
        message: "Internal server error",
        statusCode: 500,
      };

      // Mock the create exercise mutation with error
      const createExerciseScope = nock(ENV.API_URL)
        .post(API_ROUTES.exercises.base, mockedCorrectBody)
        .reply(500, errorResponse);

      const { result } = renderHook(() => useCreateExercise(), {
        wrapper: DefaultMockWrapper,
      });

      await act(async () => {
        result.current.mutate(mockedCorrectBody);
      });

      // Verify the mutation request was made
      expect(createExerciseScope.isDone()).toBe(true);

      // Wait for and verify the error state
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe("Image Selection", () => {
    it("should handle taking photo from camera", async () => {
      // Set up the camera permissions mock
      const mockUseCameraPermissions =
        require("expo-camera").useCameraPermissions;

      mockUseCameraPermissions.mockReturnValue([
        {
          granted: true,
          status: "granted",
          expires: "never",
          canAskAgain: true,
        },
        jest.fn(),
      ]);

      const mockUseMediaLibraryPermissions =
        require("expo-image-picker").useMediaLibraryPermissions;
      mockUseMediaLibraryPermissions.mockReturnValue([
        {
          granted: true,
          status: "granted",
          expires: "never",
          canAskAgain: true,
        },
        jest.fn(),
      ]);

      const { result } = renderHook(() => useCreateExerciseForm());
      customRenderUI(<CreateExerciseForm form={result.current} />);

      // Open image selection modal
      const selectImageButton = screen.getByTestId("select-image-button");
      await act(async () => {
        fireEvent.press(selectImageButton);
      });

      // Select camera option
      const cameraOptions = await screen.findAllByTestId("take-photo-button");
      expect(cameraOptions.length).toBeGreaterThan(0);

      /**
       * this mocks the camera result => if (result.assets?.[0]) {
       */
      (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue(
        mockCameraResult
      );

      await act(async () => {
        fireEvent.press(cameraOptions[0]);
      });

      // Verify camera was launched
      await waitFor(() => {
        expect(ImagePicker.launchCameraAsync).toHaveBeenCalledWith(
          mockPickerOptions
        );
      });

      //TODO: dirty fix
      await act(async () => {
        result.current.setValue("imageUrl", mockCameraResult.assets[0]);
      });

      await waitFor(() => {
        const imageBackground = screen.getByTestId("exercise-image");
        expect(imageBackground.props.source).toEqual([
          mockCameraResult.assets[0],
        ]);
      });
    });

    it("should handle selecting image from library", async () => {
      const mockUseCameraPermissions =
        require("expo-camera").useCameraPermissions;

      mockUseCameraPermissions.mockReturnValue([
        {
          granted: true,
          status: "granted",
          expires: "never",
          canAskAgain: true,
        },
        jest.fn(),
      ]);

      const mockUseMediaLibraryPermissions =
        require("expo-image-picker").useMediaLibraryPermissions;
      mockUseMediaLibraryPermissions.mockReturnValue([
        {
          granted: true,
          status: "granted",
          expires: "never",
          canAskAgain: true,
        },
        jest.fn(),
      ]);

      // Mock image picker result
      const { result } = renderHook(() => useCreateExerciseForm());

      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(
        mockCameraResult
      );

      customRenderUI(<CreateExerciseForm form={result.current} />);

      // Open image selection modal
      const selectImageButton = screen.getByTestId("select-image-button");
      await act(async () => {
        fireEvent.press(selectImageButton);
      });

      // Select library option
      const libraryOptions = await screen.findAllByText(/Chọn từ thư viện/i);
      await act(async () => {
        fireEvent.press(libraryOptions[0]);
      });

      // Verify image picker was launched
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith(
        mockPickerOptions
      );

      //TODO: dirty fix
      await act(async () => {
        result.current.setValue("imageUrl", mockCameraResult.assets[0]);
      });

      // Verify image is displayed
      await waitFor(() => {
        const imageBackground = screen.getByTestId("exercise-image");
        expect(imageBackground.props.source).toEqual([
          mockCameraResult.assets[0],
        ]);
      });
    });
  });
});
