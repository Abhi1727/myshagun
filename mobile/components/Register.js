import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const Register = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [formData, setFormData] = useState({
        interestedIn: '',
        interestedFor: '',
        firstName: '',
        lastName: '',
        dateOfBirth: null,
        religion: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
        city: '',
        state: '',
        livesWithFamily: '',
        maritalStatus: '',
        height: '',
        diet: '',
        smoking: '',
        drinking: '',
        highestQualification: '',
        profession: ''
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep = () => {
        switch (step) {
            case 1:
                if (!formData.interestedIn || !formData.interestedFor || !formData.firstName ||
                    !formData.lastName || !formData.dateOfBirth || !formData.religion ||
                    !formData.email || !formData.password || !formData.mobileNumber) {
                    Alert.alert('Error', 'Please fill in all required fields');
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    Alert.alert('Error', 'Passwords do not match');
                    return false;
                }
                if (formData.password.length < 6) {
                    Alert.alert('Error', 'Password must be at least 6 characters');
                    return false;
                }
                return true;
            case 2:
                if (!formData.city || !formData.state || !formData.livesWithFamily || !formData.maritalStatus) {
                    Alert.alert('Error', 'Please fill in all required fields');
                    return false;
                }
                return true;
            case 3:
                if (!formData.height || !formData.diet || !formData.smoking || !formData.drinking) {
                    Alert.alert('Error', 'Please fill in all required fields');
                    return false;
                }
                return true;
            case 4:
                if (!formData.highestQualification || !formData.profession) {
                    Alert.alert('Error', 'Please fill in all required fields');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep()) {
            if (step < 4) {
                setStep(step + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const submitData = {
                ...formData,
                dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : null
            };
            delete submitData.confirmPassword;

            const { data } = await api.post('/users', submitData);

            // Store token
            await AsyncStorage.setItem('token', data.token);

            Alert.alert(
                'Success!',
                'Your profile has been created successfully.',
                [{ text: 'OK', onPress: () => navigation.replace('Home') }]
            );
        } catch (error) {
            Alert.alert(
                'Registration Failed',
                error.response?.data?.errors?.[0]?.msg || 'Failed to create profile. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            updateField('dateOfBirth', selectedDate);
        }
    };

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Personal Information</Text>

            <Text style={styles.label}>Interested In *</Text>
            <Picker
                selectedValue={formData.interestedIn}
                onValueChange={(value) => updateField('interestedIn', value)}
                style={styles.picker}
            >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
            </Picker>

            <Text style={styles.label}>Interested For *</Text>
            <Picker
                selectedValue={formData.interestedFor}
                onValueChange={(value) => updateField('interestedFor', value)}
                style={styles.picker}
            >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Self" value="self" />
                <Picker.Item label="Son" value="son" />
                <Picker.Item label="Daughter" value="daughter" />
                <Picker.Item label="Brother" value="brother" />
                <Picker.Item label="Sister" value="sister" />
                <Picker.Item label="Friend" value="friend" />
                <Picker.Item label="Relative" value="relative" />
            </Picker>

            <Text style={styles.label}>First Name *</Text>
            <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => updateField('firstName', text)}
                placeholder="Enter first name"
            />

            <Text style={styles.label}>Last Name *</Text>
            <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => updateField('lastName', text)}
                placeholder="Enter last name"
            />

            <Text style={styles.label}>Date of Birth *</Text>
            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.dateButtonText}>
                    {formData.dateOfBirth ? formData.dateOfBirth.toDateString() : 'Select Date'}
                </Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={formData.dateOfBirth || new Date(2000, 0, 1)}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                />
            )}

            <Text style={styles.label}>Religion *</Text>
            <Picker
                selectedValue={formData.religion}
                onValueChange={(value) => updateField('religion', value)}
                style={styles.picker}
            >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Hindu" value="hindu" />
                <Picker.Item label="Muslim" value="muslim" />
                <Picker.Item label="Christian" value="christian" />
                <Picker.Item label="Sikh" value="sikh" />
                <Picker.Item label="Jain" value="jain" />
                <Picker.Item label="Buddhist" value="buddhist" />
                <Picker.Item label="Other" value="other" />
            </Picker>

            <Text style={styles.label}>Email *</Text>
            <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Password *</Text>
            <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
                placeholder="Enter password (min 6 characters)"
                secureTextEntry
            />

            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={(text) => updateField('confirmPassword', text)}
                placeholder="Confirm password"
                secureTextEntry
            />

            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
                style={styles.input}
                value={formData.mobileNumber}
                onChangeText={(text) => updateField('mobileNumber', text)}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
            />
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Location & Family</Text>

            <Text style={styles.label}>City *</Text>
            <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(text) => updateField('city', text)}
                placeholder="Enter city"
            />

            <Text style={styles.label}>State *</Text>
            <TextInput
                style={styles.input}
                value={formData.state}
                onChangeText={(text) => updateField('state', text)}
                placeholder="Enter state"
            />

            <Text style={styles.label}>Lives With Family *</Text>
            <Picker
                selectedValue={formData.livesWithFamily}
                onValueChange={(value) => updateField('livesWithFamily', value)}
                style={styles.picker}
            >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Yes" value="yes" />
                <Picker.Item label="No" value="no" />
            </Picker>

            <Text style={styles.label}>Marital Status *</Text>
            <Picker
                selectedValue={formData.maritalStatus}
                onValueChange={(value) => updateField('maritalStatus', value)}
                style={styles.picker}
            >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Never Married" value="never_married" />
                <Picker.Item label="Divorced" value="divorced" />
                <Picker.Item label="Widowed" value="widowed" />
                <Picker.Item label="Awaiting Divorce" value="awaiting_divorce" />
            </Picker>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Physical & Lifestyle</Text>

            <Text style={styles.label}>Height *</Text>
            <Picker
                selectedValue={formData.height}
                onValueChange={(value) => updateField('height', value)}
                style={styles.picker}
            >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Below 5'0&quot;" value="below_5_0" />
                <Picker.Item label="5'0&quot; - 5'5&quot;" value="5_0_to_5_5" />
                <Picker.Item label="5'6&quot; - 6'0&quot;" value="5_6_to_6_0" />
                <Picker.Item label="Above 6'0&quot;" value="above_6_0" />
            </Picker>

            <Text style={styles.label}>Diet *</Text>
            <Picker
                selectedValue={formData.diet}
                onValueChange={(value) => updateField('diet', value)}
                style={styles.picker}
            >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Vegetarian" value="vegetarian" />
                <Picker.Item label="Non-Vegetarian" value="non_vegetarian" />
                <Picker.Item label="Eggetarian" value="eggetarian" />
                <Picker.Item label="Vegan" value="vegan" />
            </Picker>

            <Text style={styles.label}>Smoking *</Text>
            <Picker
                selectedValue={formData.smoking}
                onValueChange={(value) => updateField('smoking', value)}
                style={styles.picker}
            >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="No" value="no" />
                <Picker.Item label="Occasionally" value="occasionally" />
                <Picker.Item label="Yes" value="yes" />
            </Picker>

            <Text style={styles.label}>Drinking *</Text>
            <Picker
                selectedValue={formData.drinking}
                onValueChange={(value) => updateField('drinking', value)}
                style={styles.picker}
            >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="No" value="no" />
                <Picker.Item label="Socially" value="socially" />
                <Picker.Item label="Yes" value="yes" />
            </Picker>
        </View>
    );

    const renderStep4 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Professional Information</Text>

            <Text style={styles.label}>Highest Qualification *</Text>
            <Picker
                selectedValue={formData.highestQualification}
                onValueChange={(value) => updateField('highestQualification', value)}
                style={styles.picker}
            >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="High School" value="high_school" />
                <Picker.Item label="Bachelor's Degree" value="bachelors" />
                <Picker.Item label="Master's Degree" value="masters" />
                <Picker.Item label="PhD" value="phd" />
                <Picker.Item label="Diploma" value="diploma" />
                <Picker.Item label="Other" value="other" />
            </Picker>

            <Text style={styles.label}>Profession *</Text>
            <TextInput
                style={styles.input}
                value={formData.profession}
                onChangeText={(text) => updateField('profession', text)}
                placeholder="Enter profession"
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Create Your Profile</Text>
                <Text style={styles.subtitle}>Step {step} of 4</Text>

                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
                </View>

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}

                <View style={styles.buttonContainer}>
                    {step > 1 && (
                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={prevStep}
                            disabled={loading}
                        >
                            <Text style={styles.secondaryButtonText}>Previous</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton, step === 1 && styles.fullWidthButton]}
                        onPress={nextStep}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.primaryButtonText}>
                                {step === 4 ? 'Submit' : 'Next'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginLinkText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef2f2',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#ec4899',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        color: '#6b7280',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        marginBottom: 24,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#ec4899',
    },
    stepContainer: {
        marginBottom: 24,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1f2937',
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
        paddingHorizontal: 16,
        backgroundColor: 'white',
        fontSize: 16,
    },
    picker: {
        height: 50,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    dateButton: {
        height: 50,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#374151',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullWidthButton: {
        flex: 1,
    },
    primaryButton: {
        backgroundColor: '#ec4899',
    },
    secondaryButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ec4899',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        color: '#ec4899',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 16,
        padding: 8,
        alignItems: 'center',
    },
    loginLinkText: {
        color: '#6366f1',
        fontSize: 14,
    },
});

export default Register;
