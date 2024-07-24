import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Login: React.FC = () => {
    const [isPressed, setIsPressed] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>
          WELCOME
        </Text>
        <Text style={{ fontFamily: 'Outfit-Bold',
    fontSize: 50,
    color: '#fff',
    marginBottom: 20,
    marginLeft:10,}}>
          USER
        </Text>
        <TouchableOpacity style={[styles.button, isPressed && styles.buttonPressed]} onPress={() => router.push('auth/sign-in')} onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}>
          <Text style={styles.buttonText}>Sub Name</Text>
          <Text style={styles.buttonText}>Year/Std</Text>
          <Text style={styles.buttonText}>Dept</Text>
          
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, isPressed && styles.buttonPressed]} onPress={() => router.push('auth/sign-in')} onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}>
          <Text style={styles.buttonText}>Sub Name</Text>
          <Text style={styles.buttonText}>Year/Std</Text>
          <Text style={styles.buttonText}>Dept</Text>
          
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
   
    flex: 1,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 50,
    color: '#fff',
    marginBottom: 10,
    marginTop: 60,
    marginLeft:10,
  },
  button: {
    backgroundColor: '#7D7D7D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width:'40%',
    display:'flex',
    marginTop:50,
    marginLeft:10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily:'Outfit-Bold',
  },
  buttonPressed: {
    backgroundColor: '#0000FF', // Change to blue on press
  },
});

export default Login;
