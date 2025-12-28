/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, Loader2, MessageSquare, Briefcase, Calendar, DollarSign, Layout, User, Mail, Phone, ExternalLink } from "lucide-react";

type Lead = {
    id: string;
    created_at: string;
    name: string;
    email: string;
    project_details: string;
    status: string;
};

type ProjectLead = {
    id: string;
    created_at: string;
    full_name: string;
    email: string;
    phone?: string;
    company_name?: string;
    project_type: string;
    description: string;
    features: string[];
    budget: string;
    timeline: string;
    existing_url?: string;
    status: string;
};

type Appointment = {
    id: string;
    created_at: string;
    name: string;
    email: string;
    message?: string;
    start_time: string;
    end_time: string;
    status: string;
};

type AvailabilitySetting = {
    id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
};

export default function AdminDashboard() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [projectLeads, setProjectLeads] = useState<ProjectLead[]>([]);
    const [formSubmissions, setFormSubmissions] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [availability, setAvailability] = useState<AvailabilitySetting[]>([]);
    const [activeTab, setActiveTab] = useState<'contact' | 'projects' | 'forms' | 'bookings' | 'settings'>('contact');
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "zokuai7@gmail.com";
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            if (!supabase) return;
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                router.push("/login"); // Redirect to login if not authenticated
                return;
            }

            if (user.email !== ADMIN_EMAIL) {
                router.push("/"); // Redirect non-admins to home
                return;
            }

            fetchData();
        };

        checkAuth();
        setLoading(false);
    }, [supabase, router]); // Added dependencies

    const fetchData = async () => {
        if (!supabase) return;
        try {
            // Fetch Contact Form Leads
            const { data: leadsData, error: leadsError } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (!leadsError && leadsData) setLeads(leadsData);

            // Fetch Project Leads
            const { data: projectData, error: projectError } = await supabase
                .from('project_leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (!projectError && projectData) setProjectLeads(projectData);

            // Fetch Secure Forms (RLS will filter this to user's own data, unless policy allows all)
            const { data: formsData, error: formsError } = await supabase
                .from('form_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (!formsError && formsData) setFormSubmissions(formsData);

            // Fetch Appointments
            const { data: appointmentData, error: appointmentError } = await supabase
                .from('appointments')
                .select('*')
                .order('start_time', { ascending: true }); // Order by upcoming

            if (!appointmentError && appointmentData) setAppointments(appointmentData);

            // Fetch Availability Settings
            const { data: availabilityData, error: availabilityError } = await supabase
                .from('availability_settings')
                .select('*')
                .order('day_of_week', { ascending: true });

            if (!availabilityError && availabilityData) {
                const existingDays = new Set(availabilityData.map(s => s.day_of_week));
                const missingDays = [0, 1, 2, 3, 4, 5, 6].filter(d => !existingDays.has(d));

                if (missingDays.length > 0) {
                    const newSettings = missingDays.map(day => ({
                        day_of_week: day,
                        start_time: "09:00:00",
                        end_time: "17:00:00",
                        is_active: false
                    }));
                    const { data: insertedData, error: insertError } = await supabase
                        .from('availability_settings')
                        .insert(newSettings)
                        .select();

                    if (!insertError && insertedData) {
                        setAvailability([...availabilityData, ...insertedData].sort((a, b) => a.day_of_week - b.day_of_week));
                    } else {
                        setAvailability(availabilityData);
                    }
                } else {
                    setAvailability(availabilityData);
                }
            }

        } catch (err: any) {
            console.error("Error fetching data:", err);
            setError(err.message || "Failed to fetch dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                <p className="text-neutral-500 font-mono text-xs animate-pulse">Initializing Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
                    <LogOut size={32} />
                </div>
                <h1 className="text-2xl font-bold">Access Error</h1>
                <p className="text-neutral-400 max-w-md">{error}</p>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-all"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-blue-500/30">

            {/* Navbar */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">A</div>
                        <span className="font-bold text-white">Admin Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/form-a" className="text-xs text-blue-400 hover:text-blue-300">Form A</a>
                        <a href="/form-b" className="text-xs text-purple-400 hover:text-purple-300">Form B</a>
                    </div>
                </div>
            </nav>

            {/* Helper for day names */}
            {(() => {
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                return null;
            })()}

            <div className="container mx-auto px-6 py-10">

                {/* Tabs */}
                <div className="flex gap-6 border-b border-white/10 mb-8 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'contact' ? 'text-blue-500' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        Contact Inquiries
                        <span className="ml-2 bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full">{leads.length}</span>
                        {activeTab === 'contact' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'projects' ? 'text-purple-500' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        Project Applications
                        <span className="ml-2 bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full">{projectLeads.length}</span>
                        {activeTab === 'projects' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('forms')}
                        className={`pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'forms' ? 'text-green-500' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        Secure Forms
                        <span className="ml-2 bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full">{formSubmissions.length}</span>
                        {activeTab === 'forms' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'bookings' ? 'text-amber-500' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        Bookings
                        <span className="ml-2 bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full">{appointments.length}</span>
                        {activeTab === 'bookings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'settings' ? 'text-blue-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        Meeting Settings
                        <span className="ml-2 bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">CAL</span>
                        {activeTab === 'settings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></div>}
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">

                    {/* CONTACT LEADS TAB */}
                    {activeTab === 'contact' && (
                        <div className="grid grid-cols-1 gap-4">
                            {leads.length === 0 ? (
                                <div className="text-center py-20 text-neutral-500">No contact inquiries yet.</div>
                            ) : (
                                leads.map((lead) => (
                                    <div key={lead.id} className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                            <div>
                                                <h3 className="text-white font-bold text-lg mb-1">{lead.name}</h3>
                                                <a href={`mailto:${lead.email}`} className="text-blue-400 text-sm hover:underline flex items-center gap-2">
                                                    <Mail size={14} /> {lead.email}
                                                </a>
                                            </div>
                                            <span className="text-xs text-neutral-500 bg-white/5 px-3 py-1 rounded-full whitespace-nowrap">
                                                {new Date(lead.created_at).toLocaleDateString()} at {new Date(lead.created_at).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-neutral-300 text-sm leading-relaxed">
                                            {lead.project_details}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* PROJECT LEADS TAB */}
                    {activeTab === 'projects' && (
                        <div className="grid grid-cols-1 gap-4">
                            {projectLeads.length === 0 ? (
                                <div className="text-center py-20 text-neutral-500">
                                    No project applications yet.
                                    <br /><span className="text-xs opacity-50">(If you just created the table, submit a test form!)</span>
                                </div>
                            ) : (
                                projectLeads.map((project) => (
                                    <div key={project.id} className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl hover:border-purple-500/20 transition-colors group">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-white font-bold text-lg">{project.full_name}</h3>
                                                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                                                        {project.project_type}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                                                    <a href={`mailto:${project.email}`} className="hover:text-white flex items-center gap-1.5"><Mail size={14} /> {project.email}</a>
                                                    {project.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {project.phone}</span>}
                                                    {project.company_name && <span className="flex items-center gap-1.5"><Briefcase size={14} /> {project.company_name}</span>}
                                                </div>
                                            </div>
                                            <span className="text-xs text-neutral-500 bg-white/5 px-3 py-1 rounded-full whitespace-nowrap">
                                                {new Date(project.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1 block">Vision</span>
                                                    <p className="text-neutral-300 text-sm bg-black/50 p-3 rounded-lg border border-white/5">
                                                        {project.description || "No description provided."}
                                                    </p>
                                                </div>
                                                {project.existing_url && (
                                                    <div>
                                                        <span className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1 block">Current Site</span>
                                                        <a href={project.existing_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                                                            {project.existing_url} <ExternalLink size={12} />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1 block flex items-center gap-1"><DollarSign size={10} /> Budget</span>
                                                        <span className="text-white text-sm">{project.budget}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1 block flex items-center gap-1"><Calendar size={10} /> Timeline</span>
                                                        <span className="text-white text-sm">{project.timeline}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-2 block flex items-center gap-1"><Layout size={10} /> Features</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.features && project.features.map((f, i) => (
                                                            <span key={i} className="text-xs bg-white/5 border border-white/5 text-neutral-300 px-2 py-1 rounded">
                                                                {f}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* SECURE FORMS TAB */}
                    {activeTab === 'forms' && (
                        <div className="grid grid-cols-1 gap-4">
                            {formSubmissions.length === 0 ? (
                                <div className="text-center py-20 text-neutral-500">
                                    No form submissions found.
                                    <br /><span className="text-xs opacity-50">(Only your own submissions need to be fetched via RLS)</span>
                                </div>
                            ) : (
                                formSubmissions.map((form) => (
                                    <div key={form.id} className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl hover:border-green-500/20 transition-colors">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider mb-2 ${form.form_type === 'form_a' ? 'bg-blue-900/20 text-blue-400 border border-blue-500/30' : 'bg-purple-900/20 text-purple-400 border border-purple-500/30'}`}>
                                                    {form.form_type === 'form_a' ? 'Form A' : 'Form B'}
                                                </span>
                                                <h3 className="text-white font-bold text-lg">Submission {form.id.slice(0, 8)}...</h3>
                                            </div>
                                            <span className="text-xs text-neutral-500 bg-white/5 px-3 py-1 rounded-full whitespace-nowrap">
                                                {new Date(form.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-neutral-300 text-sm font-mono overflow-x-auto">
                                            <pre>{JSON.stringify(form.form_data, null, 2)}</pre>
                                        </div>
                                        <div className="mt-4 text-xs text-neutral-500">
                                            User ID: {form.user_id}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* BOOKINGS TAB */}
                    {activeTab === 'bookings' && (
                        /* existing bookings tab content */
                        <div className="grid grid-cols-1 gap-4">
                            {appointments.length === 0 ? (
                                <div className="text-center py-20 text-neutral-500">
                                    No appointments scheduled yet.
                                </div>
                            ) : (
                                appointments.map((apt) => (
                                    <div key={apt.id} className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl hover:border-amber-500/20 transition-colors">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-amber-500/10 text-amber-500 p-3 rounded-xl">
                                                    <Calendar size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold text-lg mb-1">{apt.name}</h3>
                                                    <a href={`mailto:${apt.email}`} className="text-neutral-400 text-sm hover:text-white transition-colors flex items-center gap-1.5 mb-2">
                                                        <Mail size={14} /> {apt.email}
                                                    </a>
                                                    <div className="text-sm text-neutral-300 flex items-center gap-2">
                                                        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                            {new Date(apt.start_time).toLocaleDateString()}
                                                        </span>
                                                        <span>
                                                            {new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(apt.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider ${apt.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                                    {apt.status}
                                                </span>
                                                <span className="text-[10px] text-neutral-600">
                                                    Booked: {new Date(apt.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        {apt.message && (
                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                <p className="text-neutral-500 text-xs uppercase font-bold mb-1">Message</p>
                                                <p className="text-neutral-300 text-sm">{apt.message}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div className="bg-neutral-900/50 border border-white/5 p-8 rounded-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Availability Settings</h3>
                                    <p className="text-neutral-400 text-sm">Configure your weekly working hours and booking availability.</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        if (!supabase) {
                                            alert("Supabase client not initialized. Check your environment variables.");
                                            return;
                                        }
                                        setIsSaving(true);
                                        const { error } = await supabase.from('availability_settings').upsert(availability);
                                        if (error) alert(error.message);
                                        else alert("Settings saved successfully!");
                                        setIsSaving(false);
                                    }}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Changes"}
                                </button>
                            </div>

                            <div className="space-y-4">
                                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => {
                                    const setting = availability.find(s => s.day_of_week === index) || {
                                        id: `temp-${index}`,
                                        day_of_week: index,
                                        start_time: "09:00:00",
                                        end_time: "17:00:00",
                                        is_active: false
                                    };

                                    return (
                                        <div key={index} className="flex items-center gap-6 p-4 bg-black/30 border border-white/5 rounded-xl">
                                            <div className="w-32">
                                                <h4 className="font-bold text-white">{day}</h4>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={setting.is_active}
                                                    onChange={(e) => {
                                                        const newAvailability = [...availability];
                                                        const idx = newAvailability.findIndex(s => s.day_of_week === index);
                                                        if (idx >= 0) {
                                                            newAvailability[idx] = { ...newAvailability[idx], is_active: e.target.checked };
                                                        }
                                                        setAvailability(newAvailability);
                                                    }}
                                                    className="w-4 h-4 rounded border-white/10 bg-black text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-xs text-neutral-500 uppercase font-bold tabular-nums">
                                                    {setting.is_active ? "Active" : "Away"}
                                                </span>
                                            </div>

                                            <div className={`flex items-center gap-4 transition-opacity ${setting.is_active ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                                <input
                                                    type="time"
                                                    value={setting.start_time.slice(0, 5)}
                                                    onChange={(e) => {
                                                        const newAvailability = [...availability];
                                                        const idx = newAvailability.findIndex(s => s.day_of_week === index);
                                                        if (idx >= 0) {
                                                            newAvailability[idx] = { ...newAvailability[idx], start_time: e.target.value + ":00" };
                                                        }
                                                        setAvailability(newAvailability);
                                                    }}
                                                    className="bg-neutral-800 border border-white/10 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                                                />
                                                <span className="text-neutral-600">—</span>
                                                <input
                                                    type="time"
                                                    value={setting.end_time.slice(0, 5)}
                                                    onChange={(e) => {
                                                        const newAvailability = [...availability];
                                                        const idx = newAvailability.findIndex(s => s.day_of_week === index);
                                                        if (idx >= 0) {
                                                            newAvailability[idx] = { ...newAvailability[idx], end_time: e.target.value + ":00" };
                                                        }
                                                        setAvailability(newAvailability);
                                                    }}
                                                    className="bg-neutral-800 border border-white/10 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5">
                                <h4 className="text-lg font-bold text-white mb-4">Integrations</h4>
                                <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center font-bold text-blue-400">CAL</div>
                                        <div>
                                            <p className="font-bold text-white">Cal.com Widget</p>
                                            <p className="text-xs text-neutral-400">Current Link: https://cal.com/zoku-ai-skq2uy/30min</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all">Configure</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
