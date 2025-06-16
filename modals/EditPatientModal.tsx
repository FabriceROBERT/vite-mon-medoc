import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
// @ts-ignore
import { BASE_URL } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/useAuth';

type EditPatientModalProps = {
  visible: boolean;
  patient: {
    id: number;
    nom: string;
    prenom: string;
    age: number;
    poids: number;
    taille: number;
    traitement_en_cours: string;
    medicament: string;
    medecin_id: number;
    notes: string;
    rdv: Date;
    statut: string;
    numero_de_telephone: number;
    mail: string;
    created_at?: Date;
  } | null;
  onClose: () => void;
  onPatientUpdated: () => void;
};

export default function EditPatientModal({
  visible,
  patient,
  onClose,
  onPatientUpdated,
}: EditPatientModalProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusItems, setStatusItems] = useState([
    { label: 'En cours de traitement', value: 'en_cours' },
    { label: 'Guéri', value: 'guéri' },
    { label: 'À surveiller', value: 'a_surveiller' },
    { label: 'Stable', value: 'stable' },
    { label: 'Critique', value: 'critique' },
    { label: 'Mort', value: 'mort' },
  ]);
  const [role, setRole] = useState('');
  const { user } = useAuth();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [medicament, setMedicament] = useState('');
  const [medecinId, setMedecinId] = useState('');
  const [notes, setNotes] = useState('');
  const [rdv, setRdv] = useState<Date | null>(null);
  const [statut, setStatut] = useState('');
  const [numeroDeTelephone, setNumeroDeTelephone] = useState<string>('');
  const [mail, setMail] = useState('');
  type PickerItem = { label: string; value: string };
  const [medecinList, setMedecinList] = useState<PickerItem[]>([]);
  const [openMedecin, setOpenMedecin] = useState(false);
  const [medecinUsername, setMedecinUsername] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const [open, setOpen] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setRdv(selectedDate);
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

  const [traitementEnCours, setTraitementEnCours] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: 'Oui', value: 'true' },
    { label: 'Non', value: 'false' },
  ]);

  useEffect(() => {
    const type = user?.user?.type;
    if (!type) return;

    if (type === 'medecin') {
      setRole('medecin');
    } else if (type === 'admin') {
      setRole('admin');
    } else {
      setRole('rh');
    }
  }, [user]);
  useEffect(() => {
    if (patient) {
      setNom(patient.nom);
      setPrenom(patient.prenom);
      setAge(patient.age ? patient.age.toString() : '');
      setPoids(patient.poids ? patient.poids.toString() : '');
      setTaille(patient.taille ? patient.taille.toString() : '');
      setTraitementEnCours(patient.traitement_en_cours || '');
      setMedicament(patient.medicament || '');
      setMedecinId(patient.medecin_id ? patient.medecin_id.toString() : '');
      setNotes(patient.notes || '');
      setRdv(patient.rdv ? new Date(patient.rdv) : null);
      setStatut(patient.statut || '');
      setNumeroDeTelephone(
        patient.numero_de_telephone ? patient.numero_de_telephone.toString() : ''
      );
      setMail(patient.mail || '');
    }
  }, [patient]);

  useEffect(() => {
    if (patient) {
      axios
        .get(`http://${BASE_URL}/api/users/${patient.medecin_id}`)
        .then((response) => {
          setMedecinId(response.data.id.toString());
          setMedecinUsername(response.data.username);
        })
        .catch((error) => {});
    }
  }, [patient]);

  useEffect(() => {
    if (visible) {
      axios
        .get(`http://${BASE_URL}/api/users`)
        .then((response) => {
          const medecins = response.data.filter((m: any) => m.type === 'medecin'); // Sélectionne tous les médecins

          const formattedMedecins = medecins.map((med) => ({
            label: med.username,
            value: med.id.toString(),
          }));

          setMedecinList(formattedMedecins);
        })
        .catch(() => {
          setMedecinList([]);
        });
    }
  }, [visible]);

  // Désactive le bouton si certains champs essentiels sont vides
  const isDisabled = !nom.trim() || !prenom.trim() || !age.trim();

  const modify_patient = () => {
    const updatedPatientData = {
      nom,
      prenom,
      age: age ? Number(age) : undefined,
      poids: poids ? Number(poids) : undefined,
      taille: taille ? Number(taille) : undefined,
      traitement_en_cours: traitementEnCours || undefined,
      medicament: medicament || undefined,
      medecin_id: medecinId ? Number(medecinId) : undefined,
      notes: notes || undefined,
      rdv: rdv ? rdv.toISOString() : undefined,
      statut: statut || undefined,
      numero_de_telephone: numeroDeTelephone ? numeroDeTelephone : undefined,
      mail: mail || undefined,
    };

    if (!patient) return;
    axios
      .put(`http://${BASE_URL}/api/patients/${patient.id}`, updatedPatientData)
      .catch((error) => {
        Alert.alert('Erreur', 'Échec de la mise à jour du patient. Veuillez réessayer.');
      })
      .then(() => {
        onPatientUpdated();
        onClose();
        Alert.alert('Succès', 'L’utilisateur a été modifié avec succès.');
      })
      .catch((e) => {
        Alert.alert(
          'Erreur',
          'Impossible de modifier l’utilisateur. Veuillez réessayer plus tard.'
        );
      });
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le patient</Text>

            <ScrollView
              style={{ width: '100%' }}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}>
              {/* Identité */}
              <Text style={styles.sectionTitle}>Identité</Text>
              <TextInput
                style={styles.input}
                value={nom}
                placeholder="Nom"
                placeholderTextColor="grey"
                onChangeText={setNom}
              />
              <TextInput
                style={styles.input}
                value={prenom}
                placeholder="Prénom"
                placeholderTextColor="grey"
                onChangeText={setPrenom}
              />
              <Text style={styles.sectionTitle}>Âge</Text>

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={age}
                placeholder="Âge"
                placeholderTextColor="grey"
                onChangeText={setAge}
              />

              {/* Caractéristiques */}
              <Text style={styles.sectionTitle}>Caractéristiques</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={poids}
                placeholder="Poids (kg)"
                placeholderTextColor="grey"
                onChangeText={setPoids}
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={taille}
                placeholder="Taille (cm)"
                placeholderTextColor="grey"
                onChangeText={setTaille}
              />

              {/* Médecin */}
              <Text style={styles.sectionTitle}>Pris en charge par le médecin</Text>
              <DropDownPicker
                open={openMedecin}
                value={medecinId}
                items={medecinList}
                setOpen={setOpenMedecin}
                setItems={setMedecinList}
                setValue={setMedecinId}
                placeholder="Sélectionner un médecin"
                style={styles.picker}
                containerStyle={{ marginBottom: 15 }}
                dropDownContainerStyle={{ zIndex: 1000 }}
              />

              {/* Traitement */}
              <Text style={styles.sectionTitle}>Traitement en cours</Text>
              <DropDownPicker
                open={open}
                value={traitementEnCours}
                items={items}
                setOpen={setOpen}
                setItems={setItems}
                disabled={role !== 'medecin'}
                setValue={setTraitementEnCours}
                placeholder="Traitement en cours"
                style={role === 'medecin' ? styles.picker : styles.pickerDisabled}
                dropDownContainerStyle={{ zIndex: 1001 }}
                zIndex={1001}
              />

              <Text style={styles.sectionTitle}>Médicament prescrit</Text>

              <TextInput
                style={role === 'medecin' ? styles.input : styles.inputDisabled}
                value={medicament}
                placeholder="Médicament"
                placeholderTextColor="grey"
                onChangeText={setMedicament}
                editable={role === 'medecin'}
              />

              {/* Suivi */}
              <Text style={styles.sectionTitle}>Suivi</Text>
              <TextInput
                style={role === 'medecin' ? styles.input : styles.inputDisabled}
                value={notes}
                placeholder="Notes"
                placeholderTextColor="grey"
                onChangeText={setNotes}
                multiline
                editable={role === 'medecin'}
              />

              <Text style={styles.sectionTitle}>Etat du patient</Text>

              <DropDownPicker
                open={statusOpen}
                value={statut}
                items={statusItems}
                setOpen={setStatusOpen}
                setItems={setStatusItems}
                setValue={setStatut}
                placeholder="Etat du patient"
                style={role === 'medecin' ? styles.picker : styles.pickerDisabled}
                disabled={role !== 'medecin'}
                containerStyle={{ marginBottom: 15 }}
                dropDownContainerStyle={{ zIndex: 1000 }}
              />
              {/* Contact */}
              <Text style={styles.sectionTitle}>Contact</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                value={numeroDeTelephone}
                placeholder="Téléphone"
                placeholderTextColor="grey"
                onChangeText={setNumeroDeTelephone}
              />
              <TextInput
                style={styles.input}
                value={mail}
                placeholder="Email"
                placeholderTextColor="grey"
                onChangeText={setMail}
                keyboardType="email-address"
              />

              <Text style={styles.sectionTitle}>Rendez-vous</Text>
              {/* Rendez-vous */}
              <TouchableOpacity onPress={showDatePicker} style={styles.input}>
                <Text style={{ color: rdv ? 'black' : 'gray', fontSize: 16 }}>
                  {' '}
                  {rdv ? formatCustomDate(rdv) : 'Aucun rendez-vous'}
                </Text>
              </TouchableOpacity>
              {/* Affichage du DateTimePicker */}
              {isDatePickerVisible && (
                <View style={{ alignItems: 'center' }}>
                  <DateTimePicker
                    value={rdv || new Date()}
                    mode="datetime"
                    display={Platform.OS === 'android' ? 'default' : 'spinner'}
                    onChange={onChangeDate}
                    locale="fr-FR"
                    textColor="black"
                    style={styles.datePicker}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setRdv(rdv);
                      hideDatePicker();
                    }}
                    style={[styles.button, { marginTop: 10 }]}>
                    <Text style={styles.buttonDateValidate}>Valider la date</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
            {role !== 'medecin' && (
              <>
                <View style={{ backgroundColor: '#f0f0f0', padding: 5, borderRadius: 5 }}>
                  <Text style={styles.sectionTitleInfo}>
                    Les champs grisés sont uniquement modifiables par le médecin responsable du
                    patient.
                  </Text>
                </View>
              </>
            )}

            {/* Boutons toujours visibles */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, isDisabled && styles.disabledButton]}
                onPress={modify_patient}
                disabled={isDisabled}>
                <Text style={styles.buttonText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonDateValidate: {
    color: 'white',
    backgroundColor: 'skyblue',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
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
  datePicker: {
    width: 200,
    height: 200,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    width: '92%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionTitle: {
    fontStyle: 'italic',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 12,
    marginLeft: 2,
  },
  sectionTitleInfo: {
    fontStyle: 'italic',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 12,
    marginLeft: 2,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'skyblue',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    backgroundColor: '#fafcff',
  },
  inputDisabled: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'skyblue',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    backgroundColor: 'lightgray',
    color: 'gray',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
    minHeight: 44,
    borderColor: 'skyblue',
    marginBottom: 10,
    borderRadius: 8,
  },
  pickerDisabled: {
    zIndex: 1,
    width: '100%',
    minHeight: 44,
    borderColor: 'skyblue',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: 'lightgray',
    color: 'gray',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#B1D0E0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    flex: 1,
    marginRight: 6,
  },
  confirmButton: {
    backgroundColor: '#A2E2A2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    flex: 1,
    marginLeft: 6,
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
});
