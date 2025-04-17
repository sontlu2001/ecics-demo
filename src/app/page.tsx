import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Image
          src="/ecics-50-years.svg"
          alt="Logo"
          width={260}
          height={260}
        />
        <h1 className="text-3xl font-bold">
          Welcome to the ECICS
          </h1>
      </div>
    </main>
  )
}
