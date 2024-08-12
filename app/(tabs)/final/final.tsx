import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserInfo {
  username: string;
  fileName: string;
}

export default function FinalPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const username = await AsyncStorage.getItem('loggedInUser');
        if (username) {
          const response = await fetch(`http://172.20.10.2:5000/get_user_info?username=${username}`);
          const result = await response.json();

          if (response.ok) {
            setUserInfo({ username: result.username, fileName: result.fileName });
          } else {
            setError(result.message || 'Failed to fetch user info');
          }
        } else {
          setUserInfo({ username: 'Guest', fileName: '' });
        }
      } catch (error) {
        console.error('Failed to retrieve user information:', error);
        setError('Failed to fetch user information.');
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.welcomeText}>Welcome, {userInfo?.username || 'Guest'}</Text>
          <Text style={styles.infoText}>Your File Name:</Text>
          <Text style={styles.fileName}>{userInfo?.fileName || 'No file available'}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  fileName: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});
