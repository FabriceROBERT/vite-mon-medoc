import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert, Pressable, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Icônes Expo
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Import Picker

export default function AdminScreen() {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [users, setUsers] = useState<{ id: number; username: string; type: string }[]>([]);
    const [selectedUser, setSelectedUser] = useState<{ id: number; username: string; type: string } | null>(null);
    const [editUser, setEditUser] = useState<{ id: number; username: string; type: string } | null>(null);
    const [newUser, setNewUser] = useState<{ username: string; type: string }>({ username: '', type: '' });
    const [reload, setReload] = useState(false);
    const spinAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Charger les données des utilisateurs depuis l'API
        axios.get('http://10.0.2.2:3000/api/users/')
            .then(response => {
                setUsers(response.data);
                console.log('Utilisateurs chargés:', response.data);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des utilisateurs:', error);
                Alert.alert('Erreur', 'Impossible de charger les utilisateurs. Veuillez réessayer plus tard.');
            });
    }, [reload]);

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

    const modify_user = () => {
        axios.put(`http://10.0.2.2:3000/api/users/${editUser?.id}`, {
            username: editUser?.username,
            type: editUser?.type,
        })
        .then(response => {
            console.log('Utilisateur modifié:', response.data);
            setEditModalVisible(false);
            setEditUser(null); // Réinitialiser l'utilisateur modifié
            setReload(!reload); // Recharger les données
            Alert.alert('Succès', 'L’utilisateur a été modifié avec succès.');
        }
        )
        .catch(error => {
            console.error('Erreur lors de la modification de l’utilisateur:', error);
            Alert.alert('Erreur', 'Impossible de modifier l’utilisateur. Veuillez réessayer plus tard.');
        }
        );
    }

    const add_user = () => {
        axios.post('http://10.0.2.2:3000/api/users', {
            username: newUser.username,
            type: newUser.type,
            password: 'defaultPassword', // Mot de passe par défaut, à changer plus tard
        })
        .then(response => {
            console.log('Nouvel utilisateur ajouté:', response.data);
            setAddModalVisible(false);
            setNewUser({ username: '', type: '' }); // Réinitialiser les champs
            setReload(!reload); // Recharger les données
            Alert.alert('Succès', 'L’utilisateur a été ajouté avec succès.');
        }
        )
        .catch(error => {
            console.error('Erreur lors de l’ajout de l’utilisateur:', error);
            Alert.alert('Erreur', 'Impossible d’ajouter l’utilisateur. Veuillez réessayer plus tard.');
        }
        );
    }

    const delete_user = () => {
        axios.delete(`http://10.0.2.2:3000/api/users/${selectedUser?.id}`)
        .then(response => {
            console.log(`Utilisateur ${selectedUser?.username} supprimé:`, response.data);
            setModalVisible(false);
            setSelectedUser(null); // Réinitialiser l'utilisateur sélectionné
            setReload(!reload); // Recharger les données
            Alert.alert('Succès', `L’utilisateur ${selectedUser?.username} a été supprimé avec succès.`);
        }
        )
        .catch(error => {
            console.error(`Erreur lors de la suppression de l’utilisateur ${selectedUser?.username}:`, error);
            Alert.alert('Erreur', 'Impossible de supprimer l’utilisateur. Veuillez réessayer plus tard.');
        }
        );
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
            <Text style={styles.title}>Espace Admin</Text>

            {/* Boutons */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => setAddModalVisible(true)}
            >
                <Text style={styles.buttonText}>Ajouter un employé</Text>
            </TouchableOpacity>

            <ScrollView style={{ width: '100%' }}>
                {users.map((user) => (
                    <View key={user.id} style={styles.card}>
                        <Text style={styles.cardTitle}>{user.username}</Text>
                        <Text style={styles.cardSubtitle}>Type: {user.type}</Text>
                        <View style={styles.cardActions}>
                            <TouchableOpacity
                                style={styles.modifyButton}
                                onPress={() => {
                                    setEditUser(user);
                                    setEditModalVisible(true);
                                }}
                            >
                                <Text style={styles.buttonText}>Modifier</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => {
                                    setSelectedUser(user);
                                    setModalVisible(true);
                                }}
                            >
                                <Text style={styles.buttonText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmer la suppression</Text>
                        <Text style={styles.modalMessage}>
                            Êtes-vous sûr de vouloir supprimer {selectedUser?.username} ?
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={() => {
                                    console.log(`User ${selectedUser?.username} supprimé`);
                                    delete_user();  
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Edit Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modifier l'utilisateur</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nom d'utilisateur</Text>
                            <TextInput
                                style={styles.input}
                                value={editUser?.username}
                                onChangeText={(text) => setEditUser((prev) => prev && { ...prev, username: text })}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Type</Text>
                            <Picker
                                selectedValue={editUser?.type}
                                onValueChange={(value) => setEditUser((prev) => prev && { ...prev, type: value })}
                                style={styles.picker}
                            >
                                <Picker.Item label="RH" value="rh" />
                                <Picker.Item label="Médecin" value="medecin" />
                                <Picker.Item label="Admin" value="admin" />
                            </Picker>
                        </View>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={() => {
                                    console.log(`User ${editUser?.id} modifié:`, editUser);
                                    modify_user();
                                    setEditModalVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Modifier</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={addModalVisible}
                onRequestClose={() => setAddModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ajouter un employé</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nom d'utilisateur</Text>
                            <TextInput
                                style={styles.input}
                                value={newUser.username}
                                onChangeText={(text) => setNewUser((prev) => ({ ...prev, username: text }))}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Type</Text>
                            <Picker
                                selectedValue={newUser.type}
                                onValueChange={(value) => setNewUser((prev) => ({ ...prev, type: value }))}
                                style={styles.picker}
                            >
                                <Picker.Item label="RH" value="rh" />
                                <Picker.Item label="Médecin" value="medecin" />
                                <Picker.Item label="Admin" value="admin" />
                            </Picker>
                        </View>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setAddModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={() => {
                                    console.log('Nouvel employé ajouté:', newUser);
                                    add_user();
                                    setAddModalVisible(false);
                                    setNewUser({ username: '', type: '' }); // Reset fields
                                }}
                            >
                                <Text style={styles.buttonText}>Ajouter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        marginBottom: 5,
    },
    cardSubtitle: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modifyButton: {
        backgroundColor: 'lightgreen',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: 'salmon',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    confirmButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        width: '100%',
    },
    picker: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
});
