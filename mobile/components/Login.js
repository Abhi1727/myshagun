import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const Login = ({ navigation }) => {
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'otp'
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: ''
    });

    const { email, password, otp } = formData;

    const onChange = (name, value) => setFormData({ ...formData, [name]: value });

    const handleEmailPasswordLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth', { email, password });

            // Store token
            await AsyncStorage.setItem('token', res.data.token);

            Alert.alert(
                'Success!',
                'Logged in successfully.',
                [{ text: 'OK', onPress: () => navigation.replace('Home') }]
            );
        } catch (err) {
            Alert.alert(
                'Login Failed',
                err.response?.data?.errors?.[0]?.msg || 'Invalid credentials'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/send-otp', { email });
            Alert.alert(
                'OTP Sent!',
                'Check your email for the 6-digit code.',
                [{ text: 'OK' }]
            );
        } catch (err) {
            Alert.alert(
                'Failed to Send OTP',
                err.response?.data?.errors?.[0]?.msg || 'Failed to send OTP'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!email || !otp) {
            Alert.alert('Error', 'Please enter both email and OTP');
            return;
        }

        if (otp.length !== 6) {
            Alert.alert('Error', 'OTP must be 6 digits');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/verify-otp', { email, otp });

            // Store token
            await AsyncStorage.setItem('token', res.data.token);

            Alert.alert(
                'Success!',
                'Logged in successfully.',
                [{ text: 'OK', onPress: () => navigation.replace('Home') }]
            );
        } catch (err) {
            Alert.alert(
                'Verification Failed',
                err.response?.data?.errors?.[0]?.msg || 'Invalid OTP'
            );
        } finally {
            setLoading(false);
        }
    };

    const renderEmailPasswordLogin = () => (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                onChangeText={text => onChange('email', text)}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                onChangeText={text => onChange('password', text)}
                value={password}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 20 }} />
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleEmailPasswordLogin}
                    >
                        <Text style={styles.primaryButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => setAuthMode('otp')}
                    >
                        <Text style={styles.linkText}>Login with OTP instead</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );

    const renderOtpLogin = () => (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                onChangeText={text => onChange('email', text)}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSendOtp}
                disabled={loading}
            >
                <Text style={styles.secondaryButtonText}>Send OTP</Text>
            </TouchableOpacity>

            <Text style={styles.label}>OTP Code</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                onChangeText={text => onChange('otp', text)}
                value={otp}
                keyboardType="number-pad"
                maxLength={6}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 20 }} />
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleVerifyOtp}
                    >
                        <Text style={styles.primaryButtonText}>Verify & Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => setAuthMode('login')}
                    >
                        <Text style={styles.linkText}>Back to password login</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <Text style={styles.title}>MyShagun</Text>
                <Text style={styles.subtitle}>Find Your Perfect Match</Text>
            </View>

            {authMode === 'login' ? renderEmailPasswordLogin() : renderOtpLogin()}

            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.registerButtonText}>
                    Don't have an account? Create One
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef2f2',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#ec4899',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#6b7280',
    },
    formContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 12,
        color: '#374151',
    },
    input: {
        height: 50,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        fontSize: 16,
    },
    primaryButton: {
        backgroundColor: '#ec4899',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#6366f1',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    secondaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 16,
        padding: 8,
        alignItems: 'center',
    },
    linkText: {
        color: '#6366f1',
        fontSize: 14,
    },
    registerButton: {
        marginTop: 24,
        padding: 12,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#ec4899',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Login;
