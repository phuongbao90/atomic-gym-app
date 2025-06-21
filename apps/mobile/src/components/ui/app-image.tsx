import { Image, ImageProps, ImageStyle } from "expo-image";

export const AppImage = ({
  uri,
  style,
  ...props
}: {
  uri: string | undefined | null;
  style: ImageStyle;
} & ImageProps) => {
  if (!uri) {
    // add placeholder
    return (
      <Image
        source={require("../../../assets/images/placeholder.jpg")}
        style={style}
        {...props}
      />
    );
  }

  return <Image source={{ uri }} style={style} {...props} />;
};
