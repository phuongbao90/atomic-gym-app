import {
  useDeleteBodyLogMutation,
  useGetBodyLogs,
  useGetBodyMeasurementTypes,
} from "app/src/query/logs/logs.hooks";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native";
import { View } from "react-native";
import { PRIMARY_COLOR } from "../../styles/themes";
import { AppHeader } from "../../components/ui/app-header";
import { AppFlatList } from "../../components/ui/app-flat-list";
import dayjs from "dayjs";
import { VerticalDotsIcon } from "../../components/ui/expo-icon";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import ContextMenu from "react-native-context-menu-view";

export const BodyLogHistory = () => {
  const { type } = useLocalSearchParams();
  const { data, isLoading, refetch } = useGetBodyLogs("all");
  const deleteBodyLogMutation = useDeleteBodyLogMutation();
  const { data: bodyMeasurementTypes } = useGetBodyMeasurementTypes();
  const { t } = useTranslation();
  const listData = useMemo(() => {
    return data?.[type as keyof typeof data]?.reverse() || [];
  }, [data, type]);

  if (isLoading) {
    return (
      <AppScreen name="body-log-history">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={PRIMARY_COLOR} />
        </View>
      </AppScreen>
    );
  }

  const renderItem = ({
    item,
  }: { item: { date: string; value: number; id: string } }) => {
    return (
      <View className="flex-row items-center justify-between ml-4 mr-2 py-4">
        <AppText className="text-xl">
          {dayjs(item.date).format("DD/MM/YYYY")}
        </AppText>
        <View className="flex-row items-center gap-4">
          <AppText className="text-xl">
            {item.value} {bodyMeasurementTypes?.[Number(type)]?.unit}
          </AppText>

          <ContextMenu
            actions={[{ title: t("delete") }]}
            onPress={(e) => {
              if (e.nativeEvent.index === 0) {
                deleteBodyLogMutation.mutate(item.id, {
                  onSuccess: () => {
                    refetch();
                  },
                });
              }
            }}
            dropdownMenuMode={true}
            hitSlop={10}
          >
            <VerticalDotsIcon size={28} />
          </ContextMenu>
        </View>
      </View>
    );
  };

  return (
    <AppScreen
      name="body-log-history"
      isLoading={deleteBodyLogMutation.isPending}
    >
      <AppHeader
        title={bodyMeasurementTypes?.[Number(type)]?.translations?.[0]?.name}
        withBackButton
      />

      <AppFlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View className="h-1 border-b-[1px] border-slate-600" />
        )}
        ListEmptyComponent={
          <View className="mt-24">
            <AppText className="text-xl text-center">
              {t("no_graph_data", {
                type: bodyMeasurementTypes?.[Number(type)]?.translations?.[0]
                  ?.name,
              })}
            </AppText>
          </View>
        }
      />
    </AppScreen>
  );
};
