import axios from 'axios';
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

export default function PatientListScreen() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchPatients = async () => {
    try {
      setError('');
      const response = await axios.get('http://172.20.10.11:3000/api/patients');
      setPatients(response.data);
    } catch (err) {
      setError('Impossible de récupérer la liste des patients');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatients();
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.name}>
        {item.prenom} {item.nom}
      </Text>
      <Text style={styles.info}>Âge : {item.age}</Text>
      <Text style={styles.info}>Statut : {item.statut}</Text>
      <Text style={styles.info}>Téléphone : {item.numero_de_telephone}</Text>
      <Text style={styles.info}>Mail : {item.mail}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="skyblue" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPatients}>
          <Text style={{ color: 'white' }}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 10, marginTop: 60 }}>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['skyblue']} />
        }
        ListEmptyComponent={<Text style={styles.empty}>Aucun patient trouvé.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f2f8fd',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  info: {
    color: '#555',
    fontSize: 15,
    marginTop: 2,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 17,
  },
  retryButton: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
