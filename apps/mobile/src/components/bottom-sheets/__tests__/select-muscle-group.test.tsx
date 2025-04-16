import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  customRenderQueryHook,
  customRenderUI,
} from "../../../utils/test-utils";
import { SelectMuscleGroupSheet } from "../select-muscle-group";
import React from "react";
import nock from "nock";
import { ENV, MuscleGroup, API_ROUTES } from "app";
import { useGetMuscleGroups } from "app";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

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

describe("SelectMuscleGroup", () => {
  it("should render correctly", async () => {
    nock(ENV.API_URL).get(API_ROUTES.muscleGroups.query()).reply(200, {
      data: muscleGroups,
    });

    const { result } = customRenderQueryHook<MuscleGroup[]>(() =>
      useGetMuscleGroups()
    );

    const modalRef = React.createRef<BottomSheetModal>();
    const setSelectedMuscleGroup = jest.fn();
    customRenderUI(
      <SelectMuscleGroupSheet
        modalRef={modalRef}
        setSelectedMuscleGroup={setSelectedMuscleGroup}
      />
    );

    await act(async () => {
      modalRef.current?.present();
    });

    const shoulderMuscleGroup = muscleGroups.find(
      (muscleGroup) => muscleGroup.id === 5
    );

    // await act(async () => {
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.length).toBe(muscleGroups.length);

      // render all muscle groups
      for (const muscleGroup of muscleGroups) {
        expect(
          screen.getByText(muscleGroup.translations[0].name)
        ).toBeOnTheScreen();
      }

      fireEvent.press(
        screen.getByText(shoulderMuscleGroup?.translations[0].name!)
      );
      // check muscle item has class bg-gray-600
      expect(
        screen.getByTestId(`muscle-item-${shoulderMuscleGroup?.id}`).props
          .className
      ).toContain("bg-gray-600");
      expect(setSelectedMuscleGroup).toHaveBeenCalledWith(shoulderMuscleGroup);
    });

    // check clear button
    fireEvent.press(screen.getByText("Xóa"));
    expect(setSelectedMuscleGroup).toHaveBeenCalledWith(null);

    // check muscle item has class bg-gray-600
    expect(
      screen.getByTestId(`muscle-item-${shoulderMuscleGroup?.id}`).props
        .className
    ).not.toContain("bg-gray-600");
  });
});
