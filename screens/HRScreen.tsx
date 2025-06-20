import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AddPatientModal from '../modals/AddPatientModal';
import Header from '../components/Header';
import { useAuth } from '../context/useAuth';

export default function HRScreen() {
  const { user, loading } = useAuth();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.user.type !== 'rh')) {
      navigation.navigate('LoginScreen' as never);
    }
  }, [user, loading]);

  return (
    <Pressable style={styles.container}>
      {/* Icônes en haut */}
      <Header />

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
