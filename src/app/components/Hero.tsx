import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white min-h-[calc(100vh-80px)] flex-1 text-white px-4 sm:px-8 lg:px-16 py-8 flex items-stretch">
      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="relative flex-[3] rounded-3xl overflow-hidden min-h-[50vh] md:min-h-full">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Gradient Keyboard"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-8 px-6 sm:px-10 md:px-16 bg-gradient-to-t from-black/60 to-transparent w-full">
            <div className="flex flex-col">
              <p className="text-xs sm:text-sm uppercase tracking-widest text-white/70">
                Software Development Partner
              </p>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-xl">
                We are a website & app development agency
              </h1>
            </div>
            <button className="bg-white text-black font-semibold px-5 py-2 rounded-full w-max text-sm hover:bg-gray-200 transition">
              Start a project
            </button>
          </div>
        </div>

        {/* Side Card */}
        <div className="flex-[1] flex justify-center">
          <div className="bg-white rounded-2xl w-full max-w-sm h-full flex flex-col justify-start">
            <Image
              src="https://images.unsplash.com/photo-1608303588026-884930af2559?q=80&w=3403&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Fastbank Preview"
              width={400}
              height={250}
              className="rounded-2xl mb-4 w-full object-cover"
            />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs sm:text-sm uppercase text-gray-400">
                  Our latest work
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-black">
                  Fastbank
                </h2>
              </div>
              <button className="border w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
