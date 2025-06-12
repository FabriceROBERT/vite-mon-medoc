import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Icônes Expo
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import Header from 'components/Header';
import EditModal from 'modals/EditUserModal';
import AddModal from 'modals/AddUserModal';
import DeleteModal from 'modals/DeleteUserModal';

export default function AdminScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [users, setUsers] = useState<
    { id: number; username: string; type: string; created_at: Date }[]
  >([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    username: string;
    type: string;
    created_at: Date;
  } | null>(null);
  const [editUser, setEditUser] = useState<{ id: number; username: string; type: string } | null>(
    null
  );
  const [reload, setReload] = useState(false);

  const handleUserAdded = () => {
    console.log('Utilisateur ajouté, recharge les données...');
    setReload(!reload);
  };

  const handleUserUpdated = () => {
    console.log('Utilisateur mis à jour, recharge les données...');
    setReload(!reload);
  };

  const handleUserDeleted = () => {
    console.log('Utilisateur supprimé, recharge les données...');
    setReload((prev) => !prev);
  };

  useEffect(() => {
    axios
      .get('http://172.20.10.11:3000/api/users/')
      .then((response) => {
        setUsers(response.data);
        console.log('Utilisateurs chargés:', response.data);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        Alert.alert(
          'Erreur',
          'Impossible de charger les utilisateurs. Veuillez réessayer plus tard.'
        );
      });
  }, [reload]);

  return (
    <View style={styles.container}>
      <Header />
      {/* Titre */}
      <Text style={styles.title}>Espace Admin</Text>
      {/* Boutons */}
      <TouchableOpacity style={styles.button} onPress={() => setAddModalVisible(true)}>
        <Text style={styles.buttonText}>Ajouter un employé</Text>
      </TouchableOpacity>

      <ScrollView style={{ width: '100%' }}>
        {users.map((user) => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.cardTitle}>{user.username}</Text>
            <Text style={styles.cardSubtitle}>Rôle: {user.type}</Text>
            <Text style={styles.cardSubtitle}>
              Créé le :{' '}
              {new Date(user.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
              {' à '}
              {new Date(user.created_at).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.modifyButton}
                onPress={() => {
                  console.log('Ouverture du modal avec user:', user);
                  setEditUser(user);
                  setEditModalVisible(true);
                  console.log('editModalVisible:', editModalVisible);
                }}>
                <Text style={styles.buttonText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setSelectedUser(user);
                  setDeleteModalVisible(true);
                }}>
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Modal */}
      <AddModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onUserAdded={handleUserAdded}
      />
      {/* Edit Modal */}
      <EditModal
        visible={editModalVisible}
        user={editUser}
        onClose={() => setEditModalVisible(false)}
        onUserUpdated={handleUserUpdated}
      />
      {/* Delete Modal */}
      <DeleteModal
        visible={deleteModalVisible}
        user={selectedUser}
        onClose={() => setDeleteModalVisible(false)}
        onUserDeleted={handleUserDeleted}
      />
    </View>
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
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  cardActions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modifyButton: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
