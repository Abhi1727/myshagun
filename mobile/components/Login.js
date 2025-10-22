import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const Login = ({ navigation }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = (name, value) => setFormData({ ...formData, [name]: value });

    const onSubmit = async () => {
        const user = {
            email,
            password
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth', user);
            console.log(res.data);
            // You would typically store the token and navigate to the home screen
        } catch (err) {
            console.error(err.response.data);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput style={styles.input} placeholder="Email Address" onChangeText={text => onChange('email', text)} value={email} />
            <TextInput style={styles.input} placeholder="Password" onChangeText={text => onChange('password', text)} value={password} secureTextEntry />
            <Button title="Login" onPress={onSubmit} />
            <Button title="Don't have an account? Register" onPress={() => navigation.navigate('Register')} />
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

export default Login;
