import React, { useState, useEffect } from 'react';
import { Home, Settings, Bell, Package, DollarSign, FileText, Star, Users, Bed, Menu, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import NavBar from '../components/NavBar';
import { getReservations } from '../services/api';

const Expense = () => {
    const [activeSection, setActiveSection] = useState('expenses');
    const [selectedYear, setSelectedYear] = useState('This Year');
    const [selectedCategory, setSelectedCategory] = useState('All Category');
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

    // Sample expense data
    const expenseTransactions = [
        { id: 1, name: 'Housekeeping Supplies', category: 'Supplies', quantity: 10, amount: 500, date: 'June 1, 2028', status: 'Completed' },
        { id: 2, name: 'Electricity Bill', category: 'Utilities', quantity: 1, amount: 1000, date: 'June 2, 2028', status: 'Completed' },
        { id: 3, name: 'Marketing Campaign', category: 'Marketing and Advertising', quantity: 1, amount: 2000, date: 'June 3, 2028', status: 'Completed' },
        { id: 4, name: 'Room Maintenance', category: 'Maintenance and Repairs', quantity: 3, amount: 1200, date: 'June 4, 2028', status: 'Completed' },
        { id: 5, name: 'Staff Salaries', category: 'Salaries and Wages', quantity: 20, amount: 15000, date: 'June 5, 2028', status: 'Completed' },
        { id: 6, name: 'Water Bill', category: 'Utilities', quantity: 1, amount: 500, date: 'June 6, 2028', status: 'Completed' },
        { id: 7, name: 'Event Supplies', category: 'Supplies', quantity: 5, amount: 750, date: 'June 7, 2028', status: 'Completed' },
        { id: 8, name: 'Plumbing Repair', category: 'Maintenance and Repairs', quantity: 1, amount: 800, date: 'June 8, 2028', status: 'Completed' },
        { id: 9, name: 'Internet Service', category: 'Utilities', quantity: 1, amount: 300, date: 'June 9, 2028', status: 'Completed' },
        { id: 10, name: 'Print Advertisements', category: 'Marketing and Advertising', quantity: 1, amount: 500, date: 'June 10, 2028', status: 'Completed' },
    ];

    const monthlyData = [
        { month: 'Jan', income: 21000, expense: 12000 },
        { month: 'Feb', income: 18000, expense: 10000 },
        { month: 'Mar', income: 15000, expense: 8000 },
        { month: 'Apr', income: 19000, expense: 11000 },
        { month: 'May', income: 22000, expense: 13000 },
        { month: 'Jun', income: stats.totalIncome, expense: stats.totalExpenses },
        { month: 'Jul', income: 24000, expense: 12000 },
        { month: 'Aug', income: 20000, expense: 10000 },
        { month: 'Sep', income: 23000, expense: 14000 },
        { month: 'Oct', income: 26000, expense: 13000 },
        { month: 'Nov', income: 24000, expense: 12000 },
        { month: 'Dec', income: 27000, expense: 14000 },
    ];

    const expenseCategories = [
        { name: 'Salaries and Wages', percentage: 50, amount: 15000, color: 'bg-yellow-200' },
        { name: 'Utilities', percentage: 16.67, amount: 5000, color: 'bg-gray-300' },
        { name: 'Maintenance and Repairs', percentage: 13.33, amount: 4000, color: 'bg-green-200' },
        { name: 'Supplies', percentage: 10, amount: 3000, color: 'bg-blue-200' },
        { name: 'Marketing and Advertising', percentage: 6.67, amount: 2000, color: 'bg-purple-200' },
        { name: 'Miscellaneous', percentage: 3.33, amount: 1000, color: 'bg-pink-200' },
    ];

    return (<div className='flex h-screen bg-gray-50'>
        <div className="flex-1 p-8 bg-gray-50 overflow-auto">

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-gray-500 text-sm">Total Balance</div>
                        <div className={`text-sm px-2 py-1 rounded ${stats.totalBalance >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                            {stats.totalBalance >= 0 ? '+' : ''}{((stats.totalBalance / stats.totalIncome) * 100).toFixed(2)}%
                        </div>
                    </div>
                    <div className="text-3xl font-bold">NPR {stats.totalBalance.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs mt-1">from reservations</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-gray-500 text-sm">Total Income</div>
                        <div className="text-green-600 text-sm bg-green-100 px-2 py-1 rounded">+2.15%</div>
                    </div>
                    <div className="text-3xl font-bold">NPR {stats.totalIncome.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs mt-1">from reservations</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-gray-500 text-sm">Total Expenses</div>
                        <div className="text-green-600 text-sm bg-green-100 px-2 py-1 rounded">+4.67%</div>
                    </div>
                    <div className="text-3xl font-bold">NPR {stats.totalExpenses.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs mt-1">operational costs</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
                {/* Earnings Chart */}
                <div className="col-span-2 bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">Earnings</h2>
                        <button className="bg-yellow-200 px-4 py-2 rounded text-sm font-medium">
                            {selectedYear}
                        </button>
                    </div>

                    <div className="flex gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-200 rounded"></div>
                            <span>Income</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                            <span>Expense</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between h-48 gap-2">
                        {monthlyData.map((data, i) => {
                            const maxValue = 30000;
                            const incomeHeight = (data.income / maxValue) * 100;
                            const expenseHeight = (data.expense / maxValue) * 100;

                            return (
                                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                                    <div className="w-full flex flex-col items-center justify-end" style={{ height: '100%' }}>
                                        <div className="w-full bg-green-200 rounded-t" style={{ height: `${incomeHeight}%` }}></div>
                                        <div className="w-full bg-yellow-200" style={{ height: `${expenseHeight}%` }}></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">{data.month}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">Income</span>
                        <span className="text-sm bg-yellow-200 px-3 py-1 rounded font-medium">Expense</span>
                    </div>

                    <div className="relative w-48 h-48 mx-auto mb-6">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                            {expenseCategories.map((cat, i) => {
                                const angles = expenseCategories.map(c => (c.percentage / 100) * 360);
                                let startAngle = 0;
                                for (let j = 0; j < i; j++) {
                                    startAngle += angles[j];
                                }
                                const endAngle = startAngle + angles[i];

                                const startRad = (startAngle * Math.PI) / 180;
                                const endRad = (endAngle * Math.PI) / 180;

                                const x1 = 50 + 40 * Math.cos(startRad);
                                const y1 = 50 + 40 * Math.sin(startRad);
                                const x2 = 50 + 40 * Math.cos(endRad);
                                const y2 = 50 + 40 * Math.sin(endRad);

                                const largeArc = angles[i] > 180 ? 1 : 0;

                                const colors = ['#fef08a', '#d1d5db', '#bbf7d0', '#bfdbfe', '#e9d5ff', '#fbcfe8'];

                                return (
                                    <path
                                        key={i}
                                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                        fill={colors[i]}
                                        stroke="white"
                                        strokeWidth="0.5"
                                    />
                                );
                            })}
                            <circle cx="50" cy="50" r="25" fill="white" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-2xl font-bold">NPR {stats.totalExpenses.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Total Expense</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {expenseCategories.map((cat, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded ${cat.color}`}></div>
                                    <span className="text-gray-600">{cat.name}</span>
                                </div>
                                <span className="font-medium">NPR {cat.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">Transactions</h2>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Search expense"
                                className="px-4 py-2 border border-gray-300 rounded text-sm"
                            />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded text-sm"
                            >
                                <option>All Category</option>
                                <option>Supplies</option>
                                <option>Utilities</option>
                                <option>Marketing and Advertising</option>
                                <option>Maintenance and Repairs</option>
                                <option>Salaries and Wages</option>
                            </select>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded text-sm"
                            >
                                <option>All Status</option>
                                <option>Completed</option>
                                <option>Pending</option>
                            </select>
                            <button className="bg-yellow-200 px-4 py-2 rounded text-sm font-medium">
                                1 - 18 June 2028
                            </button>
                        </div>
                    </div>

                    <table className="w-full">
                        <thead className="border-b">
                            <tr className="text-left text-sm text-gray-500">
                                <th className="pb-3 font-medium">Expense ⇅</th>
                                <th className="pb-3 font-medium">Category ⇅</th>
                                <th className="pb-3 font-medium">Quantity ⇅</th>
                                <th className="pb-3 font-medium">Amount ⇅</th>
                                <th className="pb-3 font-medium">Date ⇅</th>
                                <th className="pb-3 font-medium">Status ⇅</th>
                                <th className="pb-3 font-medium">Action ⇅</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseTransactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                                    <td className="py-4">{transaction.name}</td>
                                    <td className="py-4 text-gray-600">{transaction.category}</td>
                                    <td className="py-4 text-gray-600">{transaction.quantity}</td>
                                    <td className="py-4 font-medium">NPR {transaction.amount}</td>
                                    <td className="py-4 text-gray-600">{transaction.date}</td>
                                    <td className="py-4">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded">
                                                <Eye size={16} />
                                            </button>
                                            <button className="bg-yellow-200 px-3 py-1 rounded text-sm flex items-center gap-1">
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
                        <div className="text-sm text-gray-500">Showing 1-10 of {expenseTransactions.length}</div>
                        <div className="flex gap-2 items-center">
                            <button className="p-2 border rounded hover:bg-gray-50">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="px-3 py-1 bg-yellow-200 rounded font-medium">1</button>
                            <button className="px-3 py-1 hover:bg-gray-100 rounded">2</button>
                            <button className="px-3 py-1 hover:bg-gray-100 rounded">3</button>
                            <button className="p-2 border rounded hover:bg-gray-50">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    );
}

export default Expense;