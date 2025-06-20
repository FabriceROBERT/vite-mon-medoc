import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/useAuth';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [showGif, setShowGif] = useState(true);

  // Animations du Home (hors GIF)
  const titleAnim = useRef(new Animated.Value(-50)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const { user, login, logout, loading } = useAuth();

  const goToHome = () => {
    if (!user?.user?.type) return navigation.navigate('LoginScreen' as never);
    switch (user.user.type) {
      case 'rh':
        navigation.navigate('HRScreen' as never);
        break;
      case 'medecin':
        navigation.navigate('DoctorScreen' as never);
        break;
      case 'admin':
        navigation.navigate('AdminScreen' as never);
        break;
    }
  };

  useEffect(() => {
    const gifDuration = 2800;
    const timer = setTimeout(() => {
      setShowGif(false);

      Animated.sequence([
        Animated.timing(titleAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.spring(logoAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(buttonAnim, {
          toValue: 1,
          friction: 4,
          tension: 30,
          useNativeDriver: true,
        }),
      ]).start();
    }, gifDuration);

    return () => clearTimeout(timer);
  }, []);

  if (showGif) {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/TitleGif.gif')} style={styles.gif} resizeMode="contain" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/viteMonMedocLogo.png')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [
              { scale: logoAnim },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: buttonAnim }] }}>
        {user ? (
          <TouchableOpacity style={styles.button} onPress={goToHome}>
            <Animated.Text style={[styles.buttonText, { opacity: fadeAnim }]}>
              Accueil
            </Animated.Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('LoginScreen' as never)}>
            <Animated.Text style={[styles.buttonText, { opacity: fadeAnim }]}>
              Se Connecter
            </Animated.Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  gif: {
    height: 280,
    width: 280,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 200,
    height: 200,
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
