import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Badge } from '../components/ui';
import { User, Mail, Phone, Camera, Edit2, Save, X } from 'lucide-react';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
  });

  function handleSave() {
    setIsEditing(false);
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-secondary-100 mb-2">My Profile</h1>
          <p className="text-secondary-400">Manage your account settings</p>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-secondary-800 border border-secondary-700 hover:bg-secondary-700 transition-colors">
                <Camera className="w-4 h-4 text-secondary-300" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-secondary-100">{formData.fullName}</h2>
              <p className="text-secondary-400">{formData.email}</p>
              <Badge variant="primary" className="mt-2">Premium Member</Badge>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-3 rounded-lg transition-colors ${
                isEditing
                  ? 'bg-error-500/20 text-error-400 hover:bg-error-500/30'
                  : 'bg-secondary-800 text-secondary-300 hover:bg-secondary-700'
              }`}
            >
              {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-secondary-100 mb-6">Personal Information</h3>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              disabled={!isEditing}
              leftIcon={<User className="w-5 h-5" />}
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              leftIcon={<Mail className="w-5 h-5" />}
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              leftIcon={<Phone className="w-5 h-5" />}
            />

            {isEditing && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} leftIcon={<Save className="w-5 h-5" />}>
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="card p-6 text-center">
            <p className="text-3xl font-bold text-primary-400">12</p>
            <p className="text-sm text-secondary-400 mt-1">Movies Watched</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-3xl font-bold text-cinema-gold">$458</p>
            <p className="text-sm text-secondary-400 mt-1">Total Spent</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-3xl font-bold text-success-400">850</p>
            <p className="text-sm text-secondary-400 mt-1">Reward Points</p>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-secondary-100 mb-6">Preferences</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-secondary-800">
              <div>
                <p className="font-medium text-secondary-200">Email Notifications</p>
                <p className="text-sm text-secondary-500">Receive updates about new releases</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-secondary-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-secondary-800">
              <div>
                <p className="font-medium text-secondary-200">SMS Notifications</p>
                <p className="text-sm text-secondary-500">Receive booking confirmations via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-secondary-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-secondary-200">Preferred Seat Type</p>
                <p className="text-sm text-secondary-500">Your default seat preference</p>
              </div>
              <select className="bg-secondary-800 border border-secondary-700 rounded-lg px-4 py-2 text-secondary-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20">
                <option>Any</option>
                <option value="regular">Regular</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfilePage;
