import re

with open('components/LandingPage.tsx', 'r') as f:
    content = f.read()

# Add AnimatePresence import
content = content.replace("import { motion, useInView } from 'motion/react';", "import { motion, useInView, AnimatePresence } from 'motion/react';")

step_card_repl = """
const StepCard: React.FC<StepCardProps> = ({ step, title, description, icon: Icon, videoUrl, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center py-20 border-b border-slate-100 last:border-0`}
    >
"""
content = re.sub(
    r"const StepCard: React\.FC<StepCardProps> = \(\{ step, title, description, icon: Icon, videoUrl, index \}\) => \{\n  const ref = useRef\(null\);\n  const isInView = useInView\(ref, \{ once: true, margin: \"-100px\" \}\);\n\n  return \(\n    <motion\.div \n      ref=\{ref\}\n      initial=\{\{ opacity: 0, y: 50 \}\}\n      animate=\{isInView \? \{\{ opacity: 1, y: 0 \}\} : \{\{ opacity: 0, y: 50 \}\}\}\n      transition=\{\{ duration: 0.8, delay: index \* 0.2 \}\}\n      className=\{\`flex flex-col \$\{index \% 2 === 0 \? 'lg:flex-row' : 'lg:flex-row-reverse'\} gap-12 items-center py-20 border-b border-slate-100 last:border-0\`\}\n    >",
    step_card_repl,
    content
)

play_btn_repl = """<div 
                    onClick={() => setIsExpanded(true)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/30 hover:scale-110 transition-all shadow-lg"
                  >
                    <Play size={16} fill="white" className="ml-0.5" />
                  </div>"""

content = content.replace("""<div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <Play size={16} fill="white" />
                  </div>""", play_btn_repl)

modal_repl = """      </div>
    </motion.div>

    <AnimatePresence>
      {isExpanded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
            onClick={() => setIsExpanded(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 z-10"
          >
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/10"
            >
              <X size={20} />
            </button>
            <video 
              autoPlay 
              controls 
              playsInline 
              className="w-full h-full object-contain bg-black"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );"""

content = content.replace("      </div>\n    </motion.div>\n  );", modal_repl)

with open('components/LandingPage.tsx', 'w') as f:
    f.write(content)
