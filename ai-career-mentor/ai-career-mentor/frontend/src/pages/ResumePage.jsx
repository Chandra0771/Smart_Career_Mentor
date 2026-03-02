import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, CheckCircle, AlertCircle, TrendingUp,
  Zap, Tag, Lightbulb, Star, BarChart2, ChevronDown, ChevronUp
} from 'lucide-react';
import { resumeAPI } from '../services/api';
import Navbar from '../components/ui/Navbar';
import toast from 'react-hot-toast';

const ScoreRing = ({ score, label, color }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
          <motion.circle
            cx="44" cy="44" r={r}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - progress }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-display font-bold text-xl">{score}</span>
        </div>
      </div>
      <span className="text-white/50 text-xs">{label}</span>
    </div>
  );
};

export default function ResumePage() {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [expandedSections, setExpandedSections] = useState({ strengths: true, improvements: true });

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const { data } = await resumeAPI.getAll();
      setResumes(data.resumes || []);
      if (data.resumes?.length > 0 && !selected) {
        setSelected(data.resumes[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onDrop = useCallback(async (files) => {
    if (!files[0]) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', files[0]);
      toast.loading('Analyzing your resume with AI...', { id: 'upload' });

      const { data } = await resumeAPI.upload(formData);
      toast.success('Resume analyzed successfully!', { id: 'upload' });

      setResumes(prev => [data.resume, ...prev]);
      setSelected(data.resume);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed.', { id: 'upload' });
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: uploading
  });

  const toggle = (section) => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

  const scoreColor = (score) => {
    if (score >= 80) return '#34d399';
    if (score >= 60) return '#fbbf24';
    return '#f87171';
  };

  return (
    <div className="min-h-screen bg-mesh text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            <span className="gradient-text">Resume</span> Review
          </h1>
          <p className="text-white/50">Upload your resume for instant AI analysis, ATS scoring, and improvement tips.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload + History */}
          <div className="lg:col-span-1 space-y-5">
            {/* Dropzone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                {...getRootProps()}
                className={`glass-card p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-violet-500/60 bg-violet-500/10'
                    : 'hover:border-white/30 hover:bg-white/10'
                } ${uploading ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center">
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
                  ) : (
                    <Upload size={22} className="text-violet-400" />
                  )}
                </div>
                <p className="text-white font-semibold mb-1">
                  {uploading ? 'Analyzing...' : isDragActive ? 'Drop your PDF' : 'Upload Resume'}
                </p>
                <p className="text-white/40 text-xs">PDF files only · Max 5MB</p>
              </div>
            </motion.div>

            {/* Past Resumes */}
            {resumes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-4"
              >
                <h3 className="text-white/70 text-sm font-semibold mb-3">Previous Resumes</h3>
                <div className="space-y-2">
                  {resumes.map((r) => (
                    <button
                      key={r._id}
                      onClick={() => setSelected(r)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-center gap-3 ${
                        selected?._id === r._id
                          ? 'bg-violet-500/20 border border-violet-500/30'
                          : 'hover:bg-white/7'
                      }`}
                    >
                      <FileText size={14} className="text-violet-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white/80 text-xs font-medium truncate">{r.fileName}</p>
                        <p className="text-white/35 text-xs">{new Date(r.uploadedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="ml-auto text-xs font-bold" style={{ color: scoreColor(r.aiReview?.score) }}>
                        {r.aiReview?.score}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Analysis Panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <motion.div
                key={selected._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                {/* Scores */}
                <div className="glass-card p-6">
                  <h3 className="text-white font-display font-semibold mb-6 flex items-center gap-2">
                    <BarChart2 size={18} className="text-violet-400" />
                    Resume Scores
                  </h3>
                  <div className="flex items-center justify-around">
                    <ScoreRing score={selected.aiReview?.score || 0} label="Overall Score" color={scoreColor(selected.aiReview?.score)} />
                    <ScoreRing score={selected.aiReview?.atsScore || 0} label="ATS Score" color={scoreColor(selected.aiReview?.atsScore)} />
                  </div>

                  {selected.aiReview?.summary && (
                    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-white/65 text-sm leading-relaxed">{selected.aiReview.summary}</p>
                    </div>
                  )}
                </div>

                {/* Strengths */}
                <div className="glass-card overflow-hidden">
                  <button
                    onClick={() => toggle('strengths')}
                    className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle size={16} />
                      <span className="font-semibold text-sm">Strengths</span>
                      <span className="text-emerald-400/50 text-xs">({selected.aiReview?.strengths?.length})</span>
                    </div>
                    {expandedSections.strengths ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                  </button>
                  <AnimatePresence>
                    {expandedSections.strengths && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-2">
                          {selected.aiReview?.strengths?.map((s, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <Star size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                              <p className="text-white/65 text-sm">{s}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Improvements */}
                <div className="glass-card overflow-hidden">
                  <button
                    onClick={() => toggle('improvements')}
                    className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-2 text-amber-400">
                      <Lightbulb size={16} />
                      <span className="font-semibold text-sm">Improvements</span>
                      <span className="text-amber-400/50 text-xs">({selected.aiReview?.improvements?.length})</span>
                    </div>
                    {expandedSections.improvements ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                  </button>
                  <AnimatePresence>
                    {expandedSections.improvements && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-2">
                          {selected.aiReview?.improvements?.map((imp, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <AlertCircle size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
                              <p className="text-white/65 text-sm">{imp}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Keywords */}
                {selected.aiReview?.keywords?.length > 0 && (
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 text-blue-400 mb-4">
                      <Tag size={16} />
                      <span className="font-semibold text-sm">Key Skills Found</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selected.aiReview.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/25"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {selected.aiReview?.suggestions?.length > 0 && (
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 text-violet-400 mb-4">
                      <Zap size={16} />
                      <span className="font-semibold text-sm">Action Items</span>
                    </div>
                    <div className="space-y-2">
                      {selected.aiReview.suggestions.map((s, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-white/65 text-sm">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass-card p-16 text-center flex flex-col items-center justify-center h-full">
                <FileText size={48} className="text-white/15 mb-4" />
                <p className="text-white/40 text-base font-medium mb-2">No resume uploaded yet</p>
                <p className="text-white/25 text-sm">Upload a PDF to get instant AI feedback</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
