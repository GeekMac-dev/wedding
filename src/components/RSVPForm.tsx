import { useState } from 'react';
import { Send, CheckCircle, Loader2, User, Mail, Users, Utensils, MessageSquare, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RSVPFormData {
  guestName: string;
  email: string;
  attending: boolean;
  numberOfAttendees: number;
  mealPreference: 'vegetarian' | 'non-vegetarian';
  dietaryRestrictions: string;
  message: string;
}

export default function RSVPForm() {
  const [formData, setFormData] = useState<RSVPFormData>({
    guestName: '',
    email: '',
    attending: true,
    numberOfAttendees: 1,
    mealPreference: 'non-vegetarian',
    dietaryRestrictions: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 1 : value,
    }));
  };

  const handleAttendingChange = (attending: boolean) => {
    setFormData(prev => ({
      ...prev,
      attending,
      numberOfAttendees: attending ? prev.numberOfAttendees : 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error: submitError } = await supabase
        .from('wedding_rsvps')
        .insert({
          guest_name: formData.guestName,
          email: formData.email,
          attending: formData.attending,
          number_of_attendees: formData.attending ? formData.numberOfAttendees : 0,
          meal_preference: formData.mealPreference,
          dietary_restrictions: formData.dietaryRestrictions || null,
          message: formData.message || null,
        });

      if (submitError) throw submitError;

      setIsSubmitted(true);
    } catch (err) {
      console.error('RSVP submission error:', err);
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="font-serif text-3xl text-gray-800 mb-4">Thank You!</h3>
        <p className="text-gray-600 mb-2">
          Your RSVP has been received.
        </p>
        {formData.attending ? (
          <p className="text-gray-600">
            We can't wait to celebrate with you and your {formData.numberOfAttendees > 1 ? `${formData.numberOfAttendees - 1} guest${formData.numberOfAttendees > 2 ? 's' : ''}` : 'party'}!
          </p>
        ) : (
          <p className="text-gray-600">
            We're sorry you can't make it, but we appreciate you letting us know.
          </p>
        )}
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              guestName: '',
              email: '',
              attending: true,
              numberOfAttendees: 1,
              mealPreference: 'non-vegetarian',
              dietaryRestrictions: '',
              message: '',
            });
          }}
          className="mt-6 px-6 py-2 text-rose-500 hover:text-rose-600 font-medium transition-colors"
        >
          Submit Another RSVP
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h3 className="font-serif text-3xl text-gray-800 mb-2">RSVP</h3>
        <p className="text-gray-500">Please let us know if you'll be joining us</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Attendance Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">Will you be attending?</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleAttendingChange(true)}
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.attending
                ? 'border-rose-500 bg-rose-50 text-rose-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <span className="block text-lg font-medium">Joyfully Accept</span>
            <span className="text-sm opacity-75">I'll be there!</span>
          </button>
          <button
            type="button"
            onClick={() => handleAttendingChange(false)}
            className={`p-4 rounded-xl border-2 transition-all ${
              !formData.attending
                ? 'border-gray-500 bg-gray-50 text-gray-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <span className="block text-lg font-medium">Regretfully Decline</span>
            <span className="text-sm opacity-75">Can't make it</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Guest Name */}
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Your Name *
          </label>
          <input
            type="text"
            id="guestName"
            name="guestName"
            required
            value={formData.guestName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
          />
        </div>

        {formData.attending && (
          <>
            {/* Number of Attendees */}
            <div>
              <label htmlFor="numberOfAttendees" className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Number of Guests (including yourself) *
              </label>
              <select
                id="numberOfAttendees"
                name="numberOfAttendees"
                value={formData.numberOfAttendees}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-white"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            {/* Meal Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Utensils className="w-4 h-4 inline mr-2" />
                Meal Preference *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mealPreference: 'non-vegetarian' }))}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.mealPreference === 'non-vegetarian'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="block font-medium">Non-Vegetarian</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mealPreference: 'vegetarian' }))}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.mealPreference === 'vegetarian'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="block font-medium">Vegetarian</span>
                </button>
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Restrictions / Allergies
              </label>
              <input
                type="text"
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleInputChange}
                placeholder="e.g., Gluten-free, Nut allergy, etc."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
              />
            </div>
          </>
        )}

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Message for the Couple (optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Share your wishes or any special notes..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 ${
            isSubmitting
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit RSVP
            </>
          )}
        </button>
      </div>
    </form>
  );
}
