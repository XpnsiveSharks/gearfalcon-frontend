"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { http, axiosUtils } from '@/app/_shared/services/axiosClient';
import { useSkills, Skill } from '../Hooks/useSkills';

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

interface EditTechnicianModalProps {
    isOpen: boolean;
    onClose: () => void;
    technicianId: string | null;
    onUpdateSuccess: () => void;
}

export const EditTechnicianModal: React.FC<EditTechnicianModalProps> = ({ isOpen, onClose, technicianId, onUpdateSuccess }) => {
    const [formData, setFormData] = useState<any>({});
    const [initialData, setInitialData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { skills: availableSkills, loading: skillsLoading } = useSkills();
    const [selectedSkills, setSelectedSkills] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (isOpen && technicianId) {
            const fetchDetails = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await http.get(`/admin/technicians/${technicianId}`);
                    const techData = response.data.technician;
                    const initial = {
                        name: techData.user.name || '',
                        new_email: techData.user.email || '',
                        contact: techData.user.phone || '',
                        specialization: techData.specialization || '',
                        certification: techData.certification || '',
                        experience_years: techData.experience_years || 0,
                        skills: techData.skills.map((s: any) => s.id) || [],
                    };
                    setInitialData(initial);
                    setFormData({
                        ...initial,
                        new_password: '',
                        skills: techData.skills.map((s: any) => ({ skill_id: s.id, proficiency: 'intermediate' })) || [],
                    });
                    setSelectedSkills(new Set(initial.skills));
                } catch (err) {
                    setError('Failed to fetch technician details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [isOpen, technicianId]);

    const handleSkillChange = (skillId: number) => {
        const newSelectedSkills = new Set(selectedSkills);
        if (newSelectedSkills.has(skillId)) {
            newSelectedSkills.delete(skillId);
        } else {
            newSelectedSkills.add(skillId);
        }
        setSelectedSkills(newSelectedSkills);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!technicianId || !initialData) return;

        const payload: any = {};

        if (formData.name !== initialData.name) payload.name = formData.name;
        if (formData.new_email !== initialData.new_email) payload.new_email = formData.new_email;
        if (formData.contact !== initialData.contact) payload.contact = formData.contact;
        if (formData.specialization !== initialData.specialization) payload.specialization = formData.specialization;
        if (formData.certification !== initialData.certification) payload.certification = formData.certification;
        if (Number(formData.experience_years) !== initialData.experience_years) payload.experience_years = Number(formData.experience_years);
        if (formData.new_password) payload.new_password = formData.new_password;

        const initialSkillSet = new Set(initialData.skills);
        const selectedSkillArray = Array.from(selectedSkills);

        if (selectedSkillArray.length !== initialSkillSet.size || selectedSkillArray.some(id => !initialSkillSet.has(id))) {
            payload.skills = selectedSkillArray.map(id => ({ skill_id: id, proficiency: 'intermediate' }));
        }

        if (Object.keys(payload).length === 0) {
            alert('No changes detected.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await http.put(`/admin/technicians/${technicianId}`, payload);
            alert('Technician updated successfully!');
            onUpdateSuccess();
            onClose();
        } catch (err) {
            setError(axiosUtils.getErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit Technician`}>
            {loading ? (
                <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin" /></div>
            ) : error ? (
                <div className="text-center text-red-500 p-8">{error}</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
                    <input name="new_email" type="email" value={formData.new_email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
                    <input name="new_password" type="password" value={formData.new_password} onChange={handleChange} placeholder="New Password (optional)" className="w-full p-2 border rounded" />
                    <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" className="w-full p-2 border rounded" />
                    <input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" className="w-full p-2 border rounded" />
                    <input name="certification" value={formData.certification} onChange={handleChange} placeholder="Certification" className="w-full p-2 border rounded" />
                    <input name="experience_years" type="number" value={formData.experience_years} onChange={handleChange} placeholder="Years of Experience" className="w-full p-2 border rounded" />

                    <div>
                        <h4 className="font-semibold mb-2">Skills</h4>
                        {skillsLoading ? <Loader2 className="animate-spin" /> : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {availableSkills.map(skill => (
                                    <label key={skill.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            checked={selectedSkills.has(skill.id)}
                                            onChange={() => handleSkillChange(skill.id)}
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">{skill.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 flex items-center">
                            {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                            Confirm
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};