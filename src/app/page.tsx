import Link from "next/link";
import { Briefcase, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">HireA</h1>
          </div>
          <p className="text-sm text-slate-600">Hiring Management Platform</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
            ⚠️ Prototype Mode - No Authentication
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 text-balance">
            Streamline Your Hiring Process
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-balance">
            Manage job openings, track candidates, and build your dream team all
            in one place.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Card */}
          <Link href="/admin/jobs">
            <div className="group h-full bg-white rounded-2xl border border-slate-200 p-8 hover:border-teal-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                  <Briefcase className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                For Recruiters
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Post job openings, review applications, and manage your hiring
                pipeline with powerful tools designed for recruitment teams.
              </p>
              <div className="flex items-center gap-2 text-teal-600 font-medium group-hover:gap-3 transition-all">
                <span>Go to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Candidate Card */}
          <Link href="/jobs">
            <div className="group h-full bg-white rounded-2xl border border-slate-200 p-8 hover:border-teal-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                  <Users className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                For Job Seekers
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Browse available positions, apply to jobs that match your
                skills, and track your applications in real-time.
              </p>
              <div className="flex items-center gap-2 text-teal-600 font-medium group-hover:gap-3 transition-all">
                <span>Browse Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 pt-20 border-t border-slate-200">
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Why Choose HireA?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⚡</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Fast & Efficient
              </h4>
              <p className="text-slate-600">
                Streamline your hiring workflow and reduce time-to-hire.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🎯</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Easy to Use</h4>
              <p className="text-slate-600">
                Intuitive interface designed for both recruiters and candidates.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📊</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Insightful Analytics
              </h4>
              <p className="text-slate-600">
                Track metrics and optimize your recruitment strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-600 text-sm">
          <p>© 2025 HireA Platform. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
