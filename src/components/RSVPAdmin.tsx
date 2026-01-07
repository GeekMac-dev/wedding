import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, CheckCircle, XCircle, Utensils, Mail, Calendar, Download, RefreshCw, Search, X } from 'lucide-react';

interface RSVP {
  id: string;
  guest_name: string;
  email: string;
  attending: boolean;
  number_of_attendees: number;
  meal_preference: string;
  dietary_restrictions: string | null;
  message: string | null;
  created_at: string;
}

interface RSVPAdminProps {
  onClose: () => void;
}

export default function RSVPAdmin({ onClose }: RSVPAdminProps) {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttending, setFilterAttending] = useState<'all' | 'yes' | 'no'>('all');

  const fetchRSVPs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('wedding_rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRsvps(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const filteredRsvps = rsvps.filter(rsvp => {
    const matchesSearch = 
      rsvp.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rsvp.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterAttending === 'all' ||
      (filterAttending === 'yes' && rsvp.attending) ||
      (filterAttending === 'no' && !rsvp.attending);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.attending).length,
    notAttending: rsvps.filter(r => !r.attending).length,
    totalGuests: rsvps.reduce((sum, r) => sum + (r.attending ? r.number_of_attendees : 0), 0),
    vegetarian: rsvps.filter(r => r.attending && r.meal_preference === 'vegetarian').reduce((sum, r) => sum + r.number_of_attendees, 0),
    nonVegetarian: rsvps.filter(r => r.attending && r.meal_preference === 'non-vegetarian').reduce((sum, r) => sum + r.number_of_attendees, 0),
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Attending', 'Guests', 'Meal Preference', 'Dietary Restrictions', 'Message', 'Date'];
    const rows = rsvps.map(r => [
      r.guest_name,
      r.email,
      r.attending ? 'Yes' : 'No',
      r.number_of_attendees.toString(),
      r.meal_preference,
      r.dietary_restrictions || '',
      r.message || '',
      new Date(r.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif mb-1">RSVP Management</h2>
                <p className="text-white/80 text-sm">View and manage guest responses</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total RSVPs</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalGuests}</p>
                  <p className="text-xs text-gray-500">Total Guests</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Utensils className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.vegetarian}</p>
                  <p className="text-xs text-gray-500">Vegetarian</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <Utensils className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.nonVegetarian}</p>
                  <p className="text-xs text-gray-500">Non-Vegetarian</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="p-6 border-b flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                {(['all', 'yes', 'no'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterAttending(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterAttending === filter
                        ? 'bg-rose-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter === 'yes' ? 'Attending' : 'Not Attending'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchRSVPs}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* RSVP List */}
          <div className="p-6 max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-rose-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading RSVPs...</p>
              </div>
            ) : filteredRsvps.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No RSVPs found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      rsvp.attending
                        ? 'border-green-200 bg-green-50/50'
                        : 'border-gray-200 bg-gray-50/50'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${rsvp.attending ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {rsvp.attending ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{rsvp.guest_name}</h4>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            {rsvp.email}
                          </div>
                          {rsvp.message && (
                            <p className="mt-2 text-sm text-gray-600 italic">"{rsvp.message}"</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 md:gap-4 text-sm">
                        {rsvp.attending && (
                          <>
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                              {rsvp.number_of_attendees} guest{rsvp.number_of_attendees !== 1 ? 's' : ''}
                            </span>
                            <span className={`px-3 py-1 rounded-full ${
                              rsvp.meal_preference === 'vegetarian'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {rsvp.meal_preference}
                            </span>
                            {rsvp.dietary_restrictions && (
                              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                {rsvp.dietary_restrictions}
                              </span>
                            )}
                          </>
                        )}
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(rsvp.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Summary */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-600">
              <span><strong>{stats.attending}</strong> attending</span>
              <span><strong>{stats.notAttending}</strong> not attending</span>
              <span><strong>{stats.totalGuests}</strong> total guests expected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
