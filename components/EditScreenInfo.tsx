import { Button, Text, View, StyleSheet } from 'react-native';

interface Card {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const EditScreenInfo = ({}: { path: string }) => {
  const title = 'Open up the code for this screen:';
  const description =
    'Change any of the text, save the file, and your app will automatically update.';

  return (
    <View>
      <View className="flex flex-col gap-5" style={styles.getStartedContainer}>
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Carte</Text>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.cardDescription}>{description}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Bouton 1" onPress={() => {}} color="#fff" />
            </View>
          </View>
        </View>
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Carte</Text>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.cardDescription}>{description}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Bouton 1" onPress={() => {}} color="#fff" />
            </View>
          </View>
        </View>
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Carte</Text>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.cardDescription}>{description}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Bouton 1" onPress={() => {}} color="#fff" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  cardContainer: {
    height: 200,
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 18,
    marginBottom: 16,
  },
  buttonContainer: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
