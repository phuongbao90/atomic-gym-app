import type {
  default as PagerView,
  PageScrollStateChangedNativeEvent,
  PagerViewOnPageScrollEventData,
  PagerViewOnPageSelectedEventData,
} from "react-native-pager-view";
import { Animated } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import type { ViewStyle } from "react-native";

export type UsePagerViewProps = ReturnType<typeof usePagerView>;

export interface EventLog {
  event: "scroll" | "select" | "statusChanged";
  text: string;
  timestamp: Date;
}

const getBasePages = (pages: number) =>
  new Array(pages).fill("").map((_v, index) => createPage(index));

export function usePagerView(
  pagesAmount = 10,
  onPageSelectedCallback: (position: number) => void = () => {}
) {
  const ref = useRef<PagerView>(null);
  const [pages, setPages] = useState<CreatePage[]>(
    useMemo(() => getBasePages(pagesAmount), [pagesAmount])
  );
  const [activePage, setActivePage] = useState(0);
  const [isAnimated, setIsAnimated] = useState(true);
  const [overdragEnabled, setOverdragEnabled] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [scrollState, setScrollState] = useState("idle");
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [progress, setProgress] = useState({ position: 0, offset: 0 });
  const onPageScrollOffset = useRef(new Animated.Value(0)).current;
  const onPageScrollPosition = useRef(new Animated.Value(0)).current;
  const onPageSelectedPosition = useRef(new Animated.Value(0)).current;

  const setPage = useCallback(
    (page: number) =>
      isAnimated
        ? ref.current?.setPage(page)
        : ref.current?.setPageWithoutAnimation(page),
    [isAnimated]
  );

  const addLog = useCallback((log: EventLog) => {
    setLogs((text) => [log, ...text].slice(0, 100));
  }, []);

  const addPage = useCallback(
    () => setPages((prevPages) => [...prevPages, createPage(prevPages.length)]),
    []
  );
  const removePage = useCallback(() => {
    setPages((prevPages) => {
      if (prevPages.length === 1) {
        return prevPages;
      }
      return prevPages.slice(0, prevPages.length - 1);
    });
  }, []);
  const toggleAnimation = useCallback(
    () => setIsAnimated((animated) => !animated),
    []
  );
  const toggleScroll = useCallback(
    () => setScrollEnabled((enabled) => !enabled),
    []
  );
  const toggleOverdrag = useCallback(
    () => setOverdragEnabled((enabled) => !enabled),
    []
  );

  const onPageScroll = useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: onPageScrollOffset,
              position: onPageScrollPosition,
            },
          },
        ],
        {
          listener: ({ nativeEvent: { offset, position } }) => {
            addLog({
              event: "scroll",
              text: `Position: ${position} Offset: ${offset}`,
              timestamp: new Date(),
            });
            setProgress({
              position,
              offset,
            });
          },
          useNativeDriver: true,
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      setActivePage(e.nativeEvent.position);
      onPageSelectedCallback(e.nativeEvent.position);
    },
    [onPageSelectedCallback]
  );

  const onPageScrollStateChanged = useCallback(
    (e: PageScrollStateChangedNativeEvent) => {
      addLog({
        event: "statusChanged",
        text: `State: ${e.nativeEvent.pageScrollState}`,
        timestamp: new Date(),
      });
      setScrollState(e.nativeEvent.pageScrollState);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    ref,
    activePage,
    isAnimated,
    pages,
    scrollState,
    scrollEnabled,
    progress,
    overdragEnabled,
    setPage,
    addPage,
    removePage,
    toggleScroll,
    toggleAnimation,
    setProgress,
    onPageScroll,
    onPageSelected,
    onPageScrollStateChanged,
    toggleOverdrag,
    logs,
  };
}

const BGCOLOR = ["#fdc08e", "#fff6b9", "#99d1b7", "#dde5fe", "#f79273"];
const IMAGE_URIS = [
  "https://apod.nasa.gov/apod/image/1410/20141008tleBaldridge001h990.jpg",
  "https://apod.nasa.gov/apod/image/1409/volcanicpillar_vetter_960.jpg",
  "https://apod.nasa.gov/apod/image/1409/m27_snyder_960.jpg",
  "https://apod.nasa.gov/apod/image/1409/PupAmulti_rot0.jpg",
  "https://apod.nasa.gov/apod/image/1510/lunareclipse_27Sep_beletskycrop4.jpg",
];

type CreatePage = {
  key: number;
  style: ViewStyle;
  imgSource: { uri: string };
};

const createPage = (key: number): CreatePage => {
  return {
    key: key,
    style: {
      flex: 1,
      backgroundColor: BGCOLOR[key % BGCOLOR.length],
      alignItems: "center",
      padding: 20,
    },
    imgSource: { uri: IMAGE_URIS[key % BGCOLOR.length] || "" },
  };
};
