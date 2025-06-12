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
    created_at: Date;
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
  // États pour chaque champ
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
  const [numeroDeTelephone, setNumeroDeTelephone] = useState('');
  const [mail, setMail] = useState('');
  type PickerItem = { label: string; value: string };
  const [medecinList, setMedecinList] = useState<PickerItem[]>([]);
  const [openMedecin, setOpenMedecin] = useState(false);
  const [medecinUsername, setMedecinUsername] = useState('');
  const [traitementEnCours, setTraitementEnCours] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: 'Oui', value: 'true' },
    { label: 'Non', value: 'false' },
  ]);

  const [open, setOpen] = useState(false);

  // Mise à jour des champs lorsque "patient" change
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
        .catch((error) => {
          console.error('Erreur lors de la récupération du médecin :', error);
        });
    }
  }, [patient]);

  useEffect(() => {
    // Si le modal est visible, on récupère la liste des médecins
    if (visible) {
      axios
        .get(`http://${BASE_URL}/api/users?role=medecin`)
        .then((response) => {
          const data = response.data.map((med) => ({
            label: `${med.username}`, // ou med.username
            value: med.id.toString(),
          }));
          setMedecinList(data);
        })
        .catch((err) => {
          setMedecinList([]);
        });
    }
  }, [visible]);

  // Désactive le bouton si certains champs essentiels sont vides
  const isDisabled = !nom.trim() || !prenom.trim() || !age.trim();

  const modify_patient = () => {
    if (!patient) return;
    axios
      .put(`http://${BASE_URL}/api/patients/${patient.id}`, {
        nom,
        prenom,
        age: age ? Number(age) : null,
        poids: poids ? Number(poids) : null,
        taille: taille ? Number(taille) : null,
        traitement_en_cours: traitementEnCours ? traitementEnCours : null,
        medicament: medicament ? medicament : null,
        medecin_id: medecinId ? Number(medecinId) : null,
        notes: notes ? notes : null,
        rdv: rdv ? rdv.toISOString() : null,
        statut: statut ? statut : null,
        numero_de_telephone: numeroDeTelephone ? Number(numeroDeTelephone) : null,
        mail: mail ? mail : null,
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

              {/* Traitement */}
              <Text style={styles.sectionTitle}>Traitement</Text>
              <DropDownPicker
                open={open}
                value={traitementEnCours}
                items={items}
                setOpen={setOpen}
                setItems={setItems}
                setValue={setTraitementEnCours}
                placeholder="Traitement en cours"
                style={styles.picker}
                dropDownContainerStyle={{ zIndex: 1001 }}
                zIndex={1001}
              />
              <TextInput
                style={styles.input}
                value={medicament}
                placeholder="Médicament"
                placeholderTextColor="grey"
                onChangeText={setMedicament}
              />

              {/* Médecin */}
              <Text style={styles.sectionTitle}>Médecin</Text>
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
                zIndex={1000}
              />

              {/* Suivi */}
              <Text style={styles.sectionTitle}>Suivi</Text>
              <TextInput
                style={styles.input}
                value={notes}
                placeholder="Notes"
                placeholderTextColor="grey"
                onChangeText={setNotes}
                multiline
              />
              <TextInput
                style={styles.input}
                value={statut}
                placeholder="Statut"
                placeholderTextColor="grey"
                onChangeText={setStatut}
              />

              {/* Contact */}
              <Text style={styles.sectionTitle}>Contact</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
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

              {/* Rendez-vous */}
              <Text style={styles.sectionTitle}>Rendez-vous</Text>
              <TextInput
                style={styles.input}
                value={rdv ? rdv.toISOString() : ''}
                placeholder="Date/heure (format ISO)"
                onChangeText={(text) => {
                  const parsedDate = Date.parse(text);
                  if (!isNaN(parsedDate)) setRdv(new Date(parsedDate));
                  else setRdv(null);
                }}
              />
            </ScrollView>

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
    fontSize: 14,
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
  picker: {
    width: '100%',
    minHeight: 44,
    borderColor: 'skyblue',
    marginBottom: 10,
    borderRadius: 8,
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
