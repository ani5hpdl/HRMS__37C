import React, { useState, useEffect } from 'react';
import { Download, Eye } from 'lucide-react';
import NavBar from '../components/NavBar';
import { getReservations } from '../services/api';

const Invoices = () => {
    const [selectedStatus, setSelectedStatus] = useState('All Status');

    // State for backend data
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    /* ---------- Fetch Reservations ---------- */
    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);

            const response = await getReservations();

            if (response.data.success) {
                setReservations(response.data.data || []);
            } else {
                setError("Error fetching reservations: " + response.data.message);
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to fetch reservations");
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Calculate Financial Stats ---------- */
    const calculateStats = () => {
        const totalIncome = reservations
            .filter(r => r.paymentStatus === 'paid')
            .reduce((sum, r) => sum + parseFloat(r.totalPrice || 0), 0);

        const pendingPayments = reservations
            .filter(r => r.paymentStatus === 'unpaid')
            .reduce((sum, r) => sum + parseFloat(r.totalPrice || 0), 0);

        // Mock expenses - you can replace this with actual expense data
        const totalExpenses = 30000;
        const totalBalance = totalIncome - totalExpenses;

        return {
            totalBalance,
            totalIncome,
            totalExpenses,
            pendingPayments
        };
    };

    const stats = calculateStats();

    /* ---------- Filter Reservations for Invoice ---------- */
    const filteredInvoices = reservations.filter(reservation => {
        const matchesSearch =
            reservation.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.guestEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            selectedStatus === 'All Status' ||
            (selectedStatus === 'Paid' && reservation.paymentStatus === 'paid') ||
            (selectedStatus === 'Unpaid' && reservation.paymentStatus === 'unpaid');

        return matchesSearch && matchesStatus;
    });

    /* ---------- Download Invoice ---------- */
    const downloadInvoice = (reservation) => {
        const invoiceContent = `
INVOICE
=====================================
Booking ID: ${reservation.id}
Guest Name: ${reservation.guestName}
Email: ${reservation.guestEmail}
Contact: ${reservation.guestContact}

Check-In: ${new Date(reservation.checkInDate).toLocaleDateString()}
Check-Out: ${new Date(reservation.checkOutDate).toLocaleDateString()}
Duration: ${reservation.nights} night(s)

Total Amount: NPR ${reservation.totalPrice}
Payment Status: ${reservation.paymentStatus.toUpperCase()}

Special Requests: ${reservation.specialRequest || 'None'}
=====================================
Thank you for choosing our hotel!
    `;

        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${reservation.id.substring(0, 8)}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    return (
        <div className="flex h-screen bg-gray-50">
            <div className="flex-1 p-8 bg-gray-50 overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-gray-500 text-sm mt-1">Manage guest invoices and payments</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-sm text-gray-500">Pending Payments</div>
                        <div className="text-2xl font-bold text-orange-600">NPR {stats.pendingPayments.toLocaleString()}</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <button className="bg-yellow-200 px-4 py-2 rounded text-sm font-medium">
                                All Time
                            </button>
                            <div className="flex gap-3">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded text-sm"
                                >
                                    <option>All Status</option>
                                    <option>Paid</option>
                                    <option>Unpaid</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search name, room, email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded text-sm w-64"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading invoices...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-500 mb-4">{error}</p>
                                <button
                                    onClick={fetchReservations}
                                    className="px-4 py-2 bg-yellow-200 rounded hover:bg-yellow-300"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : filteredInvoices.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                {searchTerm || selectedStatus !== 'All Status'
                                    ? 'No invoices found matching your filters'
                                    : 'No invoices available'}
                            </div>
                        ) : (
                            <>
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-left text-sm text-gray-500">
                                            <th className="pb-3 font-medium">Booking ID</th>
                                            <th className="pb-3 font-medium">Guest Name</th>
                                            <th className="pb-3 font-medium">Contact</th>
                                            <th className="pb-3 font-medium">Check-In</th>
                                            <th className="pb-3 font-medium">Check-Out</th>
                                            <th className="pb-3 font-medium">Nights</th>
                                            <th className="pb-3 font-medium">Amount</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInvoices.map((reservation) => (
                                            <tr key={reservation.id} className="border-b hover:bg-gray-50">
                                                <td className="py-4 text-gray-600 font-mono text-xs">
                                                    {reservation.id.substring(0, 8)}...
                                                </td>
                                                <td className="py-4">
                                                    <div>
                                                        <div className="font-medium">{reservation.guestName}</div>
                                                        <div className="text-xs text-gray-500">{reservation.guestEmail}</div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-gray-600 text-sm">
                                                    {reservation.guestContact}
                                                </td>
                                                <td className="py-4 text-gray-600">
                                                    {new Date(reservation.checkInDate).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 text-gray-600">
                                                    {new Date(reservation.checkOutDate).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 font-medium">{reservation.nights}</td>
                                                <td className="py-4 font-bold text-lg">NPR {reservation.totalPrice}</td>
                                                <td className="py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${reservation.paymentStatus === 'paid'
                                                            ? 'bg-green-100 text-green-700'
                                                            : reservation.paymentStatus === 'unpaid'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {reservation.paymentStatus.charAt(0).toUpperCase() + reservation.paymentStatus.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="p-2 hover:bg-gray-100 rounded"
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => downloadInvoice(reservation)}
                                                            className="bg-yellow-200 px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-yellow-300"
                                                        >
                                                            <Download size={14} />
                                                            Download
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="flex justify-between items-center mt-6">
                                    <div className="text-sm text-gray-500">
                                        Showing {filteredInvoices.length} of {reservations.length} invoices
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Total Revenue: <span className="font-bold text-green-600">NPR {stats.totalIncome.toLocaleString()}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Invoices;
