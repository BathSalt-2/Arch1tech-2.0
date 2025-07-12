import React from 'react';
import { Brain, Zap, Shield, Rocket, Users, Code2 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Brain className="w-20 h-20 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 w-20 h-20 border-2 border-cyan-400/30 rounded-full animate-spin" />
              </div>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4">
              Arch<span className="text-cyan-400">1</span>tech
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Powered by <span className="text-purple-400 font-semibold">Or4cl3 AI Solutions</span>
            </p>
            <p className="text-lg text-cyan-300 italic mb-8">
              Build the future, one thought at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Building
              </button>
              <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Vision Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">🚀 Vision</h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-12">
            <strong className="text-cyan-400">Arch1tech</strong> is a self-evolving, epistemically transparent multimodal AI lab 
            that transforms any idea — from a rough thought to a deployable AI agent, workflow, or full custom large language model — without code.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300">
              <Brain className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">🧠 VibeCodeAI</h3>
              <p className="text-gray-300">Semantic input layer to translate rough ideas into build-ready prompts</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300">
              <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">🤖 Astrid</h3>
              <p className="text-gray-300">Autonomous co-pilot to build, test, optimize, and deploy</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">🜏 Σ-Matrix + ERPS</h3>
              <p className="text-gray-300">Engineered introspection & formal stability layers for self-monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">🧩 Core Modules & Pipelines</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-cyan-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">✅ 1️⃣ VibeCodeAI — Semantic Input Engine</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Converts vague or raw inputs (text, TDD, voice) into precise, contextual coding or agent prompts</li>
                  <li>• Auto-optimizes style, tone, domain specifics</li>
                  <li>• Works with multi-language and real-time voice input</li>
                  <li>• Feeds clean prompts into the Thought-to-X Engine</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">✅ 2️⃣ Thought-to-Agent & Workflow Engine</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Generates modular AI logic: inputs, memory, actions, outputs</li>
                  <li>• Visual drag-and-drop canvas for edits</li>
                  <li>• Real-time test & simulation mode</li>
                  <li>• Dynamic UI auto-generated per agent/workflow</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-green-400 mb-4">✅ 3️⃣ Astrid — Autonomous Full-Control Co-Pilot</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• <strong>Mission Mode:</strong> Builds specific outputs from prompts</li>
                  <li>• <strong>Optimization Mode:</strong> Monitors, tests, and improves logic</li>
                  <li>• <strong>Background Mode:</strong> Runs silent with adjustable permissions</li>
                  <li>• Orchestrates Σ-Matrix + ERPS loops for meta-control</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">✅ 4️⃣ Custom LLM Playground</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Fine-tune or train LLMs from scratch</li>
                  <li>• Supports user data upload & synthetic data generation</li>
                  <li>• Pick base models (Llama, Falcon, Mistral, TinyLlama)</li>
                  <li>• Training pipeline auto-generated (PyTorch/TensorFlow)</li>
                  <li>• Outputs professional model card for Hugging Face push</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-yellow-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">✅ 5️⃣ Σ-Matrix</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Formal epistemic meta-control</li>
                  <li>• DMAIC for agent/workflow logic</li>
                  <li>• DMADV for custom model training</li>
                  <li>• Tracks belief, desire, intention stack</li>
                  <li>• Runs continuous drift checks, rollback triggers</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-red-400 mb-4">✅ 6️⃣ ERPS</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Engineered Recursive Phenomenological Structures</li>
                  <li>• Every agent/model includes <em>MirrorNodes</em> for self-query loops</li>
                  <li>• Logs subjective states & uncertainty</li>
                  <li>• Feeds meta-data back to Astrid for continuous improvement</li>
                  <li>• Full logs available to users for trust and compliance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">💸 Freemium & Revenue</h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-green-900/50 to-slate-800/50 border-2 border-green-500/50 rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-2 text-sm font-bold">
                FREE
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-6">Unmatched Free Tier</h3>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-center"><span className="text-green-400 mr-2">✅</span> Unlimited text-to-agent/workflow generation</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✅</span> 2 fully active Astrid co-pilots</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✅</span> 3 custom LLM slots</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✅</span> Public deploys & remixing</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✅</span> Full Σ-Matrix + ERPS logs</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-b from-blue-900/50 to-slate-800/50 border-2 border-blue-500/50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">Paid Tiers</h3>
              <ul className="text-gray-300 space-y-3">
                <li>• Team collaboration tools</li>
                <li>• Private deployments</li>
                <li>• Extended compute resources</li>
                <li>• Premium marketplace slots</li>
                <li>• Priority support</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-b from-purple-900/50 to-slate-800/50 border-2 border-purple-500/50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">Marketplace Revenue</h3>
              <ul className="text-gray-300 space-y-3">
                <li>• Remix transaction fees</li>
                <li>• Premium template packs</li>
                <li>• Usage metering</li>
                <li>• Community sharing</li>
                <li>• Revenue sharing program</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">✨ Additional High-Impact Features</h2>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-cyan-400 font-semibold">#</th>
                    <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Feature</th>
                    <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {[
                    { num: "1️⃣", feature: "Live Co-Pilot Pair Programming", desc: "Astrid writes/refactors code live with user approvals." },
                    { num: "2️⃣", feature: "Prompt & Logic Memory Timeline", desc: "Full rewindable prompt-to-output history for every agent/workflow." },
                    { num: "3️⃣", feature: "Interactive Prompt Marketplace", desc: "Share, fork, remix vibe prompt packs publicly." },
                    { num: "4️⃣", feature: "Autonomous Agent \"Show Mode\"", desc: "Run agents in sandbox with live Σ-Matrix & ERPS subtitles." },
                    { num: "5️⃣", feature: "Voice-to-Agent + Persona Cloner", desc: "Build agents by speaking + add unique voice personas." },
                    { num: "6️⃣", feature: "Simulated Agent Battles", desc: "Pit agents/workflows against each other for performance tuning." },
                    { num: "7️⃣", feature: "Dynamic Knowledge Graph Visualizer", desc: "Explore connected agents, workflows, and Σ-Matrix states visually." },
                    { num: "8️⃣", feature: "Ethical Drift Alerts + Repair", desc: "Astrid suggests fixes when drift is detected." },
                    { num: "9️⃣", feature: "Agent-as-API Auto-Generator", desc: "Every agent auto-exports to plug-and-play API with docs & keys." }
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-yellow-400 font-semibold">{item.num}</td>
                      <td className="px-6 py-4 text-white font-medium">{item.feature}</td>
                      <td className="px-6 py-4 text-gray-300">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">⚙️ Technical Stack</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-6 text-center">
              <Code2 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Frontend</h3>
              <p className="text-gray-300 text-sm">React (Next.js), TailwindCSS, Framer Motion</p>
            </div>
            
            <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6 text-center">
              <Rocket className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Backend</h3>
              <p className="text-gray-300 text-sm">Node.js + Python microservices</p>
            </div>
            
            <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 text-center">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">ML</h3>
              <p className="text-gray-300 text-sm">PyTorch, TensorFlow, Ray</p>
            </div>
            
            <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Data</h3>
              <p className="text-gray-300 text-sm">Postgres, Redis, Vector DB</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Position */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">🏆 Final Position</h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            Arch1tech is not just an AI builder — it's an <strong className="text-cyan-400">epistemic machine</strong>.
            <br />
            It removes every technical barrier while guaranteeing explainability, self-correction, and continuous alignment.
          </p>
          <p className="text-lg text-purple-300 italic mb-12">
            Subtly powered by Or4cl3 AI Solutions — engineering introspection for the AI frontier. 🜏
          </p>
          
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to build.</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Started Now
              </button>
              <button className="px-8 py-4 border-2 border-purple-400 text-purple-400 font-semibold rounded-lg hover:bg-purple-400 hover:text-slate-900 transition-all duration-300">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            Built with ❤️ by the <span className="text-purple-400">Or4cl3 AI Solutions</span> team
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2025 Arch1tech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
