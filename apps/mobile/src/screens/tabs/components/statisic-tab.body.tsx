import { AppText } from "../../../components/ui/app-text";
import { AppScrollView } from "../../../components/ui/app-scrollview";
import { Dimensions, RefreshControl, View } from "react-native";
import { Badge } from "../../../components/ui/badge";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { capitalize, lowerCase } from "lodash";
import { useModal } from "react-native-modalfy";
import { AppTouchable } from "../../../components/ui/app-touchable";
import { PlusCircleIcon } from "../../../components/ui/expo-icon";
import {
  useCreateBodyLogs,
  useGetBodyLogs,
  useGetBodyMeasurementTypes,
} from "app/src/query/logs/logs.hooks";
import { LineChart, LineChartPropsType } from "react-native-gifted-charts";
import { BodyMeasurementType } from "app/src/prisma-generated";
import { PRIMARY_COLOR, twColors } from "../../../styles/themes";
import { BodyLogResponse } from "app/src/query/logs/logs.types";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { appRoutes } from "../../../configs/routes";
import { UserPreferencesStorage } from "app";

const INITIAL_SPACING = 4;
const PADDING = 12;
const GRAPH_PADDING = 12;
const GRAPH_WIDTH =
  Dimensions.get("window").width -
  PADDING * 2 -
  GRAPH_PADDING * 2 -
  40 -
  INITIAL_SPACING;

export const StatisticTabBody = () => {
  const { t } = useTranslation();
  const [periodType, setPeriodType] = useState<"30DAY" | "90DAY" | "all">(
    "30DAY"
  );
  const [measurementTypeId, setMeasurementTypeId] = useState<number>(1);

  const { data, refetch, isRefetching } = useGetBodyLogs(periodType);

  const { data: bodyMeasurementTypes } = useGetBodyMeasurementTypes();

  const mappedBodyMeasurementTypes = useMemo(() => {
    return bodyMeasurementTypes?.reduce(
      (acc: Record<number, BodyMeasurementType>, item) => {
        acc[item.id] = item;
        return acc;
      },
      {} as Record<number, BodyMeasurementType>
    );
  }, [bodyMeasurementTypes]);

  return (
    <AppScrollView
      contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: PADDING }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <View className="flex-row items-center justify-center gap-2 mt-2">
        <Badge
          label={t("days", { count: 30 })}
          onPress={() => {
            setPeriodType("30DAY");
          }}
          isActive={periodType === "30DAY"}
        />
        <Badge
          label={t("days", { count: 90 })}
          onPress={() => {
            setPeriodType("90DAY");
          }}
          isActive={periodType === "90DAY"}
        />

        <Badge
          label={t("all")}
          onPress={() => setPeriodType("all")}
          isActive={periodType === "all"}
        />
      </View>

      <AppText className="text-3xl mt-8">{capitalize(t("graph"))}</AppText>

      <View className="flex-row gap-2 my-4 flex-wrap">
        {bodyMeasurementTypes?.map((item) => (
          <Badge
            key={item.id}
            label={item?.translations?.[0]?.name || item.name}
            onPress={() => {
              setMeasurementTypeId(item.id);
            }}
            isActive={measurementTypeId === item.id}
          />
        ))}
      </View>

      <BodyMeasurementChart
        data={data?.[measurementTypeId]}
        label={t(
          lowerCase(
            mappedBodyMeasurementTypes?.[measurementTypeId]?.translations?.[0]
              ?.name || ""
          )
        )}
        unit={mappedBodyMeasurementTypes?.[measurementTypeId]?.unit || ""}
        measurementTypeId={measurementTypeId}
        refetch={refetch}
      />
    </AppScrollView>
  );
};

