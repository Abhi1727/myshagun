import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const Register = ({ navigation }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;

    const onChange = (name, value) => setFormData({ ...formData, [name]: value });

    const onSubmit = async () => {
        if (password !== password2) {
            console.log('Passwords do not match');
            return;
        }
        const newUser = {
            name,
            email,
            password
        }

        try {
            const res = await axios.post('http://localhost:5000/api/users', newUser);
            console.log(res.data);
            // You would typically store the token and navigate to the home screen
        } catch (err) {
            console.error(err.response.data);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput style={styles.input} placeholder="Name" onChangeText={text => onChange('name', text)} value={name} />
            <TextInput style={styles.input} placeholder="Email Address" onChangeText={text => onChange('email', text)} value={email} />
            <TextInput style={styles.input} placeholder="Password" onChangeText={text => onChange('password', text)} value={password} secureTextEntry />
            <TextInput style={styles.input} placeholder="Confirm Password" onChangeText={text => onChange('password2', text)} value={password2} secureTextEntry />
            <Button title="Register" onPress={onSubmit} />
            <Button title="Already have an account? Login" onPress={() => navigation.navigate('Login')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8
    }
});

export default Register;
