import React, { useState } from 'react';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';

export default function AddPatientModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctorsList = [
    { id: '1', name: 'Dr. Dupont' },
    { id: '2', name: 'Dr. Martin' },
    { id: '3', name: 'Dr. Leroy' },
  ];

  const isValid = name && firstName && age && selectedDoctor;

  const handleAddPatient = () => {
    if (!isValid) {
      alert('Merci de remplir tous les champs obligatoires');
      return;
    }
    console.log('Patient ajouté:', {
      name,
      firstName,
      age,
      weight,
      height,
      phone,
      email,
      notes,
      doctor: doctorsList.find((d) => d.id === selectedDoctor)?.name,
    });
    // Réinitialise les champs si besoin
    setName('');
    setFirstName('');
    setAge('');
    setWeight('');
    setHeight('');
    setPhone('');
    setEmail('');
    setNotes('');
    setSelectedDoctor(null);
    setOpen(false);
    onClose();
  };

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Ajouter un patient</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="gray" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nom*"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Prénom*"
              placeholderTextColor="gray"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Âge*"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />

            {/* Sélecteur de médecin */}
            <DropDownPicker
              listMode="MODAL"
              open={open}
              setOpen={setOpen}
              value={selectedDoctor}
              setValue={setSelectedDoctor}
              items={doctorsList.map((doctor) => ({
                label: doctor.name,
                value: doctor.id,
              }))}
              style={styles.input}
              placeholder="Sélectionnez un médecin*"
              containerStyle={{ width: '100%', marginBottom: 15 }}
              zIndex={1000}
            />

            <TextInput
              style={styles.input}
              placeholder="Poids (kg)"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Taille (cm)"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Numéro de téléphone"
              placeholderTextColor="gray"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="Email du patient"
              placeholderTextColor="gray"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={[styles.input, styles.notes]}
              placeholder="Notes (Antécédents, remarques…)"
              placeholderTextColor="gray"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <TouchableOpacity
              style={[styles.button, !isValid && { backgroundColor: '#a0aec0' }]}
              onPress={handleAddPatient}
              disabled={!isValid}>
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    marginTop: 60,
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: 'skyblue',
    borderRadius: 8,
    marginBottom: 15,
  },
  notes: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'skyblue',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
