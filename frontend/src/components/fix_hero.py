import pathlib

p = pathlib.Path('Hero.jsx')
t = p.read_text(encoding='utf-8')

start_marker = '          <motion.div'
start_idx = t.find(start_marker)
print('start_idx', start_idx)

end_anchor = '        )}\n      </AnimatePresence>'
end_idx = t.find(end_anchor, start_idx)
print('end_idx', end_idx)
print('length', end_idx - start_idx)

new_block = '''          <motion.div
            initial={{"opacity": 0}}
            animate={{"opacity": 1}}
            exit={{"opacity": 0}}
            transition={{duration: 0.25}}
            onClick={() => setShowSuccess(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-contact-success-title"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          >
            <div
              className={`pointer-events-none absolute -top-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full blur-3xl ${isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-400/20"`}
            />

            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
              <motion.span
                animate={{"scale": [1, 1.35, 1.35], "opacity": [0.35, 0, 0]}}
                transition={{duration: 1.8, repeat: Infinity, ease: "easeOut"}}
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"`}
              />

              <motion.div
                initial={{scale: 0, rotate: -30}}
                animate={{scale: 1, rotate: 0}}
                transition={{delay: 0.12, type: "spring", stiffness: 280, damping: 18}}
                className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.35)]" : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.35)]`}
              >
                <FaCheckCircle className="text-4xl" />
              </motion.div>
            </div>

            {/* Nothing — success now lives on the shared dedicated page. */}
          </motion.div>
        )}
      </AnimatePresence>'''

new_t = t[:start_idx] + new_block + t[end_idx + len(end_anchor):]
p.write_text(new_t, encoding='utf-8')
print('written, new length', len(new_t))