const useBodyMeasurementData = (
  _data: BodyLogResponse[number] | undefined,
  measurementTypeId: number
) => {
  const bodyLogGoal = UserPreferencesStorage.getBodyLogGoal(
    measurementTypeId.toString()
  );

  // console.log("bodyLogGoal ", bodyLogGoal, measurementTypeId);

  const chartData: LineChartPropsType["data"] = useMemo(() => {
    const length = _data?.length || 0;

    if (length === 1) {
      return [
        {
          value: _data?.[0]?.value,
          label: dayjs(_data?.[0]?.date).format("DD/MM"),
          labelTextStyle: {
            color: "white",
            fontSize: 11,
            left: 6,
          },
        },
      ];
    }

    if (length === 2) {
      return [
        {
          value: _data?.[0]?.value,
          label: dayjs(_data?.[0]?.date).format("DD/MM"),
          labelTextStyle: {
            color: "white",
            fontSize: 11,
            left: 6,
          },
        },
        {
          value: _data?.[1]?.value,
          label: dayjs(_data?.[1]?.date).format("DD/MM"),
          labelTextStyle: {
            color: "white",
            fontSize: 11,
            right: 6,
          },
        },
      ];
    }

    if (length <= 4) {
      return _data?.map((item, index) => {
        return {
          value: item.value,
          label: dayjs(item.date).format("DD/MM"),
          labelTextStyle: {
            color: "white",
            fontSize: 11,
            right: index === _data.length - 1 ? 6 : undefined,
            left: index === 0 ? 6 : undefined,
          },
        };
      });
    }
    if (length <= 10) {
      return _data?.map((item, index) => {
        return {
          value: item.value,
          label:
            index === 0 ||
            index === length - 1 ||
            index === Math.floor(length / 2)
              ? dayjs(item.date).format("DD/MM")
              : undefined,
          labelTextStyle: {
            color: "white",
            fontSize: 11,
            right: index === _data.length - 1 ? 6 : undefined,
            left: index === 0 ? 6 : undefined,
          },
        };
      });
    }

    return (
      (_data?.map((item, index) => {
        if (
          index === 0 ||
          index === _data.length - 1 ||
          index === Math.floor(length / 4) ||
          index === Math.floor(length / 4) * 2 ||
          index === Math.floor(length / 4) * 3
        ) {
          // console.log(
          //   length,
          //   Math.floor(length / 4 ),
          //   Math.floor(length / 4) * 2,
          //   Math.floor(length / 4) * 3
          // );

          return {
            value: item.value,
            labelComponent: () => (
              <View
                style={{
                  right: index === 0 ? 0 : 14,
                  width: 30,
                }}
              >
                <AppText className="text-xs text-left">
                  {dayjs(item.date).format("DD/MM")}
                </AppText>
              </View>
            ),
          };
        }

        return {
          value: item.value,
        };
      }) as LineChartPropsType["data"]) || []
    );
  }, [_data]);

  const spacing = useMemo(() => {
    const dataLength = _data?.length || 0;

    if (dataLength === 1) {
      return 100;
    }

    if (dataLength === 2) {
      return GRAPH_WIDTH - 5;
    }

    return (GRAPH_WIDTH - 5) / (dataLength - 1);
  }, [_data]);

  return {
    data: chartData,
    data2: bodyLogGoal
      ? Array(chartData?.length || 0).fill({ value: +bodyLogGoal })
      : undefined,
    yAxisOffset: undefined,
    stepValue: undefined,
    spacing,
    hideDataPoints: false,
  };
};

const BodyMeasurementChart = ({
  data,
  label,
  unit,
  measurementTypeId,
  refetch,
}: {
  data: BodyLogResponse[number] | undefined;
  label: string;
  unit: string;
  measurementTypeId: number;
  refetch: () => void;
}) => {
  const { openModal } = useModal();
  const router = useRouter();
  const { t } = useTranslation();
  const createBodyLogMutation = useCreateBodyLogs();
  // const test = UserPreferencesStorage.getBodyLogGoal(
  //   measurementTypeId.toString()
  // );
  const chartProps = useBodyMeasurementData(data, measurementTypeId);
  // console.log("🚀 ~ BodyMeasurementChart ~ test:", test);

  return (
    <View
      className="bg-slate-700 py-6 rounded-xl mt-4 min-h-[350px]"
      style={{ paddingHorizontal: GRAPH_PADDING }}
    >
      <View className="flex-row mb-4 justify-between">
        <AppText className="text-2xl">
          {label} ({unit})
        </AppText>
        <AppTouchable
          onPress={() => {
            openModal("InputValueModal", {
              label,
              unit,
              initialValue: undefined,
              onConfirm: (date: string, value: number) => {
                createBodyLogMutation.mutate(
                  {
                    data: [
                      {
                        measurementTypeId,
                        value,
                      },
                    ],
                    date,
                  },
                  {
                    onSuccess: () => {
                      refetch();
                    },
                  }
                );
              },
            });
          }}
        >
          <PlusCircleIcon />
        </AppTouchable>
      </View>

      {chartProps?.data?.length && chartProps?.data?.length > 0 ? (
        <LineChart
          // data={chartData}
          {...chartProps}
          dataPointsColor2={twColors.red[700]}
          dataPointsHeight2={2}
          dataPointsShape2="rectangular"
          areaChart
          initialSpacing={INITIAL_SPACING}
          color={twColors.slate[400]}
          rulesType={"dashed"}
          rulesLength={GRAPH_WIDTH + 2}
          rulesColor={twColors.slate[400]}
          dataPointsColor={PRIMARY_COLOR}
          width={GRAPH_WIDTH}
          dashGap={10}
          yAxisTextStyle={{ color: "white", fontSize: 11 }}
          stepHeight={22}
          yAxisColor={twColors.slate[400]}
          xAxisColor={twColors.slate[400]}
          xAxisLength={GRAPH_WIDTH + 3}
          startFillColor1="skyblue"
          startOpacity={0.8}
          endOpacity={0.3}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <AppText className="text-center text-sm text-slate-300">
            {t("no_graph_data", { type: label })}
          </AppText>
        </View>
      )}

      <View className="w-full h-[1px] bg-slate-600" />

      <View className="flex-row gap-8 pt-4">
        <AppTouchable
          onPress={() => {
            openModal("InputValueModal", {
              label,
              unit,
              initialValue: undefined,
              allowDatePicker: false,
              onConfirm: (_date: string, value: number) => {
                UserPreferencesStorage.setBodyLogGoal(
                  measurementTypeId.toString(),
                  value.toString()
                );
              },
            });
          }}
        >
          <AppText className="text-md font-semibold">{t("set_goal")}</AppText>
        </AppTouchable>
        <AppTouchable
          onPress={() => {
            router.push(
              appRoutes.logs.bodyLogHistory(measurementTypeId?.toString())
            );
          }}
        >
          <AppText className="text-md font-semibold">
            {t("view_history")}
          </AppText>
        </AppTouchable>
      </View>
    </View>
  );
};
