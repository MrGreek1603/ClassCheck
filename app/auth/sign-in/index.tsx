import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from './../../../configs/FirebaseConfig';

// Define types for state
interface SignInProps {}

const SignIn: React.FC<SignInProps> = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onSignIn = async () => {
        if (!email || !password) {
            ToastAndroid.show('Please enter Email-ID and Password', ToastAndroid.LONG);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Navigate to /mytrip on successful sign-in
            router.push('/home');
        } catch (error) {
            const authError = error as AuthError;
            // Error handling for different scenarios
            if (authError.code === 'auth/network-request-failed') {
                ToastAndroid.show('Network error, please try again later.', ToastAndroid.LONG);
            } else if (authError.code === 'auth/wrong-password') {
                ToastAndroid.show('Incorrect password, please try again.', ToastAndroid.LONG);
            } else if (authError.code === 'auth/user-not-found') {
                ToastAndroid.show('No user found with this email.', ToastAndroid.LONG);
            } else {
                ToastAndroid.show('An unexpected error occurred. Please try again.', ToastAndroid.LONG);
            }
            console.error(authError.code, authError.message);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Let's Log You In</Text>
            <Text style={styles.subtitle}>Welcome Back</Text>
            <Text style={styles.subtitle}>You've been missed</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder='Enter Email'
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    keyboardType='email-address'
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    secureTextEntry={true}
                    placeholder='Enter Password'
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={onSignIn}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button1} onPress={() => router.replace('auth/sign-up')}>
                <Text style={styles.buttonText1}>Create Account</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 25,
        backgroundColor: '#000000', // Matches Login component background
        paddingTop: 80,
        height: '100%',
    },
    title: {
        color: '#fff', // Matches Login component text color
        fontFamily: 'Outfit-Bold',
        marginTop: 60,
        fontSize: 30,
    },
    subtitle: {
        color: '#7D7D7D', // Consistent with previous color scheme
        fontFamily: 'Outfit-Regular',
        marginTop: 10,
        fontSize: 20,
    },
    inputContainer: {
        marginTop: 20,
    },
    label: {
        fontFamily: 'Outfit-Regular',
        color: '#fff', // Matches Login component label color
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#7D7D7D',
        fontFamily: 'Outfit-Regular',
        color: '#fff', // Matches Login component input text color
    },
    button: {
        padding: 15,
        backgroundColor: '#1e90ff', // Consistent with button color in Login component
        borderRadius: 15,
        marginTop: 30,
    },
    button1: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#7D7D7D',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff', // Consistent with button text color in Login component
        textAlign: 'center',
        fontFamily: 'Outfit-Regular',
        fontSize: 20,
    },
    buttonText1: {
        color: '#000',
        textAlign: 'center',
        fontFamily: 'Outfit-Regular',
        fontSize: 20,
    },
});

export default SignIn;
