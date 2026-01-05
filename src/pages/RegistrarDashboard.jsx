import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { UserPlus, Key, Eye, EyeOff } from 'lucide-react';

const RegistrarDashboard = () => {
    const [activeTab, setActiveTab] = useState('create');

    // Create Student Form
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', department: 'CSE',
        currentYear: 1, batch: '2024-2028', quota: 'government', entry: 'regular', email: '',
        transportOpted: false, transportRoute: '', hostelOpted: false, placementOpted: false,
        assignedCollegeFee: 0, assignedTransportFee: 0, assignedHostelFee: 0, assignedPlacementFee: 0
    });

    // Fee Waiver State for Government Quota
    const [isFeeWaiver, setIsFeeWaiver] = useState(true);

    // Removed regulations and batches arrays as they are no longer needed

    // Reset Password Form
    const [resetData, setResetData] = useState({ username: '', newPassword: '' });

    const [searchUSN, setSearchUSN] = useState('');
    const [searchedStudent, setSearchedStudent] = useState(null);

    const handleSearchStudent = async () => {
        if (!searchUSN) return toast.error('Please enter a USN');
        try {
            const { data } = await api.get(`/registrar/students/${searchUSN}`);
            setSearchedStudent(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Student not found');
            setSearchedStudent(null);
        }
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/registrar/students', formData);
            toast.success('Student Created Successfully');
            // Reset crucial fields
            setFormData({ ...formData, username: '', name: '', email: '', password: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create student');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await api.post('/registrar/reset-password', resetData);
            toast.success('Password Reset Successfully');
            setResetData({ username: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        }
    };

    const toggleTransport = (checked) => {
        setFormData(prev => ({
            ...prev,
            transportOpted: checked,
            hostelOpted: checked ? false : prev.hostelOpted // Mutual Exclusive
        }));
    };

    const toggleHostel = (checked) => {
        setFormData(prev => ({
            ...prev,
            hostelOpted: checked,
            transportOpted: checked ? false : prev.transportOpted // Mutual Exclusive
        }));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Registrar Dashboard</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'create' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Student
                </button>
                <button
                    onClick={() => setActiveTab('reset')}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'reset' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Key className="w-5 h-5 mr-2" />
                    Reset Password
                </button>
                <button
                    onClick={() => setActiveTab('view')}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'view' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Eye className="w-5 h-5 mr-2" />
                    View Student
                </button>
            </div>

            {/* TAB: CREATE STUDENT */}
            {activeTab === 'create' && (
                <div className="bg-white p-8 rounded-xl shadow-md max-w-5xl">
                    <h2 className="text-xl font-bold mb-6">Register New Student</h2>
                    <form onSubmit={handleCreateStudent} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">USN / Roll No</label>
                                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                    <option>CSE</option>
                                    <option>CSE-CAD</option>
                                    <option>CSE-AIML</option>
                                    <option>CSE-CSM</option>
                                    <option>ECE</option>
                                    <option>EEE</option>
                                    <option>ME</option>
                                    <option>CV</option>
                                </select>
                            </div>
                            <div>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.quota}
                                    onChange={e => {
                                        const newQuota = e.target.value;
                                        setFormData({ ...formData, quota: newQuota });
                                        // Reset waiver to true if switching to gov, else irrelevant
                                        if (newQuota === 'government') setIsFeeWaiver(true);
                                    }}>
                                    <option value="government">Government</option>
                                    <option value="management">Management</option>
                                    <option value="nri">Foreign/NRI (Other Country)</option>
                                </select>
                            </div>
                        </div>



                        {/* Fee Logic for Government Quota */}
                        {formData.quota === 'government' && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                                <div className="flex items-center mb-2">
                                    <input type="checkbox" id="feeWaiver" className="h-4 w-4 text-green-600 rounded"
                                        checked={isFeeWaiver} onChange={e => {
                                            setIsFeeWaiver(e.target.checked);
                                            if (e.target.checked) {
                                                setFormData(prev => ({ ...prev, assignedCollegeFee: 0 }));
                                            }
                                        }} />
                                    <label htmlFor="feeWaiver" className="ml-2 block text-sm font-bold text-gray-900">
                                        Eligible for Government Free Seat / Scholarship?
                                    </label>
                                </div>
                                <p className="text-xs text-gray-600">
                                    If checked, College Fee will be 0. If unchecked, provide the fee amount.
                                </p>
                            </div>
                        )}

                        {/* College Fee Input - Visible for Management/NRI OR (Government AND NOT Waiver) */}
                        {(formData.quota === 'management' || formData.quota === 'nri' || (formData.quota === 'government' && !isFeeWaiver)) && (
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <label className="block text-sm font-bold text-yellow-800">Assign College Fee (₹)</label>
                                <input type="number" required min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.assignedCollegeFee} onChange={e => setFormData({ ...formData, assignedCollegeFee: e.target.value })} />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Transport Option */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center mb-2">
                                    <input type="checkbox" id="transport" className="h-4 w-4 text-indigo-600 rounded"
                                        checked={formData.transportOpted} onChange={e => toggleTransport(e.target.checked)} />
                                    <label htmlFor="transport" className="ml-2 block text-sm font-bold text-gray-900">Opt for Transport</label>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">(Mutually Exclusive with Hostel)</p>

                                {formData.transportOpted && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Transport Fee (₹)</label>
                                            <input type="number" required min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                                                value={formData.assignedTransportFee} onChange={e => setFormData({ ...formData, assignedTransportFee: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Route / Location</label>
                                            <input type="text" required placeholder="e.g. Majestic, Malleshwaram" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                                                value={formData.transportRoute} onChange={e => setFormData({ ...formData, transportRoute: e.target.value })} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Hostel Option */}
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                <div className="flex items-center mb-2">
                                    <input type="checkbox" id="hostel" className="h-4 w-4 text-orange-600 rounded"
                                        checked={formData.hostelOpted} onChange={e => toggleHostel(e.target.checked)} />
                                    <label htmlFor="hostel" className="ml-2 block text-sm font-bold text-gray-900">Opt for Hostel</label>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">(Mutually Exclusive with Transport)</p>

                                {formData.hostelOpted && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Hostel Fee (₹)</label>
                                        <input type="number" required min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                                            value={formData.assignedHostelFee} onChange={e => setFormData({ ...formData, assignedHostelFee: e.target.value })} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Placement Fee Option */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center mb-2">
                                <input type="checkbox" id="placement" className="h-4 w-4 text-blue-600 rounded"
                                    checked={formData.placementOpted} onChange={e => setFormData({ ...formData, placementOpted: e.target.checked })} />
                                <label htmlFor="placement" className="ml-2 block text-sm font-bold text-gray-900">Opt for Placement Training</label>
                            </div>

                            {formData.placementOpted && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Placement Training Fee (₹)</label>
                                    <input type="number" required min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm"
                                        value={formData.assignedPlacementFee} onChange={e => setFormData({ ...formData, assignedPlacementFee: e.target.value })} />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Year</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.currentYear} onChange={e => setFormData({ ...formData, currentYear: parseInt(e.target.value) })}>
                                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Batch</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.batch} onChange={e => setFormData({ ...formData, batch: e.target.value })}>
                                    <option>2021-2025</option>
                                    <option>2022-2026</option>
                                    <option>2023-2027</option>
                                    <option>2024-2028</option>
                                    <option>2025-2029</option>
                                    <option>2026-2030</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Entry Type</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                value={formData.entry}
                                onChange={e => {
                                    const newEntry = e.target.value;
                                    setFormData({
                                        ...formData,
                                        entry: newEntry,
                                        currentYear: newEntry === 'lateral' ? 2 : 1
                                    });
                                }}>
                                <option value="regular">Regular</option>
                                <option value="lateral">Lateral</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Default Password</label>
                            <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </div>

                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            Create Student Account
                        </button>
                    </form>
                </div>
            )}

            {/* TAB: RESET PASSWORD */}
            {activeTab === 'reset' && (
                <div className="bg-white p-8 rounded-xl shadow-md max-w-xl">
                    <h2 className="text-xl font-bold mb-6">Reset User Password</h2>
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Student USN / Username</label>
                            <input type="text" required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                placeholder="Enter USN"
                                value={resetData.username}
                                onChange={e => setResetData({ ...resetData, username: e.target.value })} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input type="text" required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                placeholder="Enter New Password"
                                value={resetData.newPassword}
                                onChange={e => setResetData({ ...resetData, newPassword: e.target.value })} />
                        </div>

                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                            Reset Password
                        </button>
                    </form>
                </div>
            )}

            {/* TAB: VIEW STUDENT */}
            {activeTab === 'view' && (
                <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl">
                    <h2 className="text-xl font-bold mb-6">View Student Details</h2>
                    <div className="flex space-x-4 mb-8">
                        <input
                            type="text"
                            placeholder="Enter Student USN"
                            className="flex-1 rounded-md border-gray-300 shadow-sm border p-2"
                            value={searchUSN}
                            onChange={(e) => setSearchUSN(e.target.value)}
                        />
                        <button
                            onClick={handleSearchStudent}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center"
                        >
                            <Eye className="w-5 h-5 mr-2" /> Search
                        </button>
                    </div>

                    {searchedStudent && (
                        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                            <div className="flex items-start space-x-6">
                                <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md flex-shrink-0">
                                    {searchedStudent.user.photoUrl ? (
                                        <img
                                            src={`http://localhost:5000${searchedStudent.user.photoUrl}`}
                                            alt="Student"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-xs uppercase text-center p-2">
                                            No Photo
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Name</p>
                                        <p className="text-xl font-bold text-gray-900">{searchedStudent.user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">USN</p>
                                        <p className="text-lg font-bold text-gray-900">{searchedStudent.usn}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Department</p>
                                        <p className="text-lg font-bold text-gray-900">{searchedStudent.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Year</p>
                                        <p className="text-lg font-bold text-gray-900">{searchedStudent.currentYear}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Email</p>
                                        <p className="text-gray-900">{searchedStudent.user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Quota</p>
                                        <p className="text-gray-900 capitalize">{searchedStudent.quota}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default RegistrarDashboard;
