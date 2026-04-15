import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline";
}

export const AppButton: React.FC<Props> = ({
  label,
  onPress,
  variant = "primary",
}) => {
  const { themeColors } = useTheme();
  const baseStyle = {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center" as const,
  };
  const background =
    variant === "primary"
      ? { backgroundColor: themeColors.primary }
      : { borderWidth: 1, borderColor: themeColors.primary };
  const textColor =
    variant === "primary" ? themeColors.textDark : themeColors.primary;

  return (
    <TouchableOpacity style={[baseStyle, background]} onPress={onPress}>
      <Text style={{ color: textColor, fontWeight: "bold" }}>{label}</Text>
    </TouchableOpacity>
  );
};
