export default function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#1a1a18]">
      {/* Gradient blobs with continuous animation */}
      <div
        className="absolute left-1/4 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-[120px]"
        style={{ animation: 'blob-drift-1 25s ease-in-out infinite' }}
      />
      <div
        className="absolute right-1/4 top-1/3 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-orange-600/15 blur-[100px]"
        style={{ animation: 'blob-drift-2 30s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 h-[450px] w-[450px] rounded-full bg-yellow-500/10 blur-[90px]"
        style={{ animation: 'blob-drift-3 20s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 h-[400px] w-[400px] rounded-full bg-amber-600/15 blur-[110px]"
        style={{ animation: 'blob-drift-4 28s ease-in-out infinite' }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  )
}
