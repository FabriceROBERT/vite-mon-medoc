import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// @ts-ignore
import { BASE_URL } from '@env';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AddPatientModal({ visible, onClose }: Props) {
  // Champs classiques
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [medicine, setMedicine] = useState('');

  // Initialiser appointment à null pour afficher un champ vide
  const [appointment, setAppointment] = useState<Date | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  // Date Picker
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const formatCustomDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    };

    const formatted = new Intl.DateTimeFormat('fr-FR', options).format(date);
    const withH = formatted.replace(/(\d{2}):(\d{2})/, '$1h$2');

    return `Le ${withH}`;
  };

  // Picker pour la sélection du médecin
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [doctorValue, setDoctorValue] = useState<string | null>(null);
  const [doctorItems, setDoctorItems] = useState<{ label: string; value: string }[]>([]);

  // Picker pour "Traitement en cours ?" (Oui / Non)
  const [processingOpen, setProcessingOpen] = useState(false);
  const [processingValue, setProcessingValue] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState([
    { label: 'Oui', value: 'true' },
    { label: 'Non', value: 'false' },
  ]);

  const formatAppointment = (isoString: string) => {
    const date = new Date(isoString);

    const optionsDate: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const formattedDate = date.toLocaleDateString('fr-FR', optionsDate);
    const formattedTime = date.toLocaleTimeString('fr-FR', optionsTime).replace(':', 'h');

    return `${formattedDate} à ${formattedTime}`;
  };

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusItems, setStatusItems] = useState([
    { label: 'En cours de traitement', value: 'en_cours' },
    { label: 'Guéri', value: 'guéri' },
    { label: 'À surveiller', value: 'a_surveiller' },
    { label: 'Stable', value: 'stable' },
    { label: 'Critique', value: 'critique' },
  ]);

  const isValid = firstName && lastName && age && doctorValue;

  useEffect(() => {
    if (!visible) return;
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`http://${BASE_URL}/api/users`);
        const medecins = data
          .filter((u: any) => u.type === 'medecin')
          .map((m: any) => ({ label: m.username, value: m.id }));
        setDoctorItems(medecins);
      } catch (e) {
        Alert.alert('Erreur', 'Impossible de récupérer les médecins.');
      }
    };
    fetchDoctors();
  }, [visible]);

  // Réinitialiser les champs à l'ouverture du modal
  useEffect(() => {
    if (visible) {
      setFirstName('');
      setLastName('');
      setAge('');
      setWeight('');
      setHeight('');
      setPhone('');
      setEmail('');
      setNote('');
      setMedicine('');
      setAppointment(null);
      setStatus('');
      setDoctorValue(null);
      setProcessingValue(null);
    }
  }, [visible]);

  const handleAdd = async () => {
    if (!isValid) {
      Alert.alert('Oups', 'Merci de remplir les champs obligatoires (*)');
      return;
    }
    try {
      await axios.post(`http://${BASE_URL}/api/patients`, {
        lastName,
        firstName,
        age: Number(age),
        weight: weight ? Number(weight.replace(',', '.')) : null,
        height: height ? Number(height.replace(',', '.')) : null,
        phone,
        email,
        processingInProgress: processingValue === 'true',
        medicine,
        appointment,
        status,
        note,
        doctorId: doctorValue,
      });
      Alert.alert('Succès', 'Patient ajouté.');
      onClose();
    } catch {
      Alert.alert('Erreur', 'Ajout impossible.');
    }
  };

  return (
    <Modal visible={visible} style={{ backgroundColor: 'white' }} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.backdrop}>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.card}>
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
              value={lastName}
              onChangeText={setLastName}
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
              keyboardType="numeric"
              placeholderTextColor="gray"
              value={age}
              onChangeText={setAge}
            />

            {/* Sélection du médecin */}
            <DropDownPicker
              listMode="MODAL"
              open={doctorOpen}
              setOpen={setDoctorOpen}
              value={doctorValue}
              setValue={setDoctorValue}
              items={doctorItems}
              setItems={setDoctorItems}
              placeholder="Sélectionnez un médecin*"
              style={styles.input}
              containerStyle={{ width: '100%', marginBottom: 15 }}
              zIndex={1000}
            />

            <TextInput
              style={styles.input}
              placeholder="Poids (kg)"
              keyboardType="numeric"
              placeholderTextColor="gray"
              value={weight}
              onChangeText={setWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Taille (cm)"
              keyboardType="numeric"
              placeholderTextColor="gray"
              value={height}
              onChangeText={setHeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              keyboardType="phone-pad"
              placeholderTextColor="gray"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="gray"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Notes…"
              placeholderTextColor="gray"
              multiline
              value={note}
              onChangeText={setNote}
            />

            {/* Sélection Oui/Non pour "Traitement en cours" */}
            <DropDownPicker
              open={processingOpen}
              value={processingValue}
              items={processingItems}
              setOpen={setProcessingOpen}
              setItems={setProcessingItems}
              setValue={setProcessingValue}
              placeholder="Traitement en cours ?"
              style={styles.picker}
              listMode="MODAL"
            />

            <TextInput
              style={styles.input}
              placeholder="Medicaments"
              placeholderTextColor="gray"
              value={medicine}
              onChangeText={setMedicine}
            />

            {/* Champ Date "Rendez-vous" */}
            <TouchableOpacity onPress={showDatePicker} style={styles.input}>
              <Text style={{ color: appointment ? 'black' : 'gray', fontSize: 16 }}>
                {appointment ? formatCustomDate(appointment) : 'Rendez-vous'}
              </Text>
            </TouchableOpacity>

            {/* Affichage du DateTimePicker */}
            {isDatePickerVisible && (
              <View style={{ alignItems: 'center' }}>
                <DateTimePicker
                  value={tempDate}
                  mode="datetime"
                  display={Platform.OS === 'android' ? 'default' : 'spinner'}
                  onChange={onChangeDate}
                  locale="fr-FR"
                  textColor="black"
                  style={styles.datePicker}
                />
                <TouchableOpacity
                  onPress={() => {
                    setAppointment(tempDate);
                    hideDatePicker();
                  }}
                  style={[styles.button, { marginTop: 10 }]}>
                  <Text style={styles.buttonDateValidate}>Valider la date</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ zIndex: 900 }}>
              <DropDownPicker
                open={statusOpen}
                value={status}
                items={statusItems}
                setOpen={setStatusOpen}
                setItems={setStatusItems}
                setValue={setStatus}
                placeholder="Sélectionnez un statut"
                style={styles.picker}
                listMode="MODAL" // Pour éviter les erreurs de VirtualizedList dans ScrollView
              />
            </View>

            <TouchableOpacity
              style={[styles.button, !isValid && styles.buttonDisabled]}
              disabled={!isValid}
              onPress={handleAdd}>
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  picker: {
    width: '100%',
    marginBottom: 20,
    borderColor: 'skyblue',
  },
  datePicker: {
    width: 200,
    height: 200,
  },
  card: {
    backgroundColor: 'white',
    marginTop: 60,
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: 'skyblue',
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'skyblue',
    padding: 5,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#a0aec0' },

  buttonDateValidate: {
    color: 'white',
    backgroundColor: 'skyblue',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: { color: 'white', fontWeight: 'bold', padding: 10 },
});
