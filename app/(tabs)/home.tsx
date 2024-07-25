import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from './../../configs/FirebaseConfig'; // Adjust the path as needed
import { onAuthStateChanged } from 'firebase/auth';

const Login: React.FC = () => {
  const [pressedButtonIndex, setPressedButtonIndex] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || ''); // Adjust according to how you store the user's name
      } else {
        router.push('auth/sign-in'); // Redirect to sign-in if no user is logged in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const handlePressIn = (index: number) => {
    setPressedButtonIndex(index);
  };

  const handlePressOut = () => {
    setPressedButtonIndex(null);
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>WELCOME</Text>
        <Text style={styles.userName}>{userName ? userName.toUpperCase() : 'USER!!'}</Text>

        {[...Array(2)].map((_, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {[...Array(2)].map((_, colIndex) => {
              const buttonIndex = rowIndex * 2 + colIndex;
              return (
                <TouchableOpacity
                  key={buttonIndex}
                  style={[
                    styles.button,
                    pressedButtonIndex === buttonIndex && styles.buttonPressed
                  ]}
                  onPress={() => router.push('cam/att')}
                  onPressIn={() => handlePressIn(buttonIndex)}
                  onPressOut={handlePressOut}
                >
                  <Text style={styles.buttonText}>Sub Name</Text>
                  <Text style={styles.buttonText}>Year/Std</Text>
                  <Text style={styles.buttonText}>Dept</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#000000',
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    marginLeft: 30,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 50,
    color: '#fff',
    marginBottom: 10,
    marginTop: 60,
  },
  userName: {
    fontFamily: 'Outfit-Bold',
    fontSize: 50,
    color: '#fff',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 10,
    gap: 10,
  },
  button: {
    backgroundColor: '#7D7D7D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
  },
  buttonPressed: {
    backgroundColor: '#1e90ff', // Change to blue on press
  },
});

export default Login;
