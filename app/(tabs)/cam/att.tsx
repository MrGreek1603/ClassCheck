import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Button from './../../../comp/Button';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { signInWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from './../../../configs/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CameraProps {
  facing: 'front' | 'back';
  flash: 'on' | 'off';
  animateShutter: boolean;
  enableTorch: boolean;
}

export default function App() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraProps, setCameraProps] = useState<CameraProps>({
    facing: 'front',
    flash: 'on',
    animateShutter: false,
    enableTorch: false,
  });
  const [image, setImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [apiUsername, setApiUsername] = useState<string | null>(null);
  const [apiSubject, setApiSubject] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (cameraPermission === null) {
      return;
    }
    if (!cameraPermission.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission, requestCameraPermission]);

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need camera permissions to continue.</Text>
        <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const picture = await cameraRef.current.takePictureAsync();
        setImage(picture.uri);
      } catch (err) {
        console.log('Error while taking the picture: ', err);
      }
    }
  };

  const sendPictureToAPI = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as unknown as Blob); // Correct casting for FormData

      try {
        const response = await fetch('http://172.20.10.2:5000/login', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const result = await response.json();

        if (result.username && result.subject) {
          setApiUsername(result.username);
          setApiSubject(result.subject);

          Alert.alert(
            'API Response',
            result.message || 'Image uploaded successfully!',
            [
              {
                text: 'Log In',
                onPress: () => handleSuccessfulLogin(result.username),
              },
            ]
          );
        } else {
          Alert.alert('API Response', result.message || 'Image uploaded successfully!');
        }
        setImage(null); // Clear the image after upload
      } catch (error) {
        Alert.alert('Error', (error as Error).message || 'Failed to upload image.');
      }
    } else {
      Alert.alert('No Image', 'Please take a picture first.');
    }
  };

  const handleSuccessfulLogin = async (username: string) => {
    try {
      await AsyncStorage.setItem('loggedInUser', username); // Save the username in AsyncStorage
      await AsyncStorage.setItem('apiSubject', apiSubject || ''); // Save the subject in AsyncStorage
      Alert.alert('Login Successful', `Welcome, ${username}`);
      router.push('/final/final'); // Redirect to the next page
    } catch (error) {
      Alert.alert('Error', 'Failed to save logged-in user data.');
    }
  };

  const handleSavePress = () => {
    setIsModalVisible(true);
  };

  const handlePasswordSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const credential = EmailAuthProvider.credential(user.email!, password);
        
        await reauthenticateWithCredential(user, credential);
        setIsModalVisible(false);
        router.push('/final/final'); // Redirect to the final page
      } else {
        Alert.alert('Error', 'No user is currently signed in.');
      }
    } catch (error) {
      Alert.alert('Reauthentication Failed', error.message || 'An error occurred during reauthentication.');
    }
  };
  
  return (
    <View style={styles.container}>
      {!image ? (
        <>
          <View style={styles.topControlsContainer}>
            <Button
              icon={cameraProps.flash === 'on' ? 'flash-on' : 'flash-off'}
              onPress={() => setCameraProps((current) => ({
                ...current,
                flash: current.flash === 'on' ? 'off' : 'on'
              }))} size={undefined} color={undefined} style={undefined} />
            <Button
              icon='animation'
              color={cameraProps.animateShutter ? 'white' : '#404040'}
              onPress={() => setCameraProps((current) => ({
                ...current,
                animateShutter: !current.animateShutter
              }))} size={undefined} style={undefined} />
            <Button
              icon={cameraProps.enableTorch ? 'flashlight-on' : 'flashlight-off'}
              onPress={() => setCameraProps((current) => ({
                ...current,
                enableTorch: !current.enableTorch
              }))} size={undefined} color={undefined} style={undefined} />
          </View>
          <CameraView 
            style={styles.camera} 
            zoom={0} // Since zoom is removed
            facing={cameraProps.facing}
            flash={cameraProps.flash}
            animateShutter={cameraProps.animateShutter}
            enableTorch={cameraProps.enableTorch}
            ref={cameraRef}
          />
          <View style={styles.bottomControlsContainer}>
            <Button 
              icon='camera'
              size={60}
              style={{ height: 60 }}
              onPress={takePicture} color={undefined} />
            <Button 
              icon='flip-camera-ios'
              onPress={() => setCameraProps((current) => ({
                ...current,
                facing: current.facing === 'front' ? 'back' : 'front'
              }))}
              size={40} color={undefined} style={undefined} />
          </View>
          <Button
            icon='save'
            onPress={handleSavePress}
            size={40}
            color={undefined}
            style={undefined}
          />
        </>
      ) : (
        <>
          <Image source={{ uri: image }} style={styles.camera} />
          <View style={styles.bottomControlsContainer}>
            <Button 
                icon='flip-camera-android'
                onPress={() => setImage(null)} size={undefined} color={undefined} style={undefined} />
            <Button 
                icon='check'
                onPress={sendPictureToAPI} size={undefined} color={undefined} style={undefined} />
          </View>
        </>
      )}
      <StatusBar style="auto" />

      {/* Modal for password input */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Enter Faculty Password</Text>
            <TextInput
              style={styles.passwordInput}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button
              icon='check'
              onPress={handlePasswordSubmit}
              size={undefined}
              color={undefined}
              style={undefined}
            />
            <Button
              icon='close'
              onPress={() => setIsModalVisible(false)}
              size={undefined}
              color={undefined}
              style={undefined}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
  },
  topControlsContainer: {
    height: 100,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    margin:
10,
borderRadius: 5,
},
buttonText: {
color: 'white',
fontSize: 16,
},
camera: {
flex: 1,
width: '100%',
},
bottomControlsContainer: {
height: 100,
backgroundColor: 'black',
flexDirection: 'row',
justifyContent: 'space-around',
alignItems: 'center',
},
modalContainer: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContent: {
width: '80%',
padding: 20,
backgroundColor: 'white',
borderRadius: 10,
alignItems: 'center',
},
passwordInput: {
width: '100%',
padding: 10,
borderWidth: 1,
borderColor: '#ccc',
marginVertical: 10,
},
});