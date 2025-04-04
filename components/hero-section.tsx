import Image from "next/image"

export function HeroSection() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <Image
        src="/placeholder.svg?height=500&width=1200"
        alt="Sports arena"
        fill
        className="object-cover brightness-75"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">Book Sports Venues Across India</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">
          Find and book courts for basketball, cricket, football, tennis, badminton and more
        </p>
      </div>
    </div>
  )
}

