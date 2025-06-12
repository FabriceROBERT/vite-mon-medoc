import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Alert, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from 'context/useAuth';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { logout } = useAuth();
  const navigation = useNavigation();

  const toggleMenu = () => {
    Animated.timing(spinAnim, {
      toValue: menuVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: menuVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setMenuVisible(!menuVisible);
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Home' as never);
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.header}>
      <Ionicons name="person-circle-outline" size={32} color="black" />
      <TouchableOpacity onPress={toggleMenu}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="settings-outline" size={28} color="gray" />
        </Animated.View>
      </TouchableOpacity>

      {menuVisible && (
        <Animated.View style={[styles.menu, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={{ fontSize: 16, color: 'black' }}>Déconnexion </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Suppression', 'Compte supprimé')}>
            <Text style={{ fontSize: 16, color: 'red' }}>Supprimer mon compte </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  menu: {
    zIndex: 1,
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: 150,
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
