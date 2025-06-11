import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Icônes Expo

export default function HRScreen() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fonction pour animer l'engrenage et afficher le menu
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

  // Animation de rotation
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Fonction pour confirmer la suppression du compte
  const confirmDeleteAccount = () => {
    Alert.alert(
      'Supprimer mon compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: () => console.log('Compte supprimé'), style: 'destructive' },
      ]
    );
  };

  return (
    <Pressable style={styles.container} onPress={() => menuVisible && toggleMenu()}>
      {/* Icônes en haut */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={32} color="black" />
        <TouchableOpacity onPress={toggleMenu}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name="settings-outline" size={28} color="gray" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Menu déroulant avec animation de fondu */}
      {menuVisible && (
        <Animated.View style={[styles.menu, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Déconnexion')}>
            <Text style={styles.menuText}>Déconnexion</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={confirmDeleteAccount}>
            <Text style={[styles.menuText, { color: 'red' }]}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Titre */}
      <Text style={styles.title}>Espace RH</Text>

      {/* Boutons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddPatientScreen' as never)}>
        <Text style={styles.buttonText}>Ajouter un patient</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PatientListScreen' as never)}>
        <Text style={styles.buttonText}>Voir la liste des patients</Text>
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  menu: {
    position: 'absolute',
    top: 100,
    zIndex: 1,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'skyblue',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
});
