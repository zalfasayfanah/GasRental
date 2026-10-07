import { Motor } from '../../types';
import { formatRupiah } from '../../lib/utils';
import { Bike, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

interface MotorCardProps {
  motor: Motor;
  onEdit: (motor: Motor) => void;
  onDelete: (motor: Motor) => void;
}

export const MotorCard = ({ motor, onEdit, onDelete }: MotorCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Icon + Title + Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                motor.tersedia
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {motor.merek_tipe}
              </h3>
              <div className="inline-block mt-1 font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                {motor.plat_nomor}
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              motor.tersedia
                ? 'bg-emerald-100/80 text-emerald-800'
                : 'bg-amber-100/80 text-amber-800'
            }`}
          >
            {motor.tersedia ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                Tersedia
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" />
                Disewa
              </>
            )}
          </span>
        </div>

        {/* Pricing Info */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 my-3">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Harga Sewa
          </div>
          <div className="text-base font-extrabold text-emerald-700 mt-0.5">
            {formatRupiah(motor.harga_per_hari)}
            <span className="text-xs font-normal text-slate-500"> / hari</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => onEdit(motor)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors active:scale-95"
        >
          <Edit2 className="w-3.5 h-3.5 text-slate-500" />
          Ubah
        </button>

        <button
          onClick={() => onDelete(motor)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus
        </button>
      </div>
    </div>
  );
};
