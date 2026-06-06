import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import * as XLSX from 'xlsx';
import * as SchoolData from '../data/schoolData';

const COLORS = ['#8884d8', '#ff8042', '#00C49F', '#FFBB28', '#0088FE'];

const AdminReports = () => {
    const [activeTab, setActiveTab] = useState('academic');

    const {
        INITIAL_FEE_PAYMENTS, ATTENDANCE_CHART_DATA, FEE_CHART_DATA,
        FEE_CATEGORY_DATA, ACADEMIC_SUBJECTS_DATA, ACADEMIC_CLASSES_DATA
    } = SchoolData;

    const handleExport = () => {
        const data = activeTab === 'financial' ? INITIAL_FEE_PAYMENTS : [];
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, `${activeTab}_report.xlsx`);
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Report & Analysis</h1>
                    <p className="text-gray-500">Comprehensive school performance insights</p>
                </div>
                <button onClick={handleExport} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    Export Excel
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 bg-white p-2 rounded-xl shadow-sm inline-flex">
                {['academic', 'financial', 'attendance'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-8 py-2 rounded-lg capitalize font-medium transition ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                            }`}>
                        {tab} Reports
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            <div className="mt-6">

                {/* ACADEMIC VIEW */}
                {activeTab === 'academic' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                            {[{ l: "Overall Avg", v: "81.2%" }, { l: "Pass Rate", v: "92.6%" }, { l: "Top Score", v: "Olivia W." }, { l: "At Risk", v: "14" }].map((s, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">{s.l}</p>
                                    <h3 className="text-2xl font-bold">{s.v}</h3>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold mb-4">Subject Wise Average performance</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={ACADEMIC_SUBJECTS_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" /><Tooltip /><Bar dataKey="score" fill="#8884d8" radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold mb-4">Pass/Fail rate by grade</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={ACADEMIC_CLASSES_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="grade" /><Tooltip />
                                        <Bar dataKey="pass" stackId="a" fill="#8884d8" radius={[0, 0, 10, 10]} />
                                        <Bar dataKey="fail" stackId="a" fill="#ff8042" radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- FINANCIAL VIEW --- */}
                {activeTab === 'financial' && (
                    <div className="space-y-6">
                        {/* 1. Summary Metric Cards (Matches your image layout) */}
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: "Total Collected", val: "$525k", sub: "8.2% vs last year", color: "border-teal-500" },
                                { label: "Pending dues", val: "$48k", sub: "24 students", color: "border-yellow-500" },
                                { label: "Overdue Amounts", val: "$25k", sub: "12 Overdue", color: "border-red-500" }
                            ].map((card, i) => (
                                <div key={i} className={`bg-white p-6 rounded-2xl border-l-4 ${card.color} shadow-sm border border-gray-100`}>
                                    <p className="text-sm text-gray-500">{card.label}</p>
                                    <h3 className="text-3xl font-bold my-1">{card.val}</h3>
                                    <p className="text-xs text-gray-400">{card.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* 2. Charts Section */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold mb-4">Monthly collection Fee 2026</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={FEE_CHART_DATA || []}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" />
                                        <Tooltip />
                                        <Bar dataKey="Collected" fill="#8884d8" radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold mb-4">Fee by Category</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={FEE_CATEGORY_DATA || []}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            outerRadius={80}
                                        >
                                            {(FEE_CATEGORY_DATA || []).map((e, i) => (
                                                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>


                        {/* --- ATTENDANCE VIEW --- */}
                        {activeTab === 'attendance' && (
                            <div className="space-y-6">
                                {/* 1. Summary Metrics */}
                                <div className="grid grid-cols-4 gap-6">
                                    {[
                                        { label: "Overall Attendance", val: "91.2%", sub: "1.5% vs last month" },
                                        { label: "Present Rate", val: "75%", sub: "Avg across all classes" },
                                        { label: "Absent Rate", val: "12%", sub: "0.8% vs last month" },
                                        { label: "Late Arrivals", val: "8%", sub: "Flagged this term" }
                                    ].map((card, i) => (
                                        <div key={i} className="bg-white p-6 rounded-2xl border-l-4 border-blue-600 shadow-sm border border-gray-100">
                                            <p className="text-sm text-gray-500">{card.label}</p>
                                            <h3 className="text-3xl font-bold my-1">{card.val}</h3>
                                            <p className="text-xs text-gray-400">{card.sub}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* 2. Charts Section */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <h3 className="font-bold mb-4">Monthly Attendance Students vs Staff</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={ATTENDANCE_CHART_DATA || []}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="month" />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="students" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                                <Area type="monotone" dataKey="staff" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                                        <h3 className="font-bold mb-4 w-full">Attendance breakdown</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={[{ name: 'Present', value: 70 }, { name: 'Absent', value: 15 }, { name: 'Late', value: 10 }, { name: 'Excuse', value: 5 }]}
                                                    dataKey="value"
                                                    innerRadius={70}
                                                    outerRadius={90}
                                                >
                                                    {COLORS.map((color, i) => (
                                                        <Cell key={i} fill={color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;