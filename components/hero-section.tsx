import Image from "next/image"

export function HeroSection() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <Image
        src="https://img.freepik.com/free-photo/sports-center_1127-4159.jpg?t=st=1743778373~exp=1743781973~hmac=b0e3eb8b371950cfffe29b701be5efcde78582137eb221d29a6e50d68c5e39d2&w=996"
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
