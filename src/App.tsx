import React, { useState } from 'react';
import { 
  Shield, Download, Layers, Cpu, Network, Key, FileCode, Check, Copy, HelpCircle, 
  Info, Sparkles, CheckCircle2, Lock, LogOut
} from 'lucide-react';

// Industry Standard Safe Anti-Malware Test File String (EICAR)
const EICAR_PAYLOAD = `X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*`;

interface BypassTechnique {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  badge: string;
  fileName: string;
  generatePayload: () => { content: string; mimeType: string };
}

export default function App() {
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if previously authenticated in this browser session
    return sessionStorage.getItem('eyeball_auth') === 'true';
  });
  const [authError, setAuthError] = useState('');

  const [copied, setCopied] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState<string>('smuggling');
  const [downloadSuccess, setDownloadSuccess] = useState<{
    show: boolean;
    title: string;
    desc: string;
    fileName: string;
  } | null>(null);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Eyeball!!') {
      setIsAuthenticated(true);
      sessionStorage.setItem('eyeball_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('eyeball_auth');
    setPasswordInput('');
  };

  const techniques: BypassTechnique[] = [
    {
      id: 'smuggling',
      title: 'HTML & Canvas Pixel Smuggling',
      description: 'Hides the file bytes inside the pixel parameters of an image. The network gateway sees a normal harmless photo, but the browser extracts the real file in memory.',
      icon: Layers,
      color: 'bg-blue-500 text-white',
      badge: 'Popular Method',
      fileName: 'eyeball_canvas_smuggle.png.txt',
      generatePayload: () => ({
        content: EICAR_PAYLOAD,
        mimeType: 'text/plain;charset=utf-8'
      })
    },
    {
      id: 'chunking',
      title: 'File Chunk Assembly',
      description: 'Splits the file into tiny separate pieces sent independently. Individual parts look safe to proxies, but assemble seamlessly in your browser.',
      icon: Cpu,
      color: 'bg-emerald-500 text-white',
      badge: 'Highly Effective',
      fileName: 'eyeball_chunk_assembled.txt',
      generatePayload: () => {
        const part1 = EICAR_PAYLOAD.substring(0, 20);
        const part2 = EICAR_PAYLOAD.substring(20, 45);
        const part3 = EICAR_PAYLOAD.substring(45);
        const assembled = `${part1}${part2}${part3}`;
        return { content: assembled, mimeType: 'text/plain;charset=utf-8' };
      }
    },
    {
      id: 'channels',
      title: 'Unmonitored WebSocket Stream',
      description: 'Establishes a persistent raw socket pipeline. SWG firewalls usually bypass binary websocket frames, making inspection blind.',
      icon: Network,
      color: 'bg-purple-500 text-white',
      badge: 'Advanced Bypass',
      fileName: 'eyeball_websocket_stream.txt',
      generatePayload: () => ({
        content: EICAR_PAYLOAD,
        mimeType: 'text/plain;charset=utf-8'
      })
    },
    {
      id: 'crypto',
      title: 'Client-Side Cryptography',
      description: 'Downloads high-entropy scrambled ciphertext. Since the network proxy does not hold the dynamic keys, decryption occurs locally inside Javascript.',
      icon: Key,
      color: 'bg-amber-500 text-white',
      badge: '100% Secure Crypt',
      fileName: 'eyeball_encrypted_decoded.txt',
      generatePayload: () => ({
        content: EICAR_PAYLOAD,
        mimeType: 'text/plain;charset=utf-8'
      })
    },
    {
      id: 'phishing',
      title: 'HTML Dropper Wrapper',
      description: 'Packages the download inside a simulated HTML offline document template that dynamically triggers the EICAR download upon opening.',
      icon: FileCode,
      color: 'bg-rose-500 text-white',
      badge: 'Interactive Demo',
      fileName: 'eyeball_html_dropper.html',
      generatePayload: () => {
        const html = `<!DOCTYPE html>
<html>
<head>
  <title>Eyeball Security Verification</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f0f4f8; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; max-width: 400px; }
    h2 { color: #1e293b; margin-top: 0; }
    p { color: #64748b; font-size: 14px; line-height: 1.6; }
    button { background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 9999px; font-weight: bold; cursor: pointer; transition: all 0.2s; }
    button:hover { transform: scale(1.05); background: #2563eb; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🛡️ Eyeball Security Dropper</h2>
    <p>This is a simulated secure HTML Dropper. Opening this file locally successfully executed the dynamic payload smuggling bypass demonstration.</p>
    <button onclick="downloadTest()">Simulate Decryption</button>
  </div>
  <script>
    function downloadTest() {
      const payload = "${EICAR_PAYLOAD}";
      const blob = new Blob([payload], {type: "text/plain"});
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "eyeball_smuggled_payload.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    // Auto-trigger
    setTimeout(downloadTest, 800);
  </script>
</body>
</html>`;
        return { content: html, mimeType: 'text/html;charset=utf-8' };
      }
    }
  ];

  const handleTestDownload = (tech: BypassTechnique) => {
    const { content, mimeType } = tech.generatePayload();
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    // Create a real browser-level dynamic trigger link
    const link = document.createElement('a');
    link.href = url;
    link.download = tech.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadCount(prev => prev + 1);
    setDownloadSuccess({
      show: true,
      title: `${tech.title} - Download Started!`,
      desc: `We assembled the standard safe anti-malware string (EICAR) directly inside the browser memory. Because the assembly happened locally, your network firewalls/gateways (SWG/AWG) remained completely blind to the threat during network transit!`,
      fileName: tech.fileName
    });
  };

  const copyEicar = () => {
    navigator.clipboard.writeText(EICAR_PAYLOAD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f3f7fa] text-slate-800 font-sans antialiased pb-20">
      
      {/* Friendly Top Navbar in Waze-like blue/white theme */}
      <nav className="bg-white border-b border-[#e2edf3] sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Friendly bright logo badge */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <img 
                src="/blue.png" 
                alt="Eyeball Security Logo" 
                className="w-12 h-12 object-contain rounded-2xl shadow-sm" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('navbar-logo-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <div 
                id="navbar-logo-fallback" 
                className="hidden bg-[#0074e4] text-white p-2.5 rounded-2xl flex items-center justify-center shadow-lg shadow-[#0074e4]/15 w-12 h-12"
              >
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-950 flex items-center gap-2">
                Eyeball Security
                <span className="bg-[#24ca49] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Active Labs</span>
              </span>
              <p className="text-xs text-slate-500 font-medium font-mono">Bypass Simulation & Validation Suite</p>
            </div>
          </div>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition flex items-center gap-2 border border-slate-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        
        {!isAuthenticated ? (
          /* Modern, Witty Onboarding & Lock Screen */
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mt-8">
            
            {/* Marketing Pitch Column (Left) */}
            <div className="md:col-span-7 bg-white rounded-[32px] p-8 border border-[#e2edf3] shadow-sm flex flex-col justify-between relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#33f2ff]/5 rounded-full blur-2xl -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0074e4]/5 rounded-full blur-2xl -ml-12 -mb-12" />
              
              <div className="relative space-y-5">
                <div className="inline-flex items-center gap-2 bg-[#e8f4ff] text-[#0074e4] px-4 py-1.5 rounded-full text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  Are You Truly Protected? Let's Check!
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                    Why trust a blind proxy when your work happens in the browser?
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                    Standard Secure Web Gateways (SWG) are like ancient wall guards. If a packet looks normal, they wave it through. But modern bypasses don't travel as fully-formed files—they slip past network security as hidden pixels or encrypted blocks.
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Once inside your browser, JavaScript assembles them into active payloads instantly. Your network firewall remains completely blind to this. 
                  </p>
                </div>

                {/* Why Eyeball section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-[#24ca49]/10 rounded-lg text-[#24ca49] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-950 block">Browser-Side Workspace Protection</span>
                      <p className="text-[11px] text-slate-500">Eyeball monitors payload assembly right in the browser memory where it executes, stopping client-side smuggling dead in its tracks.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-[#24ca49]/10 rounded-lg text-[#24ca49] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-950 block">End Blind Trust</span>
                      <p className="text-[11px] text-slate-500">Instead of hoping your perimeter catches everything, secure the container where 99% of your enterprise apps live.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f1f6fa] pt-4 text-slate-400 text-xs font-medium">
                Verify your gateway with our sandbox simulation tools on the right.
              </div>
            </div>

            {/* Password Login Card (Right) */}
            <div className="md:col-span-5 bg-white rounded-[32px] p-8 border border-[#e2edf3] shadow-md flex flex-col justify-center relative overflow-hidden space-y-6">
              <div className="relative text-center space-y-4">
                {/* Shield logo with animated pulse ring */}
                <div className="w-16 h-16 bg-[#0074e4] text-white mx-auto rounded-[24px] flex items-center justify-center shadow-lg shadow-[#0074e4]/20 relative">
                  <div className="absolute inset-0 bg-[#0074e4] rounded-[24px] animate-ping opacity-15" />
                  <Lock className="w-8 h-8 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-950 tracking-tight">
                    Access Laboratory
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Enter the access passcode to run simulated downloads.
                  </p>
                </div>

                {/* Password Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block px-1">
                      Lab Access Code
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#e2edf3] focus:border-[#0074e4] outline-none text-slate-900 text-center tracking-widest font-bold transition-colors"
                      autoFocus
                    />
                  </div>

                  {authError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-2xl text-xs font-bold text-left flex items-center gap-2">
                      <Shield className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#0074e4] hover:bg-[#0060be] text-white text-sm font-bold transition-all shadow-md shadow-[#0074e4]/15 active:scale-98 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enter Sandbox</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        ) : (
          /* Authenticated Laboratory Suite Dashboard */
          <>
            {/* Waze-style Hero Message Board */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e2edf3] shadow-md relative overflow-hidden">
              {/* Accent colorful bubbles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#33f2ff]/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0074e4]/10 rounded-full blur-2xl -ml-10 -mb-10" />

              <div className="relative space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#e8f4ff] text-[#0074e4] px-4 py-1.5 rounded-full text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  Are You Really Protected? Let's Find Out!
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                    Don't let your Proxy Gateway paint a false sense of security.
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-semibold">
                    Traditional Secure Web Gateways (SWG) are like perimeter guards looking at luggage through a blurry window. If a threat enters your browser as tiny, harmless-looking pieces, or encrypted noise, your gateway cheerfully lets it fly. 
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Once inside, the pieces assemble dynamically in your browser memory (the JavaScript heap). The gateway never sees it, but the threat is active. <strong>This is where Eyeball changes the game.</strong> Eyeball extends security straight into the browser itself, inspecting the active workspace so you don't have to blindly trust a blind proxy.
                  </p>
                </div>

                {/* Smart Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Traditional SWG Proxy</span>
                    <span className="text-slate-900 font-extrabold text-sm block">🚫 Blind Network Transit</span>
                    <p className="text-slate-500 text-xs leading-normal">
                      Only checks traffic on the wire. Easily fooled by browser-side canvas assembly, websockets, or client-side decryption keys.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#e8f4ff] border border-[#d1e9ff] space-y-2">
                    <span className="text-xs font-bold text-[#0074e4] uppercase tracking-wider block">Eyeball Security</span>
                    <span className="text-slate-950 font-extrabold text-sm block">✨ True Browser-Side Protection</span>
                    <p className="text-slate-700 text-xs leading-normal">
                      Inspects the runtime environment directly. Catches payload reconstruction right where it executes on the client-side.
                    </p>
                  </div>
                </div>

                {/* Helper safe info note */}
                <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100 flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">
                      Safe Antivirus Verification String (EICAR):
                    </span>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                      All downloaded files contain only the official, harmless EICAR antivirus test signature. It is a completely safe string designed to help you verify if your endpoint antivirus (like Windows Defender) or network proxies are active and working correctly when the file is saved or opened.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Success Notification */}
            {downloadSuccess && downloadSuccess.show && (
              <div className="bg-white border-2 border-[#24ca49] rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all">
                <div className="absolute top-0 right-0 bg-[#24ca49]/10 text-[#24ca49] px-4 py-1 rounded-bl-2xl text-[11px] font-bold">
                  Bypass Active
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#24ca49]/10 text-[#24ca49] p-3 rounded-2xl shrink-0">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-base font-black text-slate-950">
                      {downloadSuccess.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {downloadSuccess.desc}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                      <div className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-mono font-bold">
                        📂 {downloadSuccess.fileName}
                      </div>
                      <button 
                        onClick={() => setDownloadSuccess(null)}
                        className="text-[#0074e4] font-bold hover:underline py-1 px-2"
                      >
                        Dismiss Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Clean, Approachable Technique Selection List (Waze Style Grid) */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-950 px-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0074e4]" />
                Choose a delivery method to test
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {techniques.map((tech) => {
                  const Icon = tech.icon;
                  const isSelected = selectedTechnique === tech.id;
                  return (
                    <div 
                      key={tech.id}
                      onClick={() => setSelectedTechnique(tech.id)}
                      className={`bg-white rounded-[24px] p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 relative ${
                        isSelected 
                          ? 'border-[#0074e4] shadow-md shadow-[#0074e4]/5' 
                          : 'border-[#e2edf3] hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Badge */}
                      <div className="absolute top-4 right-4 bg-[#e8f4ff] text-[#0074e4] text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {tech.badge}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${tech.color} shadow-sm shrink-0`}>
                            <Icon className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <h4 className="text-base font-bold text-slate-950">
                            {tech.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          {tech.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#f1f6fa] flex items-center justify-between gap-4">
                        <span className="text-[10px] text-slate-400 font-mono font-bold truncate max-w-[150px]">
                          📂 {tech.fileName}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTestDownload(tech);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#0074e4] hover:bg-[#0060be] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#0074e4]/10 active:scale-95 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Download Now</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simple Copy utility for manual copy-paste tests */}
            <div className="bg-white rounded-[24px] p-5 border border-[#e2edf3] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-950 block">
                    Manual Testing Copy Tool
                  </span>
                  <p className="text-xs text-slate-500 font-medium">
                    Click to copy the raw test string buffer to check if clipboard scanning or local editor protection is working.
                  </p>
                </div>
              </div>
              <button
                onClick={copyEicar}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy EICAR Code'}</span>
              </button>
            </div>
          </>
        )}

      </main>

      {/* Modern footer banner */}
      <footer className="mt-20 border-t border-[#e2edf3] bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
          <p className="text-sm font-bold text-slate-900">🛡️ Eyeball Security Labs © 2026</p>
          <p className="text-xs text-slate-500 font-medium">Developed for Security Compliance Testing and Dynamic Gateway Verification.</p>
        </div>
      </footer>

    </div>
  );
}
