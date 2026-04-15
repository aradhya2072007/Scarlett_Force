'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProfile, updateProfile } from '@/lib/api';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Loader2, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: ''
  });

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setFormData({
          name: data.user.name || '',
          bio: data.user.bio || '',
          avatar: data.user.avatar || '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      await refreshUser();
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-indigo-500 animate-spin" /></div>;

  const displayAvatar = formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'U')}&background=6366f1&color=fff&size=128`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>My Profile</h1>
          <p className="text-slate-400 mt-1">Manage your account settings and personality profile.</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 btn-secondary px-4 py-2">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <button onClick={() => { setEditing(false); setFormData({ name: user.name, bio: user.bio||'', avatar: user.avatar||'' }); }} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors border border-white/10 rounded-xl hover:bg-white/5">
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 border border-white/10"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-white/5">
            <div className="relative group">
              <img src={displayAvatar} alt="Profile" className="w-32 h-32 rounded-3xl object-cover border-4 border-white/10 shadow-xl" />
              {editing && (
                <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 w-full space-y-4">
              {editing ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Avatar Image URL</label>
                  <input type="url" name="avatar" value={formData.avatar} onChange={handleChange} className="input-field bg-slate-900/50" placeholder="https://..." />
                  <p className="text-xs text-slate-500 mt-1">Leave blank to use default initials avatar.</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{user.name}</h2>
                  <p className="text-indigo-400 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" /> {user.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              {editing ? (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field pl-10 bg-slate-900/50" />
                </div>
              ) : (
                <p className="text-white bg-white/5 px-4 py-3 rounded-xl border border-white/5">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Short Bio</label>
              {editing ? (
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  className="input-field bg-slate-900/50 resize-none min-h-[100px]" 
                  placeholder="Tell us a little about yourself..."
                  maxLength={300}
                />
              ) : (
                <p className={`text-white bg-white/5 px-4 py-3 rounded-xl border border-white/5 min-h-[100px] ${!user.bio ? 'text-slate-500 italic' : ''}`}>
                  {user.bio || 'No bio added yet.'}
                </p>
              )}
            </div>
          </div>

          {editing && (
            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary py-3 px-8">
                {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto m-0" /> : <><Save className="w-5 h-5" /> Save Changes</>}
              </button>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
