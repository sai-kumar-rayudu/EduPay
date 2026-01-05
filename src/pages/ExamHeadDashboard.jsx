import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Bell, Calendar, PlusCircle, CheckCircle, Trash2 } from 'lucide-react';

const ExamHeadDashboard = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('All');
    // Changed batch to targetBatches: []
    const [formData, setFormData] = useState({
        title: '', year: '', targetBatches: [], semester: '', examFeeAmount: '', startDate: '', endDate: '', description: '', examType: 'regular'
    });

    const [editModalData, setEditModalData] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/admin/notifications');
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/notifications', formData);
            toast.success('Notification Created!');
            // Reset form
            setFormData({ title: '', year: '', targetBatches: [], semester: '', examFeeAmount: '', startDate: '', endDate: '', description: '', examType: 'regular' });
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to create notification');
        }
    };

    const handleExtendUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/admin/notifications/${editModalData._id}`, {
                endDate: editModalData.endDate,
                lateFee: editModalData.lateFee,
                isActive: editModalData.isActive
            });
            toast.success('Notification Updated!');

            // Instant UI Update
            setNotifications(prev => prev.map(notif =>
                notif._id === data._id ? data : notif
            ));

            setEditModalData(null);
        } catch (error) {
            toast.error('Failed to update notification');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this notification? This action cannot be undone.')) {
            try {
                await api.delete(`/admin/notifications/${id}`);
                toast.success('Notification Deleted');
                setNotifications(prev => prev.filter(n => n._id !== id));
            } catch (error) {
                toast.error('Failed to delete notification');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Bell className="mr-3 h-8 w-8 text-indigo-600" />
                Examination Section Control
            </h1>

            {/* Edit Modal */}
            {editModalData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Extend Deadline & Penalty</h3>
                        <form onSubmit={handleExtendUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New End Date</label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 w-full border rounded-lg p-2"
                                    value={editModalData.endDate ? new Date(editModalData.endDate).toISOString().split('T')[0] : ''}
                                    onChange={e => setEditModalData({ ...editModalData, endDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Late Fee / Penalty (₹)</label>
                                <input
                                    type="number"
                                    className="mt-1 w-full border rounded-lg p-2"
                                    value={editModalData.lateFee || 0}
                                    onChange={e => setEditModalData({ ...editModalData, lateFee: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Added to original fee if payed late.</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="rounded text-indigo-600"
                                    checked={editModalData.isActive}
                                    onChange={e => setEditModalData({ ...editModalData, isActive: e.target.checked })}
                                />
                                <label className="text-sm text-gray-700">Notification Active</label>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditModalData(null)}
                                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Notification Form */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500">
                    <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                        <PlusCircle className="mr-2 h-5 w-5 text-indigo-500" />
                        Create Exam Notification
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Notification Title</label>
                                <input
                                    type="text" required
                                    className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                                    placeholder="e.g. End Semester Exams Dec 2025"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Exam Type</label>
                                <select
                                    className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.examType}
                                    onChange={e => setFormData({ ...formData, examType: e.target.value })}
                                >
                                    <option value="regular">Regular Exam</option>
                                    <option value="supplementary">Supplementary (Backlog)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Year (1-4)</label>
                                <select
                                    className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.year}
                                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                                >
                                    <option value="">Select Year</option>
                                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target Batches</label>
                                <div className="mt-1 space-y-2 border border-gray-300 rounded-lg p-3 bg-gray-50 h-[140px] overflow-y-auto">
                                    {['2022-2026', '2023-2027', '2024-2028', '2025-2029'].map((batch) => (
                                        <div key={batch} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`batch-${batch}`}
                                                value={batch}
                                                checked={formData.targetBatches?.includes(batch)}
                                                onChange={(e) => {
                                                    const { value, checked } = e.target;
                                                    setFormData(prev => {
                                                        const current = prev.targetBatches || [];
                                                        if (checked) return { ...prev, targetBatches: [...current, value] };
                                                        return { ...prev, targetBatches: current.filter(b => b !== value) };
                                                    });
                                                }}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`batch-${batch}`} className="ml-2 block text-sm text-gray-900">
                                                {batch}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Select multiple batches if needed.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Semester</label>
                                <select
                                    className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.semester}
                                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                >
                                    <option value="">Select Semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Exam Fee (₹)</label>
                                <input
                                    type="number" required
                                    className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.examFeeAmount}
                                    onChange={e => setFormData({ ...formData, examFeeAmount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date" required
                                    className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date" required
                                    className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.endDate}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description / Note</label>
                            <textarea
                                className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
                        >
                            Publish Notification
                        </button>
                    </form>
                </div>

                {/* Active Notifications List */}
                <div className="space-y-6">
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                            {['All', '2022-2026', '2023-2027', '2024-2028', '2025-2029'].map((batch) => (
                                <button
                                    key={batch}
                                    onClick={() => setSelectedBatch(batch)}
                                    className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all ${selectedBatch === batch
                                        ? 'bg-white text-indigo-600 shadow-sm border border-gray-100 ring-1 ring-black/5'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {batch === 'All' ? 'All Batches' : batch}
                                </button>
                            ))}
                        </div>
                    </div>

                    <h2 className="text-xl font-bold flex items-center text-gray-800 mt-2">
                        <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                        Active Notifications
                        {selectedBatch !== 'All' && (
                            <span className="ml-2 text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                Filtered: {selectedBatch}
                            </span>
                        )}
                    </h2>
                    {notifications.filter(n => selectedBatch === 'All' || (n.targetBatches && n.targetBatches.includes(selectedBatch))).length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                            <p className="text-gray-500">No active notifications found.</p>
                        </div>
                    ) : (
                        notifications.filter(n => selectedBatch === 'All' || (n.targetBatches && n.targetBatches.includes(selectedBatch))).map((notif) => (
                            <div key={notif._id} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-900">{notif.title}</h3>
                                    <div className="flex flex-col items-end">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${notif.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {notif.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <p><span className="font-medium">Year:</span> {notif.year}</p>
                                    <p><span className="font-medium">Batch:</span> {notif.targetBatches && notif.targetBatches.length > 0 ? notif.targetBatches.join(', ') : (notif.batch || 'All/N/A')}</p>
                                    <p><span className="font-medium">Sem:</span> {notif.semester}</p>
                                    <p><span className="font-medium">Fee:</span> ₹{notif.examFeeAmount}</p>
                                    <p><span className="font-medium">Start:</span> {new Date(notif.startDate).toLocaleDateString()}</p>
                                    <p><span className="font-medium">End:</span> {new Date(notif.endDate).toLocaleDateString()}</p>
                                    {notif.lateFee > 0 && (
                                        <p className="col-span-2 text-red-600 font-semibold">Late Fee: ₹{notif.lateFee}</p>
                                    )}
                                </div>
                                {notif.description && (
                                    <p className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                                        {notif.description}
                                    </p>
                                )}
                                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-4">
                                    <button
                                        onClick={() => handleDelete(notif._id)}
                                        className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium"
                                        title="Delete Notification"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => setEditModalData(notif)}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                    >
                                        Extend Deadline / Add Penalty
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamHeadDashboard;
