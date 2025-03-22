import React, { useEffect, useRef } from "react";
import { Animated, Text, useColorScheme, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { getStatusColor } from "../app/helpers/habitHelper";

export const CircularProgress = ({
  progress,
  size = 70,
  habitStatus,
}: {
  progress: number;
  size: number;
  habitStatus: any;
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: clampedProgress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [clampedProgress, animatedValue]);

  const animatedStrokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? "#333" : "#e5e7eb"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStatusColor(habitStatus)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text
        style={{
          position: "absolute",
          fontSize: size / 4,
          fontWeight: "bold",
          color: isDark ? "#fff" : "#1f2937",
        }}
      >
        {Math.round(clampedProgress)}%
      </Text>
    </View>
  );
};