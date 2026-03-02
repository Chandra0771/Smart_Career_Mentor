import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Target, Sparkles, Download, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ScoreRing = ({ score, label, color }) => {
  const circumference = 2 * Math.PI * 36;
  const strokeDash = (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 80 80" className="transform -rotate-90 w-full h-full">
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
          <motion.circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-xs text-white/50 text-center">{label}</span>
    </div>
  );
};

const ResumePage = () => {
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Please upload a PDF file'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return; }

    setUploadedFile(file);
    setUploading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(data.analysis);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <FileText size={24} className="text-purple-400" /> AI Resume Analyzer
        </h1>
        <p className="text-white/50">Upload your resume for instant AI-powered feedback and optimization tips</p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div {...getRootProps()} className={`glass-card p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-purple-500/80 bg-purple-500/10' : 'hover:border-white/30 hover:bg-white/5'
        } ${uploading ? 'pointer-events-none' : ''}`}>
          <input {...getInputProps()} />
          <AnimatePresence mode="wait">
            {uploading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                <Loader2 size={40} className="text-purple-400 animate-spin" />
                <p className="text-white/70 font-medium">Analyzing with AI...</p>
                <p className="text-white/40 text-sm">This may take a moment</p>
              </motion.div>
            ) : (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragActive ? 'bg-purple-500/30' : 'bg-white/10'}`}>
                  <Upload size={28} className={isDragActive ? 'text-purple-400' : 'text-white/50'} />
                </div>
                {uploadedFile ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={18} /> <span className="font-medium">{uploadedFile.name}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-white font-medium">{isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}</p>
                    <p className="text-white/40 text-sm">or <span className="text-purple-400 underline">click to browse</span></p>
                    <p className="text-white/25 text-xs">PDF files only, max 10MB</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Score Cards */}
            <div className="glass-card p-7">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-purple-400" /> Resume Scores
              </h2>
              <div className="grid grid-cols-3 gap-8 justify-items-center">
                <ScoreRing score={analysis.overallScore} label="Overall Score" color="#8b5cf6" />
                <ScoreRing score={analysis.atsScore} label="ATS Score" color="#3b82f6" />
                <ScoreRing score={analysis.impactScore} label="Impact Score" color="#ec4899" />
              </div>
              <div className="mt-6 p-4 rounded-xl bg-white/5">
                <p className="text-white/70 text-sm leading-relaxed">{analysis.summary}</p>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="glass-card p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-400" /> Strengths
                </h3>
                <ul className="space-y-3">
                  {analysis.strengths?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-400" /> Improvements
                </h3>
                <ul className="space-y-3">
                  {analysis.improvements?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <AlertCircle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Keywords & Next Steps */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="glass-card p-6">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Target size={18} className="text-blue-400" /> ATS Keyword Analysis
                </h3>
                <p className="text-white/60 text-sm">{analysis.keywordOptimization}</p>
                {analysis.recommendedSkills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysis.recommendedSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="glass-card p-6">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-400" /> Next Steps
                </h3>
                <ul className="space-y-2">
                  {analysis.nextSteps?.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i+1}</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button onClick={() => { setAnalysis(null); setUploadedFile(null); }}
              className="gradient-btn px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Upload size={16} /> Analyze Another Resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumePage;
