import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AddPatientModal from 'modals/AddPatientModal';
import Header from 'components/Header';

export default function HRScreen() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
        <Header />
      </View>

      {/* Titre */}
      <Text style={styles.title}>Espace RH</Text>

      {/* Boutons */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Ajouter un patient</Text>
      </TouchableOpacity>
      <AddPatientModal visible={modalVisible} onClose={() => setModalVisible(false)} />

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
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
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
