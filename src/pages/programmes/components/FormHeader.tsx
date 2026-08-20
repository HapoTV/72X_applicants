import type { Programme } from '../types';

interface FormHeaderProps {
  program: Programme;
}

const FormHeader: React.FC<FormHeaderProps> = ({ program }) => {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          Applications Open
        </span>
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
          Programme Application
        </span>
      </div>

      <h1 className="mt-5 text-3xl font-semibold text-slate-900">{program.title}</h1>
      <p className="mt-4 text-base leading-8 text-slate-600">
        Thank you for your interest in this programme. Please complete the application form below. Fields marked with * are required.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-500">Partner</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{program.partner}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-500">Duration</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{program.duration}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-500">Location</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{program.location}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-500">Closing Date</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{program.closingDate}</p>
        </div>
      </div>
    </section>
  );
};

export default FormHeader;
