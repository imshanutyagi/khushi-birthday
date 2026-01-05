'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getPageContent,
  updatePageContent,
  getGifts,
  addGift,
  updateGift,
  deleteGift,
  getUserSelections,
  deleteUserSelection,
  uploadFile,
} from '@/lib/db';
import { PageContent, Gift, UserSelection } from '@/lib/types';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiUpload } from 'react-icons/fi';

type Tab = 'content' | 'gifts' | 'analytics';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [content, setContent] = useState<PageContent | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selections, setSelections] = useState<UserSelection[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const loadData = async () => {
    setLoading(true);
    const pageData = await getPageContent();
    const giftsData = await getGifts();
    const selectionsData = await getUserSelections();

    console.log('Loaded gifts data:', giftsData.map(g => ({
      id: g.id,
      title: g.title,
      showInSelection: g.showInSelection,
      showInLuckGame: g.showInLuckGame
    })));

    setContent(pageData);
    setGifts(giftsData);
    setSelections(selectionsData);
    setHasUnsavedChanges(false); // Clear unsaved changes flag after loading
    setLoading(false);
  };

  const handleLogin = () => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('Invalid password');
    }
  };

  // Helper to update content and mark as unsaved
  const updateContentField = (updates: Partial<PageContent>) => {
    if (!content) return;
    setContent({ ...content, ...updates });
    setHasUnsavedChanges(true);
  };

  const handleSaveContent = async () => {
    if (!content) return;
    setLoading(true);
    try {
      await updatePageContent(content);
      setHasUnsavedChanges(false); // Clear unsaved changes flag after successful save
      setMessage('Content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving content');
    }
    setLoading(false);
  };

  const handleFileUpload = async (file: File, field: keyof PageContent) => {
    setLoading(true);
    try {
      const url = await uploadFile(file, `media/${Date.now()}_${file.name}`);
      if (content) {
        const updated = { ...content, [field]: url };
        setContent(updated);
        await updatePageContent({ [field]: url });
        setMessage('File uploaded successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage(`Error uploading file: ${error.message || 'Unknown error'}`);
      setTimeout(() => setMessage(''), 5000);
    }
    setLoading(false);
  };

  const handleSaveGift = async () => {
    if (!editingGift) return;
    setLoading(true);
    try {
      if (editingGift.id && editingGift.id.startsWith('gift-new-')) {
        // New gift - use POST
        const { id, ...giftWithoutId } = editingGift;
        await addGift(giftWithoutId);
      } else {
        // Existing gift - use PUT
        await updateGift(editingGift.id, editingGift);
      }
      await loadData();
      setEditingGift(null);
      setMessage('Gift saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving gift');
    }
    setLoading(false);
  };

  const handleDeleteGift = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this gift from ALL pages?')) return;
    setLoading(true);
    try {
      await deleteGift(id);
      await loadData();
      setMessage('Gift deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting gift');
    }
    setLoading(false);
  };

  const handleRemoveFromSelection = async (gift: Gift) => {
    if (!confirm('Remove this gift from Selection page (Page 5)?')) return;
    setLoading(true);
    try {
      // If gift is only on selection page, delete it entirely
      if (gift.showInLuckGame === false) {
        await deleteGift(gift.id);
        setMessage('Gift deleted completely!');
      } else {
        // Otherwise just hide from selection page - only update the visibility flag
        await updateGift(gift.id, { showInSelection: false });
        setMessage('Gift removed from Selection page!');
      }
      await loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error removing gift');
    }
    setLoading(false);
  };

  const handleRemoveFromLuckGame = async (gift: Gift) => {
    if (!confirm('Remove this gift from Luck Game page (Page 6)?')) return;
    setLoading(true);
    try {
      // If gift is only on luck game page, delete it entirely
      if (gift.showInSelection === false) {
        await deleteGift(gift.id);
        setMessage('Gift deleted completely!');
      } else {
        // Otherwise just hide from luck game page - only update the visibility flag
        await updateGift(gift.id, { showInLuckGame: false });
        setMessage('Gift removed from Luck Game page!');
      }
      await loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error removing gift');
    }
    setLoading(false);
  };

  const handleDeleteSelection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this selection?')) return;
    setLoading(true);
    try {
      await deleteUserSelection(id);
      await loadData();
      setMessage('Selection deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting selection');
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="glass-effect rounded-2xl p-8 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h1 className="text-3xl font-bold text-romantic-700 mb-6 text-center">
            Admin Login 🔐
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Login
          </button>
          {message && <p className="text-red-500 text-center mt-4">{message}</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-romantic-700 mb-8">Admin Panel 🎛️</h1>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-100 border-2 border-green-500 text-green-700 px-6 py-3 rounded-lg mb-6"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {(['content', 'gifts', 'analytics'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                  : 'bg-white/50 text-romantic-700 hover:bg-white/70'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-romantic-700 mb-4">Page Content</h2>

            {loading && (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4" />
                <p className="text-romantic-600">Loading content...</p>
              </div>
            )}

            {!loading && !content && (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">Failed to load content. Please refresh the page.</p>
                <button
                  onClick={loadData}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && content && (
              <>


            {/* Page 1 - Intro */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-romantic-600">Page 1 - Intro</h3>
              <input
                type="text"
                value={content.introText1}
                onChange={(e) => setContent({ ...content, introText1: e.target.value })}
                placeholder="Intro Text 1"
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <input
                type="text"
                value={content.introText2}
                onChange={(e) => setContent({ ...content, introText2: e.target.value })}
                placeholder="Intro Text 2"
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <input
                type="text"
                value={content.introText3}
                onChange={(e) => setContent({ ...content, introText3: e.target.value })}
                placeholder="Intro Text 3"
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <input
                type="text"
                value={content.readyText}
                onChange={(e) => setContent({ ...content, readyText: e.target.value })}
                placeholder="Ready Text"
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <input
                type="text"
                value={content.readyButtonText}
                onChange={(e) => setContent({ ...content, readyButtonText: e.target.value })}
                placeholder="Ready Button Text"
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
            </div>

            {/* Page 2 - Cake */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-romantic-600">Page 2 - Cake</h3>
              <input
                type="text"
                value={content.cakeInstruction}
                onChange={(e) => setContent({ ...content, cakeInstruction: e.target.value })}
                placeholder="Cake Instruction"
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <div>
                <label className="block text-sm font-semibold text-romantic-700 mb-2">
                  Cake Image {content.cakeImageUrl && '✓'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'cakeImageUrl')}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-romantic-700 mb-2">
                  Birthday Song {content.birthdaySongUrl && '✓'}
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'birthdaySongUrl')}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-romantic-700 mb-2">
                  Clap Sound {content.clapSoundUrl && '✓'}
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'clapSoundUrl')}
                  className="w-full"
                />
              </div>
            </div>

            {/* Page 3 - Wishes */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-romantic-600">Page 3 - Wishes</h3>
              <input
                type="text"
                value={content.wishesTitle}
                onChange={(e) => setContent({ ...content, wishesTitle: e.target.value })}
                placeholder="Wishes Title"
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <textarea
                value={content.wishesMessage}
                onChange={(e) => setContent({ ...content, wishesMessage: e.target.value })}
                placeholder="Wishes Message"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <input
                type="text"
                value={content.wishesButtonText}
                onChange={(e) => setContent({ ...content, wishesButtonText: e.target.value })}
                placeholder="Button Text"
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
            </div>

            {/* Page 4 - Promises */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-romantic-600">Page 4 - Promises</h3>
              <input
                type="text"
                value={content.promisesTitle}
                onChange={(e) => setContent({ ...content, promisesTitle: e.target.value })}
                placeholder="Promises Title"
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <textarea
                value={content.promise1}
                onChange={(e) => setContent({ ...content, promise1: e.target.value })}
                placeholder="Promise 1"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <textarea
                value={content.promise2}
                onChange={(e) => setContent({ ...content, promise2: e.target.value })}
                placeholder="Promise 2"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <textarea
                value={content.promise3}
                onChange={(e) => setContent({ ...content, promise3: e.target.value })}
                placeholder="Promise 3"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
            </div>

            {/* Page 5 & 6 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-romantic-600">Page 5 & 6</h3>
              <input
                type="text"
                value={content.giftsTitle}
                onChange={(e) => setContent({ ...content, giftsTitle: e.target.value })}
                placeholder="Gifts Title"
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <input
                type="text"
                value={content.luckTitle}
                onChange={(e) => setContent({ ...content, luckTitle: e.target.value })}
                placeholder="Luck Title"
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
              <textarea
                value={content.finalMessage}
                onChange={(e) => setContent({ ...content, finalMessage: e.target.value })}
                placeholder="Final Message"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
              />
            </div>

            {/* Special Song Section */}
            <div className="space-y-4 p-6 bg-purple-50 rounded-xl border-2 border-purple-300">
              <h3 className="text-xl font-bold text-purple-700 mb-2">🎵 Special Song with Synced Lyrics</h3>
              <div className="bg-amber-100 border-l-4 border-amber-500 p-3 mb-4">
                <p className="text-sm font-semibold text-amber-800">⚠️ Important:</p>
                <p className="text-xs text-amber-700 mt-1">The song will ONLY appear if you add synced lyrics with timestamps below. This is mandatory - there's no optional listening mode.</p>
              </div>
              <input
                type="text"
                value={content.songTitle || ''}
                onChange={(e) => updateContentField({ songTitle: e.target.value })}
                placeholder="Song Title (e.g., Perfect by Ed Sheeran)"
                className="w-full px-4 py-2 rounded-lg border-2 border-purple-300 focus:border-purple-500 outline-none"
              />
              <textarea
                value={content.songLyrics || ''}
                onChange={(e) => updateContentField({ songLyrics: e.target.value })}
                placeholder="Song Lyrics (a few meaningful lines)"
                rows={6}
                className="w-full px-4 py-2 rounded-lg border-2 border-purple-300 focus:border-purple-500 outline-none"
              />
              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-2">
                  Song Audio File (Required) {content.songUrl && '✓'}
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'songUrl')}
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Upload your MP3 or audio file here. You can also use a YouTube link.
                </p>
                {content.songUrl && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Audio file uploaded: {content.songUrl.split('/').pop()}
                  </p>
                )}
              </div>

              <div className="bg-purple-100 rounded-lg p-4 border-2 border-purple-400">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-purple-700">🎬 Synced Lyrics</h4>
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">REQUIRED</span>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Add timestamps for animated lyrics! Format: <code className="bg-white px-1 rounded">time: lyric</code>
                </p>
                <p className="text-xs text-gray-600 mb-3">
                  Example:<br/>
                  <code className="bg-white px-2 py-1 rounded block mt-1">
                    0: I found a love<br/>
                    3.5: For me<br/>
                    7: Darling just dive right in
                  </code>
                </p>
                <textarea
                  value={
                    content.syncedLyrics && content.syncedLyrics.length > 0
                      ? content.syncedLyrics.map(l => `${l.time}: ${l.text}`).join('\n')
                      : ''
                  }
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(l => l.trim());
                    const parsed = lines
                      .map(line => {
                        const match = line.match(/^([\d.]+):\s*(.+)$/);
                        if (match) {
                          return { time: parseFloat(match[1]), text: match[2].trim() };
                        }
                        return null;
                      })
                      .filter(l => l !== null) as Array<{ time: number; text: string }>;
                    updateContentField({ syncedLyrics: parsed });
                  }}
                  placeholder="0: First line&#10;3.5: Second line&#10;7: Third line"
                  rows={8}
                  className="w-full px-4 py-2 rounded-lg border-2 border-purple-300 focus:border-purple-500 outline-none font-mono text-sm"
                />
              </div>
            </div>

            {hasUnsavedChanges && (
              <div className="bg-orange-100 border-2 border-orange-500 text-orange-800 px-6 py-4 rounded-lg mb-4 animate-pulse">
                <p className="font-bold">⚠️ You have unsaved changes!</p>
                <p className="text-sm mt-1">Click "Save All Content" below to save your changes, or they will be lost if you refresh or leave this page.</p>
              </div>
            )}

            <button
              onClick={handleSaveContent}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 ${
                hasUnsavedChanges
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
              }`}
            >
              <FiSave /> {hasUnsavedChanges ? 'Save All Content (Unsaved Changes)' : 'Save All Content'}
            </button>
              </>
            )}
          </div>
        )}

        {/* Gifts Tab */}
        {activeTab === 'gifts' && (
          <div className="space-y-8">
            {/* Section 1: Selection Gifts (Page 5) */}
            <div className="space-y-4 bg-pink-50/50 rounded-2xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-romantic-700 flex items-center gap-2">
                    💝 Selection Gifts (Page 5)
                  </h2>
                  <p className="text-sm text-romantic-600 mt-1">
                    Gifts that appear on the &quot;Choose Your Gift&quot; page
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingGift({
                      id: `gift-new-${Date.now()}`,
                      title: '',
                      description: '',
                      images: [],
                      enabled: true,
                      order: gifts.length,
                      showInSelection: true,  // Default to showing on selection page
                      showInLuckGame: false,
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all shadow-md"
                >
                  <FiPlus /> Add Selection Gift
                </button>
              </div>

              {/* Selection Gift List */}
              <div className="grid md:grid-cols-2 gap-4">
                {gifts.filter(g => g.showInSelection !== false).length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-romantic-600">
                    No selection gifts yet. Click &quot;Add Selection Gift&quot; to create one.
                  </div>
                ) : (
                  gifts.filter(g => g.showInSelection !== false).map((gift) => (
                    <div key={gift.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-romantic-700">{gift.title}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingGift(gift)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            title="Edit Gift"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleRemoveFromSelection(gift)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            title="Remove from Selection Page"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-romantic-600 mb-2">{gift.description}</p>
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className={`px-2 py-1 rounded text-xs ${gift.enabled ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                          {gift.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <span className="text-xs text-romantic-600">Order: {gift.order}</span>
                        {gift.isCustomText && <span className="px-2 py-1 bg-purple-200 text-purple-700 rounded text-xs">Custom Text</span>}
                        {gift.showInLuckGame && <span className="px-2 py-1 bg-indigo-200 text-indigo-700 rounded text-xs">Also in Luck Game</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section 2: Luck Game Gifts (Page 6) */}
            <div className="space-y-4 bg-purple-50/50 rounded-2xl p-6 border-t-4 border-purple-300">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-romantic-700 flex items-center gap-2">
                    🍀 Luck Game Gifts (Page 6)
                  </h2>
                  <p className="text-sm text-romantic-600 mt-1">
                    Hidden gifts for the shuffle game
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingGift({
                      id: `gift-new-${Date.now()}`,
                      title: '',
                      description: '',
                      images: [],
                      enabled: true,
                      order: gifts.length,
                      showInSelection: false,
                      showInLuckGame: true,  // Default to showing on luck game
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all shadow-md"
                >
                  <FiPlus /> Add Luck Game Gift
                </button>
              </div>

              {/* Luck Game Gift List */}
              <div className="grid md:grid-cols-2 gap-4">
                {gifts.filter(g => g.showInLuckGame !== false).length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-romantic-600">
                    No luck game gifts yet. Click &quot;Add Luck Game Gift&quot; to create one.
                  </div>
                ) : (
                  gifts.filter(g => g.showInLuckGame !== false).map((gift) => (
                    <div key={gift.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-romantic-700">{gift.title}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingGift(gift)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            title="Edit Gift"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleRemoveFromLuckGame(gift)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            title="Remove from Luck Game Page"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-romantic-600 mb-2">{gift.description}</p>
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className={`px-2 py-1 rounded text-xs ${gift.enabled ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                          {gift.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <span className="text-xs text-romantic-600">Order: {gift.order}</span>
                        {gift.isCustomText && <span className="px-2 py-1 bg-purple-200 text-purple-700 rounded text-xs">Custom Text</span>}
                        {gift.showInSelection && <span className="px-2 py-1 bg-pink-200 text-pink-700 rounded text-xs">Also in Selection</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Edit Gift Modal */}
            <AnimatePresence>
              {editingGift && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                  onClick={() => setEditingGift(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  >
                    <h3 className="text-2xl font-bold text-romantic-700 mb-4">
                      {editingGift.id.startsWith('gift-new') ? 'Add Gift' : 'Edit Gift'}
                    </h3>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingGift.title}
                        onChange={(e) => setEditingGift({ ...editingGift, title: e.target.value })}
                        placeholder="Gift Title"
                        className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
                      />
                      <textarea
                        value={editingGift.description}
                        onChange={(e) => setEditingGift({ ...editingGift, description: e.target.value })}
                        placeholder="Gift Description"
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
                      />

                      {/* Gift Images */}
                      <div>
                        <label className="block text-sm font-semibold text-romantic-700 mb-2">
                          Gift Images {editingGift.images?.length > 0 && `(${editingGift.images.length})`}
                        </label>

                        {/* Current Images */}
                        {editingGift.images && editingGift.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            {editingGift.images.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url}
                                  alt={`Gift ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => {
                                    const newImages = editingGift.images.filter((_, i) => i !== index);
                                    setEditingGift({ ...editingGift, images: newImages });
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Upload New Image */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setLoading(true);
                              try {
                                const url = await uploadFile(file, `gifts/${Date.now()}_${file.name}`);
                                const newImages = [...(editingGift.images || []), url];
                                setEditingGift({ ...editingGift, images: newImages });
                                setMessage('Image uploaded successfully!');
                                setTimeout(() => setMessage(''), 3000);
                              } catch (error) {
                                setMessage('Error uploading image');
                              }
                              setLoading(false);
                              e.target.value = '';
                            }
                          }}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">You can upload multiple images</p>
                      </div>

                      <input
                        type="number"
                        value={editingGift.order}
                        onChange={(e) => setEditingGift({ ...editingGift, order: parseInt(e.target.value) })}
                        placeholder="Order"
                        className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingGift.enabled}
                          onChange={(e) => setEditingGift({ ...editingGift, enabled: e.target.checked })}
                          className="w-5 h-5"
                        />
                        <span className="text-romantic-700">Enabled</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingGift.isCustomText || false}
                          onChange={(e) => setEditingGift({ ...editingGift, isCustomText: e.target.checked })}
                          className="w-5 h-5"
                        />
                        <span className="text-romantic-700">Custom Text Gift (6th gift)</span>
                      </label>
                      {editingGift.isCustomText && (
                        <textarea
                          value={editingGift.customText || ''}
                          onChange={(e) => setEditingGift({ ...editingGift, customText: e.target.value })}
                          placeholder="Custom Text"
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg border-2 border-romantic-300 focus:border-romantic-500 outline-none"
                        />
                      )}

                      <div className="border-t-2 border-romantic-200 pt-4">
                        <p className="text-sm font-semibold text-romantic-700 mb-3">Where should this gift appear?</p>
                        <label className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={editingGift.showInSelection !== false}
                            onChange={(e) => setEditingGift({ ...editingGift, showInSelection: e.target.checked })}
                            className="w-5 h-5"
                          />
                          <span className="text-romantic-700">Show in Gift Selection (Page 5)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingGift.showInLuckGame !== false}
                            onChange={(e) => setEditingGift({ ...editingGift, showInLuckGame: e.target.checked })}
                            className="w-5 h-5"
                          />
                          <span className="text-romantic-700">Show in Luck Game (Page 6)</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={handleSaveGift}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        Save Gift
                      </button>
                      <button
                        onClick={() => setEditingGift(null)}
                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-romantic-700 mb-6">User Analytics 📊</h2>

            {selections.length === 0 ? (
              <p className="text-romantic-600 text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-4">
                {selections.map((selection) => {
                  const selectedGift = gifts.find(g => g.id === selection.selectedGiftId);
                  const openedGifts = gifts.filter(g => selection.openedGiftIds?.includes(g.id));
                  const isFinalSelection = selection.openedGiftIds && selection.openedGiftIds.length > 0;
                  const isCustomWish = selection.selectedGiftId === 'custom';

                  return (
                    <div key={selection.id} className={`bg-white rounded-xl p-4 border-2 ${isFinalSelection ? 'border-green-300 bg-green-50/30' : 'border-romantic-200'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              isFinalSelection
                                ? 'bg-green-500 text-white'
                                : 'bg-purple-500 text-white'
                            }`}>
                              {isFinalSelection ? '🎁 Final Choice' : '💭 Initial Selection'}
                            </span>
                            <p className="text-xs text-gray-500">
                              {new Date(selection.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => selection.id && handleDeleteSelection(selection.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {isCustomWish ? (
                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                            <p className="text-xs font-semibold text-purple-600 mb-1">Custom Wish</p>
                            <p className="text-romantic-700 italic">
                              "{selection.customText || 'N/A'}"
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-romantic-700">
                              <strong>Gift:</strong> {selectedGift?.title || selection.selectedGiftId || 'Unknown'}
                            </p>
                            {selection.customText && !isFinalSelection && (
                              <div className="mt-2 bg-purple-50 rounded-lg p-3 border border-purple-200">
                                <p className="text-xs font-semibold text-purple-600 mb-1">With Custom Wish</p>
                                <p className="text-romantic-700 italic">
                                  "{selection.customText}"
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
