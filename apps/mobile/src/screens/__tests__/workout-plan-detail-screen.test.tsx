import { jest } from "@jest/globals";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { render, renderHook, waitFor } from "@testing-library/react-native";
import { useGetWorkoutPlan } from "app";
import { API_ROUTES } from "app/src/configs/api-routes";
import { useLocalSearchParams } from "expo-router";
import { renderRouter, screen } from "expo-router/testing-library";
// import { useGetWorkoutPlan } from "app";
import nock from "nock";
import React from "react";
import { View } from "react-native";
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { mockQueryClient } from "../../../__mocks__/mock-query-client";
import { WorkoutPlanDetailScreen } from "../workout-plans/workout-plan-detail-screen";

const ID = 2;
const mockData = {
  id: 2,
  name: "Aggero cunctatio correptius tres vulgaris accusantium virga corporis.",
  cover_image: "https://loremflickr.com/595/1479?lock=3949512680487871",
  description:
    "Desparatus infit paens temptatio desipio suffoco beatae stillicidium vir somnus. Dedecor explicabo theologus a ut volva valde. Suffragium unus virga conduco coniuratio ventosus totus deputo.",
  level: "BEGINNER",
  isPublic: true,
  isPremium: true,
  isFeatured: true,
  isSingle: false,
  category: "BALANCE",
  createdById: 11,
  createdAt: "2025-03-26T16:12:12.095Z",
  updatedAt: "2025-03-26T16:12:12.095Z",
  workouts: [
    {
      id: 12,
      name: "Tracto centum sufficio.",
      order: 12,
      createdAt: "2025-03-26T16:12:12.153Z",
      updatedAt: "2025-03-26T16:12:12.153Z",
      workoutPlanId: 2,
      _count: {
        exercises: 0,
      },
    },
    {
      id: 15,
      name: "Usque vix sed tantillus acer urbanus molestias.",
      order: 15,
      createdAt: "2025-03-26T16:12:12.159Z",
      updatedAt: "2025-03-26T16:12:12.159Z",
      workoutPlanId: 2,
      _count: {
        exercises: 0,
      },
    },
    {
      id: 27,
      name: "Adeo fugiat dens ara tempore.",
      order: 27,
      createdAt: "2025-03-26T16:12:12.181Z",
      updatedAt: "2025-03-26T16:12:12.181Z",
      workoutPlanId: 2,
      _count: {
        exercises: 2,
      },
    },
  ],
};

// do not mock @tanstack/react-query
// this will break the query client
// jest.mock("@tanstack/react-query", () => ({
//   useQuery: () => ({
//     data: mockData,
//     isLoading: false,
//     isError: false,
//     error: null,
//     isSuccess: true,
//   }),
// }));

// // Mock react-native-collapsible-tab-view
// jest.mock("react-native-collapsible-tab-view", () => ({
//   Tabs: {
//     Container: ({ children }: { children: React.ReactNode }) => (
//       <View>{children}</View>
//     ),
//     Tab: ({ children }: { children: React.ReactNode }) => (
//       <View>{children}</View>
//     ),
//     ScrollView: ({ children }: { children: React.ReactNode }) => (
//       <View>{children}</View>
//     ),
//   },
// }))

// Mock expo-router hooks
jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({
    id: ID.toString(),
  }),
  // Add other expo-router exports you need in your tests
  Link: () => null,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("react-native-collapsible-tab-view");

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={mockQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (ui: React.ReactElement) => {
  return render(ui, { wrapper: Provider });
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={mockQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("WorkoutPlanDetailScreen", () => {
  it("should render", async () => {
    nock("http://192.168.31.63:3000")
      .get(API_ROUTES.plans.detail(ID))
      .reply(200, {
        data: mockData,
      });

    const { getByText } = render(
      <SafeAreaProvider>
        <QueryClientProvider client={mockQueryClient}>
          <WorkoutPlanDetailScreen />
        </QueryClientProvider>
      </SafeAreaProvider>
    );
    const { result } = renderHook(() => useGetWorkoutPlan(ID), {
      wrapper,
    });

    // console.log("result ", result);

    expect(result.current.isSuccess).toEqual(false);
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.isError).toEqual(false);
    expect(result.current.data).toEqual(undefined);
    // console.log("result ", result.current.data);

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.isSuccess).toEqual(true);
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isError).toEqual(false);
      expect(getByText(mockData.name)).toBeTruthy();
    });

    expect(getByText("Start plan")).toBeTruthy();
    // expect(getByText("Overview")).toBeTruthy();
    // expect(getByText("Statistics")).toBeTruthy();
  });
});
