import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    Platform,
    Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';

const EditProfile = ({ route, navigation }) => {
    const photoOnly = route.params?.photoOnly || false;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: null,
        mobileNumber: '',
        interestedFor: '',
        interestedIn: '',
        religion: '',
        city: '',
        state: '',
        livesWithFamily: '',
        maritalStatus: '',
        height: '',
        diet: '',
        smoking: '',
        drinking: '',
        highestQualification: '',
        profession: '',
        profilePhotoUrl: ''
    });

    useEffect(() => {
        fetchProfile();
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow access to your photos to upload a profile picture');
        }
    };

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profiles/me');
            setFormData({
                firstName: data.first_name || '',
                lastName: data.last_name || '',
                dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth) : null,
                mobileNumber: data.mobile_number || '',
                interestedFor: data.interested_for || '',
                interestedIn: data.interested_in || '',
                religion: data.religion || '',
                city: data.city || '',
                state: data.state || '',
                livesWithFamily: data.lives_with_family !== null ? (data.lives_with_family ? 'yes' : 'no') : '',
                maritalStatus: data.marital_status || '',
                height: data.height || '',
                diet: data.diet || '',
                smoking: data.smoking || '',
                drinking: data.drinking || '',
                highestQualification: data.highest_qualification || '',
                profession: data.profession || '',
                profilePhotoUrl: data.profile_photo_url || ''
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to load profile');
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            updateField('dateOfBirth', selectedDate);
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (!result.canceled) {
                uploadPhoto(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
            console.error('Image picker error:', error);
        }
    };

    const uploadPhoto = async (uri) => {
        setUploadingPhoto(true);
        try {
            const formData = new FormData();
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('photo', {
                uri: uri,
                name: filename,
                type: type,
            });

            const { data } = await api.post('/profiles/upload-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            updateField('profilePhotoUrl', data.photoUrl);
            Alert.alert('Success', 'Photo uploaded successfully!');

            if (photoOnly) {
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload photo');
            console.error('Photo upload error:', error);
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSave = async () => {
        if (!formData.firstName || !formData.lastName) {
            Alert.alert('Error', 'First name and last name are required');
            return;
        }

        setSaving(true);
        try {
            const submitData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : null,
                mobileNumber: formData.mobileNumber,
                interestedFor: formData.interestedFor,
                interestedIn: formData.interestedIn,
                religion: formData.religion,
                city: formData.city,
                state: formData.state,
                livesWithFamily: formData.livesWithFamily,
                maritalStatus: formData.maritalStatus,
                height: formData.height,
                diet: formData.diet,
                smoking: formData.smoking,
                drinking: formData.drinking,
                highestQualification: formData.highestQualification,
                profession: formData.profession,
            };

            await api.put('/profiles/me', submitData);

            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
            console.error('Profile update error:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ec4899" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Photo Upload Section */}
                <View style={styles.photoSection}>
                    {formData.profilePhotoUrl ? (
                        <Image
                            source={{ uri: formData.profilePhotoUrl }}
                            style={styles.profilePhoto}
                        />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Ionicons name="person" size={60} color="#ec4899" />
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.changePhotoButton}
                        onPress={pickImage}
                        disabled={uploadingPhoto}
                    >
                        {uploadingPhoto ? (
                            <ActivityIndicator color="#ec4899" />
                        ) : (
                            <>
                                <Ionicons name="camera" size={20} color="#ec4899" style={{ marginRight: 8 }} />
                                <Text style={styles.changePhotoText}>
                                    {formData.profilePhotoUrl ? 'Change Photo' : 'Upload Photo'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {!photoOnly && (
                    <>
                        {/* Basic Information */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Basic Information</Text>

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

                            <Text style={styles.label}>Date of Birth</Text>
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

                            <Text style={styles.label}>Mobile Number</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.mobileNumber}
                                onChangeText={(text) => updateField('mobileNumber', text)}
                                placeholder="Enter mobile number"
                                keyboardType="phone-pad"
                            />
                        </View>

                        {/* Looking For */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Looking For</Text>

                            <Text style={styles.label}>Interested In</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.interestedIn}
                                    onValueChange={(value) => updateField('interestedIn', value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select" value="" />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                </Picker>
                                <Ionicons name="chevron-down" size={20} color="#6b7280" style={styles.pickerIcon} />
                            </View>

                            <Text style={styles.label}>Interested For</Text>
                            <View style={styles.pickerContainer}>
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
                                <Ionicons name="chevron-down" size={20} color="#6b7280" style={styles.pickerIcon} />
                            </View>
                        </View>

                        {/* Location */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Location</Text>

                            <Text style={styles.label}>City</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.city}
                                onChangeText={(text) => updateField('city', text)}
                                placeholder="Enter city"
                            />

                            <Text style={styles.label}>State</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.state}
                                onChangeText={(text) => updateField('state', text)}
                                placeholder="Enter state"
                            />
                        </View>

                        {/* Personal Details */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Personal Details</Text>

                            <Text style={styles.label}>Religion</Text>
                            <View style={styles.pickerContainer}>
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
                                <Ionicons name="chevron-down" size={20} color="#6b7280" style={styles.pickerIcon} />
                            </View>

                            <Text style={styles.label}>Marital Status</Text>
                            <View style={styles.pickerContainer}>
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
                                <Ionicons name="chevron-down" size={20} color="#6b7280" style={styles.pickerIcon} />
                            </View>

                            <Text style={styles.label}>Height</Text>
                            <View style={styles.pickerContainer}>
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
                                <Ionicons name="chevron-down" size={20} color="#6b7280" style={styles.pickerIcon} />
                            </View>

                            <Text style={styles.label}>Lives With Family</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.livesWithFamily}
                                    onValueChange={(value) => updateField('livesWithFamily', value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select" value="" />
                                    <Picker.Item label="Yes" value="yes" />
                                    <Picker.Item label="No" value="no" />
                                </Picker>
                                <Ionicons name="chevron-down" size={20} color="#6b7280" style={styles.pickerIcon} />
                            </View>
                        </View>

                        {/* Lifestyle */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Lifestyle</Text>

                            <Text style={styles.label}>Diet</Text>
                            <View style={styles.pickerContainer}>
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
                                <Ionicons name="chevron-down" size={20} color="#6b7280" style={styles.pickerIcon} />
                            </View>

                            <Text style={styles.label}>Smoking</Text>
                            <View style={styles.pickerContainer}>
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
                                <Ionicons name="chevron-down" size={20} color="#6b7280" style={styles.pickerIcon} />
                            </View>

                            <Text style={styles.label}>Drinking</Text>
                            <View style={styles.pickerContainer}>
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
                                <Ionicons name="chevron-down" size={20} color="#6b7280" style={styles.pickerIcon} />
                            </View>
                        </View>

                        {/* Education & Career */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Education & Career</Text>

                            <Text style={styles.label}>Highest Qualification</Text>
                            <View style={styles.pickerContainer}>
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
                                <Ionicons name="chevron-down" size={20} color="#6b7280" style={styles.pickerIcon} />
                            </View>

                            <Text style={styles.label}>Profession</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.profession}
                                onChangeText={(text) => updateField('profession', text)}
                                placeholder="Enter profession"
                            />
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Save Button */}
            {!photoOnly && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
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
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
    },
    photoSection: {
        alignItems: 'center',
        marginVertical: 24,
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#ec4899',
    },
    photoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#ec4899',
    },
    changePhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ec4899',
    },
    changePhotoText: {
        color: '#ec4899',
        fontWeight: '600',
        fontSize: 14,
    },
    section: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
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
        backgroundColor: '#f9fafb',
        fontSize: 16,
    },
    pickerContainer: {
        position: 'relative',
        height: 50,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#f9fafb',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    pickerIcon: {
        position: 'absolute',
        right: 12,
        top: 15,
        pointerEvents: 'none',
    },
    dateButton: {
        height: 50,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f9fafb',
        justifyContent: 'center',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#374151',
    },
    footer: {
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    saveButton: {
        backgroundColor: '#ec4899',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#ec4899',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditProfile;
