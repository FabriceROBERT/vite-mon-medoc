import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const logoAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 40,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 30,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/viteMonMedocLogo.png')}
        style={[styles.logo, { transform: [{ scale: logoAnim }] }]}
      />
      <Text style={styles.title}>Vite Mon Medoc</Text>
      <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => navigation.navigate('LoginScreen' as never)}>
          <Text style={styles.buttonText}>Se Connecter</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
