import { useMemo } from "react";
import {
  absMuscleGroupIds,
  backMuscleGroupIds,
  bicepsMuscleGroupIds,
  calvesMuscleGroupIds,
  chestMuscleGroupIds,
  forearmsMuscleGroupIds,
  glutesMuscleGroupIds,
  legMuscleGroupIds,
  shouldersMuscleGroupIds,
  tricepsMuscleGroupIds,
} from "../../../constants/muscle-group-data";

import ChestImage from "../../../../assets/images/muscles/chest.png";
import BackImage from "../../../../assets/images/muscles/back.png";
import ShoulderImage from "../../../../assets/images/muscles/shoulders.png";

export const useSetsPerMuscleGroupChartData = (
  data: Record<string, number> | undefined
) => {
  const total = Object.values(data ?? {}).reduce((acc, item) => acc + item, 0);
  const pieChartData = useMemo(() => {
    if (!data) return [];

    const group = Object.entries(data).reduce(
      (acc, item) => {
        if (backMuscleGroupIds.includes(Number(item[0]))) {
          acc.back.value += item[1];
        } else if (legMuscleGroupIds.includes(Number(item[0]))) {
          acc.legs.value += item[1];
        } else if (chestMuscleGroupIds.includes(Number(item[0]))) {
          acc.chest.value += item[1];
        } else if (shouldersMuscleGroupIds.includes(Number(item[0]))) {
          acc.shoulders.value += item[1];
        } else if (absMuscleGroupIds.includes(Number(item[0]))) {
          acc.abs.value += item[1];
        } else if (bicepsMuscleGroupIds.includes(Number(item[0]))) {
          acc.biceps.value += item[1];
        } else if (tricepsMuscleGroupIds.includes(Number(item[0]))) {
          acc.triceps.value += item[1];
        } else if (forearmsMuscleGroupIds.includes(Number(item[0]))) {
          acc.forearms.value += item[1];
        } else if (glutesMuscleGroupIds.includes(Number(item[0]))) {
          acc.glutes.value += item[1];
        } else if (calvesMuscleGroupIds.includes(Number(item[0]))) {
          acc.calves.value += item[1];
        }
        return acc;
      },
      {
        chest: {
          value: 0,
          color: "#4300FF",
          image: ChestImage,
        },
        back: {
          value: 0,
          color: "#FF0B55",
          image: BackImage,
        },
        shoulders: {
          value: 0,
          color: "#16610E",
          image: ShoulderImage,
        },
        legs: {
          value: 0,
          color: "#D50B8B",
          image: ChestImage,
        },
        biceps: {
          value: 0,
          color: "#a59391",
          image: ChestImage,
        },
        triceps: {
          value: 0,
          color: "#D5451B",
          image: ChestImage,
        },
        abs: {
          value: 0,
          color: "#939bfb",
          image: ChestImage,
        },
        calves: {
          value: 0,
          color: "#4B352A",
          image: ChestImage,
        },
        glutes: {
          value: 0,
          color: "#670D2F",
          image: ChestImage,
        },
        forearms: {
          value: 0,
          color: "#FFB22C",
          image: ChestImage,
        },
      }
    );

    return Object.entries(group ?? {}).map(([key, value]) => ({
      text: value.value ? `${((value.value / total) * 100).toFixed(0)}%` : "0%",
      value: value.value,
      color: value.color,
      image: value.image,
      name: key,
    }));
  }, [data, total]);

  return {
    data: pieChartData,
    hasChartData: !pieChartData.every((item) => item.value === 0),
    totalSets: total,
  };
};
