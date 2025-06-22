import { ReactNode } from "react";
import {
  Image,
  ImageBackground,
  ImageBackgroundProps,
  useImage,
} from "expo-image";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";
import { PlaceholderImage } from "../../constants/app-assets";

type AppImageBackgroundProps = {
  uri: string | undefined | null;
  style: ViewStyle;
  children?: ReactNode;
  width?: number;
  height?: number;
} & Omit<ImageBackgroundProps, "source">;

export const AppImageBackground = ({
  uri,
  style,
  children,
  contentFit = "cover",
  transition = 200,
  width = Dimensions.get("window").width,
  height = Dimensions.get("window").height,
  ...props
}: AppImageBackgroundProps) => {
  const optimizedImage = useImage(uri || "", {
    maxWidth: width,
    maxHeight: height,
  });

  return (
    // ===== BASE LAYER: The Placeholder using ImageBackground =====
    // This renders first and instantly, establishing the component's bounds
    // and showing the placeholder. It also receives all extra props like blurRadius.
    <ImageBackground
      source={PlaceholderImage}
      style={style}
      contentFit={contentFit}
      {...props}
    >
      {/* ===== LAYER 2: The Remote Image ===== */}
      {/* This is an <Image> component (not another ImageBackground) layered on top. */}
      {/* It's positioned to fill its parent and will fade in over the placeholder. */}
      {/* If it fails to load, it remains transparent, leaving the placeholder visible. */}
      {uri && (
        <Image
          source={optimizedImage}
          style={StyleSheet.absoluteFill}
          contentFit={contentFit}
          transition={transition}
        />
      )}

      {/* ===== LAYER 3: The Children ===== */}
      {/* We wrap children in an absolutely positioned View to ensure they are */}
      {/* always rendered on the topmost layer, above both image layers. */}
      {children && <View style={StyleSheet.absoluteFill}>{children}</View>}
    </ImageBackground>
  );
};
