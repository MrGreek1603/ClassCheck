import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from './../../configs/FirebaseConfig'; // Adjust the path as needed
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Login: React.FC = () => {
  const [pressedButtonIndex, setPressedButtonIndex] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFacultyIDAndSubjects = async (email: string) => {
      if (!email) {
        console.error("Email is undefined");
        return;
      }

      console.log("Fetching data for email: ", email);

      try {
        const facultyRef = collection(db, 'FACULTY');
        const q = query(facultyRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const facultyData = querySnapshot.docs[0].data();
          const facultyId = querySnapshot.docs[0].id; // Assuming 'id' is the document ID

          console.log("Fetched facultyID: ", facultyId);

          // Now fetch subjects from ALLOTMENTS collection using facultyID
          const allotmentsRef = collection(db, 'ALLOTMENTS');
          const q2 = query(allotmentsRef, where('facultyID', '==', facultyId));
          const querySnapshot2 = await getDocs(q2);

          if (!querySnapshot2.empty) {
            const subjectsList = querySnapshot2.docs.map(doc => {
              const data = doc.data();
              console.log("Fetched subject: ", data);
              return data;
            });
            setSubjects(subjectsList);
          } else {
            console.log("No subjects found for facultyID: ", facultyId);
          }
        } else {
          console.log("No faculty found for email: ", email);
        }
      } catch (error) {
        console.error("Error fetching facultyID or subjects: ", error);
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || '');
        fetchFacultyIDAndSubjects(user.email || '');
      } else {
        router.push('/auth/sign-in'); // Redirect to sign-in if no user is logged in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribeAuth();
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

        {subjects.length > 0 ? (
          subjects.map((subject, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                pressedButtonIndex === index && styles.buttonPressed
              ]}
              onPress={() => router.push('/cam/att')}
              onPressIn={() => handlePressIn(index)}
              onPressOut={handlePressOut}
            >
              <Text style={styles.buttonText}>{subject.classID}</Text>
              <Text style={styles.buttonText}>{subject.facultyID}</Text>
              <Text style={styles.buttonText}>{subject.institute_id}</Text>
              <Text style={styles.buttonText}>{subject.subjectID}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noSubjects}>No subjects allocated</Text>
        )}
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
  noSubjects: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Login;
