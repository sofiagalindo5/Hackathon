import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
  Line,
  G,
} from "react-native-svg";

export default function OwlLogo() {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-5deg", "5deg"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: floatAnim },
            { rotate: rotation },
          ],
        },
      ]}
    >
      <Svg width={80} height={80} viewBox="0 0 80 80">
        {/* Body */}
        <Ellipse cx="40" cy="50" rx="25" ry="28" fill="#8B5CF6" />
        <Circle cx="40" cy="35" r="22" fill="#A78BFA" />

        {/* Eyes */}
        <Circle cx="32" cy="32" r="9" fill="white" />
        <Circle cx="48" cy="32" r="9" fill="white" />
        <Circle cx="32" cy="32" r="4" fill="#1F2937" />
        <Circle cx="48" cy="32" r="4" fill="#1F2937" />

        {/* Glasses */}
        <Circle cx="32" cy="32" r="9" stroke="#4B5563" strokeWidth="2" fill="none" />
        <Circle cx="48" cy="32" r="9" stroke="#4B5563" strokeWidth="2" fill="none" />
        <Line x1="39" y1="32" x2="41" y2="32" stroke="#4B5563" strokeWidth="2" />

        {/* Beak */}
        <Path d="M40 38 L37 43 L43 43 Z" fill="#F59E0B" />

        {/* Wings */}
        <Ellipse cx="18" cy="50" rx="8" ry="12" fill="#7C3AED" />
        <Ellipse cx="62" cy="50" rx="8" ry="12" fill="#7C3AED" />

        {/* Belly */}
        <Ellipse cx="40" cy="55" rx="12" ry="15" fill="#C4B5FD" opacity={0.5} />

        {/* Pencil */}
        <G transform="translate(55 45) rotate(25)">
          <Rect x="0" y="0" width="20" height="5" rx="1" fill="#FCD34D" />
          <Path d="M20 0 L25 2.5 L20 5 Z" fill="#F59E0B" />
          <Rect x="-2" y="0" width="2" height="5" rx="1" fill="#EC4899" />
        </G>
      </Svg>

      {/* Sparkle */}
      <View style={styles.sparkle}>
        <Animated.Text style={styles.sparkleText}>✨</Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FDE047",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkleText: {
    fontSize: 10,
  },
});
