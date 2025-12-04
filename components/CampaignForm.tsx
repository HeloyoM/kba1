// import React, { useState } from 'react';
// import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Switch, Button } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { Campaign, CampaignStatus, CampaignType } from '@/app/(tabs)/community';

// interface CampaignFormProps {
//     campaign: Campaign | null;
//     onSave: (campaign: Campaign) => void;
//     onCancel: () => void;
// }

// export function CampaignForm({ campaign, onSave, onCancel }: CampaignFormProps) {
//     const [formData, setFormData] = useState({
//         title: campaign?.title || '',
//         description: campaign?.description || '',
//         fullDescription: campaign?.fullDescription || '',
//         type: campaign?.type || ('donate' as CampaignType),
//         status: campaign?.status || ('active' as CampaignStatus),
//         goal: campaign?.goal?.toString() || '',
//         unit: campaign?.unit || '',
//         startDate: campaign?.startDate || '',
//         endDate: campaign?.endDate || '',
//         tags: campaign?.tags.join(', ') || '',
//         featured: campaign?.featured || false,
//         urgent: campaign?.urgent || false,
//         trending: campaign?.trending || false,
//     });

//     const [imagePreview, setImagePreview] = useState(campaign?.image || '');

//     const handleInputChange = (field: string, value: string | boolean) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };

//     const handleSubmit = () => {
//         const newCampaign: Campaign = {
//             id: campaign?.id || Date.now().toString(),
//             title: formData.title,
//             description: formData.description,
//             fullDescription: formData.fullDescription,
//             type: formData.type,
//             status: formData.status,
//             image: imagePreview || 'https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg',
//             organizer: campaign?.organizer || {
//                 name: 'Admin',
//                 avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
//                 role: 'Administrator'
//             },
//             goal: formData.goal ? parseFloat(formData.goal) : undefined,
//             current: campaign?.current || 0,
//             unit: formData.unit || undefined,
//             startDate: formData.startDate,
//             endDate: formData.endDate,
//             deadline: calculateDeadline(formData.endDate),
//             participants: campaign?.participants || [],
//             tags: formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
//             featured: formData.featured,
//             urgent: formData.urgent,
//             trending: formData.trending,
//             mediaGallery: campaign?.mediaGallery || [],
//             comments: campaign?.comments || []
//         };
//         onSave(newCampaign);
//     };

//     const calculateDeadline = (endDate: string) => {
//         if (!endDate) return '';
//         const end = new Date(endDate);
//         const now = new Date();
//         const diff = end.getTime() - now.getTime();
//         const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
//         if (days < 0) return 'Ended';
//         if (days === 0) return 'Ends today';
//         if (days === 1) return '1 day left';
//         return `${days} days left`;
//     };

//     const isEditing = !!campaign;

//     return (
//         <ScrollView contentContainerStyle={{ padding: 16 }}>
//             <View style={{ marginBottom: 24 }}>
//                 <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
//                     {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
//                 </Text>

//                 {/* Title */}
//                 <Text style={{ marginBottom: 4 }}>Campaign Title *</Text>
//                 <TextInput
//                     value={formData.title}
//                     onChangeText={text => handleInputChange('title', text)}
//                     placeholder="Enter campaign title"
//                     style={{
//                         borderWidth: 1,
//                         borderColor: '#ccc',
//                         borderRadius: 12,
//                         padding: 12,
//                         marginBottom: 16,
//                     }}
//                 />

//                 {/* Short Description */}
//                 <Text style={{ marginBottom: 4 }}>Short Description *</Text>
//                 <TextInput
//                     value={formData.description}
//                     onChangeText={text => handleInputChange('description', text)}
//                     placeholder="Brief description"
//                     multiline
//                     style={{
//                         borderWidth: 1,
//                         borderColor: '#ccc',
//                         borderRadius: 12,
//                         padding: 12,
//                         marginBottom: 16,
//                         minHeight: 60,
//                     }}
//                 />

//                 {/* Full Description */}
//                 <Text style={{ marginBottom: 4 }}>Full Description *</Text>
//                 <TextInput
//                     value={formData.fullDescription}
//                     onChangeText={text => handleInputChange('fullDescription', text)}
//                     placeholder="Detailed description"
//                     multiline
//                     style={{
//                         borderWidth: 1,
//                         borderColor: '#ccc',
//                         borderRadius: 12,
//                         padding: 12,
//                         marginBottom: 16,
//                         minHeight: 120,
//                     }}
//                 />

