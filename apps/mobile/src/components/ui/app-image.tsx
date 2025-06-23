import { Image, ImageProps, ImageStyle, useImage } from "expo-image";
import { PlaceholderImage } from "../../constants/app-assets";
import { Dimensions, StyleSheet, View } from "react-native";

type AppImageProps = {
  uri: string | undefined | null;
  style: ImageStyle;
  width?: number;
  height?: number;
  children?: React.ReactNode;
} & ImageProps;

export const AppImage = ({
  uri,
  style,
  width = Dimensions.get("window").width,
  height = Dimensions.get("window").height,
  contentFit = "cover",
  children,
  ...props
}: AppImageProps) => {
  const optimizedImage = useImage(uri || PlaceholderImage, {
    maxWidth: width,
    maxHeight: height,
  });

  return (
    <View style={[style, { overflow: "hidden" }]}>
      {/* Layer 1: The Placeholder */}
      {/* <Image
        source={PlaceholderImage}
        style={StyleSheet.absoluteFill}
        contentFit={contentFit}
        {...props}
      /> */}

      {/* Layer 2: The Optimized Remote Image */}
      {optimizedImage && (
        <Image
          source={optimizedImage}
          style={StyleSheet.absoluteFill}
          contentFit={contentFit}
          transition={300}
          {...props}
        />
      )}
      {children}
    </View>
  );
};
