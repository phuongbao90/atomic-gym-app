import { TextInput, View } from "react-native";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { XIcon } from "../../components/ui/expo-icon";
import { AppTouchable } from "../../components/ui/app-touchable";
import { faker } from "@faker-js/faker";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated";

export function DevUIScreen() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([
    // {
    //   id: faker.string.uuid(),
    //   name: faker.person.fullName(),
    //   email: faker.internet.email(),
    // },
    // {
    //   id: faker.string.uuid(),
    //   name: faker.person.fullName(),
    //   email: faker.internet.email(),
    // },
  ]);
  const [listVisible, setListVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setListVisible(true), 100); // short delay
    return () => clearTimeout(timeout);
  }, []);
  const searchRef = useRef<TextInput>(null);

  useEffect(() => {
    // This runs only once, after the first render.
    setData([
      {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
    ]);
  }, []); // Empty dependency array ensures it runs only on mount.
  // ------------------------------------

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { id: string; name: string; email: string };
      index: number;
    }) => {
      return (
        <Animated.View
          className="py-6 px-4 flex-row justify-between items-center bg-slate-600 rounded-lg"
          // entering={FadeIn.duration(200).reduceMotion(ReduceMotion.Never)}
          entering={FadeIn.duration(200 + index * 450).reduceMotion(
            ReduceMotion.Never
          )}
          exiting={FadeOut.duration(200).reduceMotion(ReduceMotion.Never)}
        >
          <View>
            <AppText>{item.name}</AppText>
            <AppText>{item.email}</AppText>
          </View>
          <AppTouchable onPress={() => handleDelete(item.id)}>
            <XIcon />
          </AppTouchable>
        </Animated.View>
      );
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearch("");
  }, []);

  const addMore = useCallback(() => {
    setData((prev) => [
      ...prev,
      {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
    ]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  //! this will cause the keyboard to close on keypress
  // const renderHeader = useCallback(() => {
  //   return (
  //     <View className="flex-row items-center gap-2">
  //       <TextInput
  //         placeholder="Search"
  //         className="bg-slate-600 rounded-lg p-2 flex-1 text-white"
  //         placeholderTextColor="#94a3b8"
  //         ref={searchRef}
  //         value={search} // Input value is tied to the INSTANT state
  //         onChangeText={setSearch}
  //       />
  //       <AppTouchable onPress={clearSearch}>
  //         <XIcon />
  //       </AppTouchable>
  //     </View>
  //   );
  // }, [clearSearch]);

  const Header = useMemo(
    () => (
      <View className="flex-row items-center gap-2 px-3 pt-3">
        <TextInput
          ref={searchRef}
          placeholder="Search"
          placeholderTextColor="#94a3b8"
          className="bg-slate-600 rounded-lg p-2 flex-1 text-white"
          value={search}
          onChangeText={setSearch}
          returnKeyType="done"
        />
        <AppTouchable onPress={clearSearch}>
          <XIcon />
        </AppTouchable>
      </View>
    ),
    [search, clearSearch]
  );

  const searchData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(search?.toLowerCase() ?? "")
    );
  }, [data, search]);

  return (
    <AppScreen
      name="(dev) ui-screen"
      safeAreaEdges={["top", "bottom"]}
      // keyboardShouldPersistTaps="handled"
    >
      <AppHeader title="UI" withBackButton />

      {listVisible && (
        <Animated.FlatList
          data={searchData}
          renderItem={renderItem}
          contentContainerClassName="gap-2 px-3 mt-3 flex-grow"
          ListHeaderComponent={Header}
          // ListHeaderComponent={renderHeader}
          ListFooterComponentStyle={{
            flexGrow: 1,
          }}
          itemLayoutAnimation={LinearTransition.delay(250)}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="always"
          ListFooterComponent={() => (
            <View className="flex-1 justify-end">
              <AppTouchable
                className="py-4 px-3 bg-slate-600 rounded-lg items-center justify-center mt-auto"
                onPress={addMore}
              >
                <AppText>Add more</AppText>
              </AppTouchable>
            </View>
          )}
        />
      )}
    </AppScreen>
  );
}

/**
 * List animation
 * keys points: Animated.FlatList (itemLayoutAnimation) + Animated.View (entering, exiting)
 */

/**
 * textinput keyboard close on keypress
 * key points: use useMemo instead of useCallback
 */