//                 {/* Campaign Type & Status */}
//                 <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
//                     <View style={{ flex: 1 }}>
//                         <Text>Type *</Text>
//                         {/* <Picker
//                             selectedValue={formData.type}
//                             onValueChange={value => handleInputChange('type', value)}
//                         >
//                             <Picker.Item label="Donate" value="donate" />
//                             <Picker.Item label="Volunteer" value="volunteer" />
//                             <Picker.Item label="Awareness" value="awareness" />
//                             <Picker.Item label="Petition" value="petition" />
//                             <Picker.Item label="Event" value="event" />
//                         </Picker> */}
//                     </View>
//                     <View style={{ flex: 1 }}>
//                         <Text>Status *</Text>
//                         {/* <Picker
//                             selectedValue={formData.status}
//                             onValueChange={value => handleInputChange('status', value)}
//                         >
//                             <Picker.Item label="Active" value="active" />
//                             <Picker.Item label="Upcoming" value="upcoming" />
//                             <Picker.Item label="Completed" value="completed" />
//                         </Picker> */}
//                     </View>
//                 </View>

//                 {/* Goal & Unit */}
//                 <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
//                     <TextInput
//                         value={formData.goal}
//                         onChangeText={text => handleInputChange('goal', text)}
//                         placeholder="Goal"
//                         keyboardType="numeric"
//                         style={{
//                             flex: 1,
//                             borderWidth: 1,
//                             borderColor: '#ccc',
//                             borderRadius: 12,
//                             padding: 12,
//                         }}
//                     />
//                     <TextInput
//                         value={formData.unit}
//                         onChangeText={text => handleInputChange('unit', text)}
//                         placeholder="Unit"
//                         style={{
//                             flex: 1,
//                             borderWidth: 1,
//                             borderColor: '#ccc',
//                             borderRadius: 12,
//                             padding: 12,
//                         }}
//                     />
//                 </View>

//                 {/* Image */}
//                 <Text style={{ marginBottom: 4 }}>Campaign Image</Text>
//                 {imagePreview ? (
//                     <View style={{ marginBottom: 16 }}>
//                         <Image
//                             source={{ uri: imagePreview }}
//                             style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 8 }}
//                         />
//                         <Button title="Remove Image" onPress={() => setImagePreview('')} />
//                     </View>
//                 ) : (
//                     <Button title="Upload Image (Not implemented)" onPress={() => { }} />
//                 )}

//                 {/* Tags */}
//                 <Text style={{ marginBottom: 4 }}>Tags (comma-separated)</Text>
//                 <TextInput
//                     value={formData.tags}
//                     onChangeText={text => handleInputChange('tags', text)}
//                     placeholder="e.g., health, community"
//                     style={{
//                         borderWidth: 1,
//                         borderColor: '#ccc',
//                         borderRadius: 12,
//                         padding: 12,
//                         marginBottom: 16,
//                     }}
//                 />

//                 {/* Featured / Urgent / Trending */}
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                         <Text>Featured</Text>
//                         <Switch
//                             value={formData.featured}
//                             onValueChange={value => handleInputChange('featured', value)}
//                         />
//                     </View>
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                         <Text>Urgent</Text>
//                         <Switch
//                             value={formData.urgent}
//                             onValueChange={value => handleInputChange('urgent', value)}
//                         />
//                     </View>
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                         <Text>Trending</Text>
//                         <Switch
//                             value={formData.trending}
//                             onValueChange={value => handleInputChange('trending', value)}
//                         />
//                     </View>
//                 </View>

//                 {/* Action Buttons */}
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
//                     <Button title="Cancel" onPress={onCancel} />
//                     <Button title={isEditing ? 'Update Campaign' : 'Create Campaign'} onPress={handleSubmit} />
//                 </View>
//             </View>
//         </ScrollView>
//     );
// }

// // Note: You need to import Picker from '@react-native-picker/picker'
// // import { Picker } from '@react-native-picker/picker'; import { Campaign, CampaignStatus, CampaignType } from '@/app/(tabs)/community';

