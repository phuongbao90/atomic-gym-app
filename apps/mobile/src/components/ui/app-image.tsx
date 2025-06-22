import { useState, useEffect } from "react";
import { Image, ImageProps, ImageStyle } from "expo-image";

// Assuming PlaceholderImage is from something like:
// export const PlaceholderImage = require('../assets/images/placeholder.png');
import { PlaceholderImage } from "../../constants/app-assets";

type AppImageProps = {
  uri: string | undefined | null;
  style: ImageStyle;
} & ImageProps;

export const AppImage = ({ uri, style, ...props }: AppImageProps) => {
  // 1. Add state to track if the image has failed to load
  const [isError, setIsError] = useState(false);

  // 2. Reset the error state whenever the URI changes
  useEffect(() => {
    setIsError(false);
  }, [uri]);

  // 3. If there is no URI or an error has occurred, render the local placeholder
  if (isError || !uri) {
    return <Image source={PlaceholderImage} style={style} {...props} />;
  }

  // 4. Otherwise, render the remote image with built-in placeholder and error handling
  return (
    <Image
      style={style}
      source={{ uri }}
      {...props}
      // Use the 'placeholder' prop for a seamless loading experience.
      // This shows your local placeholder asset while the remote 'uri' is downloading.
      placeholder={PlaceholderImage}
      // Use the 'onError' callback to set our error state.
      onError={() => setIsError(true)}
      // (Recommended) Add a transition for a smooth fade-in effect.
      transition={300}
    />
  );
};
