import { Exercise } from "app";
import { customRenderUI } from "../../utils/test-utils";
import { ExerciseItem } from "../exercise-item";
import { fireEvent, screen } from "@testing-library/react-native";
import { appRoutes } from "../../configs/routes";
import { useRouter } from "../../../__mocks__/expo-router";

const mockExercise: Exercise = {
  id: 1,
  notes:
    "Crepusculum surgo ab solium aegre eos. Cruciamentum laudantium delicate acquiro vetus universe convoco. Subnecto corroboro exercitationem despecto canto tibi anser demergo.",
  category: "WEIGHT",
  createdById: 8,
  images: [
    "https://picsum.photos/seed/oieCLZWG/1112/1983",
    "https://loremflickr.com/1885/2853?lock=7104808881115842",
    "https://picsum.photos/seed/Ptf8FlttN/3310/514",
  ],
  createdAt: "2025-04-11T14:09:26.091Z",
  updatedAt: "2025-04-11T14:09:26.091Z",
  workoutId: null,
  primaryMuscle: [
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
  ],
  translations: [
    {
      exerciseId: 1,
      language: "vi",
      name: "Năm được không chỉ chết chỉ.",
      normalizedName: "nam duoc khong chi chet chi",
      description:
        "Quần tàu cửa chết. Thế tím bảy mướn mướn. Ghét hai biển nghỉ.",
      slug: "nam-duoc-khong-chi-chet-chi",
    },
  ],
};

describe("ExerciseItem", () => {
  it("should render", () => {
    customRenderUI(<ExerciseItem item={mockExercise} index={0} />);

    expect(
      screen.getByText(mockExercise.translations?.[0]?.name!, {
        exact: false,
      })
    ).toBeOnTheScreen();

    expect(
      screen.getByText(
        mockExercise.primaryMuscle?.[0]?.translations?.[0]?.name!
      )
    ).toBeOnTheScreen();

    const image = screen.getByTestId("exercise-item-image");
    expect(image).toHaveProp("source", [{ uri: mockExercise.images[0] }]);

    fireEvent.press(screen.getByTestId(`exercise-item-${mockExercise.id}`));
    expect(useRouter().push).toHaveBeenCalledWith(
      appRoutes.exercises.detail(mockExercise.id.toString())
    );
  });
});
