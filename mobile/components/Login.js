import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const Login = ({ navigation }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const { email, password } = formData;

    const onChange = (name, value) => setFormData({ ...formData, [name]: value });

    const onSubmit = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth', { email, password });

            // Store token
            await AsyncStorage.setItem('token', res.data.token);

            // Navigate to Home
            navigation.replace('Home');
        } catch (err) {
            Alert.alert(
                'Login Failed',
                err.response?.data?.errors?.[0]?.msg || 'Invalid credentials'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MyShagun</Text>
            <Text style={styles.subtitle}>Find Your Perfect Match</Text>

            <TextInput
                style={styles.input}
                placeholder="Email Address"
                onChangeText={text => onChange('email', text)}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={text => onChange('password', text)}
                value={password}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 20 }} />
            ) : (
                <>
                    <Button title="Login" onPress={onSubmit} color="#ec4899" />
                    <View style={{ marginTop: 20 }}>
                        <Button
                            title="Don't have an account? Register"
                            onPress={() => navigation.navigate('Register')}
                            color="#6366f1"
                        />
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fef2f2'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#ec4899'
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        color: '#6b7280'
    },
    input: {
        height: 50,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingLeft: 16,
        backgroundColor: 'white'
    }
});

export default Login;
