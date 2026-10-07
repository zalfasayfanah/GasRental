import React from 'react';
import { useGasRental } from '../../context/GasRentalContext';
import { Sparkles, RotateCcw, AlertCircle, Loader2, Inbox, CheckCircle2, Database } from 'lucide-react';

export const DevSimulatorBar: React.FC = () => {
  const { uiMode, setUiMode, resetMockData, seedSampleData, motors } = useGasRental();

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-1.5 px-3">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Firestore Live:</span>
        </div>

        <div className="flex items-center gap-1">
          {motors.length === 0 && uiMode === 'normal' && (
            <button
              onClick={seedSampleData}
              title="Isi database Firestore dengan data contoh awal"
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1 shadow-sm transition-colors mr-2"
            >
              <Database className="w-3 h-3" />
              Isi Data Contoh Firestore
            </button>
          )}

          <button
            onClick={() => setUiMode('normal')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              uiMode === 'normal'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Normal
          </button>

          <button
            onClick={() => setUiMode('loading')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              uiMode === 'loading'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            Loading
          </button>

          <button
            onClick={() => setUiMode('empty')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              uiMode === 'empty'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Inbox className="w-3 h-3" />
            Empty
          </button>

          <button
            onClick={() => setUiMode('error')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              uiMode === 'error'
                ? 'bg-rose-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            Error
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1"></div>

          <button
            onClick={resetMockData}
            title="Muat ulang data dari Cloud Firestore"
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};
