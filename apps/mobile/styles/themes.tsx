const margins = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
};
const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};
const spacing = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const tabBarStyle = {
  light: {
    backgroundColor: "white",
    borderTopColor: "white",
    iconColor: {
      focused: "black",
      unfocused: "lightgray",
    },
    labelColor: {
      focused: "black",
      unfocused: "lightgray",
    },
  },
  dark: {
    backgroundColor: "black",
    borderTopColor: "black",
    iconColor: {
      focused: "white",
      unfocused: "gray",
    },
    labelColor: {
      focused: "white",
      unfocused: "gray",
    },
  },
} as const;

export const theme = {
  icon: {
    light: {
      color: "black",
    },
    dark: {
      color: "white",
    },
  },
  pageBackground: {
    light: "white",
    dark: "black",
  },
  text: {
    light: {
      inactive: "gray",
      main: "black",
    },
    dark: {
      inactive: "gray",
      main: "white",
    },
  },
} as const;

export const lightTheme = {
  colors: {
    typography: "#000000",
    background: "#ffffff",
  },
  margins,
  radius,
  spacing,
  button: {
    text: {
      enabled: {
        background: "transparent",
        border: "transparent",
      },
      disabled: {
        background: "transparent",
        border: "transparent",
      },
      pressed: {
        background: "transparent",
        border: "transparent",
      },
    },
    outlined: {
      enabled: {},
      disabled: {},
      pressed: {},
    },
    contained: {
      enabled: {},
      disabled: {},
      pressed: {},
    },
  },
} as const;

export const darkTheme = {
  colors: {
    typography: "#ffffff",
    background: "#000000",
  },
  margins,
  radius,
  spacing,

  button: {
    text: {
      enabled: {
        background: "transparent",
        border: "transparent",
      },
      disabled: {
        background: "transparent",
        border: "transparent",
      },
      pressed: {
        background: "transparent",
        border: "transparent",
      },
    },
    outlined: {
      enabled: {},
      disabled: {},
      pressed: {},
    },
    contained: {
      enabled: {},
      disabled: {},
      pressed: {},
    },
  },
} as const;

// define other themes

// export function Theme({
//   children,
//   name,
// }: {
//   children: React.ReactNode;
//   name: keyof typeof themes;
// }) {
//   const { colorScheme } = useColorScheme();
//   if (!colorScheme) return null;
//   return (
//     //@ts-expect-error
//     <View style={[themes[name][colorScheme!], { flex: 1 }]}>{children}</View>
//   );
// }
