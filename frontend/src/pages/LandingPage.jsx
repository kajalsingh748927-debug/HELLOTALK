import { Link } from 'react-router-dom';
import { Radio, Zap, Globe, Users, ArrowRight, Mic, Video } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-void text-white font-body overflow-hidden">
      {/* ── Ambient background blobs ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full
          bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full
          bg-cyan-500/4 blur-[100px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30
            bg-cyan-500/5 text-cyan-400 text-xs font-mono mb-8 animate-slide-up">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            LIVE — Random Video & Audio Matching
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-5xl sm:text-7xl leading-[1.05] tracking-tight mb-6">
            Talk to
            <span className="block relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
                Strangers.
              </span>
              <span className="block text-2xl sm:text-3xl font-light text-subtle mt-2 tracking-normal">
                Learn languages. Make connections.
              </span>
            </span>
          </h1>

          <p className="text-subtle text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            OpenTalk matches you with a random language learner anywhere in the world.
            One click — instant video and audio call. No setup. No filters.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="btn-primary text-base px-8 py-4 group">
              Start Talking Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-ghost text-base px-8 py-4">
              I have an account
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 justify-center mt-16 text-sm text-muted">
            {[
              { label: 'Languages supported', value: '50+' },
              { label: 'Avg match time', value: '< 5s' },
              { label: 'Active learners', value: '10K+' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="font-display font-bold text-2xl text-white">{value}</span>
                <span className="text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Three steps. That's it.
            </h2>
            <p className="text-muted">No complicated setup. Just click and talk.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: <Users className="w-6 h-6" />,
                title: 'Create Your Account',
                desc: 'Sign up with your email. Tell us what language you speak and what you want to learn.',
              },
              {
                step: '02',
                icon: <Zap className="w-6 h-6" />,
                title: 'Hit Match',
                desc: 'Press the big button. Our engine instantly finds you a random partner who wants to talk.',
              },
              {
                step: '03',
                icon: <Video className="w-6 h-6" />,
                title: 'Talk & Learn',
                desc: 'Your camera and mic go live automatically. Real conversation, real learning.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="glass rounded-2xl p-6 relative overflow-hidden group
                hover:border-cyan-500/30 transition-all duration-300">
                <div className="absolute top-4 right-4 font-mono text-border text-lg font-bold">
                  {step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20
                  flex items-center justify-center text-cyan-400 mb-4
                  group-hover:bg-cyan-500/15 group-hover:border-cyan-500/40 transition-all duration-300">
                  {icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl mb-6">
                Powered by LiveKit for
                <span className="text-cyan-400"> zero-latency</span> calls
              </h2>
              <p className="text-subtle leading-relaxed mb-8">
                We use LiveKit's WebRTC infrastructure to deliver crystal-clear video and audio
                with sub-100ms latency. No plugins, no downloads — runs directly in your browser.
              </p>
              <div className="space-y-3">
                {[
                  { icon: <Video className="w-4 h-4" />, text: 'HD video calling with automatic quality adjustment' },
                  { icon: <Mic className="w-4 h-4" />, text: 'Noise-cancellation and echo suppression built-in' },
                  { icon: <Globe className="w-4 h-4" />, text: 'Global relay network for worldwide connections' },
                  { icon: <Radio className="w-4 h-4" />, text: 'End-to-end encrypted — your calls are private' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-subtle">
                    <span className="text-cyan-400">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Mock video call UI */}
            <div className="relative">
              <div className="glass rounded-3xl p-4 shadow-glass">
                {/* Main video */}
                <div className="aspect-video rounded-2xl bg-deep border border-border/50 flex items-center justify-center
                  relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent" />
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30
                      flex items-center justify-center mx-auto mb-2">
                      <span className="font-display font-bold text-xl text-cyan-400">M</span>
                    </div>
                    <span className="text-muted text-xs font-mono">Partner's camera</span>
                  </div>
                  {/* Self view pip */}
                  <div className="absolute bottom-3 right-3 w-24 h-16 rounded-xl bg-surface
                    border border-border flex items-center justify-center">
                    <span className="text-muted text-[10px] font-mono">You</span>
                  </div>
                </div>
                {/* Controls bar */}
                <div className="flex justify-center gap-3 mt-4">
                  {[
                    { label: 'Cam', active: true },
                    { label: 'Mic', active: true },
                    { label: 'End', danger: true },
                  ].map(({ label, active, danger }) => (
                    <div key={label}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-mono
                        border cursor-pointer transition-all
                        ${danger
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : active
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                          : 'bg-surface border-border text-muted'
                        }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-cyan-500/5 blur-xl -z-10 scale-95" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 relative z-10">
              Ready for your first random call?
            </h2>
            <p className="text-muted mb-8 relative z-10">Join thousands of learners talking every day.</p>
            <Link to="/register" className="btn-primary text-base px-8 py-4 relative z-10 group">
              Create Free Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/30 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-muted text-sm">
            <Radio className="w-4 h-4 text-cyan-500/50" />
            <span className="font-display font-semibold text-white/60">OpenTalk</span>
            <span>— Connecting language learners worldwide</span>
          </div>
          <span className="text-muted text-xs font-mono">Built with LiveKit + React</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
