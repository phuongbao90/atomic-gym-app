import { useState, useEffect, ReactNode } from "react";
import { ImageBackground, ImageBackgroundProps } from "expo-image";
import { ViewStyle } from "react-native";

// Assuming PlaceholderImage is the same local asset as before
import { PlaceholderImage } from "../../constants/app-assets";

type AppImageBackgroundProps = {
  uri: string | undefined | null;
  style: ViewStyle;
  children?: ReactNode;
  // Inherit all other props from ImageBackground, but we'll create `source` ourselves
} & Omit<ImageBackgroundProps, "source">;

export const AppImageBackground = ({
  uri,
  style,
  children,
  ...props
}: AppImageBackgroundProps) => {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Reset error state if the uri changes
    setIsError(false);
  }, [uri]);

  // If there's no URI or an error occurred, use the local placeholder as the background
  if (isError || !uri) {
    return (
      <ImageBackground source={PlaceholderImage} style={[style]} {...props}>
        {children}
      </ImageBackground>
    );
  }

  // Otherwise, attempt to load the remote image
  return (
    <ImageBackground
      style={style}
      source={{ uri }}
      {...props}
      // Show the local asset while the remote one is loading
      placeholder={PlaceholderImage}
      placeholderContentFit="scale-down"
      // Set the error state on failure
      onError={() => setIsError(true)}
      contentFit="cover"
      // Add a smooth fade-in transition
      transition={300}
    >
      {children}
    </ImageBackground>
  );
};
