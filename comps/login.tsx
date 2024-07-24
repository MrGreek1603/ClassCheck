import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Login: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>
          ClassCheck
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('auth/sign-in')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 39,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily:'Outfit-Regular',
  },
});

export default Login;
