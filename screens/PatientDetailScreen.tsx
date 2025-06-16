import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
// @ts-ignore
import { BASE_URL } from '@env';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type PatientDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'PatientDetailScreen'>;
};

export default function PatientDetailScreen({ route }: PatientDetailScreenProps) {
  const { patientId } = route.params;

  interface Patient {
    id: number;
    nom: string;
    prenom: string;
    age: number;
    poids: number;
    taille: number;
    traitement_en_cours: string;
    medicament: string;
    medecin_id: string;
    notes: string;
    rdv: string;
    statut: string;
    numero_de_telephone: string;
    mail: string;
  }
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medecinNom, setMedecinNom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`http://${BASE_URL}/api/patients/${patientId}`)
      .then((response) => setPatient(response.data))
      .catch(() => setError('Impossible de récupérer les détails du patient'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (patient?.medecin_id) {
      axios
        .get(`http://${BASE_URL}/api/users/${patient.medecin_id}`)
        .then((response) => setMedecinNom(response.data.username))
        .catch(() => setMedecinNom('Médecin inconnu'));
    }
  }, [patient]);

  if (loading) return <ActivityIndicator size="large" color="skyblue" />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!patient) return <Text style={styles.error}>Patient introuvable.</Text>;

  const rdvDate = new Date(patient.rdv);
  const now = new Date();
  const label =
    rdvDate.getTime() > now.getTime() ? 'Date prévue le :' : 'Dernière consultation le :';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.patientName}>
            {patient.nom} {patient.prenom}
          </Text>
        </View>
        <View style={styles.profileIcon}>
          <Text style={styles.profilePlaceholder}>👤</Text>
        </View>
      </View>

      <Text style={styles.info}>
        Âge :{' '}
        {patient.age ? (
          <Text style={styles.data}>{patient.age} ans </Text>
        ) : (
          <Text style={styles.noData}>Non renseigné</Text>
        )}
      </Text>
      <Text style={styles.info}>
        Poids :{' '}
        {patient.poids ? (
          <Text style={styles.data}>{patient.poids} kg </Text>
        ) : (
          <Text style={styles.noData}>Non renseigné</Text>
        )}
      </Text>
      <Text style={styles.info}>
        Taille :{' '}
        {patient.taille ? (
          <Text style={styles.data}>{patient.taille} cm </Text>
        ) : (
          <Text style={styles.noData}>Non renseigné</Text>
        )}{' '}
      </Text>
      <Text style={styles.info}>
        Traitement en cours :{' '}
        {patient.traitement_en_cours ? (
          <Text style={styles.data}>{patient.traitement_en_cours == 'false' ? 'Non' : 'Oui'}</Text>
        ) : (
          <Text style={styles.noData}>Non renseigné</Text>
        )}
      </Text>
      <Text style={styles.info}>
        Médicament :{' '}
        {patient.medicament ? (
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.data}>
            {patient.medicament}
          </Text>
        ) : (
          <Text style={styles.noData}>Aucun médicament prescrit</Text>
        )}
      </Text>
      <Text style={styles.info}>
        Médecin référent : Docteur{' '}
        {medecinNom ? (
          <Text style={styles.data}>{medecinNom}</Text>
        ) : (
          <Text style={styles.noData}>Aucun médecin renseigné</Text>
        )}
      </Text>
      <Text style={styles.info}>Notes : </Text>
      {patient.notes ? (
        <Text style={styles.notes}>{patient.notes}</Text>
      ) : (
        <Text style={styles.noData}>Aucun commentaire</Text>
      )}
      {patient.rdv ? (
        <Text style={styles.info}>
          {label}{' '}
          <Text style={styles.data}>
            {new Date(patient.rdv).toLocaleString('fr-FR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </Text>
      ) : (
        <Text style={styles.noData}>Aucune date prévue</Text>
      )}
      <Text style={styles.info}>Statut :</Text>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {patient.statut ? patient.statut : <Text style={styles.label}>Non renseigné</Text>}
        </Text>
      </View>
      <Text style={styles.info}>
        Téléphone :{' '}
        {patient.numero_de_telephone ? (
          <Text style={styles.data}>{patient.numero_de_telephone}</Text>
        ) : (
          <Text style={styles.noData}>Non renseigné</Text>
        )}
      </Text>
      <Text style={styles.info}>
        Mail :{' '}
        {patient.mail ? (
          <Text style={styles.data}>{patient.mail}</Text>
        ) : (
          <Text style={styles.noData}>Non renseigné</Text>
        )}
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'skyblue',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 20,
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
  },

  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profilePlaceholder: {
    fontSize: 24,
  },
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  info: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 12,
    marginLeft: 2,
  },
  notes: {
    fontSize: 14,
    backgroundColor: '#f0f0f0',
    fontWeight: 'semibold',
    alignContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: 'black',
    marginTop: 5,
    paddingTop: 10,
    borderRadius: 10,
    marginLeft: 2,
    fontStyle: 'italic',
  },
  data: { fontSize: 16, marginBottom: 10, fontWeight: 600, color: '#666' },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  noData: { fontStyle: 'italic', color: 'gray', fontWeight: 'light' },
  labelContainer: {
    marginBottom: 4,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'salmon',
    borderRadius: 20,
    padding: 4,
    paddingHorizontal: 8,
  },
  label: {
    color: 'white',
    fontStyle: 'italic',
  },
});
