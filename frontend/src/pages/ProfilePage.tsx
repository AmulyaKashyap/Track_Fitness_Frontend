import React, { useState } from 'react';

// Define the shape of the user profile data
interface UserProfile {
    name: string;
    age: number;
    weight: number; // in lbs
    height: number; // in inches
    dietary: "Vegetarian" | "Non-vegetarian";
    history: string[];
    goals: string[];
    fitnessScore: number; // a score out of 100
}

// Define the shape of the form data for the modal, handling all possible fields
interface ModalFormData {
    name?: string;
    age?: number | string;
    weight?: number | string;
    height?: number | string;
    dietary?: "Vegetarian" | "Non-vegetarian";
    history?: string;
    goals?: string;
}

// Define the possible sections that can be edited
type EditingSection = 'profile' | 'history' | 'goals' | null;

// Props for the EditModal component
interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    section: EditingSection;
    formData: ModalFormData;
    onFormChange: React.Dispatch<React.SetStateAction<ModalFormData>>;
}

// Main application component
export default function ProfilePage() {
    // Use state to manage user data, typed with the UserProfile interface
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: "Amulya Kashyap",
        age: 25,
        weight: 185,
        height: 70,
        dietary: "Non-vegetarian",
        history: ["High blood pressure", "Diabetic"],
        goals: ["Weight loss", "Cardiovascular health"],
        fitnessScore: 75
    });

    // State to manage the modal's visibility and which section is being edited
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingSection, setEditingSection] = useState<EditingSection>(null);
    const [modalFormData, setModalFormData] = useState<ModalFormData>({});

    // Function to convert height from inches to feet and inches
    const inchesToFeetAndInches = (totalInches: number | null | undefined): string => {
        if (totalInches === null || totalInches === undefined || isNaN(totalInches)) return "N/A";
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        return `${feet}' ${inches}"`;
    };

    // Helper component to render a list of items (for history and goals)
    const TagList: React.FC<{ items: string[] }> = ({ items }) => (
        <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                    {item}
                </span>
            ))}
        </div>
    );

    // Open the modal with the correct data for the section
    const openEditModal = (section: EditingSection) => {
        setEditingSection(section);
        // Populate the modal form with existing data based on the section
        switch (section) {
            case 'profile':
                setModalFormData({
                    name: userProfile.name,
                    age: userProfile.age,
                    weight: userProfile.weight,
                    height: userProfile.height,
                    dietary: userProfile.dietary,
                });
                break;
            case 'history':
                setModalFormData({ history: userProfile.history.join(', ') });
                break;
            case 'goals':
                setModalFormData({ goals: userProfile.goals.join(', ') });
                break;
            default:
                setModalFormData({});
        }
        setIsModalOpen(true);
    };

    // Close the modal and reset states
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSection(null);
        setModalFormData({});
    };

    // Handle saving the edited data from the modal
    const handleSave = () => {
        let updatedProfile = { ...userProfile };
        if (editingSection === 'profile') {
            updatedProfile = {
                ...updatedProfile,
                // Convert string inputs to numbers with a fallback, ensuring empty inputs are handled correctly
                name: modalFormData.name ?? updatedProfile.name,
                age: parseInt(String(modalFormData.age)) || 0,
                weight: parseInt(String(modalFormData.weight)) || 0,
                height: parseInt(String(modalFormData.height)) || 0,
                dietary: modalFormData.dietary ?? updatedProfile.dietary,
            };
        } else if (editingSection === 'history' && modalFormData.history !== undefined) {
            updatedProfile.history = modalFormData.history.split(',').map(s => s.trim()).filter(s => s !== ''); // Filter out empty strings
        } else if (editingSection === 'goals' && modalFormData.goals !== undefined) {
            updatedProfile.goals = modalFormData.goals.split(',').map(s => s.trim()).filter(s => s !== ''); // Filter out empty strings
        }
        setUserProfile(updatedProfile);
        closeModal();
    };

    // A simple function to handle back navigation. In a real app,
    // this would likely use a routing library like React Router.
    const handleBackNavigation = () => {
        console.log("Navigating back...");
        // window.history.back(); // Uncomment in a real browser environment
    };

    // Generic modal component for editing sections
    const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, section, formData, onFormChange }) => {
        if (!isOpen) return null;

        let title = '';
        switch (section) {
            case 'profile': title = 'Edit Profile Information'; break;
            case 'history': title = 'Edit Health History & Concerns'; break;
            case 'goals': title = 'Edit Current Goals'; break;
            default: title = 'Edit Section';
        }

        // A single, robust function to handle form changes for all input types
        const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            onFormChange(prevData => ({
                ...prevData,
                [name]: value,
            }));
        };

        return (
            // The overlay with a backdrop blur effect
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
                <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden transition-transform duration-300 scale-95 translate-y-4 ease-out">
                    {/* Subtle glowing border effect */}
                    <div className="absolute inset-0 border-2 border-transparent rounded-2xl animate-pulse-glow"></div>

                    <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>

                    <div className="space-y-4">
                        {/* Conditional rendering of form fields based on the section */}
                        {section === 'profile' && (
                            <>
                                <label className="block">
                                    <span className="text-slate-400">Name</span>
                                    <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className="mt-1 block w-full bg-slate-700 text-white rounded-md border-b-2 border-slate-600 focus:border-sky-500 focus:outline-none transition duration-200 shadow-sm px-3 py-2" />
                                </label>
                                <label className="block">
                                    <span className="text-slate-400">Age</span>
                                    <input type="number" name="age" value={formData.age || ''} onChange={handleFormChange} className="mt-1 block w-full bg-slate-700 text-white rounded-md border-b-2 border-slate-600 focus:border-sky-500 focus:outline-none transition duration-200 shadow-sm px-3 py-2" />
                                </label>
                                <label className="block">
                                    <span className="text-slate-400">Weight (lbs)</span>
                                    <input type="number" name="weight" value={formData.weight || ''} onChange={handleFormChange} className="mt-1 block w-full bg-slate-700 text-white rounded-md border-b-2 border-slate-600 focus:border-sky-500 focus:outline-none transition duration-200 shadow-sm px-3 py-2" />
                                </label>
                                <label className="block">
                                    <span className="text-slate-400">Height (inches)</span>
                                    <input type="number" name="height" value={formData.height || ''} onChange={handleFormChange} className="mt-1 block w-full bg-slate-700 text-white rounded-md border-b-2 border-slate-600 focus:border-sky-500 focus:outline-none transition duration-200 shadow-sm px-3 py-2" />
                                </label>
                                <label className="block">
                                    <span className="text-slate-400">Dietary</span>
                                    <select name="dietary" value={formData.dietary || ''} onChange={handleFormChange} className="mt-1 block w-full bg-slate-700 text-white rounded-md border-b-2 border-slate-600 focus:border-sky-500 focus:outline-none transition duration-200 shadow-sm px-3 py-2">
                                        <option>Vegetarian</option>
                                        <option>Non-vegetarian</option>
                                    </select>
                                </label>
                            </>
                        )}
                        {section === 'history' && (
                            <label className="block">
                                <span className="text-slate-400">Health History (comma-separated)</span>
                                <textarea name="history" value={formData.history || ''} onChange={handleFormChange} className="mt-1 block w-full bg-slate-700 text-white rounded-md border-b-2 border-slate-600 focus:border-sky-500 focus:outline-none transition duration-200 shadow-sm h-24 px-3 py-2"></textarea>
                            </label>
                        )}
                        {section === 'goals' && (
                            <label className="block">
                                <span className="text-slate-400">Current Goals (comma-separated)</span>
                                <textarea name="goals" value={formData.goals || ''} onChange={handleFormChange} className="mt-1 block w-full bg-slate-700 text-white rounded-md border-b-2 border-slate-600 focus:border-sky-500 focus:outline-none transition duration-200 shadow-sm h-24 px-3 py-2"></textarea>
                            </label>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                        <button onClick={onClose} className="px-6 py-2 rounded-full text-white font-semibold bg-gray-600 hover:bg-gray-700 transition duration-200 shadow-lg">
                            Cancel
                        </button>
                        <button onClick={onSave} className="px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition duration-200 shadow-lg">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-gray-100 p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
            <style>
                {`
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 10px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.3); }
            50% { box-shadow: 0 0 15px rgba(56, 189, 248, 0.7), 0 0 30px rgba(56, 189, 248, 0.5); }
          }
          .animate-pulse-glow {
            animation: pulse-glow 2.5s infinite ease-in-out;
          }
        `}
            </style>
            <div className="w-full max-w-4xl p-6 sm:p-10">

                {/* Header with Back Button and Title */}
                <div className="relative mb-6 text-center">
                    <button onClick={handleBackNavigation} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-700 transition duration-200">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white">My Fitness Profile</h1>
                </div>

                {/* Subtitle */}
                <p className="text-slate-400 text-center text-lg mb-8">A snapshot of your health and goals.</p>

                {/* Main profile card layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Profile Picture and General Info */}
                    <div className="md:col-span-1 flex flex-col items-center bg-slate-700 rounded-2xl p-6 shadow-xl">
                        {/* Edit button for profile info */}
                        <button onClick={() => openEditModal('profile')} className="self-end -mt-4 -mr-4 p-2 bg-sky-600 rounded-full hover:bg-sky-700 transition duration-200">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>

                        {/* Placeholder for a profile picture */}
                        <div className="w-32 h-32 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 text-6xl font-bold mb-4 border-4 border-slate-500 -mt-2">
                            {userProfile.name.charAt(0)}
                        </div>
                        <h2 className="text-3xl font-bold text-white mt-4">{userProfile.name}</h2>
                        <div className="text-slate-400 text-sm mt-1 mb-6">Fitness Enthusiast</div>

                        <div className="space-y-4 w-full">
                            <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center"><svg className="w-5 h-5 mr-2 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Age</span>
                                <span className="font-bold text-white">{userProfile.age}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center"><svg className="w-5 h-5 mr-2 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Weight</span>
                                <span className="font-bold text-white">{userProfile.weight} lbs</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center"><svg className="w-5 h-5 mr-2 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21H12M4 7h.01M7 7h.01M10 7h.01M4 11h.01M7 11h.01M10 11h.01m12 0a12.022 12.022 0 01-12 0m12 0c-1.319-2.073-2.909-3.921-4.708-5.556-1.545-1.378-3.329-2.23-5.292-2.443M12 11a7 7 0 017-7m-4 12a1 1 0 11-2 0 1 1 0 012 0zm-7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg> Height</span>
                                <span className="font-bold text-white">{inchesToFeetAndInches(userProfile.height)}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center"><svg className="w-5 h-5 mr-2 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.484 9.349 5 8 5c-4.46 0-8 3.54-8 8s3.54 8 8 8 8-3.54 8-8-3.54-8-8-8zm-2 8l2 2 4-4"></path></svg> Diet</span>
                                <span className="font-bold text-white">{userProfile.dietary}</span>
                            </div>
                        </div>
                    </div>

                    {/* Goals, History, and Fitness Meter */}
                    <div className="md:col-span-2 flex flex-col space-y-8">

                        {/* Fitness Meter */}
                        <div className="bg-slate-700 rounded-2xl p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white">Fitness Score</h3>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="relative h-6 w-full rounded-full bg-slate-600 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${userProfile.fitnessScore}%`,
                                            background: `linear-gradient(to right, #6EE7B7, #3B82F6)`
                                        }}
                                    ></div>
                                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-sm font-bold">{userProfile.fitnessScore}%</span>
                                </div>
                                <div className="ml-4 text-2xl font-extrabold text-sky-400">
                                    {userProfile.fitnessScore}
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm mt-3">
                                Your current fitness level. Keep up the good work to see this score rise!
                            </p>
                        </div>

                        {/* Previous History & Concerns */}
                        <div className="bg-slate-700 rounded-2xl p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white">Health History & Concerns</h3>
                                <button onClick={() => openEditModal('history')} className="p-1 bg-sky-600 rounded-full hover:bg-sky-700 transition duration-200">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                            </div>
                            <TagList items={userProfile.history} />
                        </div>

                        {/* Goals */}
                        <div className="bg-slate-700 rounded-2xl p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white">Current Goals</h3>
                                <button onClick={() => openEditModal('goals')} className="p-1 bg-sky-600 rounded-full hover:bg-sky-700 transition duration-200">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                            </div>
                            <TagList items={userProfile.goals} />
                        </div>

                    </div>
                </div>
            </div>

            {/* The modal component is rendered here without the key prop to avoid re-render issues */}
            <EditModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSave}
                section={editingSection}
                formData={modalFormData}
                onFormChange={setModalFormData}
            />

        </div>
    );
}
