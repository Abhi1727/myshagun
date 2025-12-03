import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const Login = ({ navigation }) => {
    const [authMode, setAuthMode] = useState('password'); // 'password', 'otp', or 'forgot'
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [resetOtpSent, setResetOtpSent] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const { email, password, otp, newPassword, confirmPassword } = formData;

    const onChange = (name, value) => setFormData({ ...formData, [name]: value });

    const handleEmailPasswordLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth', { email, password });
            await AsyncStorage.setItem('token', res.data.token);
            navigation.replace('Home');
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
            setOtpSent(true);
            Alert.alert('OTP Sent!', 'Check your email for the 6-digit code.');
        } catch (err) {
            Alert.alert(
                'Failed',
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
            await AsyncStorage.setItem('token', res.data.token);
            navigation.replace('Home');
        } catch (err) {
            Alert.alert(
                'Verification Failed',
                err.response?.data?.errors?.[0]?.msg || 'Invalid OTP'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setResetOtpSent(true);
            Alert.alert('OTP Sent!', 'Check your email for the password reset code.');
        } catch (err) {
            Alert.alert(
                'Failed',
                err.response?.data?.errors?.[0]?.msg || 'Failed to send reset code'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email || !otp || !newPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (otp.length !== 6) {
            Alert.alert('Error', 'OTP must be 6 digits');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            Alert.alert('Success!', 'Your password has been reset. Please login with your new password.');
            setAuthMode('password');
            setResetOtpSent(false);
            setFormData({ ...formData, otp: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            Alert.alert(
                'Reset Failed',
                err.response?.data?.errors?.[0]?.msg || 'Failed to reset password'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fef2f2" />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header with Logo */}
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#1f2937" />
                        </TouchableOpacity>
                        
                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.welcomeText}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Login to find your perfect match</Text>
                    </View>

                    {/* Auth Mode Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, authMode === 'password' && styles.activeTab]}
                            onPress={() => { setAuthMode('password'); setOtpSent(false); setResetOtpSent(false); }}
                        >
                            <Ionicons 
                                name="lock-closed" 
                                size={18} 
                                color={authMode === 'password' ? '#ec4899' : '#9ca3af'} 
                            />
                            <Text style={[styles.tabText, authMode === 'password' && styles.activeTabText]}>
                                Password
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, authMode === 'otp' && styles.activeTab]}
                            onPress={() => { setAuthMode('otp'); setOtpSent(false); setResetOtpSent(false); }}
                        >
                            <Ionicons 
                                name="mail" 
                                size={18} 
                                color={authMode === 'otp' ? '#ec4899' : '#9ca3af'} 
                            />
                            <Text style={[styles.tabText, authMode === 'otp' && styles.activeTabText]}>
                                OTP Login
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, authMode === 'forgot' && styles.activeTab]}
                            onPress={() => { setAuthMode('forgot'); setOtpSent(false); setResetOtpSent(false); }}
                        >
                            <Ionicons 
                                name="key" 
                                size={18} 
                                color={authMode === 'forgot' ? '#ec4899' : '#9ca3af'} 
                            />
                            <Text style={[styles.tabText, authMode === 'forgot' && styles.activeTabText]}>
                                Forgot
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Card */}
                    <View style={styles.formCard}>
                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={text => onChange('email', text)}
                                    value={email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {authMode === 'password' ? (
                            <>
                                {/* Password Input */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter your password"
                                            placeholderTextColor="#9ca3af"
                                            onChangeText={text => onChange('password', text)}
                                            value={password}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>

                                {/* Login Button */}
                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={handleEmailPasswordLogin}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#ec4899', '#db2777']}
                                        style={styles.buttonGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <>
                                                <Text style={styles.buttonText}>Sign In</Text>
                                                <Ionicons name="arrow-forward" size={20} color="white" />
                                            </>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {/* Send OTP Button */}
                                {!otpSent && (
                                    <TouchableOpacity
                                        style={styles.otpButton}
                                        onPress={handleSendOtp}
                                        disabled={loading}
                                        activeOpacity={0.8}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#ec4899" />
                                        ) : (
                                            <>
                                                <Ionicons name="send" size={18} color="#ec4899" />
                                                <Text style={styles.otpButtonText}>Send OTP</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                )}

                                {otpSent && (
                                    <>
                                        {/* OTP Input */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Enter OTP</Text>
                                            <View style={styles.inputContainer}>
                                                <Ionicons name="keypad-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter 6-digit OTP"
                                                    placeholderTextColor="#9ca3af"
                                                    onChangeText={text => onChange('otp', text)}
                                                    value={otp}
                                                    keyboardType="number-pad"
                                                    maxLength={6}
                                                />
                                            </View>
                                        </View>

                                        {/* Resend OTP */}
                                        <TouchableOpacity
                                            style={styles.resendButton}
                                            onPress={handleSendOtp}
                                            disabled={loading}
                                        >
                                            <Text style={styles.resendText}>Didn't receive? Resend OTP</Text>
                                        </TouchableOpacity>

                                        {/* Verify Button */}
                                        <TouchableOpacity
                                            style={styles.primaryButton}
                                            onPress={handleVerifyOtp}
                                            disabled={loading}
                                            activeOpacity={0.8}
                                        >
                                            <LinearGradient
                                                colors={['#ec4899', '#db2777']}
                                                style={styles.buttonGradient}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                            >
                                                {loading ? (
                                                    <ActivityIndicator color="white" />
                                                ) : (
                                                    <>
                                                        <Text style={styles.buttonText}>Verify & Login</Text>
                                                        <Ionicons name="checkmark-circle" size={20} color="white" />
                                                    </>
                                                )}
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </>
                        )}

                        {authMode === 'forgot' && (
                            <>
                                {!resetOtpSent ? (
                                    <>
                                        <Text style={styles.forgotDescription}>
                                            Enter your registered email address and we'll send you a code to reset your password.
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.primaryButton}
                                            onPress={handleForgotPassword}
                                            disabled={loading}
                                            activeOpacity={0.8}
                                        >
                                            <LinearGradient
                                                colors={['#ec4899', '#db2777']}
                                                style={styles.buttonGradient}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                            >
                                                {loading ? (
                                                    <ActivityIndicator color="white" />
                                                ) : (
                                                    <>
                                                        <Text style={styles.buttonText}>Send Reset Code</Text>
                                                        <Ionicons name="send" size={20} color="white" />
                                                    </>
                                                )}
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        {/* OTP Input */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Enter Reset Code</Text>
                                            <View style={styles.inputContainer}>
                                                <Ionicons name="keypad-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter 6-digit code"
                                                    placeholderTextColor="#9ca3af"
                                                    onChangeText={text => onChange('otp', text)}
                                                    value={otp}
                                                    keyboardType="number-pad"
                                                    maxLength={6}
                                                />
                                            </View>
                                        </View>

                                        {/* New Password Input */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>New Password</Text>
                                            <View style={styles.inputContainer}>
                                                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter new password"
                                                    placeholderTextColor="#9ca3af"
                                                    onChangeText={text => onChange('newPassword', text)}
                                                    value={newPassword}
                                                    secureTextEntry
                                                />
                                            </View>
                                        </View>

                                        {/* Confirm Password Input */}
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Confirm Password</Text>
                                            <View style={styles.inputContainer}>
                                                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Confirm new password"
                                                    placeholderTextColor="#9ca3af"
                                                    onChangeText={text => onChange('confirmPassword', text)}
                                                    value={confirmPassword}
                                                    secureTextEntry
                                                />
                                            </View>
                                        </View>

                                        {/* Resend Code */}
                                        <TouchableOpacity
                                            style={styles.resendButton}
                                            onPress={handleForgotPassword}
                                            disabled={loading}
                                        >
                                            <Text style={styles.resendText}>Didn't receive? Resend Code</Text>
                                        </TouchableOpacity>

                                        {/* Reset Button */}
                                        <TouchableOpacity
                                            style={styles.primaryButton}
                                            onPress={handleResetPassword}
                                            disabled={loading}
                                            activeOpacity={0.8}
                                        >
                                            <LinearGradient
                                                colors={['#ec4899', '#db2777']}
                                                style={styles.buttonGradient}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                            >
                                                {loading ? (
                                                    <ActivityIndicator color="white" />
                                                ) : (
                                                    <>
                                                        <Text style={styles.buttonText}>Reset Password</Text>
                                                        <Ionicons name="checkmark-circle" size={20} color="white" />
                                                    </>
                                                )}
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </>
                        )}
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Create Account */}
                    <TouchableOpacity
                        style={styles.createAccountButton}
                        onPress={() => navigation.navigate('Register')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.createAccountText}>New to MyShagun? </Text>
                        <Text style={styles.createAccountLink}>Create Free Account</Text>
                    </TouchableOpacity>

                    {/* Trust Badge */}
                    <View style={styles.trustBadge}>
                        <Ionicons name="shield-checkmark" size={16} color="#22c55e" />
                        <Text style={styles.trustText}>100% Safe & Secure Login</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef2f2',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 20,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        padding: 8,
        zIndex: 1,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#6b7280',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 6,
    },
    activeTab: {
        backgroundColor: '#fef2f2',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9ca3af',
    },
    activeTabText: {
        color: '#ec4899',
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    inputIcon: {
        paddingLeft: 16,
    },
    input: {
        flex: 1,
        height: 52,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    primaryButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
        shadowColor: '#ec4899',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    otpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef2f2',
        borderWidth: 2,
        borderColor: '#ec4899',
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
        marginTop: 8,
    },
    otpButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ec4899',
    },
    resendButton: {
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 8,
    },
    resendText: {
        fontSize: 14,
        color: '#6366f1',
        fontWeight: '500',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#9ca3af',
        fontWeight: '500',
    },
    createAccountButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    createAccountText: {
        fontSize: 15,
        color: '#6b7280',
    },
    createAccountLink: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ec4899',
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        gap: 6,
    },
    trustText: {
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '500',
    },
    forgotDescription: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
});

export default Login;
